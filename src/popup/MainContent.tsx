/*******************************************
 * Main Content
 *
 * High order component of popup contents.
 *
 * IN CASE: Rejected due to spam policy, then rebuild popup style and delete description so not to use keywords excessively.
 * ******************************************/
// NOTE: React is required by Material UI.
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
    "トランスクリプト上の英語字幕を再構成し、より正確な翻訳出力を助けます。好みの翻訳拡張機能とともに使用して下さい",
  running: "😎 実行中... 💨💨",
  standby: "😎 ",
} as const;

/***
 * Main Content
 *
 * @param props
 * @param { boolean} built - If ExTranscript is running, then true.
 * @param { boolean} building - While between REBUILD button pressed and complete deploying ExTranscript, it is true.
 * @param { boolean} correctUrl - Validity of the tab's URL that popup popped up.
 * @param { funciton } handlerOfToggle - Toggles turningOn state.
 *
 * Wrapping Content component and icon component.
 * All props will be passed to Content component.
 * */
export default function MainContent(props): JSX.Element {
  const theme = useTheme();

  /**
   * Generate State JSX
   *
   * State will be shown on valid page.
   * */
  const generateStateMessage = (): JSX.Element => {
    if (props.correctUrl) {
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
    } else return null;
  };

  return (
    <Card sx={{ display: "flex" }}>
      <Box
        className="box-primary"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* <CardContent
                    sx={{ flex: '1 0 auto', padding: '16px 16px 8px' }}
                >
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
                </CardContent> */}
        {generateStateMessage()}
        <Content
          correctUrl={props.correctUrl}
          built={props.built}
          building={props.building}
          handlerOfToggle={props.handlerOfToggle}
        />
      </Box>
      {/* <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          paddingLeft: 0,
        }}
      >
        <CardMedia
          component="img"
          // NOTE: height is required to display.
          sx={{
            width: 80,
            height: 80,
          }}
          image="./re-transcript-128.svg"
          alt="Re Transcript icon"
        />
      </CardContent> */}
    </Card>
  );
}
