import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('applymate_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        
        try {
          // Fetch full profile to populate skills/links not stored in basic login response
          const { data } = await api.get('/users/profile');
          const fullUser = { ...parsedUser, ...data };
          setUser(fullUser);
          localStorage.setItem('applymate_user', JSON.stringify(fullUser));
        } catch (error) {
          console.error("Failed to fetch full profile on load", error);
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      setUser(data);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      localStorage.setItem('applymate_user', JSON.stringify(data));
      
      // Fetch full profile right after login
      try {
        const profileRes = await api.get('/users/profile');
        const fullUser = { ...data, ...profileRes.data };
        setUser(fullUser);
        localStorage.setItem('applymate_user', JSON.stringify(fullUser));
      } catch (err) {
        console.error("Failed to fetch full profile after login", err);
      }
      
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/users', { name, email, password });
      setUser(data);
      localStorage.setItem('applymate_user', JSON.stringify(data));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('applymate_user');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const updateGlobalUser = (updatedData) => {
    if (!user) return;
    const newData = { ...user, ...updatedData };
    setUser(newData);
    localStorage.setItem('applymate_user', JSON.stringify(newData));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateGlobalUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
