/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
// controllers/productController.ts
import {useState, useEffect} from 'react';
import SaleHistoryService from '../service/sale_history_service';
import {Sale} from '../../pos/model/sales_mode';
import {GiftDetails, GiftTransaction} from '../model/gift_history';
import {useIsFocused} from '@react-navigation/native';

export const useHistoryController = (screenType: number) => {
  const [data, setData] = useState<Sale[]>([]);
  const [giftData, setGiftData] = useState<GiftTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Sale[]>(data);
  const [filteredGiftData, setFilteredGiftData] =
    useState<GiftTransaction[]>(giftData);
  const isFocused = useIsFocused();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = data.filter(outlet =>
        outlet.id.toString().includes(query.toLowerCase()),
      );
      setFilteredData(filteredData);
      const filteredGiftData = giftData.filter(outlet =>
        outlet.id.toString().includes(query.toLowerCase()),
      );
      setFilteredGiftData(filteredGiftData);
    } else {
      setFilteredData(data);
      setFilteredGiftData(giftData);
    }
  };
  var currentPage = 1;
  const onReferesh = () => {
    if (screenType === 1) {
      fetchSalesHistoryData(currentPage);
    } else if (screenType === 2) {
      fetchSalesReturnHistoryData(currentPage);
    } else if (screenType === 3) {
      fetchGiftHistoryData(currentPage);
    }
    currentPage = 1;
    lastPage = 1;
  };

  useEffect(() => {
    if (screenType === 1) {
      fetchSalesHistoryData(currentPage);
    } else if (screenType === 2) {
      fetchSalesReturnHistoryData(currentPage);
    } else if (screenType === 3) {
      fetchGiftHistoryData(currentPage);
    }
  }, [screenType, isFocused]);

  var lastPage = 1;
  const fetchNextPage = async () => {
    if (currentPage >= lastPage) {
      return;
    }
    currentPage++;

    if (screenType === 1) {
      fetchSalesHistoryData(currentPage);
    } else if (screenType === 3) {
      fetchGiftHistoryData(currentPage);
    }
  };

  const fetchSalesHistoryData = async (page: any) => {
    if (page === 1) {
      setLoading(true);
    }
    try {
      var {response, last_page} = await SaleHistoryService.getSalesHisyoty(
        undefined,
        page ?? 1,
      );
      lastPage = last_page;

      if (page === 1) {
        setData([]);
        setFilteredData([]);
      }

      setData(prevData => [...prevData, ...response]);

      setFilteredData(prevData => [...prevData, ...response]);
    } catch (error: any) {
      //console.log(error);
      const message =
        error.message || 'An unexpected error occurred. Please try again.';

      setSnackbarMessage(message);
      setVisible(true);
      setError(message || 'Failed to load products');
    } finally {
      if (page === 1) {
        setLoading(false);
      }
    }
  };
  const fetchSalesReturnHistoryData = async page => {
    if (page === 1) {
      setLoading(true);
    }
    console.log('fetching sales return history');
    try {
      var {response, last_page} =
        await SaleHistoryService.getSalesReturnHisyoty(page ?? 1);

      lastPage = last_page;
      console.log('last page', lastPage);
      console.log('response', response);
      setData(prevData => [...prevData, ...response]);
      setFilteredData(prevData => [...prevData, ...response]);
    } catch (error: any) {
      //console.log(error);
      const message =
        error.message || 'An unexpected error occurred. Please try again.';

      setSnackbarMessage(message);
      setVisible(true);
      setError(message || 'Failed to load products');
    } finally {
      if (page === 1) {
        setLoading(false);
      }
    }
  };
  const fetchGiftHistoryData = async page => {
    if (page === 1) {
      setLoading(true);
    }
    try {
      var {response, last_page} = await SaleHistoryService.getGiftHisyoty(
        undefined,
        page ?? 1,
      );
      setGiftData(prevData => [...prevData, ...response]);
      lastPage = last_page;
      setFilteredGiftData(prevData => [...prevData, ...response]);
      console.log('filtered gifts', filteredGiftData.length);
    } catch (error: any) {
      //console.log(error);
      const message =
        error.message || 'An unexpected error occurred. Please try again.';

      setSnackbarMessage(message);
      setVisible(true);
      setError(message || 'Failed to load products');
    } finally {
      if (page === 1) {
        setLoading(false);
      }
    }
  };
  const onDismissSnackBar = () => setVisible(false);
  return {
    loading,
    error,
    visible,
    snackbarMessage,
    onDismissSnackBar,
    filteredData,
    handleSearch,
    setFilteredData,
    searchQuery,
    filteredGiftData,
    setFilteredGiftData,
    giftData,
    data,
    fetchNextPage,
    onReferesh,
  };
};
