/* eslint-disable react-native/no-inline-styles */
// ApplyCouponScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {COLORS} from '../../../constants/colors';
import useHomeController from '../../home/controller/home_controller';
import {Promotion} from '../../home/models/promotion_model';
import {Product} from '../model/product_model';
import CustomButton from '../../../components/custom_app_button';
import {Icon} from 'react-native-paper';
import {Const} from '../../../constants/const_value';
import {usePosContext} from '../pos_screen';

interface ApplyCouponScreenProps {
  onCouponSelect: (coupon: Promotion | null) => void;
  selectCoupon: Promotion | null;
  products: Product[];
  total: number;
}

const ApplyCouponScreen: React.FC<ApplyCouponScreenProps> = ({
  onCouponSelect,
  selectCoupon,
  products,
  total,
}) => {
  console.log('products', products);
  const {foundOutlet} = usePosContext();

  const {promotions, loading} = useHomeController();

  const handleCouponSelect = (coupon: Promotion) => {
    if (selectCoupon?.id === coupon.id) {
      onCouponSelect(null);
      return;
    }
    onCouponSelect(coupon);
  };
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {Const.languageData?.Selected_Products ?? 'Selected Products'}
      </Text>
      <FlatList
        scrollEnabled={false}
        data={products}
        ListEmptyComponent={
          <Text style={{color: 'black'}}> {'No Progucts found'}</Text>
        }
        style={{marginBottom: 10}}
        renderItem={({item}) => {
          var product_price = 0;
          Object.keys(item?.chanel).forEach(key => {
            const data = item?.chanel[key];
            if (foundOutlet?.chanel_id === data?.chanel_id) {
              product_price = data?.price;
            }
          });
          return (
            <View style={styles.productItem}>
              <Image
                source={{
                  uri:
                    item.images?.length > 0
                      ? item.images[0]
                      : 'https://via.placeholder.com/100',
                }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  {Const.user?.currency} {product_price}
                </Text>
              </View>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{item.quantity || 0}</Text>
              </View>
            </View>
          );
        }}
      />

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.heading}>
          {Const.languageData?.Total ?? 'Total'}:
        </Text>
        <Text style={{color: 'black'}}>
          {Const.user?.currency}{' '}
          {total + (selectCoupon?.attributes?.discount ?? 0)}
        </Text>
      </View>
      {selectCoupon && (
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.heading}>
              {Const.languageData?.Discount ?? 'Discount'}:
            </Text>
            <Text style={{color: 'black'}}>
              {Const.user?.currency} {selectCoupon?.attributes?.discount}
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.heading}>
              {Const.languageData?.Final_Amount ?? 'Final Amount'}:
            </Text>
            <Text style={{color: 'black'}}>
              {Const.user?.currency} {total}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.heading}>
        {Const.languageData?.Available_coupons ?? 'Available Coupons'}
      </Text>
      <FlatList
        scrollEnabled={false}
        data={promotions}
        ListEmptyComponent={
          <Text style={{color: 'black'}}> {'No Promotions found'}</Text>
        }
        style={{marginBottom: 10, minHeight: 140}}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.couponItem,
              selectCoupon?.id === item.id && styles.selectedCouponItem,
            ]}
            onPress={() => handleCouponSelect(item)}>
            <View
              style={{flex: 1, alignContent: 'center', alignSelf: 'center'}}>
              <Text style={styles.couponCode}>{item.attributes.name}</Text>
              <Text style={styles.couponDescription}>
                {item.attributes.code}
              </Text>
            </View>
            {selectCoupon?.id !== item.id ? (
              <CustomButton
                title={Const.languageData?.Apply ?? 'Apply'}
                buttonStyle={{width: 80, height: 30, alignSelf: 'center'}}
                onPress={function (): void {
                  handleCouponSelect(item);
                }}
              />
            ) : (
              <View>
                <View
                  style={{
                    width: 80,
                    height: 30,
                    alignSelf: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: COLORS.PRIMARY,
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginRight: 5,
                    }}>
                    {Const.languageData?.Applied ?? 'Applied'}
                  </Text>
                  <Icon source="check" color="green" size={22} />
                </View>
                <View
                  style={{
                    borderColor: 'red',
                    borderWidth: 2,
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                  }}>
                  <Text style={{color: 'red', fontSize: 16}}>
                    X {Const.languageData?.Remove_coupon ?? 'Remove'}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 15,
  },
  couponItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  selectedCouponItem: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  couponDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  loaderContainer: {
    justifyContent: 'center',
    marginVertical: 80,
    alignItems: 'center',
  },
  productsContainer: {
    backgroundColor: 'transparent',
    minHeight: 140,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    color: 'grey',
  },
  productPrice: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 5,
    color: 'black',
  },
});

export default ApplyCouponScreen;
