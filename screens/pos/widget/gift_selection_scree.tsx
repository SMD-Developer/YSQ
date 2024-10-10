import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../constants/colors';
import {useDeliveryController} from '../controller/delivery_controller'; // Adjust the path if necessary
import CustomSnackbar from '../../../components/custom_snackbar';
import {Const} from '../../../constants/const_value';

const GiftSelectionScreen: React.FC<any> = ({
  quantities,
  handleQuantityChange,
}) => {
  const {
    gifts,
    loading,
    showSnackBar,
    setShowSnackBar,
    errorMessage,
    setError,
  } = useDeliveryController(3); // Fetch gifts by setting screenType to 3

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
        {Const.languageData?.Select_a_Gift ?? 'Select a Gift'}
      </Text>
      <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      />
      <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      />
      {/* Gifts List */}
      <FlatList
        data={gifts}
        scrollEnabled={false}
        contentContainerStyle={styles.productsContainer}
        ListEmptyComponent={
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              height: 200,
              alignSelf: 'center',
            }}>
            {' '}
            {'No Gifts found'}
          </Text>
        }
        renderItem={({item}) => (
          <View style={styles.productItem}>
            <Image
              source={{
                uri: item.image ?? 'https://via.placeholder.com/150',
              }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.title}</Text>
              <Text style={styles.productPrice}>
              {Const.languageData?.Avl_Stock ?? 'stock'} {": "} 
                {item.quantity}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, false)}>
                <MaterialIcons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityText}
                value={quantities[item.id]?.toString() ?? '0'}
                onChangeText={text => {
                  if (parseInt(text, 10) > item.quantity) {
                    setError(
                      Const.languageData?.Quantity_less_equal_to_stock ??
                        'Quantity should be less than or equal to available stock',
                    );
                    setShowSnackBar(true); // Set the snackbar to
                    handleQuantityChange(item.id, true, item.quantity);
                    return;
                  }
                  handleQuantityChange(item.id, true, parseInt(text, 10));
                }}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  if (quantities[item.id] + 1 > item.quantity) {
                    setError(
                      Const.languageData?.Quantity_less_equal_to_stock ??
                        'Quantity should be less than or equal to available stock',
                    );
                    setShowSnackBar(true); // Set the snackbar to

                    return;
                  }
                  handleQuantityChange(item.id, true);
                }}>
                <MaterialIcons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
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
    color: COLORS.PRIMARY,
  },
  productPrice: {
    fontSize: 14,
    color: COLORS.PRIMARY,
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
    color: COLORS.PRIMARY,
    marginBottom: 15,
  },
  productsContainer: {
    flexGrow: 1,
    height: '60%',
    backgroundColor: 'transparent',
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
});

export default GiftSelectionScreen;
