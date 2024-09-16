import React from 'react';
import { Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';

const UserMenu = ({ signOut }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* User icon (avatar) */}
      <IconButton onClick={handleMenuOpen} color="inherit">
        <Avatar alt="User Avatar" />
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={signOut}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          Sign Out
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
