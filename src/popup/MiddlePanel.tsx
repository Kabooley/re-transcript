import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CheckSharpIcon from '@mui/icons-material/CheckSharp';
import ErrorOutlineSharpIcon from '@mui/icons-material/ErrorOutlineSharp';
import CircularProgress, {
    circularProgressClasses,
} from '@mui/material/CircularProgress';
// import CircularProgress from '@mui/material/CircularProgress';

interface iProps {
    built: boolean;
    building: boolean;
    enableRebuildButton: boolean;
    isTranscriptEnabled: boolean;
    isSubtitleEnabled: boolean;
}

const status = {
    notenabled: {
        transcript: 'Transcript is not enabled',
        subtitle: 'Subtitle is not English',
    },
    enabled: {
        transcript: 'Transcript enabled',
        subtitle: 'Subtitle is English',
    },
};

const stackItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
};

/***
 * 以下の3つの状態に従って表示内容を決定する。
 *
 * ビルド前である: `!built && !building`
 * ビルド中である: `enableRebuildButton && !built && building`
 * ビルド後である: `enableRebuildButton && built && !building`
 *
 * */
const MiddlePanel = ({
    built,
    building,
    enableRebuildButton,
    isTranscriptEnabled,
    isSubtitleEnabled,
}: iProps) => {
    const statusMessageTranscript = isTranscriptEnabled
        ? status.enabled.transcript
        : status.notenabled.transcript;
    const statusMessageSubtitle = isSubtitleEnabled
        ? status.enabled.subtitle
        : status.notenabled.subtitle;

    /***
     * Render panel while ex transcript is running
     *
     * */
    const renderRunningPanel = () => {
        return (
            <div style={stackItemStyle}>
                <Typography sx={{ pl: '16px' }}>{'running'}</Typography>
            </div>
        );
    };

    /***
     *
     * */
    const renderBeforeBuildPanel = () => {
        return (
            <>
                {isTranscriptEnabled ? (
                    <>
                        <div style={stackItemStyle}>
                            <CheckSharpIcon />
                            <Typography sx={{ pl: '16px' }}>
                                {statusMessageTranscript}
                            </Typography>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={stackItemStyle}>
                            <ErrorOutlineSharpIcon />
                            <Typography sx={{ pl: '16px' }}>
                                {statusMessageTranscript}
                            </Typography>
                        </div>
                    </>
                )}
                {isSubtitleEnabled ? (
                    <div style={stackItemStyle}>
                        <CheckSharpIcon />
                        <Typography sx={{ pl: '16px' }}>
                            {statusMessageSubtitle}
                        </Typography>
                    </div>
                ) : (
                    <div style={stackItemStyle}>
                        <ErrorOutlineSharpIcon />
                        <Typography sx={{ pl: '16px' }}>
                            {statusMessageSubtitle}
                        </Typography>
                    </div>
                )}
            </>
        );
    };

    /***
     * render panel on building
     *
     * - circularを目立たせるためにほかのアイテムの色を灰色にしている
     * - circularを真ん中に位置付けるためにBox要素で囲っている
     *
     * TODO: やりたいことは`BackDrop`で実現できるかも
     * */
    const renderBuildingPanel = () => {
        return (
            <>
                <div style={stackItemStyle}>
                    <CheckSharpIcon color={'disabled'} />
                    <Typography sx={{ pl: '16px' }} color="rgba(0,0,0,0.26)">
                        {statusMessageTranscript}
                    </Typography>
                </div>
                <div style={stackItemStyle}>
                    <CheckSharpIcon color={'disabled'} />
                    <Typography sx={{ pl: '16px' }} color="rgba(0,0,0,0.26)">
                        {statusMessageSubtitle}
                    </Typography>
                </div>
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        size={60}
                        thickness={4}
                        sx={{
                            // color: (theme) =>
                            //   theme.palette.mode === 'light' ? '#390E4A' : '#390E4A',
                            color: '#390E4A',
                            animationDuration: '1000ms',
                            [`& .${circularProgressClasses.circle}`]: {
                                strokeLinecap: 'round',
                            },
                        }}
                    />
                </Box>
            </>
        );
    };

    const isBeforeBuilding = !built && !building;
    const isBuilding = enableRebuildButton && !built && building;
    const isBuilt = enableRebuildButton && built && !building;

    return (
        <Stack
            direction="column"
            spacing={2}
            justifyContent="space-evenly"
            position={'relative'}
            sx={{ width: '90%', mx: 'auto', pt: '28px' }}
        >
            {isBeforeBuilding && renderBeforeBuildPanel()}
            {isBuilding && renderBuildingPanel()}
            {isBuilt && renderRunningPanel()}
        </Stack>
    );
};

export default MiddlePanel;
