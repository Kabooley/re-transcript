import React from 'react';
import Box from '@mui/material/Box';
import HeaderPanel from './HeaderPanel';
import Typography from '@mui/material/Typography';
import ErrorOutlineSharpIcon from '@mui/icons-material/ErrorOutlineSharp';
import { lightBlue } from '@mui/material/colors';

const textColor = lightBlue[800];

// import Alert from '@mui/material/Alert';
// import CircularProgress from '@mui/material/CircularProgress';

interface iProps {}

/**
 * TODO: Color icon and text as alert
 * **/
const InvalidPanel = ({}: iProps) => {
    return (
        <Box
            sx={{
                // my: 4,
                boxShadow: 3,
                width: '330px',
                height: '120px',
                // borderRadius: 2,
            }}
        >
            <HeaderPanel height={'50%'}>
                <></>
            </HeaderPanel>
            <Box
                sx={{
                    display: 'flex',
                    pt: '16px',
                    pl: '20px',
                }}
            >
                {/* <Alert
          variant="outlined"
          severity="info"
          sx={{ width: '90%', fontSize: '0.75rem', height: '60%' }}
        >
          {'This function is not available on this page'}
        </Alert> */}
                <ErrorOutlineSharpIcon color="secondary" />
                <Typography sx={{ pl: '16px' }} color={textColor}>
                    {"Can't enable on this page"}
                </Typography>
            </Box>
        </Box>
    );
};

export default InvalidPanel;
