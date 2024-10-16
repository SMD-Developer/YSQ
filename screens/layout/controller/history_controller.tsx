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
  const [lastIndex, setLastIndex] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  const onReferesh = () => {
    if (screenType === 1) {
      fetchSalesHistoryData(currentPage);
    } else if (screenType === 2) {
      fetchSalesReturnHistoryData(currentPage);
    } else if (screenType === 3) {
      fetchGiftHistoryData(currentPage);
    }
    setCurrentPage (1);
    setLastIndex(1);
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


  const fetchNextPage = async () => {
    console.log("fetch next page", currentPage);
    console.log("lastPage", lastIndex);
    console.log(currentPage>=lastIndex);
    if (currentPage >= lastIndex) {
      return;
    }

     setCurrentPage((prevPage) => prevPage + 1);


    if (screenType === 1) {

      fetchSalesHistoryData(currentPage+1);
    } else if (screenType === 3) {
      fetchGiftHistoryData(currentPage+1);
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
      setLastIndex(last_page);
      if (page === 1) {
        setData([]);
        setFilteredData([]);
      }

      setData(prevData => [...prevData, ...response]);

      setFilteredData(prevData => [...prevData, ...response]);
    } catch (error: any) {
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
    try {
      var {response, last_page} =
        await SaleHistoryService.getSalesReturnHisyoty(page ?? 1);

      setLastIndex(last_page);
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
      setLastIndex( last_page);
      setFilteredGiftData(prevData => [...prevData, ...response]);
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
