import { useApp } from '@/contexts/AppContext';
import type { Notification } from '@/contexts/AppContext';

export function useNotifications() {
  const { state, dispatch } = useApp();

  const markAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const markAllAsRead = () => {
    state.notifications
      .filter(n => !n.read)
      .forEach(n => {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id });
      });
  };

  const createNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    return newNotification;
  };

  const getUserNotifications = () => {
    if (!state.currentUser) return [];
    
    return state.notifications
      .filter(n => n.userId === state.currentUser!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getUnreadCount = () => {
    return getUserNotifications().filter(n => !n.read).length;
  };

  return {
    notifications: getUserNotifications(),
    unreadCount: getUnreadCount(),
    markAsRead,
    markAllAsRead,
    createNotification,
  };
}