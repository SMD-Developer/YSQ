import {useEffect, useState} from 'react';

import User from '../../login/models/user_model';
import RecordMileageService from '../service/recored_service';
import {RecordMileageModel} from '../modle/record_mileage_model';
import {useIsFocused} from '@react-navigation/native';

const useRecordController = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [data, setData] = useState<RecordMileageModel[]>([]);
  const [filterData, setFilterData] = useState<RecordMileageModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'All',
  );

  useEffect(() => {
    getData();
  }, [isFocused]); // Empty dependency array to run only on mount
  const getData = async () => {
    setLoading(true);
    const currentUser: User | null = await User.getUser();

    try {
      const response = await RecordMileageService.getHistory(currentUser!.id);
      const sortedData = response.data.sort((a, b) => {
        const dateA = new Date(a.created_at); // Convert the date string to a Date object
        const dateB = new Date(b.created_at);

        // For ascending order (earliest to latest), return dateA - dateB
        return dateB.getTime() - dateA.getTime();

        // If you want descending order (latest to earliest), use:
        // return dateB.getTime() - dateA.getTime();
      });

      setData(sortedData);
      setFilterData(sortedData);
    } catch (error: any) {
      //console.log(error);
      const message =
        error.message || 'An unexpected error occurred. Please try again.';
      setSnackbarMessage(message);
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarDismiss = () => {
    setVisible(false);
  };

  return {
    visible,
    getData,
    snackbarMessage,
    handleSnackbarDismiss,
    loading,
    data,
    selectedCategory,
    setSelectedCategory,
    filterData,
    setFilterData,
  };
};

export default useRecordController;
