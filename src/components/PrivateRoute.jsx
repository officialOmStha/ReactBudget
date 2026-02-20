import React from 'react'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const Authenticated = localStorage.getItem("access")
  return Authenticated ? children : <Navigate to={'/'}/>;
}

export default PrivateRoute