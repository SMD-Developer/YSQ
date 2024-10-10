// screens/ReturnSalesScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {Product} from '../model/product_model';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Sale, SaleItem} from '../model/sales_mode';
import {Const} from '../../../constants/const_value';
import {useDeliveryController} from '../controller/delivery_controller';
import {RadioButton} from 'react-native-paper';
import CustomSnackbar from '../../../components/custom_snackbar';

const ReturnProductScreen: React.FC<any> = ({
  selectedSales,
  handleQuantityChange,
  quantities,
  setSelectedSales,

  setQuantities,
  outletId,
}) => {
  const {
    salesReturns,
    loading,
    setError,
    setShowSnackBar,
    showSnackBar,
    errorMessage,
  } = useDeliveryController(2, outletId);
  const renderItem = ({item}: {item: SaleItem}) => (
    <View style={styles.productItem}>
      <Image
        source={{
          uri:
            item.product_id[0].images.imageUrls.length > 0
              ? item.product_id[0].images.imageUrls[0]
              : 'https://via.placeholder.com/150' ??
                'https://via.placeholder.com/150',
        }}
        style={styles.productImage}
      />
      {/* <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      /> */}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.product_id[0].name}</Text>
        <Text style={styles.productPrice}>
          {Const.languageData?.Avl_Stock ?? 'stock'}{": "}{item.quantity}
        </Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() =>
            handleQuantityChange(item.product_id[0].main_product_id, false)
          }>
          <MaterialIcons name="remove" size={20} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.quantityText}
          value={
            quantities[item.product_id[0].main_product_id]?.toString() ?? '0'
          }
          onChangeText={text => {
            if (parseInt(text, 10) > item.quantity) {
              setError(
                Const.languageData?.Quantity_less_equal_to_stock ??
                  'Quantity should be less than or equal to available stock',
              );
              setShowSnackBar(true); // Set the snackbar to
              handleQuantityChange(
                item.product_id[0].main_product_id,
                true,
                item.quantity,
              );
              return;
            }
            handleQuantityChange(
              item.product_id[0].main_product_id,
              true,
              parseInt(text, 10),
            );
          }}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => {
            if (
              quantities[item.product_id[0].main_product_id] + 1 >
              item.quantity
            ) {
              setError(
                Const.languageData?.Quantity_less_equal_to_stock ??
                  'Quantity should be less than or equal to available stock',
              );
              setShowSnackBar(true); // Set the snackbar to

              return;
            }

            handleQuantityChange(item.product_id[0].main_product_id, true);
          }}>
          <MaterialIcons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderSaleItem = ({item}: {item: Sale}) => (
    <TouchableOpacity
      style={[styles.productItem]}
      onPress={() => handleSaleSelection(item)}>
      <View>
        <Text style={[styles.productName]}>
          {Const.languageData?.Order_ID ?? 'Order Id'} #{item.id}
        </Text>
        <Text style={[styles.productPrice]}>
          {Const.getFormatedDate(item.attributes.created_at)}
        </Text>
      </View>

      <RadioButton
        value="first"
        color={COLORS.PRIMARY}
        status={item.id === (selectedSales?.id ?? '') ? 'checked' : 'unchecked'}
        onPress={() => handleSaleSelection(item)}
      />
    </TouchableOpacity>
  );

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSaleSelection = (sale: Sale) => {
    setSelectedSales(sale);
    setQuantities({});
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, {minHeight: 140}]}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }
  return (
    <View>
      <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      />
      <Text style={styles.heading}>
        {Const.languageData?.Order_ID ?? 'Order ID'}
      </Text>
      <TouchableOpacity style={styles.selectionBox} onPress={toggleModal}>
        <Text style={styles.selectionText}>
          {selectedSales
            ? `${Const.languageData?.Order_ID ?? 'Order Id'} #${
                selectedSales.id
              }`
            : Const.languageData?.Choose_Order_ID ?? 'Choose order id'}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.heading}>
              {Const.languageData?.Choose_Order_ID ?? 'Choose order id'}
            </Text>
            <FlatList
              data={salesReturns}
              ListEmptyComponent={
                <View style={[styles.loaderContainer, {marginBottom: 10}]}>
                  <Text>
                    {Const.languageData?.No_data_available ?? 'No Sale Found'}
                  </Text>
                </View>
              }
              renderItem={renderSaleItem}
              keyExtractor={item => item.id.toString()}
            />
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>
                {Const.languageData?.Select ?? 'Select'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.heading}>
        {Const.languageData?.Products ?? 'Products'}
      </Text>
      <FlatList
        data={selectedSales?.attributes.sale_items}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={[styles.loaderContainer, {marginBottom: 10}]}>
            <Text>No products found</Text>
          </View>
        }
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  productItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 4,
    padding: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: 'black',
  },
  selectionBox: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
    elevation: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: COLORS.PRIMARY,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 15,
  },
});

export default ReturnProductScreen;
