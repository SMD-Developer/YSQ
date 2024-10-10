import {useEffect, useState} from 'react';
import HomeService from '../service/home_service';
import {HomeData} from '../models/home_model';
import User from '../../login/models/user_model';
import {Promotion} from '../models/promotion_model';

const useHomeController = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    getUser(); // Optional: Get user info if required for the APIs
    fetchData();
  }, []);

  const getUser = async () => {
    const user = await User.getUser();
    setUser(user);
  };

  const fetchData = async (loading=true) => {
    if (loading)
    setLoading(true);

    try {
      // Call both APIs in parallel
      const [homeResponse, promotionResponse] = await Promise.all([
        HomeService.getData(),
        HomeService.getPromotions(),
      ]);

      const homeModelData: HomeData = homeResponse.data;
      const promotionModelData: Promotion[] = promotionResponse;

      setHomeData(homeModelData);
      setPromotions(promotionModelData);
    } catch (error: any) {
      //console.log(error);
      const message =
        error.message || 'An unexpected error occurred. Please try again.';

      setSnackbarMessage(message);
      setVisible(true);
    } finally {
      if (loading)
      setLoading(false);
    }
  };

  return {
    setVisible,
    visible,
    snackbarMessage,
    loading,
    homeData,
    promotions,
    onDismissSnackBar,
    fetchData, // Updated function name to reflect both APIs are called
    user,
    getUser,
  };
};

export default useHomeController;
