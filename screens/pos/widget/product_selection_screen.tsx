import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../constants/colors';
import {useDeliveryController} from '../controller/delivery_controller'; // Adjust the path if necessary
import {TextInput} from 'react-native-gesture-handler';
import CustomSnackbar from '../../../components/custom_snackbar';
import {Const} from '../../../constants/const_value';
import {usePosContext} from '../pos_screen';

const ProductSelectionScreen: React.FC<{
  quantities: Record<string, number>;
  handleQuantityChange: (
    productId: number,
    increment: boolean,
    quantity?: number,
  ) => void;
}> = ({quantities, handleQuantityChange}) => {
  const {foundOutlet} = usePosContext();
  const {
    products,
    categories,
    loading,
    showSnackBar,
    errorMessage,
    setError,
    setShowSnackBar,
  } = useDeliveryController(1, foundOutlet?.id!, foundOutlet?.chanel_id!);

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );

  const filteredProducts = selectedCategory
    ? products.filter(
        product => product.product_category_name === selectedCategory,
      )
    : products;

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
        {Const.languageData?.Products ?? 'Products'}
      </Text>
      {/* Categories List */}
      <FlatList
        style={{marginBottom: 20}}
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
            onPress={() =>
              setSelectedCategory(
                item.name === selectedCategory ||
                  item.name === (Const.languageData?.All ?? 'All')
                  ? null
                  : item.name.toString(),
              )
            }>
            <Text
              style={[
                styles.categoryText,
                (selectedCategory === item.name ||
                  (item.name === (Const.languageData?.All ?? 'All') &&
                    selectedCategory === null)) &&
                  styles.selectedCategoryText,
              ]}>
              {item.name.toString()}
            </Text>
          </TouchableOpacity>
        )}
      />
      <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      />
      {/* Products List */}
      <FlatList
        data={filteredProducts}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', color: 'black'}}>
            No products found
          </Text>
        }
        contentContainerStyle={styles.productsContainer}
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
                <Text style={styles.productPrice}>
                  {Const.languageData?.Avl_Stock ?? 'stock'}:{' '}
                  {item.assign_quantity ?? 0}
                </Text>
                <Text style={styles.productPrice}>
                  {Const.languageData?.Product_Type ?? 'Unit'}:{' '}
                  {item.product_unit_name.name ?? ''}
                </Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    handleQuantityChange(item.main_product_id, false)
                  }>
                  <MaterialIcons name="remove" size={20} color="#fff" />
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityText}
                  value={quantities[item.main_product_id]?.toString() ?? '0'}
                  onChangeText={text => {
                    //console.log('Text:', text);
                    //console.log('In Stock:', item.in_stock);
                    if (parseInt(text, 10) > item.assign_quantity) {
                      //console.log(
                      //   'Quantity should be less than or equal to stock',
                      // );
                      setError(
                        Const.languageData?.Quantity_less_equal_to_stock ??
                          'Quantity should be less than or equal to available stock',
                      );
                      setShowSnackBar(true); // Set the snackbar to
                      handleQuantityChange(
                        item.main_product_id,
                        true,
                        item.assign_quantity,
                      );
                      return;
                    }
                    handleQuantityChange(
                      item.main_product_id,
                      true,
                      parseInt(text, 10),
                    );
                  }}
                  keyboardType="numeric"
                />
                {/* <Text style={styles.quantityText}>
                {quantities[item.main_product_id] || 0}
              </Text> */}
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    if (
                      quantities[item.main_product_id] + 1 >
                      item.assign_quantity
                    ) {
                      setError(
                        Const.languageData?.Quantity_less_equal_to_stock ??
                          'Quantity should be less than or equal to available stock',
                      );
                      setShowSnackBar(true); // Set the snackbar to

                      return;
                    }

                    handleQuantityChange(item.main_product_id, true);
                  }}>
                  <MaterialIcons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    marginVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
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
    textAlign: 'center',
    color: 'black',
  },
  nextButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey',
    marginBottom: 15,
  },
});

export default ProductSelectionScreen;
