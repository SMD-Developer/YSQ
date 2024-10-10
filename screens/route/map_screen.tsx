import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../constants/colors';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import CustomButton from '../../components/custom_app_button';
import MapViewDirections from 'react-native-maps-directions';
import {addMinutes, format} from 'date-fns';
import {RouteProp} from '@react-navigation/native';
import {Const} from '../../constants/const_value';
import {event} from 'firebase-functions/v1/analytics';

const {width} = Dimensions.get('window');

type MapScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.MapScreen
>;
type MapScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.MapScreen
>;

interface MapScreenProps {
  navigation: MapScreenNavigationProp;
  route: MapScreenRouteProp;
}

const MapScreen: React.FC<MapScreenProps> = ({navigation, route}) => {
  const {long, lat, outletId, outletData} = route.params;
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  console.log('lat', lat);
  console.log('long', long);
  const [destination] = useState({
    latitude: parseFloat(lat),
    longitude: parseFloat(long),
  });
  const [time, setTime] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [arrival, setArrival] = useState<string>('');
  const [heading, setHeading] = useState<number>(0);
  const [expanded, setExpanded] = useState<boolean>(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const result = await check(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      if (result === RESULTS.DENIED) {
        const requestResult = await request(
          Platform.OS === 'android'
            ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
            : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        if (requestResult !== RESULTS.GRANTED) {
          Alert.alert('Permission to access location was denied');
          return;
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          setOrigin({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setHeading(position.coords.heading ?? 0);
        },
        error => {
          Alert.alert('Error getting location', error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );

      const watchId = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setOrigin({latitude, longitude});
          // setHeading(position.coords.heading ?? 0);
        },
        error => {
          Alert.alert('Error watching position', error.message);
        },
        {
          accuracy: {android: 'high', ios: 'best'},
          distanceFilter: 40,
          interval: 1000,
        },
      );

      return () => Geolocation.clearWatch(watchId);
    };

    requestLocationPermission();

    return () => {};
  }, [destination, lat, long]);

  const moveToCurrentLocation = () => {
    if (mapRef.current && origin) {
      mapRef.current.animateCamera({
        center: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
        zoom: 18,
      });
    }
  };
  const calculateBearing = (start, end) => {
    const lat1 = (start.latitude * Math.PI) / 180;
    const lon1 = (start.longitude * Math.PI) / 180;
    const lat2 = (end.latitude * Math.PI) / 180;
    const lon2 = (end.longitude * Math.PI) / 180;

    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360; // Normalize to 0-360 degrees
    return bearing;
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      {origin && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: origin.latitude,
              longitude: origin.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker.Animated
              coordinate={origin}
              title="You"
              style={{width: 30, height: 30}}
              // image={require('../../assets/bike_marker.png')}
              rotation={heading} // Rotate marker according to the device heading
            >
              <Image
                source={require('../../assets/trip.png')}
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: 'contain',
                  // transform: [{rotate: `${heading}deg`}],
                }}
              />
            </Marker.Animated>
            <Marker
              coordinate={destination}
              style={{width: 30, height: 30}}
              title="Outlet"
              image={require('../../assets/store.png')}
            />
            {origin && (
              <MapViewDirections
                resetOnChange={false}
                origin={origin}
                destination={destination}
                apikey={'AIzaSyD6lpgvCGHSvAInVE7wbZ2-OrwJPyVn0OA'}
                strokeWidth={6}
                strokeColor={COLORS.PRIMARY}
                onReady={result => {
                  setDistance(result.distance.toPrecision(2));
                  setTime(result.duration.toPrecision(2));

                  const currentTime = new Date();
                  const arrivalTime = addMinutes(currentTime, result.duration);
                  const formattedTime = format(arrivalTime, 'hh:mm a');
                  setArrival(formattedTime);
                  moveToCurrentLocation();
                  const nextPoint = result.coordinates[1]; // Get the next point in the polyline
                  if (nextPoint && nextPoint.latitude && nextPoint.longitude) {
                    const bearing = calculateBearing(origin, nextPoint); // Calculate bearing between origin and nextPoint
                    setHeading(bearing); // Set the marker heading to the calculated bearing
                  }
                  //console.log('Distance: ', result.distance);
                  //console.log('Arrival: ', result.distance);
                  //console.log('Duration: ', result.duration);
                }}
              />
            )}
          </MapView>
        </>
      )}

      {/* Floating Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Current Location Button */}
      <TouchableOpacity
        style={[styles.locationButton, {bottom: expanded ? 320 : 120}]}
        onPress={moveToCurrentLocation}>
        <Icon name="my-location" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Information Box */}
      {time &&
        (expanded ? (
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={() => setExpanded(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 20,
                backgroundColor: '#D3D3D3',
                width: 40,
                height: 40,
                borderRadius: 20,

                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}>
              <Icon
                name="keyboard-arrow-down"
                size={30}
                color={COLORS.PRIMARY}
              />
            </TouchableOpacity>
            <View style={styles.outletInfo}>
              {/* <Image
                source={require('../../assets/chair.png')} // Add your dummy image here
                style={styles.outletImage}
              /> */}
              <Icon name="store" size={50} color={COLORS.PRIMARY} />
              <View style={styles.outletDetails}>
                <Text style={styles.outletName}>
                  {outletData?.name ?? 'Outlet Name'}
                </Text>
                <Text style={styles.outletAddress}>
                  {outletData?.address ?? 'Outlet Address'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Icon name="access-time" size={30} color={COLORS.PRIMARY} />
                <Text style={styles.label}>
                  {Const.languageData?.Arrival ?? 'Arrival'}
                </Text>
                <Text style={styles.value}>{arrival}</Text>
              </View>
              <View style={styles.infoBox}>
                <Icon name="timer" size={30} color={COLORS.PRIMARY} />
                <Text style={styles.label}>
                  {Const.languageData?.Minutes ?? 'Minutes'}
                </Text>
                <Text style={styles.value}>{time}</Text>
              </View>
              <View style={styles.infoBox}>
                <Icon name="place" size={30} color={COLORS.PRIMARY} />
                <Text style={styles.label}>
                  {Const.languageData?.KM ?? 'Km'}
                </Text>
                <Text style={styles.value}>{distance}</Text>
              </View>
            </View>
            <CustomButton
              onPress={function (): void {
                navigation.replace(ROUTES.MapRouteSuccessScreen, {
                  outletId: outletId,
                });
              }}
              title={Const.languageData?.End_Trip ?? 'End'}
            />
          </View>
        ) : (
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={() => setExpanded(true)}
              style={{
                position: 'absolute',
                top: 10,
                right: 20,
                backgroundColor: '#D3D3D3',
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}>
              <Icon name="keyboard-arrow-up" size={30} color={COLORS.PRIMARY} />
            </TouchableOpacity>
            <View style={styles.outletInfo}>
              {/* <Image
                source={require('../../assets/chair.png')} // Add your dummy image here
                style={styles.outletImage}
              /> */}
              <Icon name="store" size={50} color={COLORS.PRIMARY} />
              <View style={styles.outletDetails}>
                <Text style={styles.outletName}>
                  {outletData?.name ?? 'Outlet Name'}
                </Text>
                <Text style={styles.outletAddress}>
                  {outletData?.address ?? 'Outlet Address'}
                </Text>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Make map cover the entire screen
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    height: 120,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderStyle: 'dotted',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: '#757575',
  },
  value: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 50,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  locationButton: {
    position: 'absolute',
    bottom: 320,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  outletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outletImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  outletDetails: {
    flex: 1,
  },
  outletName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  outletAddress: {
    fontSize: 14,
    color: '#757575',
  },
});

export default MapScreen;
