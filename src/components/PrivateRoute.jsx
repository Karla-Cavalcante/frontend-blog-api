import { Navigate } from 'react-router-dom';


const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('admin');  

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;  
};

export default PrivateRoute;  
