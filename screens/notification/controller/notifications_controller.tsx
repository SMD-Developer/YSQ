// src/controller/useOutletController.ts
import {useState, useEffect} from 'react';
import NotificationService from '../service/notification_service';

const useNotificationController = (allData = false) => {
  const [notifications, setNotifications] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [filteredNotifications, setFilteredNotifications] = useState<any>([]);

  useEffect(() => {
    fetchNotifications();
  },[]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      console.log('Fetching outlets', allData);
      const data = await NotificationService.getNotifications();
      setNotifications(data);
      setFilteredNotifications(data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications: filteredNotifications,
    loading,
  };
};

export default useNotificationController;
