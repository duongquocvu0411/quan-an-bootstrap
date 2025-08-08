// import React, { createContext, useState, useEffect } from 'react';

// export const DarkModeContext = createContext();

// export const DarkModeProvider = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(() => {
//     const stored = localStorage.getItem('darkMode');
//     return stored ? JSON.parse(stored) : false;
//   });

//   useEffect(() => {
//     document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
//     localStorage.setItem('darkMode', JSON.stringify(darkMode));
//   }, [darkMode]);

//   return (
//     <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
//       {children}
//     </DarkModeContext.Provider>
//   );
// };



import React, { createContext, useState, useEffect } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [autoMode, setAutoMode] = useState(() => {
    const stored = localStorage.getItem('autoDarkMode');
    return stored ? JSON.parse(stored) : false;
  });

  // Tự động cập nhật theo giờ UTC nếu bật autoMode
useEffect(() => {
  if (autoMode) {
    const utcHour = new Date().getUTCHours();
    const vnHour = (utcHour + 7) % 24; // Giờ Việt Nam (UTC+7)
    const isNight = vnHour >= 18 || vnHour < 6;
    setDarkMode(isNight);
  }
}, [autoMode]);

  // Lưu vào localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('autoDarkMode', JSON.stringify(autoMode));
    document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
  }, [darkMode, autoMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, autoMode, setAutoMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
