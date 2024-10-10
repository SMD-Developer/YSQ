import axios from 'axios';
import {Const} from '../../../constants/const_value';
import {AddOutletModel} from '../modle/add_outlet_model';
import NetInfo from '@react-native-community/netinfo';
import Realm from 'realm';
import {realmObject} from '../../../routes/realm';
import User from '../../login/models/user_model';

const OutletService = {
  // Function to add an outlet
  addOutlet: async (data: AddOutletModel) => {
    try {
      const getTokenHeader = await Const.getTokenHeaderWithFOrmType();
      //console.log('getTokenHeader', getTokenHeader);

      // Prepare the form data for the API request
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('country', data.country);
      formData.append('phone', data.phone);
      formData.append('city', data?.city ?? '');
      formData.append('address', data.address);
      formData.append('latitude', data.latitude);
      formData.append('longitude', data.longitude); // Fixed the typo: 'logintude' to 'longitude'
      formData.append('credit_limit', data.credit_limit);
      formData.append('user_id', Const.user?.id);
      formData.append('salesman_id', Const.user?.id);
      formData.append('ware_id', Const.user?.distributerId);
      formData.append('distributor_id', Const.user?.id);
      formData.append('salesman_id', Const.user?.id);
      formData.append('chanel_id', data.channel);
      formData.append('area_id', data.area);
      formData.append('postal_code', data?.postal_code);
      //console.log('url', `${Const.BASE_URL}api/m1/outlets`);
      //console.log('form data', formData);

      // Make the API call to add the outlet
      const response = await axios.post(
        `${Const.BASE_URL}api/m1/outlets`,
        formData,
        {
          headers: getTokenHeader,
        },
      );

      // Handle the response
      if (response.status !== 200) {
        throw new Error('Failed to add outlet');
      }
      return response.data;
    } catch (error: any) {
      //console.log('Error caught');
      if (axios.isAxiosError(error)) {
        //console.log('This is an Axios error:', error.message);
        //console.log('This is an Axios error reponse :', error.response!);
        //console.log('error code:', error.code);
        throw new Error(error.response?.data?.message || 'Failed');
      } else {
        //console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  },

  editOutlet: async (data: AddOutletModel) => {
    try {
      const getTokenHeader = await Const.getTokenHeaderWithFOrmType();
      //console.log('getTokenHeader', getTokenHeader);

      // Prepare the form data for the API request
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('id', data.id);
      formData.append('email', data.email);
      formData.append('country', data.country);
      formData.append('phone', data.phone);
      formData.append('city', data?.city ?? '');
      formData.append('address', data.address);
      formData.append('latitude', data.latitude);
      formData.append('longitude', data.longitude);
      formData.append('credit_limit', data.credit_limit);
      formData.append('user_id', '1');
      formData.append('chanel_id', data.channel);
      formData.append('area_id', data.area);
      formData.append('postal_code', data?.postal_code);
      //console.log('url', `${Const.BASE_URL}api/m1/outlets`);
      //console.log('form data', formData);

      // Make the API call to add the outlet
      const response = await axios.post(
        `${Const.BASE_URL}api/m1/update-outlets`,
        formData,
        {
          headers: getTokenHeader,
        },
      );

      // Handle the response
      if (response.status !== 200) {
        throw new Error('Failed to add outlet');
      }
      return response.data;
    } catch (error: any) {
      //console.log('Error caught');
      if (axios.isAxiosError(error)) {
        //console.log('This is an Axios error:', error.message);
        //console.log('This is an Axios error reponse :', error.response!);
        //console.log('error code:', error.code);
        throw new Error(error.response?.data?.message || 'Failed');
      } else {
        //console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  },

  getAllOutletCount: async () => {
    try {
      const user = await User.getUser();
      const getTokenHeader = await Const.getTokenHeader(); // Assume this fetches your token
      const response = await axios.get(
        `${Const.BASE_URL}api/m1/get-all-customers/${user?.id}`,
        {
          headers: getTokenHeader,
        },
      );

      const outletsData = response.data.data; // Assuming your API response returns an array of outlets in data
      return outletsData;
    } catch (error) {
      console.error('Error fetching outlets:', error);
      throw error;
    }
  },
  getAreaOutletCount: async () => {
    try {
      const user = await User.getUser();
      const getTokenHeader = await Const.getTokenHeader(); // Assume this fetches your token
      const response = await axios.get(
        `${Const.BASE_URL}api/m1/outlets/?area_id=${user?.area}`,
        {
          headers: getTokenHeader,
        },
      );

      const outletsData = response.data.data; // Assuming your API response returns an array of outlets in data
      return outletsData;
    } catch (error) {
      console.error('Error fetching outlets:', error);
      throw error;
    }
  },
  async getOutlets(allData = false): Promise<AddOutletModel[]> {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      try {
        const user = await User.getUser();
        const getTokenHeader = await Const.getTokenHeader(); // Assume this fetches your token
        const response = await axios.get(
          allData
            ? `${Const.BASE_URL}api/m1/get-completed-customers/${user?.id}`
            : `${Const.BASE_URL}api/m1/get-today-customers/${user?.id}`,
          {
            headers: getTokenHeader,
          },
        );

        const outletsData = response.data.data; // Assuming your API response returns an array of outlets in data

        // Store data in Realm
        // realmObject.write(() => {
        //   // Remove old entries if necessary (optional)
        //   const existingOutlets = realmObject.objects('Outlet');
        //   realmObject.delete(existingOutlets);

        //   // Insert new data
        //   outletsData.forEach((outlet: AddOutletModel) => {
        //     realmObject.create('Outlet', outlet, Realm.UpdateMode.Modified);
        //   });
        // });

        // Return the freshly fetched data
        return outletsData;
      } catch (error) {
        console.error('Error fetching outlets:', error);
        throw error;
      }
    } else {
      try {
        console.log('Fetching outlets from Realm');
        const outlets = realmObject.objects<AddOutletModel>('Outlet');

        // Convert Realm objects to a plain JavaScript array
        const outletsArray = outlets.map(outlet => ({
          id: outlet.id,
          name: outlet.name,
          email: outlet.email,
          phone: outlet.phone,
          country: outlet.country,
          city: outlet.city,
          address: outlet.address,
          latitude: outlet.latitude,
          longitude: outlet.longitude,
          credit_limit: outlet.credit_limit,
          area: outlet.area,
          userType: outlet.userType,
          channel: outlet.channel,
        }));

        // Return the local data
        return outletsArray;
      } catch (error) {
        console.error('Error fetching outlets from Realm:', error);
        throw error;
      }
    }
  },
  async geUpcomingOutlets(): Promise<AddOutletModel[]> {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      try {
        const user = await User.getUser();
        const getTokenHeader = await Const.getTokenHeader(); // Assume this fetches your token
        const response = await axios.get(
          `${Const.BASE_URL}api/m1/get-upcoming-customers/${user?.id}`,
          {
            headers: getTokenHeader,
          },
        );

        const outletsData = response.data.data; // Assuming your API response returns an array of outlets in data

        // Store data in Realm
        // realmObject.write(() => {
        //   // Remove old entries if necessary (optional)
        //   const existingOutlets = realmObject.objects('Outlet');
        //   realmObject.delete(existingOutlets);

        //   // Insert new data
        //   outletsData.forEach((outlet: AddOutletModel) => {
        //     realmObject.create('Outlet', outlet, Realm.UpdateMode.Modified);
        //   });
        // });

        // Return the freshly fetched data
        return outletsData;
      } catch (error) {
        console.error('Error fetching outlets:', error);
        throw error;
      }
    } else {
      try {
        console.log('Fetching outlets from Realm');
        const outlets = realmObject.objects<AddOutletModel>('Outlet');

        // Convert Realm objects to a plain JavaScript array
        const outletsArray = outlets.map(outlet => ({
          id: outlet.id,
          name: outlet.name,
          email: outlet.email,
          phone: outlet.phone,
          country: outlet.country,
          city: outlet.city,
          address: outlet.address,
          latitude: outlet.latitude,
          longitude: outlet.longitude,
          credit_limit: outlet.credit_limit,
          area: outlet.area,
          userType: outlet.userType,
          channel: outlet.channel,
        }));

        // Return the local data
        return outletsArray;
      } catch (error) {
        console.error('Error fetching outlets from Realm:', error);
        throw error;
      }
    }
  },

  getAreaList: async () => {
    try {
      const getTokenHeader = await Const.getTokenHeader();
      const response = await axios.get(`${Const.BASE_URL}api/m1/area-list`, {
        headers: getTokenHeader,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch area list');
      }

      const areaList = response.data.data; // Assuming data is an array
      return areaList; // Return the area list data
    } catch (error) {
      console.error('Error fetching area list:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch area list',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  },
  getChannelList: async () => {
    try {
      const getTokenHeader = await Const.getTokenHeader();
      const response = await axios.get(`${Const.BASE_URL}api/m1/chanels-list`, {
        headers: getTokenHeader,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch area list');
      }

      const areaList = response.data.data; // Assuming data is an array
      return areaList; // Return the area list data
    } catch (error) {
      console.error('Error fetching area list:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch area list',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  },

  getUserTypeList: async () => {
    try {
      const getTokenHeader = await Const.getTokenHeader();
      const response = await axios.get(
        `${Const.BASE_URL}api/m1/distributors-list`,
        {
          headers: getTokenHeader,
        },
      );

      if (response.status !== 200) {
        throw new Error('Failed to fetch area list');
      }

      const areaList = response.data.data; // Assuming data is an array
      return areaList; // Return the area list data
    } catch (error) {
      console.error('Error fetching area list:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to fetch area list',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  },
  //   const getTokenHeader = await Const.getTokenHeader();
  //   //console.log('getTokenHeader', getTokenHeader);
  //   try {
  //     const response = await axios.get(`${Const.BASE_URL}api/m1/outlets`, {
  //       headers: getTokenHeader,
  //     });
  //     return response.data.data;
  //   } catch (error) {
  //     console.error('Error fetching outlets:', error);
  //     throw error;
  //   }
  // },
};

export default OutletService;
