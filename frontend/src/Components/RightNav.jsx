import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import ModelDropdown from "./ModelDropdown";
import Slider from "./Slider";
import { Box, Button, Divider, FormControlLabel, Checkbox } from "@mui/material";
import { primary_50, PRIMARY_MAIN } from "../utilities/constants";
import { useNavigate } from 'react-router-dom';
import { useModel } from '../contexts/ModelContext';
import UserMenu from "./UserMenu";

const RightNav = ({ drawerWidth, mobileOpen, handleDrawerClose, handleDrawerTransitionEnd, signOut }) => {
  const navigate = useNavigate();
  const { selectedModel, selectedModelId } = useModel();
  const [saveModel, setSaveModel] = useState(false);
  const [isModelAlreadySaved, setIsModelAlreadySaved] = useState(false);

  useEffect(() => {
    const storedModelName = localStorage.getItem('selectedModel');
    const storedModelId = localStorage.getItem('selectedModelId');

    if (storedModelName === selectedModel && storedModelId === selectedModelId) {
      setIsModelAlreadySaved(true);
      setSaveModel(true);
    } else {
      setIsModelAlreadySaved(false);
      setSaveModel(false);
    }
  }, [selectedModel, selectedModelId]);

  const handleCompareClick = () => {
    navigate('/compare');
  };

  const handleSaveModelChange = (event) => {
    const shouldSave = event.target.checked;
    setSaveModel(shouldSave);

    if (shouldSave && selectedModel && selectedModelId) {
      localStorage.setItem('selectedModel', selectedModel);
      localStorage.setItem('selectedModelId', selectedModelId);
      setIsModelAlreadySaved(true);
    } else {
      localStorage.removeItem('selectedModel');
      localStorage.removeItem('selectedModelId');
      setIsModelAlreadySaved(false);
    }
  };

  const renderContent = () => (
    <>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          sx={{
            backgroundColor: primary_50,
            color: "white",
            "&:hover": {
              backgroundColor: PRIMARY_MAIN,
              color: "white",
            },
          }}
          onClick={handleCompareClick}
        >
          Compare models
        </Button>
        <UserMenu signOut={signOut}/>
      </Toolbar>
      <Divider />
      <Toolbar />
      <ModelDropdown />
      <Box m={2}>
        <Slider />
      </Box>
      <Box sx={{ marginTop: 'auto', padding: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={saveModel}
              onChange={handleSaveModelChange}
              name="saveModel"
              disabled={isModelAlreadySaved} // Disable checkbox if the model is already saved
            />
          }
          label="Set as default model"
        />
      </Box>
    </>
  );

  return (
    <>
      {/* Temporary Drawer for mobile view */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        anchor="right"
      >
        {renderContent()}
      </Drawer>

      {/* Permanent Drawer for desktop view */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
        anchor="right"
      >
        {renderContent()}
      </Drawer>
    </>
  );
};

export default RightNav;
