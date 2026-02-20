import React from 'react'
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const Authinticated = localStorage.getItem("access")

  return Authinticated ? <Navigate to={'/dashboard'} />: children;
}

export default PublicRoute