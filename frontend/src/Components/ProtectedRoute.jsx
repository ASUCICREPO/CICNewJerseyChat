import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useContext(UserContext);

  // If the user is not an admin, redirect them to the chat page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If the user is an admin, let them go to the slect models page
  return children;
};

export default ProtectedRoute;
