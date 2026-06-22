import { useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const GlobalErrorHandler = () => {
  const { showToast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || error.message || "An unexpected error occurred";
        
        // Handle unauthorized errors
        if (error.response?.status === 401) {
          showToast("Session expired. Please login again.", "error");
          logout();
        } else if (error.response?.status === 403) {
          showToast("You don't have permission to perform this action.", "error");
        } else if (error.response?.status === 404) {
          // 404s might be handled locally, but we can show a toast if it's an API failure
          // showToast("Resource not found", "error");
        } else if (error.response?.status >= 500) {
          showToast("Server error. Our engineers are on it!", "error");
        } else {
          showToast(message, "error");
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [showToast, logout]);

  return null;
};

export default GlobalErrorHandler;
