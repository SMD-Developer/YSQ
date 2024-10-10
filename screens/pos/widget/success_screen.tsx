import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {RootStackParamList} from '../../../routes/routes_name';
import {ROUTES} from '../../../routes/routes_name';
import {RouteProp} from '@react-navigation/native';
import {COLORS} from '../../../constants/colors';
import SuccessIcon from '../../../assets/success-icon.svg';
import {Const} from '../../../constants/const_value';

type ReturnSuccessScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.ReturnSuccessScreen
>;
type ReturnSuccessScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.ReturnSuccessScreen
>;

interface ReturnSuccessScreenProps {
  navigation: ReturnSuccessScreenNavigationProp;
  route: ReturnSuccessScreenRouteProp;
}

const ReturnSuccessScreen: React.FC<ReturnSuccessScreenProps> = ({
  navigation,
  route,
}) => {
  const {screenType, data} = route.params;
  const title =
    screenType === 1
      ? Const.languageData?.Delivery_Successful ?? 'Delivery Successful'
      : screenType === 2
      ? Const.languageData?.Return_Successful ?? 'Return Successful'
      : Const.languageData?.Gift_Successful ?? 'Gift Successful';
  const product =
    screenType === 1
      ? `${Const.languageData?.Products ?? 'Products'}:`
      : screenType === 2
      ? `${Const.languageData?.Returned_items ?? 'Returned Items'}:`
      : `${Const.languageData?.Gifts ?? 'Gifts'}:`;
  // const buttonText =
  //   screenType === 1 ? 'sales' : screenType === 2 ? 'return' : 'gift';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        {/* Success SVG Icon */}
        <View style={styles.svgContainer}>
          <SuccessIcon width={130} height={130} style={{marginBottom: 30}} />
        </View>

        {/* Details Container */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{title}</Text>

          {/* Product List */}
          <Text style={styles.sectionHeader}>{product}</Text>

          {/* Example Product */}
          {data.products.map((product, index) => (
            <View style={styles.productRow} key={index}>
              <Image
                source={{uri: product.image}}
                style={styles.productImage}
              />
              <Text style={styles.productText}>{product.name}</Text>
              <Text style={styles.productQuantity}>x{product.quantity}</Text>
            </View>
          ))}
          {/* <View style={styles.productRow}>
            <Image
              source={{uri: 'https://via.placeholder.com/50'}}
              style={styles.productImage}
            />
            <Text style={styles.productText}>Product 1</Text>
            <Text style={styles.productQuantity}>x2</Text>
          </View> */}

          {/* Other Details */}
          <View style={styles.detailRow}>
            <Text style={styles.sectionHeader}>
              {Const.languageData?.Date_Time ?? 'Date & Time'}:
            </Text>
            <Text style={styles.detailText}>{data.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.sectionHeader}>
              {Const.languageData?.Customer_name ?? 'Customer Name'}:
            </Text>
            <Text style={styles.detailText}>{data.outletName}</Text>
          </View>

          {screenType === 1 && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.sectionHeader}>
                  {Const.languageData?.Payment_Method ?? 'Payment Method'}:
                </Text>
                <Text style={styles.detailText}>{data.paymentType}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.sectionHeader}>
                  {Const.languageData?.Promotions ?? 'Promotion Applied'}:
                </Text>
                <Text style={styles.detailText}>{data.promotion}</Text>
              </View>
            </>
          )}
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            {Const.languageData?.Print_Receipt ?? 'Print Receipt'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={styles.buttonTextSecondary}>
            {Const.languageData?.Back_to_home ?? 'Back to Home'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: 20,
  },
  svgContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black', // Updated to black
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black', // Updated to black
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  productText: {
    fontSize: 14,
    color: 'black', // Updated to black
    flex: 1,
  },
  productQuantity: {
    fontSize: 14,
    color: 'black', // Updated to black
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Make details in a row
    alignItems: 'center',
    marginVertical: 5,
  },
  detailText: {
    fontSize: 14,
    color: 'black', // Updated to black
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#4caf50',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSecondary: {
    width: '100%',
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 55,
  },
  buttonTextSecondary: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReturnSuccessScreen;
