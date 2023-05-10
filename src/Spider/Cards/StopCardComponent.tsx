import { Box } from '@mui/material';
import React from 'react';

const StopCardComponent = () => {
    return (
        <Box sx={{ width: "100%", height: "100%", position:"absolute" }}>
            <img
                src="images/cardsImgs/stop.png"
                width="100%"
                height="100%"
                draggable={false}
            />
        </Box>
    );
};

export default StopCardComponent;