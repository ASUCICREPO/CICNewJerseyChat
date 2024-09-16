import React, { useState, useRef, useContext } from "react";
import {
  Toolbar,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import Slider from "../Components/Slider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppHeader from "../Components/AppHeader";
import ModelSelection from "../Components/ModelSelection";
import { primary_50, CONVERSE_API, PRIMARY_MAIN } from "../utilities/constants";
import ModelOutputs from "../Components/ModelOutputs";
import { useResponseLength } from '../contexts/ResponseLengthContext';
import createMessageBlock from "../utilities/createMessageBlock";
import { UserContext } from "../contexts/UserContext"; // Import UserContext

const CompareModels = ({signOut, user}) => {
  const [selectedModels, setSelectedModels] = useState([]);
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState({});
  const [tokens, setTokens] = useState({});
  const [loading, setLoading] = useState({});
  const [processing, setProcessing] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [showModelError, setShowModelError] = useState(false);
  const { responseLength } = useResponseLength();
  const { isAdmin } = useContext(UserContext); // Use the isAdmin state from context

  const outputRef = useRef(null);

  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  const handleGenerateClick = async () => {
    if (!question || selectedModels.length === 0) {
      setShowModelError(true);
      return;
    }

    setProcessing(true);
    setShowModelError(false);

    const newResponses = {};
    const newTokens = {};
    const newLoading = {};

    selectedModels.forEach((model) => {
      newLoading[model.modelName] = true;
    });
    setLoading(newLoading);

    const userMessageBlock = createMessageBlock(
      question,
      'USER',
      'TEXT',
      'SENT',
      "",
      "",
      "",
      ""
    );

    const updatedMessageList = [userMessageBlock];

    const invokeModels = selectedModels.map((model) => {
      return new Promise(async (resolve, reject) => {
        try {
          const requestBody = {
            user_message: question,
            selected_model: model.modelId,
            responseLength: responseLength,
            message_history: updatedMessageList,
          };

          const response = await fetch(CONVERSE_API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();

          newResponses[model.modelName] =
            data.messages.content[0].text || "No response received";
          newTokens[model.modelName] =
            [data.inputTokens, data.outputTokens] || "";

          setResponses((prevResponses) => ({ ...prevResponses, ...newResponses }));
          setTokens((prevTokens) => ({ ...prevTokens, ...newTokens }));
          setLoading((prevLoading) => ({ ...prevLoading, [model.modelName]: false }));

          resolve();
        } catch (error) {
          console.error(`Error invoking model: ${model.modelName}`, error);
          setLoading((prevLoading) => ({ ...prevLoading, [model.modelName]: false }));
          reject(error);
        }
      });
    });

    try {
      await Promise.all(invokeModels);
      outputRef.current.scrollIntoView({ behavior: "smooth" });
    } finally {
      setProcessing(false);
    }
  };

  const buttonsConfig = [
    {
      label: "Chat",
      route: "/",
      color: "primary",
      style: {
        backgroundColor: primary_50,
        color: "white",
        padding: 1,
        "&:hover": {
          backgroundColor: PRIMARY_MAIN,
          color: "white",
        },
      },
    },
    // Conditionally render the "Update models" button only if the user is an admin
    isAdmin && {
      label: "Update models",
      route: "/select",
      color: "secondary",
      style: {
        backgroundColor: primary_50,
        color: "white",
        padding: 1,
        "&:hover": {
          backgroundColor: PRIMARY_MAIN,
          color: "white",
        },
      },
    },
  ].filter(Boolean); // Remove null entries from the array

  return (
    <>
      <AppHeader buttonsConfig={buttonsConfig} signOut={signOut}/>
      <Toolbar />
      <Toolbar sx={{ backgroundColor: primary_50 }}>
        <Typography variant="h6" color="white">
          Model Comparisons
        </Typography>
      </Toolbar>

      <Box sx={{ padding: 4 }}>
        {showModelError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please select at least one model before generating a response.
          </Alert>
        )}

        <Accordion expanded={expanded} onChange={handleAccordionChange}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">
              Step 1: Select up to 4 models to compare
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ModelSelection
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
            />
          </AccordionDetails>
        </Accordion>


        {/* add query */}
        <Box boxShadow={3} sx={{ padding: 2, marginTop: 2 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={10}>
              <Typography variant="h6" gutterBottom>
                Step 2: Add your question or task for comparison
              </Typography>
              <TextField
                fullWidth
                label="Enter your question"
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={processing}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Slider />
                <Button
                  sx={{
                    backgroundColor: primary_50,
                    color: "white",
                    marginTop: 1,
                    padding: 2,
                    "&:hover": {
                      backgroundColor: PRIMARY_MAIN,
                      color: "white",
                    },
                  }}
                  onClick={handleGenerateClick}
                  disabled={processing}
                >
                  {processing ? <CircularProgress size={24} color="inherit" /> : "Generate"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>


        {/* model outputs */}
        <Box ref={outputRef} sx={{ marginTop: 2 }}>
          <ModelOutputs
            responses={responses}
            selectedModels={selectedModels}
            tokens={tokens}
            loading={loading}
          />
        </Box>
      </Box>
    </>
  );
};

export default CompareModels;
