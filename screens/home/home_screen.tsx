/* eslint-disable react-native/no-inline-styles */
import React, { useCallback , useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView} from 'react-native';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {Icon} from 'react-native-paper';
import {COLORS} from '../../constants/colors';
import {DrawerNavigationProp} from '@react-navigation/drawer';

import useHomeController from './controller/home_controller';
import Loader from '../../components/custom_loader';
import CustomSnackbar from '../../components/custom_snackbar';
import MainAppBar from '../../components/custom_main_app_bar';
import {Const} from '../../constants/const_value';
import {Promotion} from './models/promotion_model';

interface Option {
  id: string;
  title: string;
  value: string;
  iconName: string;
  backgroundColor: string;
  borderColor: string;
  navigationFunc: any;
}
type HomeScreenNavigationProp = DrawerNavigationProp<
  RootStackParamList,
  typeof ROUTES.Country
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}
const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  useEffect(() => {
    getUser();
  });

  const {
    getUser,
    visible,
    snackbarMessage,
    loading,
    onDismissSnackBar,
    promotions,
    homeData,
    fetchData,
    user,
  } = useHomeController();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);

    await fetchData();
    setRefreshing(false);
  },[]);
  const topOptions: Option[] = [
    {
      id: '1',
      title: Const.languageData?.Todays_Routes ?? "Today's Routes",
      value: `${homeData?.today_trip ?? 0}`,
      iconName: 'map-marker',
      borderColor: 'rgb(217,239,253)',
      backgroundColor: 'rgb(217,239,253)',
      navigationFunc: () => {
        navigation.navigate('Routes');
      },
    }, // Amber
    {
      id: '2',
      title: Const.languageData?.Opening_Cash ?? 'Opening Cash',
      value: `${user?.currency} ${homeData?.opening_cash ?? 0}`,
      iconName: 'cash',
      borderColor: 'rgb(235,234,247)',
      backgroundColor: 'rgb(235,234,247)',
      navigationFunc: () =>
        navigation.navigate(ROUTES.OpeningCash, {screenType: 1}),
    }, // Peach
    {
      id: '3',
      title: Const.languageData?.Closing_Cash ?? 'Closing Cash',
      value: `${user?.currency} ${homeData?.closing_cash ?? 0}`,
      iconName: 'cash-register',
      borderColor: 'rgb(226,241,244)',
      backgroundColor: 'rgb(226,241,244)',
      navigationFunc: () =>
        navigation.navigate(ROUTES.OpeningCash, {screenType: 2}),
    }, // Lavender
  ];

  const bottomOptions: Option[] = [
    {
      id: '1',
      title: Const.languageData?.Todays_Sale ?? "Today's Sale",
      value: `${user?.currency} ${homeData?.today_sales ?? 0}`,
      iconName: 'cart',
      borderColor: 'rgb(217,239,253)',
      backgroundColor: 'rgb(217,239,253)',
      navigationFunc: () => {},
    }, // Peach
    {
      id: '2',
      title: Const.languageData?.Total_Sale ?? 'Total Sale',
      value: `${Const.user?.currency}  ${homeData?.total_sales ?? 0}`,
      iconName: 'cart-outline',
      borderColor: 'rgb(235,234,247)',
      backgroundColor: 'rgb(235,234,247)',
      navigationFunc: () => {},
    }, // Lavender
    {
      id: '3',
      title:
        Const.languageData?.Todays_Cash_Received ?? "Today's Cash Received",
      value: `${user?.currency} ${homeData?.today_cash_recieved ?? 0}`,
      iconName: 'cash-multiple',
      borderColor: 'rgb(226,241,244)',
      backgroundColor: 'rgb(226,241,244)',
      navigationFunc: () => {},
    }, // Light Green
  ];

  const renderOption = ({item}) => (
    <TouchableOpacity
      onPress={item.navigationFunc}
      style={[
        styles.optionBox,
        {
          backgroundColor: item.backgroundColor,
          borderColor: item.borderColor,
          borderWidth: 1,
        },
      ]}>
      <View style={styles.iconContainer}>
        <Icon source={item.iconName} size={25} color="#000" />
      </View>
      <Text style={styles.optionTitle}>{item.title}</Text>
      <View style={[styles.titleBox, {backgroundColor: COLORS.PRIMARY}]}>
        <Text style={styles.optionValue}>{item.value}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPromotion = ({item}: {item: Promotion}) => {
    return (
      <View style={styles.promotionContainer}>
        <View style={styles.promotionTextContainer}>
          <Text style={styles.promotionTitle}>{item.attributes.name}</Text>
          <Text style={styles.promotionDescription}>
            {item.attributes.code}
          </Text>
        </View>
        <Text style={styles.validDate}>
          {Const.languageData?.Valid_till ?? 'Valid till'}
          {' \n'}
          {`${item.attributes.end_date}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MainAppBar
        title={''}
        isPrimary={true}
        showUser={true}
        showBackButton={false}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <ScrollView
          style={{paddingTop: 20,flexGrow: 1,}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          
          >
          <FlatList
            data={topOptions}
            style={{
              marginHorizontal: 20,
              backgroundColor: 'rgb(242, 248, 255)',
              borderColor: 'rgb(242, 248, 255)',
              borderWidth: 1,
              borderRadius: 10,
              paddingVertical: 10,
              marginBottom: 20,
            }}
            renderItem={renderOption}
            keyExtractor={item => item.id}
            numColumns={3} // Updated to 3 columns
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
          

          {/* Bottom Metrics Section */}
          <FlatList
            style={{
              marginHorizontal: 20,

              backgroundColor: 'rgba(217, 231, 213, 0.3)',
              borderColor: 'rgba(217, 231, 213, 0.4)',
              borderWidth: 1,
              borderRadius: 10,
              paddingVertical: 10,
              marginBottom: 10,
            }}
            data={bottomOptions}
            renderItem={renderOption}
            keyExtractor={item => item.id}
            numColumns={3} // Updated to 3 columns
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.ProductListScreen)}
              style={[styles.buttonBox]}>
              <Icon source="map" size={25} color="black" />
              <Text style={styles.buttonText}>
                {Const.languageData?.Products ?? 'Products'}
              </Text>
            </TouchableOpacity>
            {/* Deep Orange */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.SaleHistoryScreen, {
                  screenType: 1,
                })
              }
              style={[styles.buttonBox]}>
              <Icon source="cash" size={25} color="black" />
              <Text style={styles.buttonText}>
                {Const.languageData?.Sales ?? 'Sales'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.SaleHistoryScreen, {
                  screenType: 2,
                })
              }
              style={[styles.buttonBox]}>
              <Icon source="undo" size={25} color="black" />
              <Text style={styles.buttonText}>
                {Const.languageData?.Returns ?? 'Return'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.SaleHistoryScreen, {
                  screenType: 3,
                })
              }
              style={[styles.buttonBox]}>
              <Icon source="gift" size={25} color="black" />
              <Text style={styles.buttonText}>
                {Const.languageData?.Gifts ?? 'Gift'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Promotions Section */}
          <View
            style={{
              marginHorizontal: 25,
              marginTop: 15,
              backgroundColor: 'rgb(250, 250, 250)',
              borderRadius: 10,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}>
            <View style={styles.promotionHeader}>
              <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
                {Const.languageData?.All_Promotions ?? 'All Promotions'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.AllPromotions)}>
                <Text style={styles.viewAllText}>
                  {Const.languageData?.View_all ?? 'View All'}
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              scrollEnabled={false}
              data={promotions}
              renderItem={renderPromotion}
              keyExtractor={item => item.id.toString()}
            />
          </View>
          <View style={{height: 85}} />
        </ScrollView>
      )}

      <CustomSnackbar
        visible={visible}
        message={snackbarMessage}
        onDismiss={onDismissSnackBar}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={onDismissSnackBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50, // Circular image
    borderWidth: 4,
    borderColor: 'grey',
    marginBottom: 10,
  },
  userName: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userType: {
    marginTop: 5,
    fontSize: 10,
    color: 'white',
    fontWeight: '300', // "thin" is not a valid weight, "300" is more common
    textAlign: 'center',
  },
  userInfo: {
    marginLeft: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: COLORS.PRIMARY,

    elevation: 4,
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 0, height: 2}, // Offset for shadow
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 4,
  },
  leadingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  trailingItem: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 450,
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  optionBox: {
    flex: 1,
    height: 150,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
    margin: 5, // Adds spacing between the items
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 13,
    color: 'grey',
    textAlign: 'center',
  },
  optionValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {fontSize: 12, color: 'black', marginTop: 5},
  buttonBox: {
    width: 70,
    height: 70,

    borderRadius: 10,

    backgroundColor: COLORS.PimaryLight,

    paddingTop: 11,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  promotionContainer: {
    padding: 15,
    // borderWidth: 1,
    // borderColor: COLORS.PRIMARY,
    borderRadius: 10,
    margin: 15,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',

    color: 'black',
  },
  viewAllText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  promotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(228,239,253)', // Blue background
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  promotionTextContainer: {
    flexDirection: 'column',
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // White text
  },
  promotionDescription: {
    fontSize: 14,
    color: 'black', // White text
  },
  validDate: {
    fontSize: 14,
    color: 'black', // White text
    textAlign: 'center',
  },
  titleBox: {
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'red',
  },
});

export default HomeScreen;
