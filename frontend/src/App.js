import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react"; 
import "@aws-amplify/ui-react/styles.css"; // Amplify UI styles
import awsExports from "./aws-exports"; // AWS configurations

import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { LanguageProvider } from "./utilities/LanguageContext";
import { TranscriptProvider } from "./utilities/TranscriptContext";
import { ResponseLengthProvider } from "./contexts/ResponseLengthContext";
import { ModelProvider } from "./contexts/ModelContext";
import { UserProvider } from "./contexts/UserContext";
import { MessageProvider } from "./contexts/MessageContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompareModels, ChatBot, SelectModels } from "./Pages";
import ProtectedRoute from "./Components/ProtectedRoute";

// Configure Amplify with AWS services
Amplify.configure(awsExports);

function App() {
  return (
    <Authenticator hideSignUp>
      {({ signOut, user }) => (
        <LanguageProvider>
          <UserProvider user={user}>
            <ResponseLengthProvider>
              <MessageProvider>
                <ModelProvider>
                  <TranscriptProvider>
                    <BrowserRouter>
                      <ThemeProvider theme={theme}>
                        <Routes>
                          <Route 
                            path="/" 
                            exact 
                            element={<ChatBot signOut={signOut} />} 
                          />
                          <Route 
                            path="/compare" 
                            exact 
                            element={<CompareModels signOut={signOut} />} 
                          />
                          {/* Protect the /select route */}
                          <Route 
                            path="/select" 
                            exact 
                            element={
                              <ProtectedRoute>
                                <SelectModels signOut={signOut} />
                              </ProtectedRoute>
                            } 
                          />
                        </Routes>
                      </ThemeProvider>
                    </BrowserRouter>
                  </TranscriptProvider>
                </ModelProvider>
              </MessageProvider>
            </ResponseLengthProvider>
          </UserProvider>
        </LanguageProvider>
      )}
    </Authenticator>
  );
}

export default App;
