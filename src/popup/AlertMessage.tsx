/***********************************************
 * Alert few seconds and disappear automatically
 *
 *
 * 参考：
 * https://stackover
 * flow
 * .com/questions/65214950/how-to-disappear-alert-after-5-seconds-in-react-js
 *
 * **********************************************/
// NOTE: React is required by Material UI.
import React from 'react';
import { useState, useEffect } from 'react';
import Slide from '@mui/material/Slide';

/***
 * Alert Message
 *
 * @param props
 * @param {MutableRefObject} _ref -
 * @param {boolean} show -
 * @param {number} timer -
 *
 * This alert will be used for displaying complete rebuilding ExTranscript on popup.
 *
 * */
const AlertMessage = (props): JSX.Element => {
    const [show, setShow] = useState<boolean>(false);

    // NOTE: useEffect()内でsetTimeoutする場合は、無限ループを起こさないように
    // clearTimeoutをreturnすること
    useEffect(
        function () {
            let timerId = null;
            if (props.show) {
                setShow(true);
                timerId = setTimeout(function () {
                    setShow(false);
                }, props.timer);
            }
            return () => {
                clearTimeout(timerId);
            };
        },
        [props.show]
    );

    if (!props.show) return null;

    return (
        <Slide
            direction="right"
            in={show}
            // Refのコンテナの中でスライドする
            container={props._ref.current}
            // transition-timing-functionを指定できる
            easing={'ease-out'}
            // transition-durationと同じ。アニメーションにかける時間
            timeout={600}
        >
            {props.children}
        </Slide>
    );
};

export default AlertMessage;
