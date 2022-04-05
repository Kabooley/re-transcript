/***********************************************
 * Alert few seconds and disappear automatically
 *
 *
 * 参考：
 * https://stackoverflow.com/questions/65214950/how-to-disappear-alert-after-5-seconds-in-react-js
 *
 * 下部Usage確認のこと
 *
 * */

import React from "react";
import { useState, useEffect } from 'react';
import Slide from '@mui/material/Slide';

/**********************************
 * @param props
 *  props.ref: Object of React.useRef();
 *  props.show: boolean;
 *  props.timer: number;
 *
 * */
const AlertMessage = (props): JSX.Element => {
    const [show, setShow] = useState<boolean>(false);

    // NOTE: useEffect()内でsetTimeoutする場合は、無限ループを起こさないように
    // clearTimeoutをreturnすること
    useEffect(function () {
        console.log("[AlertMessage] use effect");
        console.log(props.show);
        let timerId = null;
        if(props.show) {
          setShow(true);
            timerId = setTimeout(function () {
            setShow(false);
          }, props.timer);
  
        }
          return () => {
              clearTimeout(timerId);
          };
      }, [props.show]);
  
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


// ----- Alert and retract on its own -------------------
// 
// NOTE: timerが2つある
// 1. 使う側のstateをfalseにするタイマー
// 2. AlertMesageのslideコンポーネントのinに渡すbooleanをfalseにするタイマー
// 1のタイマーは２のタイマーよりも長くないといけない
// でないとアニメーションが終了する前にスライド中の要素が急に消える


// Usage このままcodesandboxで確認できるよ

// import React from "react";
// import { useState, useEffect } from 'react';
// import Slide from '@mui/material/Slide';

// /**********************************
//  * @param props
//  *  props.ref: Object of React.useRef();
//  *  props.show: boolean;
//  * props.timer: number;
//  *
//  * */
// const AlertMessage = (props)=> {
//     const [show, setShow] = useState(false);

//     // NOTE: useEffect()内でsetTimeoutする場合は、無限ループを起こさないように
//     // clearTimeoutをreturnすること
//     useEffect(function () {
//       console.log("[AlertMessage] use effect");
//       console.log(props.show);
//       let timerId = null;
//       if(props.show) {
//         setShow(true);
//           timerId = setTimeout(function () {
//           setShow(false);
//         }, props.timer);

//       }
//         return () => {
//             clearTimeout(timerId);
//         };
//     }, [props.show]);

//     if (!props.show) return null;

//     return (
//         <Slide
//             direction="right"
//             in={show}
//             // Refのコンテナの中でスライドする
//             container={props._ref}
//             // transition-timing-functionを指定できる
//             easing={'ease-out'}
//             // transition-durationと同じ。アニメーションにかける時間
//             timeout={600}
//         >
//             {props.children}
//         </Slide>
//     );
// };

// export default AlertMessage;

// import * as React from "react";

// import Box from "@mui/material/Box";
// import Switch from "@mui/material/Switch";
// import Paper from "@mui/material/Paper";
// import Slide from "@mui/material/Slide";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import AlertMessage from "./AlertMessage";

// const icon = (
//   <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
//     <Box component="svg" sx={{ width: 100, height: 100 }}>
//       <Box
//         component="polygon"
//         sx={{
//           fill: (theme) => theme.palette.common.white,
//           stroke: (theme) => theme.palette.divider,
//           strokeWidth: 1
//         }}
//         points="0,100 50,00, 100,100"
//       />
//     </Box>
//   </Paper>
// );

// export default function SlideFromContainer() {
//   const [checked, setChecked] = React.useState(false);
//   const containerRef = React.useRef(null);

//   const handleChange = () => {
//     setChecked((prev) => !prev);
//   };
// 
//   // NOTE: アラートは自動で引っ込んでほしいので
//   // 一旦引っ込んだらstateはflaseになってほしい
//   // なのでsetTimeoutでfalseにする
//   React.useEffect(function() {
//     let timer = null;
//     if(checked) {
//       timer = setTimeout(function() {
//         setChecked(false);
//          // NOTE: このタイマーの時間は、AlertMessageのslideに指定している時間 + slideのtimeoutプロパティの時間より長くないといけない
//       }, 5000);
//       return () => {
//         clearTimeout(timer);
//       }
//     }
//   }, [checked]);
// 
//   return (
//     <Box
//       sx={{
//         height: 180,
//         width: 240,
//         display: "flex",
//         padding: 2,
//         borderRadius: 1,
//         bgcolor: (theme) =>
//           theme.palette.mode === "light" ? "grey.100" : "grey.900",
//         overflow: "hidden"
//       }}
//       ref={containerRef}
//     >
//       <Box sx={{ width: 200 }}>
//         <FormControlLabel
//           control={<Switch checked={checked} onChange={handleChange} />}
//           label="Show from target"
//         />
//         <AlertMessage _ref={containerRef.current} show={checked} timer={3000}>
//           {/* <Slide direction="up" in={checked} container={containerRef.current}>
//           {icon}
//         </Slide> */}
//           {icon}
//         </AlertMessage>
//       </Box>
//     </Box>
//   );
// }
