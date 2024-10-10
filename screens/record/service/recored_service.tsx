import axios from 'axios';
import {RecordMileageModel} from '../modle/record_mileage_model';
import {Const} from '../../../constants/const_value';

const RecordMileageService = {
  uploadMileage: async (data: RecordMileageModel) => {
    try {
      var getTokenHeader = await Const.getTokenHeaderWithFOrmType();
      //console.log('getTokenHeader', getTokenHeader);
      // Prepare the form data for the API request
      const formData = new FormData();
      formData.append('sales_man_id', data.sale_man_id);
      formData.append('type', data.type);
      formData.append('mileage', data.mileage);

      // Append images if they are present
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
      // Make the API call to upload the mileage
      const response = await axios.post(
        `${Const.BASE_URL}api/m1/upload_mileage`,
        formData,
        // formData,
        {
          headers: {
            ...getTokenHeader,
          },
        },
      );

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
};

export default RecordMileageService;
