const { exec } = require('child_process');
const fs = require('fs');

// ============================================
// 1. BPM DETECTION
// ============================================
exports.detectBPM = async (musicPath) => {
    return new Promise((resolve) => {
        const cmd = `ffmpeg -i "${musicPath}" -af "silencedetect=noise=-30dB:d=0.5" -f null - 2>&1`;
        
        exec(cmd, (error, stdout, stderr) => {
            const output = stdout || stderr;
            const silenceEnds = output.match(/silence_end: (\d+\.\d+)/g);
            
            if (!silenceEnds || silenceEnds.length < 2) {
                return resolve(120);
            }
            
            const times = silenceEnds.map(s => parseFloat(s.split(' ')[1]));
            const gaps = [];
            for (let i = 1; i < times.length; i++) {
                gaps.push(times[i] - times[i-1]);
            }
            
            const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
            const bpm = Math.round(60 / avgGap);
            resolve(Math.min(Math.max(bpm, 60), 200));
        });
    });
};

// ============================================
// 2. BEAT STRUCTURE ANALYSIS
// ============================================
exports.analyzeBeatStructure = async (musicPath) => {
    try {
        const bpm = await exports.detectBPM(musicPath);
        
        // ✅ Calculate beat timings
        const secondsPerBeat = 60 / bpm;
        const beatsPerBar = 4;
        const secondsPerBar = secondsPerBeat * beatsPerBar;
        
        // ✅ Generate beat timestamps (first 30 seconds)
        const beatTimestamps = [];
        const barTimestamps = [];
        const totalBeats = 100;
        
        for (let i = 0; i < totalBeats; i++) {
            const time = i * secondsPerBeat;
            beatTimestamps.push(time);
            if (i % beatsPerBar === 0) {
                barTimestamps.push(time);
            }
        }
        
        // ✅ Detect strong beats (first beat of each bar)
        const strongBeats = barTimestamps;
        
        return {
            bpm,
            secondsPerBeat,
            beatsPerBar,
            secondsPerBar,
            beatTimestamps,
            barTimestamps,
            strongBeats,
            totalBeats: totalBeats
        };
    } catch (error) {
        console.warn('⚠️ Beat analysis failed:', error.message);
        return {
            bpm: 120,
            secondsPerBeat: 0.5,
            beatsPerBar: 4,
            secondsPerBar: 2.0,
            beatTimestamps: [],
            barTimestamps: [],
            strongBeats: [],
            totalBeats: 0
        };
    }
};

// ============================================
// 3. GET BEAT-AWARE TIMINGS (WITH TEMPLATE RULES)
// ============================================
exports.getDynamicTimings = async (musicPath, numImages, template) => {
    try {
        const beatRules = template.beatRules || { enabled: false };
        
        // ✅ If beat sync disabled, use template default
        if (!beatRules.enabled) {
            console.log('📐 Beat sync disabled, using template duration');
            return {
                bpm: 120,
                slideDuration: template.slideDuration || 3.0,
                totalDuration: (template.slideDuration || 3.0) * numImages,
                beatsPerImage: 0,
                cutOnBeat: false,
                strongBeats: []
            };
        }
        
        // ✅ Analyze beat structure
        const beatStructure = await exports.analyzeBeatStructure(musicPath);
        const { bpm, secondsPerBeat, strongBeats } = beatStructure;
        
        // ✅ Get beat rules from template
        const beatsPerImage = beatRules.beatsPerImage || 8;
        const cutOnBeat = beatRules.cutOnBeat !== undefined ? beatRules.cutOnBeat : true;
        const syncType = beatRules.syncType || 'bar';
        
        // ✅ Calculate slide duration based on beat rules
        let slideDuration;
        const secondsPerBar = secondsPerBeat * 4;
        
        if (syncType === 'bar') {
            slideDuration = (beatsPerImage / 4) * secondsPerBar;
        } else {
            slideDuration = beatsPerImage * secondsPerBeat;
        }
        
        // ✅ Round to 1 decimal
        slideDuration = Math.round(slideDuration * 10) / 10;
        
        // ✅ Ensure min/max
        const minDuration = 1.5;
        const maxDuration = 6.0;
        slideDuration = Math.min(Math.max(slideDuration, minDuration), maxDuration);
        
        // ✅ Find exact beat timestamps for each image
        const imageTimings = [];
        let currentTime = 0;
        for (let i = 0; i < numImages; i++) {
            const startTime = currentTime;
            const endTime = currentTime + slideDuration;
            
            // ✅ Find next strong beat for cut
            let cutTime = endTime;
            if (cutOnBeat) {
                const nextStrongBeat = strongBeats.find(t => t >= endTime - 0.5);
                if (nextStrongBeat) {
                    cutTime = nextStrongBeat;
                }
            }
            
            imageTimings.push({
                index: i,
                start: Math.round(startTime * 10) / 10,
                end: Math.round(cutTime * 10) / 10,
                duration: Math.round((cutTime - startTime) * 10) / 10,
                beats: Math.round((cutTime - startTime) / secondsPerBeat)
            });
            
            currentTime = cutTime;
        }
        
        const totalDuration = imageTimings.reduce((sum, img) => sum + img.duration, 0);
        
        console.log(`🎵 Beat Rules Applied:`);
        console.log(`   🥁 BPM: ${bpm}`);
        console.log(`   🎯 Beats/Image: ${beatsPerImage}`);
        console.log(`   ⏱️ Slide Duration: ${slideDuration}s`);
        console.log(`   📍 Cut On Beat: ${cutOnBeat}`);
        console.log(`   🔄 Sync Type: ${syncType}`);
        console.log(`   📊 Image Timings: ${imageTimings.map(t => t.duration.toFixed(1) + 's').join(' | ')}`);
        
        return {
            bpm,
            slideDuration,
            totalDuration: Math.round(totalDuration * 10) / 10,
            beatsPerImage,
            cutOnBeat,
            syncType,
            imageTimings,
            strongBeats: strongBeats.slice(0, 20),
            beatStructure
        };
        
    } catch (error) {
        console.warn('⚠️ Beat detection fallback:', error.message);
        const fallbackDuration = Math.max(2.5, Math.min(4.0, 15 / numImages));
        return {
            bpm: 120,
            slideDuration: Math.round(fallbackDuration * 10) / 10,
            totalDuration: fallbackDuration * numImages,
            beatsPerImage: 4,
            cutOnBeat: true,
            syncType: 'beat',
            imageTimings: [],
            strongBeats: []
        };
    }
};