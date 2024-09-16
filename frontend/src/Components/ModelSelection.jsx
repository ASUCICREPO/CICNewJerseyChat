import React from 'react';
import { Box, Typography, Grid, Divider, Switch } from '@mui/material';
import { SECONDARY_MAIN } from '../utilities/constants';
import { useModel } from '../contexts/ModelContext';

const ModelSelection = ({ selectedModels, setSelectedModels }) => {
  const { models } = useModel();

  const handleToggle = (model) => {
    const currentIndex = selectedModels.findIndex((selectedModel) => selectedModel.modelId === model.modelId);
    const newSelectedModels = [...selectedModels];

    if (currentIndex === -1) {
      if (selectedModels.length < 4) {
        newSelectedModels.push(model);
      }
    } else {
      newSelectedModels.splice(currentIndex, 1);
    }

    setSelectedModels(newSelectedModels);
  };

  return (
    <Box boxShadow={3} sx={{ padding: 2, height: '100%' }}>
      <Grid container spacing={2} sx={{ maxHeight: '40vh', overflowY: 'auto', marginTop: 1 }}>
        {models.map((model) => (
          <Grid item xs={12} md={3} key={model.modelId}>
            <ModelCard 
              model={model} 
              selectedModels={selectedModels} 
              handleToggle={handleToggle} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const ModelCard = ({ model, selectedModels, handleToggle }) => {
  return (
    <Box sx={{ border: 1, borderColor: SECONDARY_MAIN}} p={1.5}>
      <Grid container alignItems="center">
        <Grid item xs={9}>
          <Typography variant="subtitle1">{model.modelName}</Typography>
          <Typography variant="body2" fontStyle={"italic"}>{model.providerName}</Typography>
        </Grid>
        <Grid item xs={3} container justifyContent="flex-end">
          <Switch
            checked={selectedModels.findIndex((selectedModel) => selectedModel.modelId === model.modelId) !== -1}
            onChange={() => handleToggle(model)}
            inputProps={{ 'aria-label': 'controlled' }}
            disabled={selectedModels.findIndex((selectedModel) => selectedModel.modelId === model.modelId) === -1 && selectedModels.length >= 4}
          />
        </Grid>
      </Grid>
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2">Input Modalities: {model.inputModalities?.join(', ').toLowerCase()}</Typography>
      <Typography variant="body2">Output Modalities: {model.outputModalities?.join(', ').toLowerCase()}</Typography>
    </Box>
  );
};

export default ModelSelection;
