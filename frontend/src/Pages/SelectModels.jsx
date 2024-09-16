import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, FormControlLabel, Checkbox, Button, Toolbar, Divider, Alert } from '@mui/material';
import { MODELS_LIST } from "../utilities/constants";
import AppHeader from '../Components/AppHeader';
import { primary_50, PRIMARY_MAIN } from "../utilities/constants";
import { useModel } from '../contexts/ModelContext';

const SelectModels = ({signOut}) => {
  const { models: contextModels } = useModel(); // Accessing models from the context
  const [apiModels, setApiModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' }); // Alert state

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${MODELS_LIST}?user_type=admin`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setApiModels(data || []);

          // Initialize selectedModels state based on comparison
          const initialState = data.reduce((acc, model) => {
            const isInContext = contextModels.some(ctxModel => ctxModel.modelId === model.modelId);
            acc[model.modelId] = isInContext;
            return acc;
          }, {});

          setSelectedModels(initialState);
        } else {
          console.error("Unexpected API response format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };

    fetchModels();
  }, [contextModels]);

  const handleCheckboxChange = (modelId) => {
    setSelectedModels((prevSelectedModels) => ({
      ...prevSelectedModels,
      [modelId]: !prevSelectedModels[modelId],
    }));
  };

  const handleSave = () => {
    // Filter the apiModels to only include those that are selected (checked)
    const selectedModelsToUpdate = apiModels.filter(model => selectedModels[model.modelId]);
  
    // Prepare the data to be saved, which includes only the selected models
    const updatedModels = selectedModelsToUpdate.map((model) => ({
      ...model,
      isVisible: true, // Since these are the selected ones, we explicitly set isVisible to true
    }));
  
    console.log("Selected models to update:", updatedModels);
  
    const url = `${MODELS_LIST}?user_type=admin_update`;
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedModels),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save models');
        }
        return response.json();
      })
      .then(data => {
        console.log('Models saved successfully:', data);
        setAlert({ show: true, type: 'success', message: 'Models updated successfully!' }); // Show success alert
      })
      .catch(error => {
        console.error('Error saving models:', error);
        setAlert({ show: true, type: 'error', message: 'Failed to update models. Please try again.' }); // Show error alert
      });
  };

  // this is to show the specific buttons on this page
  const buttonsConfig = [
    {
      label: "Chat",
      route: "/",  // Navigate to the chatbot page
      color: "primary",
      style: { 
      backgroundColor: primary_50, 
      color: "white", 
      padding: 1,
      '&:hover': { // Custom hover styles
        backgroundColor: PRIMARY_MAIN,  // Keep the same background color on hover
        color: "white", // Keep the text color white on hover
      },
    },
    },
    {
      label: "Compare models",
      route: "/compare",  // Navigate to the selection page for admin
      color: "secondary",
      style: { 
      backgroundColor: primary_50, 
      color: "white", 
      padding: 1,
      '&:hover': { // Custom hover styles
        backgroundColor: PRIMARY_MAIN,  // Keep the same background color on hover
        color: "white", // Keep the text color white on hover
      },
    },
    },
  ];

  return (
    <>
      <AppHeader buttonsConfig={buttonsConfig} signOut={signOut}/>
      <Toolbar />
      <Toolbar sx={{ backgroundColor: primary_50 }}>
        <Typography variant="h6" color="white">
          Model Selection
        </Typography>
      </Toolbar>
      <Box boxShadow={3} p={3} m={3}>
        {/* Conditionally render the Alert component */}
        {alert.show && (
          <Alert 
            severity={alert.type} 
            onClose={() => setAlert({ ...alert, show: false })}
            sx={{ mb: 2 }}
          >
            {alert.message}
          </Alert>
        )}
        <Grid container spacing={2}>
          {apiModels.map((model) => (
            <Grid item xs={6} sm={4} md={3} key={model.modelId} mb={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedModels[model.modelId] || false}
                    onChange={() => handleCheckboxChange(model.modelId)}
                    color="primary"
                  />
                }
                label={model.modelName}
              />
            </Grid>
          ))}
        </Grid>
        <Divider />
        <Button
          sx={{
                backgroundColor: primary_50,
                color: "white",
                marginTop: 2,
                padding: 2,
                "&:hover": {
                  backgroundColor: PRIMARY_MAIN, // Maintain the background color on hover
                  color: "white", // Keep the text color white on hover
                },
              }}
          onClick={handleSave}
        >
          Update Models
        </Button>
      </Box>
    </>
  );
};

export default SelectModels;
