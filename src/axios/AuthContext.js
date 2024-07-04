import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import default
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Initial state is null

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const id = decodedToken['sub'];
        const fullName = decodedToken['fullName'];
        const phoneNumber = decodedToken['phoneNumber'];
        setUser({ email, roles, id, fullName, phoneNumber });
      } catch (error) {
        console.error('Invalid token format:', error);
        setUser(null);
        localStorage.removeItem('jwt');
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const id = decodedToken['sub'];
      const fullName = decodedToken['fullName'];
      const phoneNumber = decodedToken['phoneNumber'];
      setUser({ email, roles, id, fullName, phoneNumber });
      localStorage.setItem('jwt', token);
    } catch (error) {
      console.error('Invalid token format:', error);
      setUser(null);
      localStorage.removeItem('jwt');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
