import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

interface iProps {
    height: string;
    children?: React.ReactElement;
}

const HeaderPanel = ({ height, children }: iProps) => {
    return (
        <Box
            sx={{
                // my: 4,
                width: '100%',
                height: height,
                bgcolor: 'primary.main',
                // borderRadius: '10px 10px 0 0',
            }}
            alignContent="center"
        >
            <Stack
                direction={'row'}
                justifyContent="space-between"
                width="90%"
                sx={{ mx: 'auto' }}
            >
                <Typography
                    sx={{ pt: '4px' }}
                    variant="h5"
                    color="common.white"
                >
                    {'Re Transcript'}
                </Typography>
                {children}
            </Stack>
        </Box>
    );
};

export default HeaderPanel;
