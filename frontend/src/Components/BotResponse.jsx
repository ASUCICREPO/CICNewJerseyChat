// this component showcases the bot response we recieve from bedrock models
import React from "react";
import { Grid, Avatar, Typography, Chip, Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import InfoIcon from '@mui/icons-material/Info'; 
import BotAvatar from "../Assets/BotAvatar.svg";
import loadingAnimation from "../Assets/loading_animation.gif"; 

const BotResponse = ({ response, isLoading, modelName, error, isChatError, isDocumentError }) => {
  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end">
      {/* Bot image, currently showcases a bedrock image */}
      <Grid item>
        <Avatar alt="Bot Avatar" src={BotAvatar} />
      </Grid>
      <Grid item className="botMessage" sx={{ backgroundColor: (theme) => theme.palette.background.botMessage }}>
        <Chip label={modelName || "No Model Selected"} />
        <br />
        {isLoading ? (
          <img src={loadingAnimation} alt="Loading..." style={{ width: '50px', marginTop: '10px' }} />
        ) : (
          <>
          {/* response from bot */}
            <Typography variant="body2" marginTop={2}>
              <ReactMarkdown>{response}</ReactMarkdown>
            </Typography>
            {/* These are info/ errors it will show to the user in case they choose a model that does not allow chat or document based chat */}
            {isChatError && (
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="textSecondary">
                  This model does not support chat. It is optimized for single-turn Q&A.
                </Typography>
              </Box>
            )}
            {isDocumentError && (
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="textSecondary">
                  This model does not support document-based chat. Kindly choose a different model to query the uploaded document.
                </Typography>
              </Box>
            )}
            {error && (
              <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default BotResponse;
