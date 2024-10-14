import axios from 'axios';
import {RecordMileageModel} from '../modle/record_mileage_model';
import {Const} from '../../../constants/const_value';
import {realmObject} from '../../../routes/realm';
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from '@react-native-community/netinfo';

const RecordMileageService = {
  uploadMileage: async (data: RecordMileageModel) => {
    try {
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected) {
        // Store the data in Realm for syncing later
        realmObject.write(() => {
          realmObject.create('Mileage', {
            sale_man_id: data.sale_man_id,
            type: data.type,
            mileage: data.mileage,
            vehicle_image: data.vehicle_image || null,
            mileage_image: data.mileage_image || null,
          });
        });

        console.log('Mileage data stored locally in Realm');
        return;
      }

      // If network is available, proceed with the API request
      var getTokenHeader = await Const.getTokenHeaderWithFOrmType();
      const formData = new FormData();
      formData.append('sales_man_id', data.sale_man_id);
      formData.append('type', data.type);
      formData.append('mileage', data.mileage);

      if (data.vehicle_image) {
        formData.append('vehicle_image', {
          type: 'image/jpg',
          name: 'vehicle_image.jpg',
          uri: data.vehicle_image,
        });
      }

      if (data.mileage_image) {
        formData.append('mileage_image', {
          type: 'image/jpg',
          name: 'mileage_image.jpg',
          uri: data.mileage_image,
        });
      }

      const response = await axios.post(
        `${Const.BASE_URL}api/m1/upload_mileage`,
        formData,
        {
          headers: {
            ...getTokenHeader,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error('Failed to upload mileage');
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed');
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  },
  getHistory: async (id: number) => {
    try {
      var getTokenHeader = await Const.getTokenHeader();
      //console.log('getTokenHeader', getTokenHeader);

      const response = await axios.post(
        `${Const.BASE_URL}api/m1/mileage-records`,
        {
          sales_man_id: id,
        },
        {
          headers: {
            ...getTokenHeader,
          },
        },
      );
      //console.log('response', response);
      // Handle the response
      if (response.status !== 200) {
        throw new Error('Failed to upload mileage');
      }
      return response.data;
    } catch (error) {
      //console.log('Error caught'); // Log full error object
      if (axios.isAxiosError(error)) {
        //console.log('This is an Axios error:', error.response!);
        //console.log('error code:', error.code);
        throw new Error(error.response?.data?.message || 'Failed');
      } else {
        //console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  },
  syncMileageData: async () => {
    try {
      const unsyncedMileageData = realmObject.objects('Mileage');
  
      if (unsyncedMileageData.length === 0) {
        console.log('No mileage data to sync');
        return;
      }
  
      var getTokenHeader = await Const.getTokenHeaderWithFOrmType();
  
      // Loop through unsynced mileage data
      for (let i = 0; i < unsyncedMileageData.length; i++) {
        const data = unsyncedMileageData[i];
  
        const formData = new FormData();
        formData.append('sales_man_id', data.sale_man_id);
        formData.append('type', data.type);
        formData.append('mileage', data.mileage);
  
        if (data.vehicle_image) {
          formData.append('vehicle_image', {
            type: 'image/jpg',
            name: 'vehicle_image.jpg',
            uri: data.vehicle_image,
          });
        }
  
        if (data.mileage_image) {
          formData.append('mileage_image', {
            type: 'image/jpg',
            name: 'mileage_image.jpg',
            uri: data.mileage_image,
          });
        }
  
        // Try uploading the mileage data
        const response = await axios.post(
          `${Const.BASE_URL}api/m1/upload_mileage`,
          formData,
          {
            headers: {
              ...getTokenHeader,
            },
          },
        );
  
        if (response.status === 200) {
          // Remove the synced data from Realm
          realmObject.write(() => {
            realmObject.delete(data);
          });
          console.log('Synced mileage data successfully');
        }
      }
    } catch (error) {
      console.log('Error syncing mileage data:', error);
    }
  }
};

export default RecordMileageService;
