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

const useRecordMileageController = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const [startMileage, setStartMileage] = useState('');
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [mileageImage, setMileageImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  var currentUser: User | null;

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>,
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
  const onSave = async (type: string) => {
    if (!startMileage || !vehicleImage || !mileageImage) {
      setSnackbarMessage(Const.languageData?.Fill_all_fields_and_upload_images??'Please fill all fields and upload images.');
      setVisible(true);
      return;
    }
    setLoading(true);
    currentUser = await User.getUser();
    const recordMileageData: RecordMileageModel = {
      sale_man_id: currentUser?.id.toString()!,
      type,
      mileage: startMileage,
      vehicle_image: vehicleImage,
      mileage_image: mileageImage,
    };
//console.log('recordMileageData', recordMileageData);
    try {
      await RecordMileageService.uploadMileage(recordMileageData);
      
      setSnackbarMessage('Mileage recorded successfully');
      setVisible(true);
      setMileageImage(null);
      setVehicleImage(null);
      setStartMileage('');
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
    startMileage,
    setStartMileage,
    vehicleImage,
    setVehicleImage,
    mileageImage,
    setMileageImage,
    visible,
    snackbarMessage,
    handleSnackbarDismiss,
    onSave,
    pickImage,
    loading,
  };
};

export default useRecordMileageController;
