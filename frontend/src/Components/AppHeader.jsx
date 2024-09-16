import { Toolbar, AppBar, Button, Box } from '@mui/material';
import React from 'react';
import Logo from "../Assets/header_logo.jpg";
import { useNavigate } from 'react-router-dom'; 
import UserMenu from './UserMenu';

function AppHeader({ buttonsConfig, buttonStyle, signOut }) {
  const navigate = useNavigate(); 

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: (theme) => theme.palette.background.header,
      }}
    >
      <Toolbar>
        <img src={Logo} alt={`App main Logo`} height={64} />
        
        {/* Flex Spacer */}
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Render Buttons Dynamically */}
        {buttonsConfig && buttonsConfig.map((btn, index) => (
          <Button
            key={index}
            color={btn.color || "inherit"}
            onClick={() => navigate(btn.route)} 
            sx={{
              marginRight: index < buttonsConfig.length - 1 ? 2 : 0, 
              ...buttonStyle, 
              ...btn.style,    
            }}
          >
            {btn.label}
          </Button>
        ))}
        <Box sx={{ ml: 1 }}>
          <UserMenu signOut={signOut} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
