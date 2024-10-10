// ProductDetailScreen.tsx
import React from 'react';
import {View, Text, Image, StyleSheet, ScrollView} from 'react-native';
import MainAppBar from '../../components/custom_main_app_bar';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Const} from '../../constants/const_value';
import {Product} from './model/product_model';

type ProductDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.ProductDetails
>;
type ProductDetailRoute = RouteProp<
  RootStackParamList,
  typeof ROUTES.ProductDetails
>;

interface ProductDetailScreenProps {
  navigation: ProductDetailNavigationProp;
  route: ProductDetailRoute;
}

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const product: Product = route.params.product;

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <MainAppBar
        title={Const.languageData?.Product_Details ?? 'Product Details'}
        showBackButton={true}
        isPrimary={false}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {Const.languageData?.Product_Details ?? 'Product Details'}
        </Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {Const.languageData?.Name ?? 'Name'}:
          </Text>
          <Text style={styles.value}>{product.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {Const.languageData?.Category ?? 'Category'}:
          </Text>
          <Text style={styles.value}>{product.product_category_name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {`${Const.languageData?.Product_Type ?? 'SKU Code'}:`}
          </Text>
          <Text style={styles.value}>{product?.product_unit_name.name??""}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {`${Const.languageData?.SKU_Code ?? 'SKU Code'}:`}
          </Text>
          <Text style={styles.value}>{product.product_code}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {Const.languageData?.Quantity ?? 'Quantity'}:
          </Text>
          <Text style={styles.value}>{product.stock.quantity}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {Const.languageData?.Price ?? 'Price'}:
          </Text>
          <Text style={styles.value}>{Const.user?.currency} {product.product_price}</Text>
        </View>
        {product.images.length > 0 && (
          <View style={styles.imageContainer}>
            <Text style={[styles.label, {marginBottom: 10}]}>
              {Const.languageData?.Product_Image ?? 'Product Image'}:
            </Text>
            <Image source={{uri: product.images[0]}} style={styles.image} />
          </View>
        )}
        <View style={{height: 40, backgroundColor: 'white'}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: 'black',
    marginVertical: 8,
  },
  imageContainer: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
});

export default ProductDetailScreen;
