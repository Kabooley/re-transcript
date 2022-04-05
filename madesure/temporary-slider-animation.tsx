import * as React from "react";

import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";

const icon = (
  <Paper sx={{ m: 1 }} elevation={4}>
    <Box component="svg" sx={{ width: 100, height: 100 }}>
      <Box
        component="polygon"
        sx={{
          fill: (theme) => theme.palette.common.white,
          stroke: (theme) => theme.palette.divider,
          strokeWidth: 1
        }}
        points="0,100 50,00, 100,100"
      />
    </Box>
  </Paper>
);

export default function SimpleSlide() {
  const [checked, setChecked] = React.useState(false);
  const currentRef = React.useRef(null);

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <div>
      <Card sx={{ display: "flex", width: "600px"}}>
        <Box sx={{ display: "flex", flexDirection: "column" }} ref={currentRef}>
          <CardContent sx={{ flex: "1 0 auto" }} >
            <Typography component="div" variant="h5">
              Udemy Re Transcript
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              Udemy transcript subtitles are reconstructed into
              easy-to-translate sentences by the translation app
            </Typography>
          </CardContent>
          {/* NOTE: スライディング部分 */}
          {/* 問題はどうやってボタンとのバッティングを解消するか... */}
          <Slide
            direction="right"
            in={checked}
            // Refのコンテナの中でスライドする
            container={currentRef.current}
            // transition-timing-functionを指定できる
            easing={"ease-out"}
            // transition-durationと同じ。アニメーションにかける時間
            timeout={600}
          >
            <Alert 
              variant="filled" severity="success" 
              sx={{width: "200px", marginLeft:"10px", marginBottom: "8px"}}
            >
              COMPLETE!
            </Alert>
          </Slide>
          {/* ----------------- */}
        </Box>
        <CardMedia
          component="img"
          // heightを指定しないと表示されないよとのこと
          sx={{ width: 180, height: 180 }}
          image="public-domain-synthwave.jpg"
          alt="Udemy Re Transcript icon"
        />
      </Card>
      <FormControlLabel
            control={<Switch checked={checked} onChange={handleChange} />}
            label="Show"
          />
          
    </div>
  );
}
