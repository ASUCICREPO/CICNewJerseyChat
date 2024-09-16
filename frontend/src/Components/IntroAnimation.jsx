import React from 'react'
import animation from "../Assets/intro.gif";
import { Box, Typography} from "@mui/material";
import {PRIMARY_MAIN} from "../utilities/constants";

const IntroAnimation = () => {
  return (
<Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
    >
      <img src={animation} alt="intro animation of a sphere" width={"100%"} />
      <Typography color={PRIMARY_MAIN} variant='body2'>Ask a question to get started!</Typography>
    </Box>
  )
}

export default IntroAnimation