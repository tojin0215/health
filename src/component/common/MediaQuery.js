import React from 'react';
import { useMediaQuery } from 'react-responsive';
// npm install react-responsive

export const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({
    query: '(max-width:767px)',
  });
  return <>{isMobile && children}</>;
};

export const PC = ({ children }) => {
  const isPc = useMediaQuery({
    query: '(min-width:768px)',
  });
  return <>{isPc && children}</>;
};

export default { Mobile, PC };
