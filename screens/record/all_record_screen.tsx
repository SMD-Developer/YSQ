/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {COLORS} from '../../constants/colors';
import MainAppBar from '../../components/custom_main_app_bar';
import useRecordController from './controller/record_controller';
import Loader from '../../components/custom_loader';
import CustomSnackbar from '../../components/custom_snackbar';
import {Const} from '../../constants/const_value';
import {Icon} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import FilterDialog from '../../components/custom_filter';
import {parseISO} from 'date-fns';

type RecordNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.AllRecord
>;

interface RecordScreenProps {
  navigation: RecordNavigationProp;
}

const AllRecordScreen: React.FC<RecordScreenProps> = ({navigation}) => {
  const {
    visible,
    snackbarMessage,
    handleSnackbarDismiss,
    loading,
    data,
    filterData,
    setFilterData,
    selectedCategory,
    getData,
    setSelectedCategory,
  } = useRecordController();
  const renderHistoryItem = ({item}: {item: (typeof data)[0]}) => {
    return (
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
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);

    await getData();
    setSelectedCategory("All");
    setRefreshing(false);
  }, []);
  const handleFilterApply = (
    filter: string,
    startDate?: Date,
    endDate?: Date,
  ) => {
    startDate?.setHours(0, 0, 0, 0);
    endDate?.setHours(0, 0, 0, 0);
    console.log(startDate);
    if (
      filter === 'Custom' ||
      filter.toLowerCase() === 'today' ||
      filter.toLowerCase() === 'yesterday' ||
      filter.toLowerCase() === 'last 7 days' ||
      filter.toLowerCase() === 'this month' ||
      filter.toLowerCase() === 'last month'
    ) {
      setFilterData(
        data.filter(item => {
          const itemDate = parseISO(item.created_at!);
          itemDate?.setHours(0, 0, 0, 0);

          console.log('item date', itemDate);
          console.log('checking', itemDate === startDate!);

          // Check if the item's date is between startDate and endDate
          return (
            itemDate.getTime() >= (startDate?.getTime() || 0) &&
            itemDate.getTime() <= (endDate?.getTime() || Infinity)
          );
        }),
      );
    } else {
      console.log(`Selected Filter: ${filter}`);
      if (filter.toLowerCase() === 'all') {
        setFilterData(data);
      }
    }
    // Add logic to apply the filter to your data or UI...
  };

  return (
    <View style={styles.safeArea}>
      <MainAppBar
        title={Const.languageData?.Record_History ?? 'Record History'}
        showBackButton={true}
        isPrimary={false}
      />
      <View style={{flexDirection: 'row'}}>
        <FlatList
          style={{marginLeft: 20, height: 30}}
          data={[
            {id: 'All', name: `${Const.languageData?.All ?? 'All'}`},
            {id: 'Start', name: `${Const.languageData?.Start ?? 'Start'}`},
            {id: 'End', name: `${Const.languageData?.End ?? 'End'}`},
          ]}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                (selectedCategory === item.name ||
                  (item.name === 'All' && selectedCategory === null)) &&
                  styles.selectedCategoryChip,
              ]}
              onPress={() => {
                setSelectedCategory(item.name);
                if (item.name === 'All') {
                  setFilterData(data);
                } else {
                  setFilterData(
                    data.filter(
                      record =>
                        record.type.toLowerCase() === item.name.toLowerCase(),
                    ),
                  );
                }
              }}>
              <Text
                style={[
                  styles.categoryText,
                  (selectedCategory === item.name ||
                    (item.name === 'All' && selectedCategory === null)) &&
                    styles.selectedCategoryText,
                ]}>
                {item.name.toString()}
              </Text>
            </TouchableOpacity>
          )}
        />
        <FilterDialog onFilterApply={handleFilterApply} />
      </View>

      <View style={styles.container}>
        {loading ? (
          <Loader />
        ) : filterData.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text>
              {Const.languageData?.Record_History ?? 'No Record History'}
            </Text>
          </View>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={{color: 'black'}}>
                {' '}
                {Const.languageData?.No_data_available ?? 'No History Found'}
              </Text>
            }
            data={filterData}
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
  categoriesContainer: {
    height: 30,
    marginBottom: 20,
  },
  categoryChip: {
    marginBottom: 0,
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginRight: 10,
  },
  selectedCategoryChip: {
    backgroundColor: COLORS.PRIMARY,
    height: 30,
  },
  categoryText: {
    color: '#000',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
});

export default AllRecordScreen;
