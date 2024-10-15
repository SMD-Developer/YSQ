import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import MainAppBar from '../../components/custom_main_app_bar';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import { Const } from '../../constants/const_value';

type RecordDeatilsNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.RecordDetails
>;
type RecordDeatilsRoute = RouteProp<
  RootStackParamList,
  typeof ROUTES.RecordDetails
>;

interface RecordDeatilsScreenProps {
  navigation: RecordDeatilsNavigationProp;
  route: RecordDeatilsRoute;
}

const RecordDeatilScreen: React.FC<RecordDeatilsScreenProps> = ({
  navigation,
  route,
}) => {
  const recordMileage = route.params.recordMileage;
  const defaultImage = 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=b9S9F5NT9TWeFZE8XGGdIu3FucUa2Nm9MAXIgkj-FnA='; // Replace with your default image URL

  const [vehicleImageUri, setVehicleImageUri] = useState(recordMileage.vehicle_image);
  const [mileageImageUri, setMileageImageUri] = useState(recordMileage.mileage_image);

  return (
    <View style={{backgroundColor: 'white'}}>
      <MainAppBar
        title={Const.languageData?.Record_History??"Record Details"}
        showBackButton={true}
        isPrimary={false}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{Const.languageData?.Type??"Type"}:</Text>
          <Text style={styles.value}>{recordMileage.type}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{Const.languageData?.Mileage??"Mileage"}:</Text>
          <Text style={styles.value}>{recordMileage.mileage} KM</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{Const.languageData?.Date??"Date"}:</Text>
          <Text style={styles.value}>{Const.getFormatedDate2(recordMileage.created_at!)}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>{"Location"}:</Text>
          <Text style={styles.value}>{recordMileage.location}</Text>
        </View>
        {vehicleImageUri && (
          <View style={styles.imageContainer}>
            <Text style={styles.label}>{Const.languageData?.Vehicle_Image_With_Number_Plate??"Vehicle Image"}:</Text>
            <Image
              source={{uri: vehicleImageUri}}
              style={styles.image}
              onError={() => setVehicleImageUri(defaultImage)}
            />
          </View>
        )}
        {mileageImageUri && (
          <View style={styles.imageContainer}>
            <Text style={styles.label}>{Const.languageData?.Mileage_Image_Showing_Current_Record??"Mileage Image"}:</Text>
            <Image
              source={{uri: mileageImageUri}}
              style={styles.image}
              onError={() => setMileageImageUri(defaultImage)}
            />
          </View>
        )}
        <View style={{height: 40, backgroundColor: 'white'}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: 'black',
    marginVertical: 8,
  },
  imageContainer: {
    marginBottom: 16,
    width: '100%', 
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical:10
  },
});

export default RecordDeatilScreen;
