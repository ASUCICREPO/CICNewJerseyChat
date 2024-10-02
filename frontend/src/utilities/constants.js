// --------------------------------------------------------------------------------------------------------//
// Primary color constants for the theme
export const PRIMARY_MAIN = "#444E56"; // 
export const primary_50 = "#1c7ec3"; // The main primary color used for buttons, highlights, etc.

// Background color constants
export const SECONDARY_MAIN = "#D3D3D3"; // The main secondary color used for less prominent elements

// Chat component background colors
export const CHAT_BODY_BACKGROUND = "#FFFFFF"; // Background color for the chat body area
export const CHAT_LEFT_PANEL_BACKGROUND = "#444E56"; // Background color for the left panel in the chat
export const ABOUT_US_HEADER_BACKGROUND = "#FFFFFF"; // Background color for the About Us section in the left panel
export const FAQ_HEADER_BACKGROUND = "#FFFFFF"; // Background color for the FAQ section in the left panel
export const ABOUT_US_TEXT = "#FFFFFF"; // Text color for the About Us section in the left panel
export const FAQ_TEXT = "#FFFFFF"; // Text color for the FAQ section in the left panel
export const HEADER_BACKGROUND = "#FFFFFF"; // Background color for the header
export const HEADER_TEXT_GRADIENT = "#444E56"; // Text gradient color for the header

// Message background colors
export const BOTMESSAGE_BACKGROUND = "#F5F5F5"; // Background color for messages sent by the bot
export const USERMESSAGE_BACKGROUND = "#edf7fa"; // Background color for messages sent by the user

// --------------------------------------------------------------------------------------------------------//
// --------------------------------------------------------------------------------------------------------//

// Text Constants
export const TEXT = {
  EN: {
    APP_NAME: "NJ AI App",
    APP_ASSISTANT_NAME: "NJ Advanced AI",
    ABOUT_US_TITLE: "About us",
    ABOUT_US: [
      {
        type: "heading",
        level: 5,
        content: "NJ Advanced AI"
      },
      {
        type: "paragraph",
        content: "This is an internal generative artificial intelligence chatbot for use by NJ state employees and authorized parties, using Amazon Bedrock."
      },
      {
        type: "heading",
        level: 6,
        content: "Training Requirements"
      },
      {
        type: "paragraph",
        content: "Before using the NJ Advanced AI, please begin the Responsible AI for Public Professionals training course, where you'll be asked to use the Advanced AI."
      },
      {
        type: "list",
        items: [
          "Access this course as a State Learner or as an External Learner. You will be asked to log in with MyNJ and then redirected to the training. If you have trouble accessing the course, please email ciplearning.support@csc.nj.gov."
        ]
      },
      {
        type: "heading",
        level: 6,
        content: "Sensitive Information"
      },
      {
        type: "paragraph",
        content: "In order to ensure responsible, safe AI use, please follow these guidelines:"
      },
      {
        type: "list",
        items: [
          "Do not share personally identifiable information (PII) about residents, colleagues, or yourself.",
          "Do not share confidential or sensitive content, nor transcribe or summarize meetings where sensitive topics are discussed.",
          "In short: Do not share any information that you wouldn't share publicly."
        ]
      },
    ],
    CHAT_HEADER_TITLE: "NJ AI Chat Assistant",
    CHAT_INPUT_PLACEHOLDER: "Type a Query...",
    HELPER_TEXT: "Cannot send empty message",
    SPEECH_RECOGNITION_START: "Start Listening",
    SPEECH_RECOGNITION_STOP: "Stop Listening",
    SPEECH_RECOGNITION_HELPER_TEXT: "Stop speaking to send the message" // New helper text
  },
};


// --------------------------------------------------------------------------------------------------------//
// admin constants
// Dummy admin users
export const adminUsers = ["28216390-8081-70f2-dca6-b847a8816e27","admin1", "admin2", "superadmin", "adminTest"];
// --------------------------------------------------------------------------------------------------------//

