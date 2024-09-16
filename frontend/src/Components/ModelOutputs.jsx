import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Grid, Tooltip, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { calculateCost } from '../utilities/calculateCost';
import loadingAnimation from '../Assets/loading_animation.gif';

const ModelOutputs = ({ selectedModels, responses, tokens, loading }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box boxShadow={3} p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h6" mb={2}>Model Outputs</Typography>
      <Grid container spacing={2}>
        {selectedModels.map((model, index) => {
          const tokenData = tokens ? tokens[model.modelName] : undefined;
          const inputTokens = tokenData ? tokenData[0] : 0;
          const outputTokens = tokenData ? tokenData[1] : 0;

          return (
            <Grid item xs={12} md={3} key={index}>
              <Card variant="outlined" sx={{ height: 300, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Chip label={model.modelName} sx={{ marginBottom: 2 }} />
                  <Box sx={{ overflowY: 'auto', maxHeight: '140px', marginBottom: 1, display: 'flex' }}>
                    {loading[model.modelName] ? (
                      <img src={loadingAnimation} alt="Loading..." style={{ width: '50px' }} />
                    ) : (
                      <Typography variant="body2">
                        {responses[model.modelName] || ""}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 1,
                    borderTop: '1px solid #ddd',
                  }}
                >
                  {tokenData && (
                    <Typography variant="caption">
                      Cost $ {calculateCost(inputTokens, outputTokens, model.modelId)}
                    </Typography>
                  )}
                  <Tooltip title="Copy to clipboard">
                    <IconButton size="small" onClick={() => handleCopy(responses[model.modelName] || "")}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ModelOutputs;
