import {useState} from 'react';
import {RecordMileageModel} from '../modle/record_mileage_model';
import RecordMileageService from '../service/recored_service';
import {
  ImageLibraryOptions,
  launchCamera,
  ImagePickerResponse,
} from 'react-native-image-picker';
import User from '../../login/models/user_model';
import { Const } from '../../../constants/const_value';
import NetInfo from '@react-native-community/netinfo';

const useCheckInController = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');


  const [image, setImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  var currentUser: User | null;

  const pickImage = async (

  ) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', // Can be 'photo' or 'video'
      quality: 0.3,
      selectionLimit: 1,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        //console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        //console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImage(response.assets![0].uri!);
      }
    });
  };
  const onSave = async (type: string,customer_id:string ) => {
    if (!image) {
      setSnackbarMessage('Please upload image.');
      setVisible(true);
      return;
    }
    setLoading(true);
    currentUser = await User.getUser();
    let loaction: any;
    try {
      const networkState = await NetInfo.fetch();

      if(networkState.isConnected) {
        loaction = await Const.getCurrentLocationName();
      }
      else{
        loaction="offline";
      }
      console.log(loaction);
    } catch (e) {
      loaction = '';
    }
    // @ts-ignore

    try {
      await RecordMileageService.checkIn( {
        sale_man_id: currentUser?.id.toString()!,
        customer_id:customer_id,
        image: image,
        location: loaction,
        type:type,
      });
      
      setSnackbarMessage(`${type} successfully`);
      setVisible(true);

      return true;
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
  image,
    setImage,
    visible,
    snackbarMessage,
    handleSnackbarDismiss,
    onSave,
    pickImage,
    loading,
  };
};

export default useCheckInController;