// API endpoints
export const MODELS_LIST = process.env.REACT_APP_MODEL_INFORMATIONS // url for getting information about the models
export const CONVERSE_API = process.env.REACT_APP_CONVERSE_API


export const MAX_TEXT_LENGTH_PDF = 150000; // Number of words to check for PDF size (150000 - 200000 is good enough for 200k token limit of claude)


// --------------------------------------------------------------------------------------------------------//
// --------------------------------------------------------------------------------------------------------//

// Features
export const ALLOW_FILE_UPLOAD = true; // Set to true to enable file upload feature
export const ALLOW_VOICE_RECOGNITION = false; // Set to true to enable voice recognition feature

export const ALLOW_MULTLINGUAL_TOGGLE = false; // Set to true to enable multilingual support
export const ALLOW_LANDING_PAGE = false; // Set to true to enable the landing page

// --------------------------------------------------------------------------------------------------------//
// Styling under work, would reccomend keeping it false for now
export const ALLOW_MARKDOWN_BOT = false; // Set to true to enable markdown support for bot messages



// --------------------------------------------------------------------------------------------------------//
// Since there is currently no API for model costs retrieval, I added them all here, if they change at any time they can be edited here
export const MODEL_COSTS = [
  {
    modelId: "amazon.titan-tg1-large",
    modelName: "Titan Text Large",
    providerName: "Amazon",
    costPer1000InputTokens: 0.0005,
    costPer1000OutputTokens: 0.0015,
  },
  {
    modelId: "amazon.titan-text-lite-v1",
    modelName: "Titan Text G1 - Lite",
    providerName: "Amazon",
    costPer1000InputTokens: 0.00015,
    costPer1000OutputTokens: 0.0002,
  },
  {
    modelId: "amazon.titan-text-express-v1",
    modelName: "Titan Text G1 - Express",
    providerName: "Amazon",
    costPer1000InputTokens: 0.0002,
    costPer1000OutputTokens: 0.0006,
  },
  {
    modelId: "ai21.j2-grande-instruct",
    modelName: "J2 Grande Instruct",
    providerName: "AI21 Labs",
    costPer1000InputTokens: 0.0125,
    costPer1000OutputTokens: 0.0125,
  },
  {
    modelId: "ai21.j2-jumbo-instruct",
    modelName: "J2 Jumbo Instruct",
    providerName: "AI21 Labs",
    costPer1000InputTokens: 0.0188,
    costPer1000OutputTokens: 0.0188,
  },
  {
    modelId: "anthropic.claude-instant-v1",
    modelName: "Claude Instant",
    providerName: "Anthropic",
    costPer1000InputTokens: 0.0008,
    costPer1000OutputTokens: 0.0024,
  },
  {
    modelId: "anthropic.claude-v2",
    modelName: "Claude",
    providerName: "Anthropic",
    costPer1000InputTokens: 0.008,
    costPer1000OutputTokens: 0.024,
  },
  {
    modelId: "anthropic.claude-v2:1",
    modelName: "Claude",
    providerName: "Anthropic",
    costPer1000InputTokens: 0.008,
    costPer1000OutputTokens: 0.024,
  },
  {
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    modelName: "Claude 3 Sonnet",
    providerName: "Anthropic",
    costPer1000InputTokens: 0.003,
    costPer1000OutputTokens: 0.015,
  },
  {
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    modelName: "Claude 3 Haiku",
    providerName: "Anthropic",
    costPer1000InputTokens: 0.00025,
    costPer1000OutputTokens: 0.00125,
  },
  {
    modelId: "anthropic.claude-3-opus-20240229-v1:0",
    modelName: "Claude 3 Opus",
    providerName: "Anthropic",
    costPer1000InputTokens: 0.015,
    costPer1000OutputTokens: 0.075,
  },
  {
    modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
    modelName: "Claude 3.5 Sonnet",
    providerName: "Anthropic",
    costPer1000InputTokens: 0.003,
    costPer1000OutputTokens: 0.015,
  },
  {
    modelId: "cohere.command-text-v14",
    modelName: "Command",
    providerName: "Cohere",
    costPer1000InputTokens: 0.0015,
    costPer1000OutputTokens: 0.0020,
  },
  {
    modelId: "cohere.command-light-text-v14",
    modelName: "Command Light",
    providerName: "Cohere",
    costPer1000InputTokens: 0.0003,
    costPer1000OutputTokens: 0.0006,
  },
  {
    modelId: "cohere.command-r-v1:0",
    modelName: "Command R",
    providerName: "Cohere",
    costPer1000InputTokens: 0.0005,
    costPer1000OutputTokens: 0.0015,
  },
  {
    modelId: "cohere.command-r-plus-v1:0",
    modelName: "Command R+",
    providerName: "Cohere",
    costPer1000InputTokens: 0.003,
    costPer1000OutputTokens: 0.015,
  },
  {
    modelId: "meta.llama3-8b-instruct-v1:0",
    modelName: "Llama 3 8B Instruct",
    providerName: "Meta",
    costPer1000InputTokens: 0.00022,
    costPer1000OutputTokens: 0.00022,
  },
  {
    modelId: "meta.llama3-70b-instruct-v1:0",
    modelName: "Llama 3 70B Instruct",
    providerName: "Meta",
    costPer1000InputTokens: 0.00099,
    costPer1000OutputTokens: 0.00099,
  },
  {
    modelId: "meta.llama3-1-8b-instruct-v1:0",
    modelName: "Llama 3.1 8B Instruct",
    providerName: "Meta",
    costPer1000InputTokens: 0.00022,
    costPer1000OutputTokens: 0.00022,
  },
  {
    modelId: "meta.llama3-1-70b-instruct-v1:0",
    modelName: "Llama 3.1 70B Instruct",
    providerName: "Meta",
    costPer1000InputTokens: 0.00099,
    costPer1000OutputTokens: 0.00099,
  },
  {
    modelId: "meta.llama3-1-405b-instruct-v1:0",
    modelName: "Llama 3.1 405B Instruct",
    providerName: "Meta",
    costPer1000InputTokens: 0.00532,
    costPer1000OutputTokens: 0.016,
  },
  {
    modelId: "mistral.mistral-7b-instruct-v0:2",
    modelName: "Mistral 7B Instruct",
    providerName: "Mistral AI",
    costPer1000InputTokens: 0.00015,
    costPer1000OutputTokens: 0.0002,
  },
  {
    modelId: "mistral.mixtral-8x7b-instruct-v0:1",
    modelName: "Mixtral 8x7B Instruct",
    providerName: "Mistral AI",
    costPer1000InputTokens: 0.00045,
    costPer1000OutputTokens: 0.0007,
  },
  {
    modelId: "mistral.mistral-large-2402-v1:0",
    modelName: "Mistral Large (2402)",
    providerName: "Mistral AI",
    costPer1000InputTokens: 0.004,
    costPer1000OutputTokens: 0.012,
  },
  {
    modelId: "mistral.mistral-large-2407-v1:0",
    modelName: "Mistral Large (2407)",
    providerName: "Mistral AI",
    costPer1000InputTokens: 0.004,
    costPer1000OutputTokens: 0.012,
  },
  {
    modelId: "ai21.j2-mid-instruct",
    modelName: "Jurassic-2 Mid",
    providerName: "AI21 Labs",
    costPer1000InputTokens: 0.0125,
    costPer1000OutputTokens: 0.0125,
  },
  {
    modelId: "ai21.j2-ultra-instruct",
    modelName: "Jurassic-2 Ultra",
    providerName: "AI21 Labs",
    costPer1000InputTokens: 0.0188,
    costPer1000OutputTokens: 0.0188,
  },
  {
    modelId: "ai21.j2-jumbo-instruct",
    modelName: "Jamba-Instruct",
    providerName: "AI21 Labs",
    costPer1000InputTokens: 0.0005,
    costPer1000OutputTokens: 0.0007,
  }
];
