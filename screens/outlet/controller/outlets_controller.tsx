// src/controller/useOutletController.ts
import {useState, useEffect} from 'react';
import OutletService from '../service/outlet_service';
import {AddOutletModel} from '../modle/add_outlet_model';
import {useIsFocused} from '@react-navigation/native';

const useOutletController = (allData = false) => {
  const [outlets, setOutlets] = useState<AddOutletModel[]>([]);
  const [completedOutlets, setCompletedOutlets] = useState<AddOutletModel[]>(
    [],
  );
  const [upcomingOutlets, setUpcomingOutlets] = useState<AddOutletModel[]>([]);
  const [allOutlets, setAllOutlets] = useState<AddOutletModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalOutletCount, setOutletCount] = useState<string>('');
  const [filteredOutlets, setFilteredOutlets] = useState<AddOutletModel[]>([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      fetchOutlets();
      fetchCompletedOutlets();
      fetchUpcomingOutlets();
      fetchTotalOutlets();
    }
  }, [isFocused]);

  const fetchOutlets = async () => {
    setLoading(true);
    try {
      console.log('Fetching outlets', allData);
      const data = await OutletService.getOutlets(allData);
      const alldata=await OutletService.getAreaOutletCount();
      setAllOutlets(alldata);
      console.log('outlets', data.length);
      var unique = data.filter(
        (obj, index, self) => index === self.findIndex(t => t.id === obj.id),
      );
      console.log('uniquelll', unique.length);
      setOutlets(unique);
      setFilteredOutlets(unique);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedOutlets = async () => {
    try {
      const data = await OutletService.getOutlets(true);
      setCompletedOutlets(data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
    }
  };

  const fetchTotalOutlets = async () => {
    try {
      const data = await OutletService.getAllOutletCount();
      console.log('compalete', data);
      setOutletCount(data.length);
     
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
    }
  };

  const fetchUpcomingOutlets = async () => {
    try {
      const data = await OutletService.geUpcomingOutlets();
      setUpcomingOutlets(data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = outlets.filter(outlet =>
        outlet.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredOutlets(filteredData);
    } else {
      setFilteredOutlets(outlets);
    }
  };

  return {
    outlets: filteredOutlets,
    loading,
    searchQuery,
    handleSearch,
    fetchOutlets,
    completedOutlets,
    totalOutletCount,
    upcomingOutlets,
    allOutlets,
    fetchCompletedOutlets,
    fetchUpcomingOutlets,
    fetchTotalOutlets,
  };
};

export default useOutletController;
