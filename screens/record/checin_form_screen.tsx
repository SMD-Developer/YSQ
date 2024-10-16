import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView, DeviceEventEmitter,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Import icon package
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import CustomTextField from '../../components/custom_text_field';
import CustomButton from '../../components/custom_app_button';
import MainAppBar from '../../components/custom_main_app_bar';
import CustomSnackbar from '../../components/custom_snackbar';
import {RouteProp} from '@react-navigation/native';
import useRecordMileageController from './controller/save_record_controller copy';
import {Const} from '../../constants/const_value';
import useCheckInController from './controller/save_checkin_controller.tsx';

type CheckInFormScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.CheckInFormScreen
>;
type CheckInScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.CheckInFormScreen
>;

interface CheckInScreenProps {
  navigation: CheckInFormScreenNavigationProp;
  route: CheckInScreenRouteProp;
}

const CheckInFormScreen: React.FC<CheckInScreenProps> = ({
                                                             navigation,
                                                             route,
                                                           }) => {
  let isCheckIn: boolean = route.params.screenType === 1;
  let customerId: string = route.params.customerId;

  const {
    image,
    visible,
    snackbarMessage,
    handleSnackbarDismiss,
    loading,
    onSave,
    setImage,
    pickImage,
  } = useCheckInController();

  const renderImageWithDeleteIcon = (
    imageUri: string,
    onDelete: () => void
  ) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{uri: imageUri}} style={styles.image} />
        <TouchableOpacity style={styles.deleteIcon} onPress={onDelete}>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.safeArea}>
      <MainAppBar
        title={`${
          isCheckIn
            ?  'Check In'
            :  'Check Out'
        }`}
        isPrimary={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          <Text style={styles.label}>
            {
              'Image'}
          </Text>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={() => pickImage()}>
            {image ? (
              renderImageWithDeleteIcon(image, () =>
                setImage(null)
              )
            ) : (
              <Text style={styles.placeholderText}>
                {Const.languageData?.Tap_to_upload ?? 'Tap to select to upload'}
              </Text>
            )}
          </TouchableOpacity>


          <CustomButton
            loading={loading}
            title={Const.languageData?.Save ?? 'Save'}
            buttonStyle={{marginTop: 40}}
            onPress={async () => {
              var data = await onSave(isCheckIn ? 'checkin' : 'ckeckout',customerId);
              if (data === true) {
                if(isCheckIn) {
                  DeviceEventEmitter.emit('event.testEvent');
                }
                else {
                  DeviceEventEmitter.emit('event.closeevent');
                }
                navigation.goBack(); // Na
              }
            }}
          />
        </View>
      </ScrollView>
      <CustomSnackbar
        visible={visible}
        message={snackbarMessage}
        onDismiss={handleSnackbarDismiss}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        onActionPress={handleSnackbarDismiss}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  imagePlaceholder: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 5,
  },
});

export default CheckInFormScreen;
