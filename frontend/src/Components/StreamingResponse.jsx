// import React, { useState, useEffect } from "react";
// import { Grid, Avatar, Typography, Chip, Box } from "@mui/material";
// import BotAvatar from "../Assets/BotAvatar.svg";
// import loadingAnimation from "../Assets/loading_animation.gif"; // Import your loading animation
// import { CONVERSE_API } from "../utilities/constants";
// import ReactMarkdown from "react-markdown";
// import { useResponseLength } from '../contexts/ResponseLengthContext'; // Import the context hook
// import { useMessage } from "../contexts/MessageContext";

// const StreamingMessage = ({ initialMessage, setProcessing, modelName, modelId, handleBotResponse }) => {
//   const [response, setResponse] = useState("");
//   const [isLoading, setIsLoading] = useState(true); // State to track loading status
//   const { responseLength } = useResponseLength(); // Use the context
//   const { messageList } = useMessage();

//   useEffect(() => {
//     const fetchResponse = async () => {
//       setProcessing(true);

//       const requestBody = {
//         user_message: initialMessage,
//         selected_model: modelId,
//         response_length: responseLength,
//         message_history: messageList
//       };

//       try {
//         const response = await fetch(CONVERSE_API, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(requestBody),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           const botMessage = data.messages.content[0].text;
//           setResponse(botMessage);

//           // Call the function to save the bot's response in the message list
//           handleBotResponse(botMessage, modelName, modelId);
//         } else {
//           console.error('Error fetching response:', data.error);
//         }
//       } catch (error) {
//         console.error('Error making request:', error);
//       } finally {
//         setIsLoading(false); // Stop loading animation when the request completes
//         setProcessing(false);
//       }
//     };

//     fetchResponse();
//   }, [initialMessage]);

//   return (
//     <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end">
//       <Grid item>
//         <Avatar alt="Bot Avatar" src={BotAvatar} />
//       </Grid>
//       <Grid item className="botMessage" sx={{ backgroundColor: (theme) => theme.palette.background.botMessage }}>
//         <Chip label={modelName} />
//         <br />
//         {isLoading ? (
//           <img src={loadingAnimation} alt="Loading..." style={{ width: '50px', marginTop: '10px' }} /> 
//         ) : (
//           <Typography variant="body2" marginTop={2}>
//             <ReactMarkdown>{response}</ReactMarkdown>
//           </Typography>
//         )}
//       </Grid>
//     </Grid>
//   );
// };

// export default StreamingMessage;
import React, { useState, useEffect } from "react";
import { Grid, Avatar, Typography, Chip, Box } from "@mui/material";
import BotAvatar from "../Assets/BotAvatar.svg";
import loadingAnimation from "../Assets/loading_animation.gif"; // Import your loading animation
import { CONVERSE_API } from "../utilities/constants";
import ReactMarkdown from "react-markdown";
import { useResponseLength } from '../contexts/ResponseLengthContext'; // Import the context hook
import { useMessage } from "../contexts/MessageContext";
import InfoIcon from '@mui/icons-material/Info'; // Import the Info icon from Material UI
import BotResponse from "./BotResponse"; // Import the new BotResponse component

const StreamingMessage = ({ initialMessage, setProcessing, modelName, modelId, handleBotResponse }) => {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [isChatError, setIsChatError] = useState(false); // State to track if chat error occurred
  const [isDocumentError, setIsDocumentError] = useState(false); // State to track if document error occurred
  const { responseLength } = useResponseLength(); // Use the context
  const { messageList, addMessage } = useMessage();

  useEffect(() => {
    const fetchResponse = async (sendLastMessageOnly = false) => {
      setProcessing(true);

      const requestBody = {
        user_message: initialMessage,
        selected_model: modelId,
        response_length: responseLength,
        ...(sendLastMessageOnly ? { message_history: [messageList[messageList.length - 1]] } : { message_history: messageList }),
      };

      try {
        const response = await fetch(CONVERSE_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (response.ok) {
          const botMessage = data.messages.content[0].text;
          setResponse(botMessage);

          // Call the function to save the bot's response in the message list
          handleBotResponse(botMessage, modelName, modelId, sendLastMessageOnly ? "This model does not support chat. It is optimized for single-turn Q&A." : "" );
        } else {
          // Check if the error is related to conversation history
          if (data.error && data.error.includes("doesn't support conversation history")) {
            console.error("Model does not support conversation history, retrying with last message only");
            setIsChatError(true); // Set error state for conversation history
            fetchResponse(true);
          } 
          // Check if the error is related to document chat support
          else if (data.error && data.error.includes("doesn't support documents")) {
            console.error("Model does not support document chat");

            // Add dummy bot message to message list, this ensure that messages alternate between bot and user
            const dummyMessage = "---";
            handleBotResponse(dummyMessage, modelName, modelId, "This model does not support document-based chat. Kindly choose a different model to query the uploaded document.");

            setIsDocumentError(true); // Set error state for document support
          } else {
            console.error("Error fetching response:", data.error);
          }
        }
      } catch (error) {
        console.error("Error making request:", error);
      } finally {
        setIsLoading(false); // Stop loading animation when the request completes
        setProcessing(false);
      }
    };

    fetchResponse();
  }, [initialMessage]);

  return (
    <BotResponse
      response={response}
      isLoading={isLoading}
      modelName={modelName}
      isChatError={isChatError}
      isDocumentError={isDocumentError}
    />
  );
};

export default StreamingMessage;
