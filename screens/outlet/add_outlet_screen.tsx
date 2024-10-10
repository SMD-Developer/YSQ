import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import MapView, {Marker} from 'react-native-maps';
import CustomTextField from '../../components/custom_text_field';
import CustomButton from '../../components/custom_app_button';
import MainAppBar from '../../components/custom_main_app_bar';

import CustomSnackbar from '../../components/custom_snackbar';
import useAddOutletController from './controller/add_outlet_controller';
import {Const} from '../../constants/const_value';
import {Icon} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const AddOutletScreen: React.FC<any> = ({navigation, route}) => {
  const {
    outlet,
    setOutlet,
    visible,
    snackbarMessage,
    handleSnackbarDismiss,
    onSave,
    loading,
    areaList,
    channelList,
    userTypeList,
    origin,
    mapRef,
  } = useAddOutletController(route.params?.outletData);

  const handleMapPress = (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    setOutlet(prevOutlet => ({
      ...prevOutlet,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));
  };
  const moveToCurrentLocation = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: origin!.latitude,
          longitude: origin!.longitude,
        },
        zoom: 16,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MainAppBar
        title={`${
          route.params?.outletData == null
            ? Const.languageData?.Add_Customer ?? 'Add Outlet'
            : Const.languageData?.Edit_Customer ?? 'Edit Outlet'
        }`}
        isPrimary={false}
      />
      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* <Text style={styles.mapLabel}>Channel:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={outlet.userType}
            style={styles.picker}
            placeholder="Select Channel"
            onValueChange={itemValue =>
              setOutlet({...outlet, userType: itemValue})
            }>
            <Picker.Item label="Select Channel" value="" enabled={false} />
            {channelList.map(area => (
              <Picker.Item key={area.id} label={area.name} value={area.id} />
            ))}
          </Picker>
        </View> */}
        <Text style={styles.mapLabel}>{Const.languageData?.Area} </Text>
        <View style={styles.pickerContainer}>
          <Picker
            enabled={false}
            selectedValue={outlet.area}
            style={styles.picker}
            selectionColor="black"
            itemStyle={{backgroundColor: 'white', color: 'black'}}
            placeholder={Const.languageData?.Choose_Area ?? 'Select Area'}
            onValueChange={itemValue =>
              setOutlet({...outlet, area: itemValue})
            }>
            <Picker.Item
              label={Const.languageData?.Choose_Area ?? 'Select Area'}
              value=""
              enabled={false}
            />
            {areaList.map(area => (
              <Picker.Item
                key={area.id}
                label={area.name}
                value={area.id}
                color="black"
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.mapLabel}>
          {Const.languageData?.Customer__Type}:
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={outlet.channel}
            style={styles.picker}
            selectionColor="black"
            placeholder={
              Const.languageData?.Choose_Customer_Type ?? 'Select Customer Type'
            }
            itemStyle={{backgroundColor: 'white', color: 'black'}}
            onValueChange={itemValue =>
              setOutlet({...outlet, channel: itemValue})
            }>
            <Picker.Item
              label={
                Const.languageData?.Choose_Customer_Type ??
                'Select Customer Type'
              }
              value=""
              enabled={false}
            />
            {channelList.map(area => (
              <Picker.Item
                key={area.id}
                color="black"
                label={area.name}
                value={area.id}
              />
            ))}
          </Picker>
        </View>

        <CustomTextField
          label={Const.languageData?.Customer ?? 'Outlet Name'}
          value={outlet.name}
          onChangeText={text => setOutlet({...outlet, name: text})}
          placeholder={
            Const.languageData?.Enter_customer_name ?? 'Enter customer name'
          }
          style={styles.input}
        />
        <CustomTextField
          label={Const.languageData?.Email ?? 'Email'}
          value={outlet.email}
          onChangeText={text => setOutlet({...outlet, email: text})}
          placeholder={
            Const.languageData?.Enter_email_address ?? 'Enter email address'
          }
          keyboardType="email-address"
          style={styles.input}
        />
        <CustomTextField
          label={Const.languageData?.Phone ?? 'Phone'}
          value={outlet.phone}
          onChangeText={text => setOutlet({...outlet, phone: text})}
          placeholder={
            Const.languageData?.Enter_phone_number ?? 'Enter phone number'
          }
          keyboardType="phone-pad"
          style={styles.input}
        />
        <CustomTextField
          label={Const.languageData?.Country ?? 'Country'}
          value={outlet.country}
          onChangeText={text => setOutlet({...outlet, country: text})}
          placeholder={Const.languageData?.Country ?? 'Enter country'}
          style={styles.input}
          editable={false}
        />
        <CustomTextField
          label={Const.languageData?.Address ?? 'Address'}
          value={outlet.address}
          onChangeText={text => setOutlet({...outlet, address: text})}
          placeholder={Const.languageData?.Enter_address ?? 'Enter address'}
          style={styles.input}
        />
        <CustomTextField
          label={'Postal Code'}
          value={outlet.postal_code}
          onChangeText={text => setOutlet({...outlet, postal_code: text})}
          placeholder={'Postal Code'}
          style={styles.input}
        />

        {/* <CustomTextField
          label={Const.languageData?.Credit_limit ?? 'Credit Limit'}
          value={outlet.credit_limit}
          onChangeText={text => setOutlet({...outlet, credit_limit: text})}
          placeholder={Const.languageData?.Enter_credit_limit ?? 'Enter points'}
          keyboardType="numeric"
          style={styles.input}
        /> */}

        <Text style={styles.mapLabel}>
          {Const.languageData?.Select_Location ?? 'Select Location'}
        </Text>
        <View style={[styles.container, {paddingBottom: 10}]}>
          <GooglePlacesAutocomplete
            placeholder={
              Const.languageData?.Search_your_location ?? 'Search your location'
            }
            minLength={2}
            textInputProps={{
              placeholderTextColor: 'black',
            }}
            disableScroll={true}
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log('data', data);
              if (details) {
                // Extracting latitude and longitude from the details object
                const {lat, lng} = details.geometry.location;

                // You can now use the latitude and longitude

                console.log('Latitude:', lat);
                console.log('Longitude:', lng);

                setOutlet(prevOutlet => ({
                  ...prevOutlet,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                }));

                if (mapRef.current) {
                  mapRef.current.animateCamera({
                    center: {
                      latitude: lat,
                      longitude: lng,
                    },
                    zoom: 16,
                  });
                }
              }
            }}
            query={{
              key: 'AIzaSyD6lpgvCGHSvAInVE7wbZ2-OrwJPyVn0OA',
              language: 'en', // language of the results
            }}
            styles={{
              textInputContainer: styles.textInputContainer,
              textInput: styles.textInput,
              description: styles.textInput,
              predefinedPlacesDescription: styles.predefinedPlacesDescription,
            }}
            enablePoweredByContainer={false} // Removes the "Powered by Google" text
          />
        </View>
        <View>
          <MapView
            style={styles.map}
            ref={mapRef}
            initialRegion={{
              latitude: parseFloat(outlet.latitude) || 37.78825,
              longitude: parseFloat(outlet.longitude) || -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}>
            <Marker
              coordinate={{
                latitude: parseFloat(outlet.latitude) || 37.78825,
                longitude: parseFloat(outlet.longitude) || -122.4324,
              }}
            />
          </MapView>

          <TouchableOpacity
            style={[styles.locationButton, {bottom: 30}]}
            onPress={moveToCurrentLocation}>
            <Icon name="my-location" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text style={{color: 'black'}}>
            {Const.languageData?.Longitude ?? 'Longitude'}:{' '}
            {parseFloat(outlet.longitude).toFixed(3)} ,{' '}
            {Const.languageData?.Latitude ?? 'Latitude'}:{' '}
            {parseFloat(outlet.latitude).toFixed(3)}
          </Text>
        </View>

        <CustomButton
          onPress={() => onSave(navigation)}
          title={`${
            route.params?.outletData == null
              ? Const.languageData?.Add_Customer ?? 'Add Outlet'
              : Const.languageData?.Edit_Customer ?? 'Update'
          }`}
          loading={loading}
        />

        {/* Snackbar or other notification components can be added here */}
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  mapLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    justifyContent: 'center',
  },
  locationButton: {
    position: 'absolute',
    bottom: 320,
    right: 20,
    width: 30,
    height: 30,
    backgroundColor: '#333',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
  },

  textInputContainer: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: 'black',
  },
  textInput: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  predefinedPlacesDescription: {
    color: 'black',
  },
});

export default AddOutletScreen;
