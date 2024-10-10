import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {COLORS} from '../../constants/colors';
import MainAppBar from '../../components/custom_main_app_bar';
import {useProductController} from './controller/product_controller';
import {Product} from './model/product_model';
import Loader from '../../components/custom_loader';
import CustomSnackbar from '../../components/custom_snackbar';
import {ROUTES} from '../../routes/routes_name';
import {Const} from '../../constants/const_value';
import CustomTextField from '../../components/custom_text_field';

const ProductListScreen: React.FC<any> = ({navigation}) => {
  const {
    loading,
    error,
    visible,
    snackbarMessage,
    onDismissSnackBar,
    filteredOutlets,
    handleSearch,
    searchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    handleClick,
    fetchProductData,
  } = useProductController();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);

    await fetchProductData();
    handleClick(null);
    setSelectedCategory(null);
    setRefreshing(false);
  }, []);
  const renderProduct = ({item}: {item: Product}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(ROUTES.ProductDetails, {product: item})
      }
      style={styles.productItem}>
      <Image source={{uri: item.images[0]}} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.product_code}</Text>
        <Text style={styles.productDescription}>
          {Const.languageData?.Product_Type ?? 'Product Type'}:{' '}
          {item.product_unit_name.name}
        </Text>
        <View style={styles.productDetails}>
          <Text style={styles.productQuantity}>
            {Const.languageData?.Avl_Stock ?? 'Avl. Stock'}:{' '}
            {item.stock.quantity}
          </Text>
          <Text style={styles.productPrice}>
            {Const.user?.currency} {item.product_price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MainAppBar
        title={Const.languageData?.Products ?? 'Products'}
        isPrimary={false}
      />
      <CustomTextField
        // eslint-disable-next-line react-native/no-inline-styles
        style={{paddingHorizontal: 15}}
        value={searchQuery}
        placeholder={Const.languageData?.Search_Product ?? 'Search Product'}
        onChangeText={(text: string) => handleSearch(text)}
      />

      {loading ? (
        <Loader />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <View>
          <FlatList
            style={{marginBottom: 20, marginLeft: 20}}
            data={[
              {
                id: Const.languageData?.All ?? 'all',
                name: Const.languageData?.All ?? 'All',
              },
              ...categories.map(category => ({
                id: category.id,
                name: category.name,
              })),
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  (selectedCategory === item.name ||
                    (item.name === (Const.languageData?.All ?? 'All') &&
                      selectedCategory === null)) &&
                    styles.selectedCategoryChip,
                ]}
                onPress={() => {
                  if (item.name === Const.languageData?.All ?? 'All') {
                    // Reset selection to 'All'

                    handleClick(null);
                    setSelectedCategory(null);
                  } else {
                    // Set selected category to the clicked one

                    handleClick(item.name);
                    setSelectedCategory(item.name);
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
          {filteredOutlets.length === 0 ? (
            <View style={styles.noProductContainer}>
              <Text style={styles.noProductText}>
                {Const.languageData?.No_data_available ?? 'No data available'}
              </Text>
            </View>
          ) : (
            <FlatList
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              data={filteredOutlets}
              ListEmptyComponent={
                <Text style={{color: 'black'}}>
                  {Const.languageData?.No_data_available ?? 'No data available'}
                </Text>
              }
              renderItem={renderProduct}
              keyExtractor={item => item.main_product_id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          )}
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

export default ProductListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  noProductContainer: {
    flexGrow: 1,
    marginTop: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductText: {
    color: 'black',
    fontSize: 16,
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
    shadowColor: '#000', // Shadow color
    shadowOffset: {width: 0, height: 2}, // Offset for shadow
    shadowOpacity: 0.1, // Shadow opacity
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
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  categoryText: {
    color: '#000',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
});
