import React, {useState, useCallback} from 'react';
import {StyleSheet, View, Text, FlatList, RefreshControl, ScrollViewComponent, ScrollView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomTextField from '../../components/custom_text_field';
import {COLORS} from '../../constants/colors';
import MainAppBar from '../../components/custom_main_app_bar';
import {Icon} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Const} from '../../constants/const_value';
import Loader from '../../components/custom_loader';
import CustomSnackbar from '../../components/custom_snackbar';
import {ROUTES} from '../../routes/routes_name';
import {useHistoryController} from '../layout/controller/history_controller';
import {Sale} from '../pos/model/sales_mode';
import {useNavigation} from '@react-navigation/native';
import FilterDialog from '../../components/custom_filter';
import {parseISO} from 'date-fns';

const SalesScreen: React.FC<any> = () => {
  const navigation = useNavigation();
  const {
    loading,
    visible,
    snackbarMessage,
    onDismissSnackBar,
    filteredData,
    setFilteredData,
    data,
    handleSearch,
    searchQuery,
    fetchNextPage,
    onReferesh,
  } = useHistoryController(1);
  const [paymentOptions] = useState([
    {id: '1', name: Const.languageData?.Cash ?? 'Cash'},
    {id: '2', name: Const.languageData?.Cheque ?? 'Cheque'},
    {id: '5', name: Const.languageData?.Credit_limit ?? 'Credit Limit'},
  ]);
  const renderSaleItem = ({item}: {item: Sale}) => {
    var payment = paymentOptions.filter(
      element =>
        element.id.toString() === item.attributes.payment_type.toString(),
    );
    var paymentMethod = payment.length > 0 ? payment[0].name : '-';

    return (
      <TouchableOpacity
        style={styles.tableRow}
        onPress={() =>
          navigation.navigate(ROUTES.SaleDetailScreen, {
            sale: item,
            screenType: 1,
          })
        }>
        <View style={styles.outletInfo}>
          <Text style={styles.heading}>
            {Const.languageData?.Order_ID ?? 'Order ID'}{' '}
            {item.attributes.reference_code}
          </Text>
          <Text style={styles.outletName}>
            {Const.getFormatedDate(item.attributes.created_at)}
          </Text>
          <Text style={styles.heading}>
            {Const.languageData?.Customer_name ?? 'Customer Name'}
          </Text>
          <Text style={styles.outletName}>{item.attributes.customer_name}</Text>

          {/* Heading for Payment Method */}

          <View>
            <Text style={styles.heading}>
              {Const.languageData?.Payment_Method ?? 'Payment Method'}
            </Text>
            <Text style={styles.paymentMethod}>{paymentMethod}</Text>
          </View>
        </View>
        <View>
          <Text
            style={
              styles.amount
            }>{`${Const.user?.currency} ${item.attributes.grand_total}`}</Text>
          <Icon source="store" size={40} color={COLORS.PRIMARY} />
          {/* <Image
          source={
            row.imageUri
              ? {uri: row.imageUri}
              : require('../../assets/chair.png')
          }
          style={styles.outletImage}
        /> */}
        </View>
      </TouchableOpacity>
    );
  };
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
      setFilteredData(
        data.filter(item => {
          const itemDate = parseISO(item.attributes.created_at);
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
        setFilteredData(data);
      }
    }
    // Add logic to apply the filter to your data or UI...
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);

    await onReferesh();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.fullContainer}>
      <MainAppBar
        title={Const.languageData?.Sales ?? 'Sales'}
        showBackButton={false}
        isPrimary={true}
      />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loader />
        </View>
      ) : (
        <ScrollView  refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
          <View

            style={{
              flexDirection: 'row',
            }}>
            <CustomTextField
              // eslint-disable-next-line react-native/no-inline-styles
              style={{paddingHorizontal: 15, flex: 1}}
              value={searchQuery}
              placeholder={
                Const.languageData?.Search_Sales ?? `Search ${'Sales'}`
              }
              onChangeText={(text: string) => handleSearch(text)}
            />
            <FilterDialog onFilterApply={handleFilterApply} />
          </View>

          <FlatList
            scrollEnabled={false}

            data={filteredData}
            renderItem={renderSaleItem}
            ListEmptyComponent={
              <Text style={{color: 'black'}}>
                {' '}
                {Const.languageData?.No_data_available ?? 'No Sale Found'}
              </Text>
            }
            onEndReached={fetchNextPage} // Trigger next page load
            onEndReachedThreshold={0.5}
            keyExtractor={(item,index) => item.attributes.reference_code.toString()+index}
            contentContainerStyle={styles.listContainer}
          />
        </ScrollView>
      )}
      <CustomSnackbar
        visible={visible}
        message={snackbarMessage}
        onDismiss={onDismissSnackBar}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        onActionPress={onDismissSnackBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterField: {
    marginBottom: 16,
  },
  filterLabel: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  datePicker: {
    width: '100%',
    backgroundColor: COLORS.PRIMARY,
  },
  textInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  applyButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabBar: {
    elevation: 0,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    backgroundColor: '#fff',
    marginTop: 3,
  },
  indicator: {
    backgroundColor: COLORS.PRIMARY,
  },
  reportContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  tableContainer: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 3,
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  outletInfo: {
    flex: 1,
  },
  outletImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 4,
  },
  outletName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  paymentMethod: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey',
    marginTop: 4,
    marginBottom: 15,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'black',
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 50,
    flexGrow: 1,
  },
});

export default SalesScreen;
