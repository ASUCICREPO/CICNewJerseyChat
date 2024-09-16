import React, { useState } from "react";
import { Grid, Button, CircularProgress } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import pdfToText from 'react-pdftotext';
import { useMessage } from "../contexts/MessageContext";
import { MAX_TEXT_LENGTH_PDF } from "../utilities/constants";
import { useModel } from "../contexts/ModelContext"; 

function Attachment({ onFileUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const { selectedModel, selectedModelId } = useModel();
  const { addMessage } = useMessage();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const textContent = await pdfToText(file);

      if (textContent.length > MAX_TEXT_LENGTH_PDF) {
        setUploading(false);
        onFileUploadComplete(file, "File size limit exceeded.");
        return;
      }

      onFileUploadComplete(file, "File page limit check succeeded.");

      const fileNameWithoutExtension = file.name.replace('.pdf', '');
      // Add the extracted text to the message list
      addMessage({
        type: 'FILE',
        sentBy: 'USER',
        state: 'SENT',
        content: textContent,
        fileName: fileNameWithoutExtension,
        fileStatus: "File converted and added to message list.",
        selectedModel,
        selectedModelId
      });
      
    } catch (error) {
      console.error("Failed to extract text from pdf", error);
      onFileUploadComplete(file, "Error processing file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Grid container direction="column" alignItems="flex-end" justifyContent="center">
      <Grid item xs={12}>
        <Button component="label" className="attachmentButton">
          <AttachFileIcon />
          <input type="file" accept="application/pdf" hidden onChange={handleFileUpload} />
          {uploading && <CircularProgress size={24} />}
        </Button>
      </Grid>
    </Grid>
  );
}

export default Attachment;