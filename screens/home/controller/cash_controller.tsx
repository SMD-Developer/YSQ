import {useEffect, useState, useCallback} from 'react';
import HomeService from '../service/home_service';
import {OpenCashData} from '../models/cash_data';
import User from '../../login/models/user_model';

const useOpenCashController = (screenType: number) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [openCashData, setOpenCashData] = useState<OpenCashData | null>(null);
  const [filteredCashData, setFilteredCashData] = useState<OpenCashData | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const onDismissSnackBar = () => setVisible(false);

  const getUser = useCallback(async () => {
    try {
      const userData: User | null = await User.getUser();
      setUser(userData);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      setSnackbarMessage('Failed to fetch user data.');
      setVisible(true);
    }
  }, []);

  const getOpenCashData = useCallback(async () => {
    if (!user) {
      return;
    } // Ensure user exists before calling

    setLoading(true);
    try {
      const data = await HomeService.getOpenCash(user.id!, screenType);
      //console.log('Open cash data:', data);
      setOpenCashData(data);
      setFilteredCashData(data);
    } catch (error: any) {
      //console.log(error);
      const message =
        error.message || 'An unexpected error occurred. Please try again.';
      setSnackbarMessage(message);
      setVisible(true);
    } finally {
      setLoading(false);
    }
  }, [user, screenType]);

  useEffect(() => {
    getUser(); // Fetch the user on mount
  }, [getUser]);

  useEffect(() => {
    if (user) {
      getOpenCashData(); // Fetch open cash data after user is fetched
    }
  }, [user, getOpenCashData]);

  return {
    setVisible,
    visible,
    snackbarMessage,
    loading,
    openCashData,
    setFilteredCashData,
    filteredCashData,
    onDismissSnackBar,
    setOpenCashData,
    getOpenCashData,
    user,
  };
};

export default useOpenCashController;
