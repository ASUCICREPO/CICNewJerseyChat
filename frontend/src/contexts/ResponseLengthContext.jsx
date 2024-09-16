import React, { createContext, useState, useContext } from 'react';

// Create the context
const ResponseLengthContext = createContext();

// Create a provider component
export const ResponseLengthProvider = ({ children }) => {
  const [responseLength, setResponseLength] = useState(1000); // Default value

  return (
    <ResponseLengthContext.Provider value={{ responseLength, setResponseLength }}>
      {children}
    </ResponseLengthContext.Provider>
  );
};

// Custom hook to use the ResponseLength context
export const useResponseLength = () => {
  return useContext(ResponseLengthContext);
};
