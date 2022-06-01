/*********************************************************
 * Main Content
 *
 * POPUPのコンテンツ群のトップのコンポーネント
 *
 * TODO: iconが表示されない件
 *
 * path指定の仕方が間違っていた
 * バンドリングされるので、distの中でのpathを指定すればいい
 *
 * 参考： CardMedia componentのimgのサイズ変更方法
 *
 * https://stackoverflow.com/questions/50272814/image-on-material-ui-cardmedia
 *
 * 上記の方法だと、CardMedia自体のサイズが変わってしまうので、
 *
 * ********************************************************/
// NOTE: 'React'の宣言はMaterial UIに必須なので消さないこと
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Content from './Content';
// import { Check, CheckCircle } from '@mui/icons-material';

/**
 * Copies for POPUP display.
 *
 * input emoji into command palette and find emoji you want.
 * */
const templates = {
    title: 'Re Transcript',
    description:
        'Udemyのトランスクリプト上の英語字幕を再構成し、より正確な翻訳出力を助けます。好みの翻訳拡張機能とともに使用して下さい',
    running: '😎 実行中... 💨💨',
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
     * */
    const generateStateMessage = (): JSX.Element => {
        if (props.built && props.correctUrl) {
            return (
                <Typography
                    variant="button"
                    display="block"
                    gutterBottom
                    sx={{ paddingLeft: '16px' }}
                >
                    {templates.running}
                </Typography>
            );
        } else return null;
    };

    return (
        <Card sx={{ display: 'flex' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                        {templates.title}
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        component="div"
                    >
                        {templates.description}
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
                    display: 'flex',
                    alignItems: 'center',
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
