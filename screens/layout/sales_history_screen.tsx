import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {COLORS} from '../../constants/colors';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import MainAppBar from '../../components/custom_main_app_bar';
import {Const} from '../../constants/const_value';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomTextField from '../../components/custom_text_field';
import {useHistoryController} from './controller/history_controller';
import Loader from '../../components/custom_loader';
import CustomSnackbar from '../../components/custom_snackbar';
import {Sale} from '../pos/model/sales_mode';
import FilterDialog from '../../components/custom_filter';
import {format, parseISO} from 'date-fns';

type SaleHistoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.SaleHistoryScreen
>;
type SaleHistoryScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.SaleHistoryScreen
>;

interface SaleHistoryScreenProps {
  navigation: SaleHistoryScreenNavigationProp;
  route: SaleHistoryScreenRouteProp;
}
const SaleHistoryScreen: React.FC<SaleHistoryScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    loading,
    visible,
    snackbarMessage,
    onDismissSnackBar,
    filteredData,
    handleSearch,
    setFilteredData,
    data,
    searchQuery,
    onReferesh,
    fetchNextPage,
  } = useHistoryController(route.params.screenType ?? 1);
  let heading: string =
    route.params.screenType === 1
      ? Const.languageData?.Sales_History ?? 'Sales History'
      : route.params.screenType === 2
      ? Const.languageData?.Return_History ?? 'Return History'
      : Const.languageData?.Gift_History ?? 'Gift History';
  const [paymentOptions] = useState([
    {id: '1', name: Const.languageData?.Cash ?? 'Cash'},
    {id: '2', name: Const.languageData?.Cheque ?? 'Cheque'},
    {id: '5', name: Const.languageData?.Credit_limit ?? 'Credit Limit'},
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);

    await onReferesh();

    setRefreshing(false);
  }, []);
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
            screenType: route.params.screenType ?? 1,
          })
        }>
        <View style={styles.outletInfo}>
          <Text style={styles.heading}>
            {route.params.screenType === 2
              ? Const.languageData?.Return_ID ?? 'Return ID'
              : Const.languageData?.Order_ID ?? 'Order ID'}{' '}
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
          {route.params.screenType === 1 && (
            <View>
              <Text style={styles.heading}>
                {Const.languageData?.Payment_Method ?? 'Payment Method'}
              </Text>
              <Text style={styles.paymentMethod}>{paymentMethod}</Text>
            </View>
          )}
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

  return (
    <View style={styles.container}>
      <MainAppBar title={heading} isPrimary={false} />
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loader />
        </View>
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <CustomTextField
              // eslint-disable-next-line react-native/no-inline-styles
              style={{paddingHorizontal: 15, flex: 1}}
              value={searchQuery}
              placeholder={`${
                route.params.screenType === 3
                  ? Const.languageData?.Search_Gifts ?? 'Gifts'
                  : route.params.screenType === 2
                  ? Const.languageData?.Search_Return ?? 'Return'
                  : Const.languageData?.Sale_Details ?? 'Sales'
              }`}
              onChangeText={(text: string) => handleSearch(text)}
            />
            <FilterDialog onFilterApply={handleFilterApply} />
          </View>
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={filteredData}
            onEndReached={fetchNextPage} // Trigger next page load
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View
                style={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>
                  {Const.languageData?.No_data_available ?? 'No Data Found'}
                </Text>
              </View>
            }
            renderItem={renderSaleItem}
            keyExtractor={(item, index) => item.id.toString() + index}
            contentContainerStyle={styles.listContainer}
          />
        </View>
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

export default SaleHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    paddingBottom: 10,
  },
  appBarTitle: {
    color: 'grey',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'center',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 130,
    flexGrow: 1,
  },
  saleItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY, // Blue border
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  goodImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  productList: {
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productQuantity: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  promotion: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginBottom: 10,
  },
  comment: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  paymentType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});
