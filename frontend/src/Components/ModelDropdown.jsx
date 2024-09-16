// src/components/ModelDropdown.js
import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useModel } from '../contexts/ModelContext';

export default function ModelDropdown() {
  const { models, selectedModel, setSelectedModel , selectedModelId, setSelectedModelId } = useModel();

  const handleChange = (event) => {
    const selectedModelName = event.target.value;
    setSelectedModel(selectedModelName);

    // Find the corresponding model ID based on the selected model name
    const selectedModelObject = models.find(model => model.modelName === selectedModelName);
    if (selectedModelObject) {
      setSelectedModelId(selectedModelObject.modelId); // Set the selectedModelId
      // console.log("setting model Id here", selectedModelObject.modelId)
    }
  };

  return (
    <FormControl sx={{ m: 1 }}>
      <InputLabel id="model-select-label">Model</InputLabel>
      <Select
        labelId="model-select-label"
        value={selectedModel}
        onChange={handleChange}
        label="Model"
      >
        {models.map((model) => (
          <MenuItem key={model.id} value={model.modelName}>
            {model.modelName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
