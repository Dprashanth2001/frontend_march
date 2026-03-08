// import { createContext, useContext, useState } from "react";

// const AppContext = createContext(null);

// export function AppProvider({ children }) {
//   const [student, setStudent] = useState(null);
//   const [sessionId, setSessionId] = useState(null);
//   const [sessionData, setSessionData] = useState(null); // full session object with device arrays
//   const [admin, setAdmin] = useState(null);
//   const [labId, setLabId] = useState("");

//   const logout = () => {
//     setStudent(null);
//     setSessionId(null);
//     setSessionData(null);
//     setLabId("");
//   };

//   const adminLogout = () => setAdmin(null);

//   return (
//     <AppContext.Provider
//       value={{
//         student,
//         setStudent,
//         sessionId,
//         setSessionId,
//         sessionData,
//         setSessionData,
//         admin,
//         setAdmin,
//         labId,
//         setLabId,
//         logout,
//         adminLogout,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

// export const useApp = () => useContext(AppContext);

import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [sessionInstanceId, setSessionInstanceId] = useState(null); // MongoDB _id of session doc
  const [sessionData, setSessionData] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [labId, setLabId] = useState("");

  const logout = () => {
    setStudent(null);
    setSessionId(null);
    setSessionInstanceId(null);
    setSessionData(null);
    setLabId("");
  };

  const adminLogout = () => setAdmin(null);

  return (
    <AppContext.Provider
      value={{
        student,
        setStudent,
        sessionId,
        setSessionId,
        sessionInstanceId,
        setSessionInstanceId,
        sessionData,
        setSessionData,
        admin,
        setAdmin,
        labId,
        setLabId,
        logout,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
