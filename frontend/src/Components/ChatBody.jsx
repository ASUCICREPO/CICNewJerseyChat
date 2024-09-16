// This is a components that displays the chat, the text field to add queries
import React, { useState, useRef, useEffect } from "react";
import { Grid, Avatar, Typography, Box, Stack, Toolbar } from "@mui/material";
import Attachment from "./Attachment";
import ChatInput from "./ChatInput";
import UserAvatar from "../Assets/UserAvatar.svg";
import StreamingResponse from "./StreamingResponse";
import createMessageBlock from "../utilities/createMessageBlock";
import { ALLOW_FILE_UPLOAD, ALLOW_VOICE_RECOGNITION } from "../utilities/constants";
import BotFileCheckReply from "./BotFileCheckReply";
import SpeechRecognitionComponent from "./SpeechRecognition";
import IntroAnimation from "./IntroAnimation";
import { useModel } from "../contexts/ModelContext"; 
import { useMessage } from '../contexts/MessageContext';
import BotResponse from './BotResponse';

function ChatBody({ onFileUpload }) {
  const { models, selectedModel, selectedModelId } = useModel();
  const { messageList, addMessage } = useMessage();
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [questionAsked, setQuestionAsked] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // This function receives the bot response
  const handleBotResponse = (response, modelName, modelId, error) => {
    const botMessageBlock = createMessageBlock(
      response,
      "BOT",
      "TEXT",
      "SENT",
      "",
      "",
      modelName,
      modelId,
      error,
    );
    addMessage(botMessageBlock);
  };

  const handleSendMessage = (message) => {
    setProcessing(true);
    const newMessageBlock = createMessageBlock(message, 'USER', 'TEXT', 'SENT', "", "", selectedModel, selectedModelId);
    addMessage(newMessageBlock);
    setQuestionAsked(true);
  };

  const handleFileUploadComplete = (file, fileStatus) => {
    const newMessageBlock = createMessageBlock(
      `File uploaded: ${file.name}`,
      'USER',
      'FILE',
      'SENT',
      file.name,
      fileStatus,
      selectedModel,
      selectedModelId
    );
    addMessage(newMessageBlock);

    const botMessageBlock = createMessageBlock(
      fileStatus === 'File page limit check succeeded.'
        ? 'Checking file size.'
        : fileStatus === 'File size limit exceeded.'
        ? 'File size limit exceeded. Please upload a smaller file.'
        : 'Network Error. Please try again later.',
      'BOT',
      'FILE',
      'RECEIVED',
      file.name,
      fileStatus,
      selectedModel,
      selectedModelId
    );
    addMessage(botMessageBlock);

    setQuestionAsked(true);

    if (onFileUpload && fileStatus === 'File page limit check succeeded.') {
      onFileUpload(file, fileStatus);
    }
  };

  const handlePromptClick = (prompt) => {
    handleSendMessage(prompt);
  };

  const getMessage = () => message;

  return (
    <Stack height={"100vh"} p={2}>
      <Toolbar />
      <Box flex={1} overflow="auto" className="chatScrollContainer">
        <Box>
          {messageList.length === 0 && <IntroAnimation />}
        </Box>
        {messageList.map((msg, index) => (
          <Box key={index} mb={2}>
            {/* Always display the user's message */}
            {msg.sentBy === 'USER' && msg.type === 'TEXT' && (
              <UserReply message={msg.message} />
            )}

            {/* Send only the last user's message to StreamingResponse */}
            {msg.sentBy === 'USER' && msg.type === 'TEXT' && index === messageList.length - 1 && (
              <StreamingResponse 
                initialMessage={msg.message} 
                setProcessing={setProcessing} 
                processing={processing} 
                modelId={msg.modelId} 
                handleBotResponse={handleBotResponse} 
                modelName={msg.modelName} 
              />
            )}

            {/* Display bot message if it is text */}
            {msg.sentBy === 'BOT' && msg.type === 'TEXT' && (
              <BotResponse response={msg.message} modelName={msg.modelName} error={msg.errorMessage} />
            )}

            {/* Display bot file replies */}
            {msg.type === 'FILE' && msg.state === 'RECEIVED' && (
              <BotFileCheckReply messageId={index} setProcessing={setProcessing} processing={processing} />
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ flexShrink: 0 }}
      >
        <Box sx={{ display: ALLOW_VOICE_RECOGNITION ? "flex" : "none" }}>
          <SpeechRecognitionComponent
            setMessage={setMessage}
            getMessage={getMessage}
          />
        </Box>
        <Box sx={{ display: ALLOW_FILE_UPLOAD ? "flex" : "none" }}>
          <Attachment onFileUploadComplete={handleFileUploadComplete} />
        </Box>
        <Box sx={{ width: "100%" }} ml={2}>
          <ChatInput
            onSendMessage={handleSendMessage}
            processing={processing}
            message={message}
            setMessage={setMessage}
          />
        </Box>
      </Box>
    </Stack>
  );
}

export default ChatBody;

function UserReply({ message }) {
  return (
    <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end" mb={2}>
      <Grid item className="userMessage" sx={{ backgroundColor: (theme) => theme.palette.background.userMessage }}>
        <Typography variant="body2">{message}</Typography>
      </Grid>
      <Grid item>
        <Avatar alt={"User Profile Pic"} src={UserAvatar} />
      </Grid>
    </Grid>
  );
}
