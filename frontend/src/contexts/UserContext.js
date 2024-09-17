// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { adminUsers } from "../utilities/constants";
import { fetchAuthSession } from 'aws-amplify/auth';

// Create context
export const UserContext = createContext();

// Create provider component
export const UserProvider = ({ children, user }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");

  //  // Function to fetch current session and get access token
  //  const fetchAccessToken = async () => {
  //   try {
  //     const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
  //     // const token = session.getAccessToken().getJwtToken();  // Get access token
  //     // setAccessToken(token);  // Set access token in state
  //     console.log("Access Token:", idToken, accessToken);
  //   } catch (err) {
  //     console.log("Error fetching access token:", err);
  //   }
  // };


  // Login function to be called when a user logs in
  const login = (user) => {
    const username = user?.username || "";
    setUsername(username);

    const isAdminUser = adminUsers.includes(username);
    setIsAdmin(isAdminUser);

    // Store the username and admin status in localStorage to persist it
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", isAdminUser);

    // Fetch and set the access token for the logged-in user
    // fetchAccessToken();
  };

  // Logout function to be called when a user logs out
  const logout = () => {
    setUsername("");
    setIsAdmin(false);
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
  };

  // Set the user on login when the user object changes (passed from Amplify)
  useEffect(() => {
    if (user) {
      login(user); // Log in the user when the user object is available
    } else {
      logout(); // Log out the user if no user is available
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ isAdmin, username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
