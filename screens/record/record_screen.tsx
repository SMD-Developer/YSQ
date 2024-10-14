/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {COLORS} from '../../constants/colors';
import MainAppBar from '../../components/custom_main_app_bar';
import useRecordController from './controller/record_controller';
import Loader from '../../components/custom_loader';
import CustomSnackbar from '../../components/custom_snackbar';
import {Const} from '../../constants/const_value';
import {RefreshControl} from 'react-native-gesture-handler';

type RecordNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.Record
>;

interface RecordScreenProps {
  navigation: RecordNavigationProp;
}

const RecordScreen: React.FC<RecordScreenProps> = ({navigation}) => {
  const {
    visible,
    snackbarMessage,
    getData,
    handleSnackbarDismiss,
    loading,
    data,
  } = useRecordController();
  const renderHistoryItem = ({item}: {item: (typeof data)[0]}) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => {
        navigation.navigate(ROUTES.RecordDetails, {recordMileage: item});
      }}>
      <Text style={styles.dateText}>
        {Const.getFormatedDate(item.created_at!)}
      </Text> 
      <View style={styles.mileageRow}>
        <Text style={styles.mileageText}>
          {Const.languageData?.Mileage ?? 'Mileage'}: {item.mileage}{' '}
          {Const.languageData?.KM ?? 'KM'}
        </Text>
        <Text style={styles.mileageText}>
          {Const.languageData?.Type ?? 'Type'}: {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);

    await getData();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.safeArea}>
      <MainAppBar
        title={Const.languageData?.Record ?? 'Record'}
        showBackButton={false}
        isPrimary={true}
      />

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(ROUTES.RecordFormScreen, {screenType: 1});
          }}>
          <View style={[styles.box, {backgroundColor: '#198754'}]}>
            <Text style={styles.boxTitle}>
              {Const.languageData?.Mileage_Start_Record ??
                'Mileage Start Record'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate(ROUTES.RecordFormScreen, {screenType: 2});
          }}>
          <View style={[styles.box, {backgroundColor: '#f77327'}]}>
            <Text style={styles.boxTitle}>
              {Const.languageData?.Mileage_End_Record ?? 'Mileage End Record'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Mileage History Section */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>
            {Const.languageData?.Mileage_History ?? 'Mileage History'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(ROUTES.AllRecord);
            }}>
            <Text style={styles.viewAll}>
              {Const.languageData?.View_all ?? 'View All'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* FlatList for Mileage History */}
        {loading ? (
          <Loader />
        ) : data.length == 0 ? (
          <View
            style={{
              marginTop: 100,
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text>
              {Const.languageData?.No_data_available ?? 'No History Found'}
            </Text>
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={data.slice(0, 5)}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.historyList}
          />
        )}
      </View>
      <CustomSnackbar
        visible={visible}
        message={snackbarMessage}
        onDismiss={handleSnackbarDismiss}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={handleSnackbarDismiss}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appBarTitle: {
    color: 'grey',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  box: {
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'dotted',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  boxTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  viewAll: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  historyList: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#e9e9e9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  mileageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mileageText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RecordScreen;
