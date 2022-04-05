/*********************************************************
 *
 *
 * ********************************************************/

/* DEVELOPMENT NOTE

props:
    built: 拡張機能が実行中ならばtrue
    building: 拡張機能がRUNされて構築中ならばtrue
    correctUrl: Popupが開かれたときのURLが許可URLなのかどうか
    handlerOfToggle: 実行ボタンが押されたときに発火する関数
*/

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Content from "./Content";
import { Check, CheckCircle } from "@mui/icons-material";

export default function MainContent(props): JSX.Element {
  const theme = useTheme();

  const generateStateMessage = (): JSX.Element => {
    if (props.built && props.correctUrl) {
      return (
        <Typography variant="button" display="block" gutterBottom sx={{paddingLeft: "16px" }}>
          Now Running...
        </Typography>
      );
    } else return null;
  };

  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            Udemy Re Transcript
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            Udemy transcript subtitles are reconstructed into easy-to-translate
            sentences by the translation app
          </Typography>
        </CardContent>
        {generateStateMessage()}
        <Content
          correctUrl={props.correctUrl}
          built={props.built}
          building={props.building}
          handlerOfToggle={props.handlerOfToggle}
        />
      </Box>
      <CardMedia
        component="img"
        // heightを指定しないと表示されないよとのこと
        sx={{ width: 180, height: 180 }}
        image="../static/udemy-re-transcript-512.svg"
        alt="Udemy Re Transcript icon"
      />
    </Card>
  );
}

/*
MainContent ...ネーミングセンスなさすぎ問題あとで変える

Container(aka.MainContent)
    Title
    Introduction
    Content
        Button(RUN/LOADING/COMPLETE!)
        Alerts


condition
    correctUrl ? CONTENT {LOADING | RUN | COMPLETE} : ALERT
    CONTENT
        building ? LOADING
        built ? COMPLETE
        !building && !built ? RUN


TODO:

    propsというかstateの値の節約：役割被っているからいらない値ある...
    コンポーネントの分割
    字大きすぎる小さくする
    併せて全体の幅狭くして

*/
