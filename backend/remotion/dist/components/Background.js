import { jsx as _jsx } from "react/jsx-runtime";
export const Background = ({ color = '#000000', gradient, gradientDirection = 'vertical', image, blur = 0, opacity = 1, children, }) => {
    const getStyle = () => {
        if (image) {
            return {
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: `blur(${blur}px)`,
            };
        }
        if (gradient && gradient.length > 0) {
            let direction = 'to bottom';
            switch (gradientDirection) {
                case 'horizontal':
                    direction = 'to right';
                    break;
                case 'vertical':
                    direction = 'to bottom';
                    break;
                case 'diagonal':
                    direction = 'to bottom right';
                    break;
                case 'radial':
                    direction = 'circle';
                    break;
            }
            const gradientStyle = direction === 'circle'
                ? `radial-gradient(${direction}, ${gradient.join(', ')})`
                : `linear-gradient(${direction}, ${gradient.join(', ')})`;
            return { background: gradientStyle };
        }
        return { backgroundColor: color };
    };
    return (_jsx("div", { style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity,
            ...getStyle(),
        }, children: children }));
};
