import React, {useState} from 'react';
import {View, Text, StyleSheet, StatusBar, Image, TouchableOpacity} from 'react-native';
import SuccessIcon from '../../assets/success-icon.svg';
import CustomButton from '../../components/custom_app_button';
import {Const} from '../../constants/const_value';
import {ROUTES} from '../../routes/routes_name';
import {CommonActions} from '@react-navigation/native';
import {ImageLibraryOptions, ImagePickerResponse, launchCamera} from 'react-native-image-picker';

const MapRouteSuccessScreen: React.FC<any> = ({navigation, route}) => {
  const outletId = route.params?.outletId;
  const [image, setImage] = useState<string | null>(null);
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
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      <SuccessIcon width={130} height={130} style={{marginBottom: 30}} />

      <Text style={styles.title}>
        {Const.languageData?.Route_completed ?? 'Route Completed'}
      </Text>
      <Text style={styles.message}>
        {Const.languageData?.Succefully_reached_outlet_location ??
          'You have successfully completed the route and reached the outlet location.'}
      </Text>

      <TouchableOpacity
        style={styles.imagePlaceholder}
        onPress={() => pickImage()}>
        {image ? (
          <Image source={{uri: image}} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>
            {Const.languageData?.Tap_to_upload ?? 'Tap to select to upload'}
          </Text>
        )}
      </TouchableOpacity>

      <CustomButton
        onPress={function (): void {
          //console.log('outletId', outletId);
          Const.selectedOutlet = outletId;
          navigation.dispatch(
            CommonActions.reset({
              index: 0, // The index of the route to make active
              routes: [
                {

                  name: ROUTES.DrawerScreen,
                  params: {initialRoute: 'Pos', outletId: outletId},
                },
              ], // Array of routes to reset to, with the desired screen
            }),
          );
        }}
        title={Const.languageData?.Checkin_to_outlet ?? 'Go Back'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 60,
    marginHorizontal: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden', // Ensures the gradient doesn't exceed the button boundaries
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MapRouteSuccessScreen;
