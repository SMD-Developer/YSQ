import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
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

type RecordFormScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.RecordFormScreen
>;
type RecordFormScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.RecordFormScreen
>;

interface RecordFormScreenProps {
  navigation: RecordFormScreenNavigationProp;
  route: RecordFormScreenRouteProp;
}

const RecordFormScreen: React.FC<RecordFormScreenProps> = ({
                                                             navigation,
                                                             route,
                                                           }) => {
  let isStart: boolean = route.params.screenType === 1;
  const {
    startMileage,
    setStartMileage,
    vehicleImage,
    setVehicleImage,
    mileageImage,
    setMileageImage,
    visible,
    snackbarMessage,
    handleSnackbarDismiss,
    loading,
    onSave,
    pickImage,
  } = useRecordMileageController();

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
          isStart
            ? Const.languageData?.Record_Start_Mileage ?? 'Start'
            : Const.languageData?.Record_End_Mileage ?? 'End'
        }`}
        isPrimary={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <CustomTextField
            keyboardType={"numeric"}
            value={startMileage}
            placeholder={isStart
              ? Const.languageData?.Enter_Start_Mileage ?? 'Start'
              : Const.languageData?.Enter_End_Mileage ?? 'End'
            }
            label={
              isStart
              ? Const.languageData?.Start_mileage ?? 'Start'
              : Const.languageData?.End_Mileage ?? 'End'
            }
            onChangeText={function (text: string): void {
              setStartMileage(text);
            }}
          />
          <Text style={styles.label}>
            {Const.languageData?.Vehicle_Image_With_Number_Plate ??
              'Vehicle Image'}
          </Text>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={() => pickImage(setVehicleImage)}>
            {vehicleImage ? (
              renderImageWithDeleteIcon(vehicleImage, () =>
                setVehicleImage(null)
              )
            ) : (
              <Text style={styles.placeholderText}>
                {Const.languageData?.Tap_to_upload ?? 'Tap to select to upload'}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>
            {Const.languageData?.Mileage_Image_Showing_Current_Record ??
              'Mileage Image'}
          </Text>
          <TouchableOpacity
            style={styles.imagePlaceholder}
            onPress={() => pickImage(setMileageImage)}>
            {mileageImage ? (
              renderImageWithDeleteIcon(mileageImage, () =>
                setMileageImage(null)
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
              var data = await onSave(isStart ? 'start' : 'end');
              if (data === true) {
                navigation.replace(ROUTES.RecordSuccessScreen);
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

export default RecordFormScreen;
