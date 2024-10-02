import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import LeftNav from "../Components/LeftNav";
import RightNav from "../Components/RightNav";
import ChatBody from '../Components/ChatBody';
import Logo from "../Assets/header_logo.jpg";
import { Typography} from "@mui/material";
import {
  TEXT, primary_50
} from "../utilities/constants"; // Adjust the import path

const drawerWidthLeftNav = 350;
const drawerWidthRightNav = 260;

const ChatBot = ({signOut}) => {
  const [mobileOpenLeft, setMobileOpenLeft] = React.useState(false);
  const [isClosingLeft, setIsClosingLeft] = React.useState(false);

  const [mobileOpenRight, setMobileOpenRight] = React.useState(false);
  const [isClosingRight, setIsClosingRight] = React.useState(false);

  const handleDrawerCloseLeft = () => {
    setIsClosingLeft(true);
    setMobileOpenLeft(false);
  };

  const handleDrawerTransitionEndLeft = () => {
    setIsClosingLeft(false);
  };

  const handleDrawerToggleLeft = () => {
    if (!isClosingLeft) {
      setMobileOpenLeft(!mobileOpenLeft);
    }
  };

  const handleDrawerCloseRight = () => {
    setIsClosingRight(true);
    setMobileOpenRight(false);
  };

  const handleDrawerTransitionEndRight = () => {
    setIsClosingRight(false);
  };

  const handleDrawerToggleRight = () => {
    if (!isClosingRight) {
      setMobileOpenRight(!mobileOpenRight);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* Start of left nav */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidthLeftNav }, flexShrink: { sm: 0 } }}
          aria-label="disclaimer"
        >
          <LeftNav drawerWidth={drawerWidthLeftNav} mobileOpen={mobileOpenLeft} handleDrawerClose={handleDrawerCloseLeft} handleDrawerTransitionEnd={handleDrawerTransitionEndLeft} />
        </Box>

        {/* Start of middle section */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidthLeftNav}px)` },
            ml: { sm: `${drawerWidthLeftNav}px` },
            backgroundColor: (theme) => theme.palette.background.header,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Left side (logo and left nav icon) */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggleLeft}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              {/* App name and app logo */}
              <img src={Logo} alt={`App main Logo`} height={74} />
              <Typography 
                variant="h3" 
                sx={{ marginLeft: 2, flexGrow: 1 }}
                color={primary_50}
              >
                {TEXT.EN.APP_NAME}
              </Typography>
            </Box>
            {/* Right side (right nav icon button aligned to the right) */}
            <IconButton
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggleRight}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          
          </Toolbar>
        </AppBar>

        {/* Start of chatbot body */}
        <Box
          component="main"
          sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidthLeftNav}px - ${drawerWidthRightNav}px)` }, height: "100vh" }}
        >
          <ChatBody />
        </Box>

        {/* Start of right navigation */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidthRightNav }, flexShrink: { sm: 0 } }}
          aria-label="change model side navigation"
        >
          <RightNav drawerWidth={drawerWidthRightNav} mobileOpen={mobileOpenRight} handleDrawerClose={handleDrawerCloseRight} handleDrawerTransitionEnd={handleDrawerTransitionEndRight} signOut={signOut}/>
        </Box>
      </Box>
    </>
  );
};

export default ChatBot;
