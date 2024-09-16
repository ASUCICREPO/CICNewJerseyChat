// src/contexts/ModelContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { MODELS_LIST } from "../utilities/constants";

// Create the context
const ModelContext = createContext();

// Custom hook to use the ModelContext
export const useModel = () => useContext(ModelContext);

// Provider component
export const ModelProvider = ({ children }) => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  // Fetch models from the Bedrock API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${MODELS_LIST}?user_type=employee`);
        const data = await response.json();
        setModels(data);

        // Retrieve model from localStorage
        const storedModelName = localStorage.getItem('selectedModel');
        const storedModelId = localStorage.getItem('selectedModelId');

        // If stored model exists in the fetched models, set it as selected
        if (storedModelName && storedModelId) {
          const modelExists = data.some(model => model.modelName === storedModelName && model.modelId === storedModelId);
          if (modelExists) {
            setSelectedModel(storedModelName);
            setSelectedModelId(storedModelId);
          } else {
            setSelectedModel(data[0]?.modelName || '');
            setSelectedModelId(data[0]?.modelId || '');
          }
        } else {
          // Otherwise, default to the first model in the list
          setSelectedModel(data[0]?.modelName || '');
          setSelectedModelId(data[0]?.modelId || '');
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };

    fetchModels();
  }, []);

  return (
    <ModelContext.Provider value={{ models, selectedModel, setSelectedModel, selectedModelId, setSelectedModelId }}>
      {children}
    </ModelContext.Provider>
  );
};