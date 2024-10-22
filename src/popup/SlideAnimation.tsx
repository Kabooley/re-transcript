import React from 'react';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import './animation.css';

interface iProps {
    animate: boolean;
}

// https://web.dev/articles/animations-guide?hl=ja
const SlideAnimation = ({ animate }: iProps) => {
    const boxClassName = animate ? ['box', 'animate'] : ['box'];
    return (
        <div className="animation-container">
            <div className={boxClassName.join(' ')}>
                <Typography>{'Successfully generated!'}</Typography>
                <CheckCircleOutlineRoundedIcon fontSize={'inherit'} />
            </div>
        </div>
    );
};

export default SlideAnimation;
