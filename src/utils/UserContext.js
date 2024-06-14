import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [roleId,setRoleId] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId, userRole, setUserRole , roleId, setRoleId}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
