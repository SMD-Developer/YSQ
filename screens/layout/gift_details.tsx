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
  typeof ROUTES.GiftDetailScreen
>;
type SaleDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.GiftDetailScreen
>;

interface SaleDetailScreenProps {
  navigation: SaleDetailScreenNavigationProp;
  route: SaleDetailScreenRouteProp;
}

const GiftDetailScreen: React.FC<SaleDetailScreenProps> = ({route}) => {
  const gift = route.params.gift;
  console.log(gift);

  return (
    <ScrollView style={styles.container}>
      <MainAppBar
        title={Const.languageData?.Gift_Details ?? `${'Gift'} Details`}
        isPrimary={false}
      />
      <View style={styles.detailContainer}>
        <Text style={styles.label}>
          {Const.languageData?.Gift_ID ?? 'Gift ID'}:
        </Text>
        <Text style={styles.value}>{gift.id}</Text>
        <Text style={styles.label}>{Const.languageData?.Date ?? 'Date'}:</Text>
        <Text style={styles.value}>
          {Const.getFormatedDate(gift.uploaded_date)}
        </Text>
        <Text style={styles.label}>
          {Const.languageData?.Customer_name ?? 'Customer Name'}:
        </Text>
        <Text style={styles.value}>
          {gift.outlets.name}
        </Text>
        <Text style={styles.label}>
          {Const.languageData?.Gifts ?? 'Gift Item'}:
        </Text>
        <View style={styles.saleItemContainer}>
          <Image
            source={{uri: gift.gitf_details!.image}}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{gift.gitf_details!.title}</Text>

            <Text style={styles.productQuantity}>
              {Const.languageData?.Quantity ?? 'Quantity'}: {gift.quantity}
            </Text>
          </View>
        </View>
        <Text style={styles.label}>{'Location'}:</Text>
        <Text style={styles.value}>{gift.location}</Text>
        <Text style={styles.label}>
          {Const.languageData?.Uploaded_photo ?? 'Uploaded photo'}
        </Text>
        <Image
          source={{uri: gift.image}}
          style={{
            height: 200,
            width: '100%',
            marginBottom: 50,
          }}
          resizeMode="contain" // Adjust based on your needs
        />
      </View>
    </ScrollView>
  );
};

export default GiftDetailScreen;

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
