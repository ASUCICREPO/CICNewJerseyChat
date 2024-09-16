/**
 * Function to create a message block with consistent structure and validation.
 *
 * @param {string} message - The content of the message.
 * @param {string} sentBy - The sender of the message ('USER' or 'BOT').
 * @param {string} [type='TEXT'] - The type of the message ('TEXT' or 'FILE').
 * @param {string} [state='PROCESSING'] - The state of the message ('PROCESSING' or 'RECEIVED' or 'SENT' or 'STREAMING').
 * @param {string} [fileName=''] - The name of the file (if type is 'FILE').
 * @param {string} [fileStatus=''] - The status of the file (if type is 'FILE').
 * @param {string} [modelName=''] - The name of the model used.
 * @param {string} [modelId=''] - The ID of the model used.
 * @param {string} [errorMessage=''] - The error message (if any).
 * @returns {Object} - A message block object.
 * @throws Will throw an error if sentBy, type, or state are invalid.
 */
const createMessageBlock = (
  message,
  sentBy,
  type = "TEXT",
  state = "PROCESSING",
  fileName = "",
  fileStatus = "",
  modelName = "",
  modelId = "",
  errorMessage = "" // New error message field
) => {
  // Valid sender types
  const validSenders = ["USER", "BOT"];
  // Valid message types
  const validTypes = ["TEXT", "FILE"];
  // Valid message states
  const validStates = ["PROCESSING", "RECEIVED", "SENT", "STREAMING"];

  // Validate the 'sentBy' parameter
  if (!validSenders.includes(sentBy)) {
    throw new Error("Invalid sender. Must be 'USER' or 'BOT'.");
  }

  // Validate the 'type' parameter
  if (!validTypes.includes(type)) {
    throw new Error("Invalid message type. Must be 'TEXT' or 'FILE'.");
  }

  // Validate the 'state' parameter
  if (!validStates.includes(state)) {
    throw new Error("Invalid state. Must be 'PROCESSING', 'RECEIVED', 'SENT', or 'STREAMING'.");
  }

  // Return the message block object
  return {
    message,
    sentBy,
    type,
    state,
    fileName,
    fileStatus,
    modelName,
    modelId,
    errorMessage // Include the error message field in the message block
  };
};

export default createMessageBlock;
