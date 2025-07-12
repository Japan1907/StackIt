import { useApp } from '@/contexts/AppContext';
import type { User } from '@/contexts/AppContext';

export function useAuth() {
  const { state, dispatch } = useApp();

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check against stored users (in real app, this would be API call)
      const storedUsers = JSON.parse(localStorage.getItem('stackit_users') || '[]');
      const user = storedUsers.find((u: User) => u.email === email);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      dispatch({ type: 'SET_USER', payload: user });
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: { username: string; email: string; password: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const storedUsers = JSON.parse(localStorage.getItem('stackit_users') || '[]');
      const existingUser = storedUsers.find((u: User) => u.email === userData.email || u.username === userData.username);

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      const newUser: User = {
        id: `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: userData.username,
        email: userData.email,
        reputation: 0,
        joinedAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      };

      // Store user
      storedUsers.push(newUser);
      localStorage.setItem('stackit_users', JSON.stringify(storedUsers));

      dispatch({ type: 'SET_USER', payload: newUser });
      return newUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!state.currentUser) return;

    const updatedUser = { ...state.currentUser, ...updates };
    dispatch({ type: 'SET_USER', payload: updatedUser });

    // Update in stored users
    const storedUsers = JSON.parse(localStorage.getItem('stackit_users') || '[]');
    const userIndex = storedUsers.findIndex((u: User) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      storedUsers[userIndex] = updatedUser;
      localStorage.setItem('stackit_users', JSON.stringify(storedUsers));
    }
  };

  return {
    currentUser: state.currentUser,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!state.currentUser,
  };
}