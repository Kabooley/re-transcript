/*************************************
 * Siwtch component
 * ___________________________________
 *
 * cf.
 * https://upmostly.com/tutorials/build-a-react-switch-toggle-component
 *
 * https://mui-treasury.com/components/card/
 *
 * @props
 * isOn: 拡張機能が実行中であればtrue
 * handlerOfToggle: ボタンが押されたときの挙動を制御する関数
 * disable: ボタンを無効にするならtrue
 * ***********************************/
import React from "react";
import "./Switch.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";

const Switch = ({ isOn, handlerOfToggle, disable }): JSX.Element => {
  const labelClassName: string = isOn
    ? `react-switch-label slider-on`
    : "react-switch-label";

  return (
    <Card className="root">
      <CardMedia className="media" image="udemy-re-transcript-512.svg" />
      <CardContent>
        {/* <TextInfoContent classes={contentStyles} overline={"---"} heading={"Udemy Re Transcript"} body={"Udemy transcript subtitles are reconstructed into easy-to-translate sentences by the translation app"} /> */}
        <Button>REBUILD</Button>
      </CardContent>
    </Card>
  );
};

export default Switch;
