import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import SuccessIcon from '../../assets/success-icon.svg';
import CustomButton from '../../components/custom_app_button';
import {Const} from '../../constants/const_value';
import {ROUTES} from '../../routes/routes_name';
import {CommonActions} from '@react-navigation/native';

const MapRouteSuccessScreen: React.FC<any> = ({navigation, route}) => {
  const outletId = route.params?.outletId;
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
