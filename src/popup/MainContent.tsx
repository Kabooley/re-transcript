/*********************************************************
 * Main Content
 *
 * POPUPのコンテンツ群のトップのコンポーネント
 *
 *
 * ********************************************************/
// NOTE: 'React'の宣言はMaterial UIに必須なので消さないこと
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Content from "./Content";


/**
 * Copies for POPUP display.
 *
 * input emoji into command palette and find emoji you want.
 * */
const copies = {
  title: "Re Transcript",
  description:
    "Udemyのトランスクリプト上の英語字幕を再構成し、より正確な翻訳出力を助けます。好みの翻訳拡張機能とともに使用して下さい",
  running: "😎 実行中... 💨💨",
  standby: "😎 ",
} as const;

/***
 * @param props
 * @param { boolean} built - 拡張機能が実行中ならばtrue
 * @param { boolean} building - 拡張機能がRUNされて構築の最中ならばtrue
 * @param { boolean} correctUrl - Popupが開かれたときのURLが許可URLなのかどうか
 * @param { funciton } handlerOfToggle - 実行/OFFボタンが押されたときに発火する関数
 *
 * propsの内容はほぼContentへそのままスライドする
 * */
export default function MainContent(props): JSX.Element {
  const theme = useTheme();

  /**
   * Generate State JSX
   *
   * State will be shown on valid page.
   * */
  const generateStateMessage = (): JSX.Element => {
    if(props.correctUrl) {
        return (
            <Typography
              variant="button"
              display="block"
              gutterBottom
              sx={{ paddingLeft: "16px" }}
            >
              {props.built && props.correctUrl ? copies.running : copies.standby}
            </Typography>
          );
    }
    else return null;
  };

  return (
    <Card sx={{ display: "flex" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto", padding: "16px 16px 8px" }}>
          <Typography component="div" variant="h6">
            {copies.title}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            component="div"
          >
            {copies.description}
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
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          paddingLeft: 0,
        }}
      >
        <CardMedia
          component="img"
          // NOTE: heightを指定しないと表示されないよとのこと
          sx={{
            width: 80,
            height: 80,
          }}
          image="./re-transcript-128.svg"
          alt="Re Transcript icon"
        />
      </CardContent>
    </Card>
  );
}
