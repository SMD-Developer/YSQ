import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import MainAppBar from '../../components/custom_main_app_bar';
import {OpenCashItem} from './models/cash_data';
import Loader from '../../components/custom_loader';
import useOpenCashController from './controller/cash_controller';
import CustomSnackbar from '../../components/custom_snackbar';
import {RouteProp} from '@react-navigation/native';
import {format, parseISO} from 'date-fns';
import {Const} from '../../constants/const_value';
import {COLORS} from '../../constants/colors';
import FilterDialog from '../../components/custom_filter';

type TodaysCashNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.CashInOUt
>;
type TodaysCashRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.CashInOUt
>;

interface TodaysCashProps {
  navigation: TodaysCashNavigationProp;
  route: TodaysCashRouteProp;
}

const StockInOUtScreen: React.FC<TodaysCashProps> = ({navigation, route}) => {
  var isOpeningCash = (route.params?.screenType ?? 1) === 1;
  var isAll = (route.params?.screenType ?? 0) === 0;
  // const {
  //   visible,
  //   snackbarMessage,
  //   loading,
  //   openCashData,
  //   onDismissSnackBar,
  //   setFilteredCashData,
  //   filteredCashData,
  //   setOpenCashData,
  //   getOpenCashData,
  //   user,
  // } = useOpenCashController(route.params?.screenType ?? 1); // Pass salesManId as needed

  const renderItem = ({item}: {item: any}) => {
    var formattedDate = format(new Date(), 'dd MMM yyyy HH:mm');
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.storeName}>
          {Const.languageData?.Cash_ID ?? 'Cash ID'}: {'u127312'}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.dataRow}>
            <Text style={styles.detailText}>
              {Const.languageData?.Date ?? 'Date'}:{' '}
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </Text>
            <Text style={styles.detailText}>
              {Const.languageData?.Amount ?? 'Amount'}:{' '}
              <Text style={styles.detailValue}>
                {Const.user?.currency} {'200'}
              </Text>
            </Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.detailText}>
              {Const.languageData?.Salesman_ID ?? 'Salesman ID'}:{' '}
              <Text style={styles.detailValue}>{'Sales_id_12211'}</Text>
            </Text>

            <Text style={styles.detailText}>
              {Const.languageData?.Type ?? 'Type'}:{' '}
              <Text style={styles.detailValue}>{'Cash In'}</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    'All',
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);
    // await getOpenCashData();
    // setSelectedCategory('All');
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
      // var openCashDataList = openCashData!.data.filter(item => {
      //   const itemDate = parseISO(item.created_at);
      //   itemDate?.setHours(0, 0, 0, 0);
      //   console.log('item date', itemDate);
      //   console.log('checking', itemDate === startDate!);
      //   // Check if the item's date is between startDate and endDate
      //   return (
      //     itemDate.getTime() >= (startDate?.getTime() || 0) &&
      //     itemDate.getTime() <= (endDate?.getTime() || Infinity) &&
      //     (item.type.toLowerCase() === selectedCategory?.toLowerCase() ||
      //       (selectedCategory?.toLowerCase() ?? 'all') === 'all')
      //   );
      // });
      // setFilteredCashData({
      //   success: openCashData?.success!,
      //   message: openCashData?.message!,
      //   data: openCashDataList,
      // });
    } else {
      console.log(`Selected Filter: ${filter}`);
      if (filter.toLowerCase() === 'all') {
        // var openCashDataList = openCashData!.data.filter(item => {
        //   // Check if the item's date is between startDate and endDate
        //   return (
        //     item.type.toLowerCase() === selectedCategory?.toLowerCase() ||
        //     (selectedCategory?.toLowerCase() ?? 'all') === 'all'
        //   );
        // });
        // setFilteredCashData({
        //   success: openCashData?.success!,
        //   message: openCashData?.message!,
        //   data: openCashDataList,
        // });
      }
    }
    // Add logic to apply the filter to your data or UI...
  };

  return (
    <View style={styles.container}>
      <MainAppBar title={`${'Stock IN/OUT'}`} isPrimary={false} />

      <View style={{flexDirection: 'row'}}>
        {true ? (
          <FlatList
            style={{marginLeft: 20, height: 30}}
            data={[
              {
                id: Const.languageData?.All ?? 'All',
                name: Const.languageData?.All ?? 'All',
              },
              {
                id:  'Stock In',
                name:  'Stock In',
              },
              {
                id:'Stock Out',
                name: 'Stock Out',
              },
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
                  // setSelectedCategory(item.id);
                  // if (item.name === 'All') {
                  //   setFilteredCashData(openCashData);
                  // } else {
                  //   var openCashDataList = openCashData!.data.filter(eitem => {
                  //     return eitem.type.toLowerCase() === item.id.toLowerCase();
                  //   });
                  //   setFilteredCashData({
                  //     success: openCashData?.success!,
                  //     message: openCashData?.message!,
                  //     data: openCashDataList,
                  //   });
                  // }
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
        ) : (
          <View style={{width: '90%'}} />
        )}
        <FilterDialog onFilterApply={handleFilterApply} />
      </View>

      {false ? (
        <Loader />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={[
            {
              id: '111',
            },
          ]}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={{color: 'black'}}>
              {' '}
              <Text>
                {Const.languageData?.No_data_available ?? 'No Data Found'}
              </Text>
            </Text>
          }
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* <CustomSnackbar
        visible={visible}
        message={snackbarMessage}
        onDismiss={onDismissSnackBar}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={onDismissSnackBar}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginHorizontal: 15,
  },
  detailValue: {
    fontWeight: 'bold',
    color: '#000',
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

export default StockInOUtScreen;
