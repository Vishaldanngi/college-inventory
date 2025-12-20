import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: any) {
  return localStorage.getItem('token')
    ? children
    : <Navigate to="/login" />;
}
