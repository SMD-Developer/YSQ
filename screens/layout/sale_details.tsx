import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {StackNavigationProp} from '@react-navigation/stack';
import {COLORS} from '../../constants/colors';
import MainAppBar from '../../components/custom_main_app_bar';
import {Sale} from '../pos/model/sales_mode';
import {Const} from '../../constants/const_value';

type SaleDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.SaleDetailScreen
>;
type SaleDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.SaleDetailScreen
>;

interface SaleDetailScreenProps {
  navigation: SaleDetailScreenNavigationProp;
  route: SaleDetailScreenRouteProp;
}

const SaleDetailScreen: React.FC<SaleDetailScreenProps> = ({route}) => {
  const {sale, screenType} = route.params;

  const saleItems =
    screenType === 2
      ? sale.attributes.sale_return_items
      : sale.attributes.sale_items;
  const [paymentOptions] = useState([
    {id: '1', name: Const.languageData?.Cash ?? 'Cash'},
    {id: '2', name: Const.languageData?.Cheque ?? 'Cheque'},
    {id: '5', name: Const.languageData?.Credit_limit ?? 'Credit Limit'},
  ]);
  var payment = paymentOptions.filter(
    element =>
      element.id.toString() === sale.attributes.payment_type.toString(),
  );
  var paymentMethod = payment.length > 0 ? payment[0].name : '-';

  return (
    <ScrollView style={styles.container}>
      <MainAppBar
        title={`${
          screenType === 1
            ? Const?.languageData?.Sale_Details ?? 'Sale'
            : screenType === 2
            ? Const?.languageData?.Return_Details ?? 'Sale'
            : 'Gift'
        }`}
        isPrimary={false}
      />
      <View style={styles.detailContainer}>
        <Text style={styles.label}>
          {Const.languageData?.Order_ID ?? 'Order ID'}:
        </Text>
        <Text style={styles.value}>{sale.attributes.reference_code}</Text>
        <Text style={styles.label}>{Const.languageData?.Date ?? 'Date'}:</Text>
        <Text style={styles.value}>
          {Const.getFormatedDate(sale.attributes.created_at)}
        </Text>
        <Text style={styles.label}>
          {Const.languageData?.Customer_name ?? 'Customer Name'}:
        </Text>
        <Text style={styles.value}>{sale.attributes.customer_name}</Text>
        <Text style={styles.label}>
          {Const.languageData?.Total ?? 'Grand Total'}:
        </Text>
        <Text
          style={
            styles.value
          }>{`${Const.user?.currency} ${sale.attributes.grand_total}`}</Text>
        <Text style={styles.label}>
          {Const.languageData?.Discount ?? 'Discount'}:
        </Text>
        <Text style={styles.value}>
          {Const.user?.currency} {sale.attributes.discount}
        </Text>
        <Text style={styles.label}>
          {Const.languageData?.Final_Amount ?? 'Final Amount'}:
        </Text>
        <Text style={styles.value}>
          {Const.user?.currency}{' '}
          {sale.attributes.grand_total + sale.attributes.discount}
        </Text>
        {screenType === 1 && (
          <View>
            <Text style={styles.label}>
              {Const.languageData?.Payment_Method ?? 'Payment Type'}:
            </Text>
            <Text style={styles.value}>{paymentMethod}</Text>
          </View>
        )}

        <Text style={styles.label}>
          {Const.languageData?.Comments ?? 'Comments'}:
        </Text>
        <Text style={styles.value}>
          {sale.attributes.note ??
            Const.languageData?.No_comments ??
            'No comments'}
        </Text>
        <Text style={styles.label}>{'Location'}:</Text>
        <Text style={styles.value}>
          {sale.attributes.location ?? 'No Location'}
        </Text>

        {/* List sale items */}
        <Text style={styles.label}>
          {Const.languageData?.Products ?? 'Sale Items'}:
        </Text>
        {saleItems.map((item, index) => (
          <View key={index} style={styles.saleItemContainer}>
            <Image
              source={{uri: item.product_id[0].images.imageUrls[0]}}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.product_id[0].name}</Text>
              <Text
                style={
                  styles.productPrice
                }>{`${Const.user?.currency} ${item?.product_price}`}</Text>
              <Text style={styles.productQuantity}>
                {Const.languageData?.Quantity ?? 'Quantity'}: {item.quantity}
              </Text>
              <Text style={styles.productQuantity}>
                {Const.languageData?.Product_Type ?? 'Product Type'}:{' '}
                {item.product_id[0].product_unit_name.name}
              </Text>
            </View>
          </View>
        ))}
        {sale.attributes.uploaded_image && (
          <View>
            <Text style={styles.label}>
              {Const.languageData?.Uploaded_photo ?? 'Uploaded Image'}:
            </Text>
            <Image
              source={{uri: sale.attributes.uploaded_image}}
              style={{
                height: 200,
                width: '100%',
                marginBottom: 50,
              }}
              resizeMode="contain" // Adjust based on your needs
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SaleDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  detailContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: 'black',
  },
  saleItemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
  },
});
