// src/components/MagneticParticles.jsx
import React, { useEffect, useRef } from 'react';

const MagneticParticles = ({ children, className = '' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const mouse = { x: null, y: null };
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                
                // Size: Chhota aur bada (1 se 4 tak)
                this.size = Math.random() * 3 + 1; 
                
                // ⚡ FASTER Speed: 1.2 se 2.0 tak
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 0.8 + 1.2;
                this.speedX = Math.cos(angle) * speed;
                this.speedY = Math.sin(angle) * speed;
                
                // Bright Opacity
                this.opacity = Math.random() * 0.5 + 0.4;

                // NEON / BRIGHT VIBRANT COLORS
                const colors = [
                    '#FF007F', '#00FFFF', '#39FF14', '#FF0730', 
                    '#FFD700', '#0F52BA', '#FF6EC7', '#FF5E00', 
                    '#B026FF', '#00FF7F', '#FFFFFF'
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                
                // Random Shape: 0=Circle, 1=Star, 2=Diamond, 3=Plus
                this.shapeType = Math.floor(Math.random() * 4);
                
                // For smooth oscillation
                this.phase = Math.random() * Math.PI * 2;
                this.oscillationSpeed = Math.random() * 0.02 + 0.01;
            }

            update() {
                time += 0.01;
                
                // 1. Continuous Drift with smooth oscillation
                this.x += this.speedX + Math.sin(time * this.oscillationSpeed + this.phase) * 0.3;
                this.y += this.speedY + Math.cos(time * this.oscillationSpeed + this.phase) * 0.3;

                // Mouse interaction (Smooth repulsion with lerp)
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 250) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (250 - distance) / 250;
                        // Smooth interpolation for mouse force
                        const smoothForce = force * force * 4; // Square for smoother falloff
                        this.x -= forceDirectionX * smoothForce;
                        this.y -= forceDirectionY * smoothForce;
                    }
                }

                // Wrap around: Screen se bahar jaye toh dusri taraf aa jaye
                if (this.x > canvas.width + 20) this.x = -20;
                if (this.x < -20) this.x = canvas.width + 20;
                if (this.y > canvas.height + 20) this.y = -20;
                if (this.y < -20) this.y = canvas.height + 20;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                
                // Pulsing opacity for extra smoothness
                const pulse = Math.sin(time * 0.02 + this.phase) * 0.1 + 0.9;
                ctx.globalAlpha = this.opacity * pulse;
                ctx.shadowBlur = 25;
                ctx.shadowColor = this.color;

                switch(this.shapeType) {
                    case 1: this.drawStar(); break;
                    case 2: this.drawDiamond(); break;
                    case 3: this.drawPlus(); break;
                    default: this.drawCircle();
                }
                
                ctx.restore();
            }

            drawCircle() {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            drawStar() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const angle = i * (Math.PI / 2) - Math.PI / 4;
                    const outer = this.size * 1.8;
                    const inner = this.size * 0.6;
                    if (i === 0) ctx.moveTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
                    else ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
                    ctx.lineTo(Math.cos(angle + Math.PI / 4) * inner, Math.sin(angle + Math.PI / 4) * inner);
                }
                ctx.closePath();
                ctx.fill();
            }

            drawDiamond() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(0, -this.size * 1.5);
                ctx.lineTo(this.size, 0);
                ctx.lineTo(0, this.size * 1.5);
                ctx.lineTo(-this.size, 0);
                ctx.closePath();
                ctx.fill();
            }

            drawPlus() {
                ctx.fillStyle = this.color;
                const w = this.size * 0.4;
                const h = this.size * 2;
                ctx.fillRect(-w, -h / 2, w * 2, h);
                ctx.fillRect(-h / 2, -w, h, w * 2);
            }
        }

        const init = () => {
            particles = [];
            // Heavy glitter: 150 particles
            const particleCount = Math.min(150, (canvas.width * canvas.height) / 10000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        resizeCanvas();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={`magnetic-particles-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
            <canvas 
                ref={canvasRef} 
                style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    zIndex: 0,
                    pointerEvents: 'none',
                    background: '#04060A'
                }} 
            />
            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                {children}
            </div>
        </div>
    );
};

export default MagneticParticles;