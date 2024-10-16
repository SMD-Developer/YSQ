import React, {useState} from 'react';
import {View, Text, StyleSheet, StatusBar, Image, TouchableOpacity} from 'react-native';
import SuccessIcon from '../../assets/success-icon.svg';
import CustomButton from '../../components/custom_app_button';
import {Const} from '../../constants/const_value';
import {ROUTES} from '../../routes/routes_name';
import {CommonActions} from '@react-navigation/native';
import {ImageLibraryOptions, ImagePickerResponse, launchCamera} from 'react-native-image-picker';

const CheckInSuccessScreen: React.FC<any> = ({navigation, route}) => {
  const type = route.params?.type;


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      <SuccessIcon width={130} height={130} style={{marginBottom: 30}} />

      <Text style={styles.title}>
        { 'Completed'}
      </Text>
      <Text style={styles.message}>
        {
          `${type} image uploaded successfully`}
      </Text>


      <CustomButton
        onPress={function (): void {
          //console.log('outletId', outletId);
         navigation.goBack();

        }}
        title={ 'Continue'}
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

export default CheckInSuccessScreen;
