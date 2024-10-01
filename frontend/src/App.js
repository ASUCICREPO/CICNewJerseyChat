import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { getCurrentUser, signOut, signInWithRedirect } from 'aws-amplify/auth';
import awsExports from "./aws-exports"; // AWS configurations
import "@aws-amplify/ui-react/styles.css"; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { LanguageProvider } from "./utilities/LanguageContext";
import { TranscriptProvider } from "./utilities/TranscriptContext";
import { ResponseLengthProvider } from "./contexts/ResponseLengthContext";
import { ModelProvider } from "./contexts/ModelContext";
import { UserProvider } from "./contexts/UserContext";
import { MessageProvider } from "./contexts/MessageContext";
import { CompareModels, ChatBot, SelectModels } from "./Pages";
import ProtectedRoute from "./Components/ProtectedRoute";

Amplify.configure(awsExports);

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check if a user is authenticated
  async function checkAuth() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.log('No user signed in', error);
    } finally {
      setAuthChecked(true); 
    }
  }

  // Function to handle SAML Sign-In
  const handleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'njsaml' }); // Replace 'njsaml' with your SAML provider's name
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };


  if (!authChecked) {
    return <div>Loading...</div>;
  }

  // Automatically redirect to login page if the user is not authenticated
  if (!user) {
    handleSignIn(); 
    return null;
  }

  return (
    <LanguageProvider>
      <UserProvider user={user}>
        <ResponseLengthProvider>
          <MessageProvider>
            <ModelProvider>
              <TranscriptProvider>
                <BrowserRouter>
                  <ThemeProvider theme={theme}>
                    <Routes>
                      {/* After authentication, redirect from "/" to "/chat" */}
                      <Route path="/" element={<Navigate to="/chat" replace />} />
                      <Route 
                        path="/select" 
                        element={<ProtectedRoute><SelectModels /></ProtectedRoute>} 
                      />
                      <Route 
                        path="/chat" 
                        element={<ChatBot signOut={signOut}/>} 
                      />
                      <Route 
                        path="/compare" 
                        element={<CompareModels signOut={signOut}/>} 
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
  );
}

export default App;
