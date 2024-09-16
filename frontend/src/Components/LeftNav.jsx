import React from "react";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Toolbar from "@mui/material/Toolbar";
import {
  TEXT,
} from "../utilities/constants"; // Adjust the import path

function LeftNav({ drawerWidth, mobileOpen, handleDrawerClose, handleDrawerTransitionEnd }) {
  const aboutUsContent = TEXT.EN.ABOUT_US;

  const renderContent = (content) => {
    return content.map((item, index) => {
      switch (item.type) {
        case "heading":
          return (
            <Typography variant={`h${item.level}`} key={index}>
              {item.content}
            </Typography>
          );
        case "paragraph":
          return (
            <Typography variant="subtitle2" key={index} paragraph>
              {item.content}
            </Typography>
          );
        case "list":
          return (
            <Box component="ul" key={index} sx={{ paddingLeft: "1.5rem" }}>
              {item.items.map((listItem, listIndex) => (
                <Box component="li" key={listIndex}>
                  <Typography variant="subtitle2">{listItem}</Typography>
                </Box>
              ))}
            </Box>
          );
        default:
          return null;
      }
    });
  };

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        <div>
          <Toolbar/>
          <Box sx={{ p: 2 }}>{renderContent(aboutUsContent)}</Box>
        </div>
      </Drawer>


      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        <div>
          <Toolbar/>
          <Box sx={{ p: 2 }}>{renderContent(aboutUsContent)}</Box>
        </div>
      </Drawer>
    </>
  );
}

export default LeftNav;
