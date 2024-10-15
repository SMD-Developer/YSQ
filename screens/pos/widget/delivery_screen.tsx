import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {COLORS} from '../../../constants/colors';
import ApplyCouponScreen from './apply_cupon_screen';
import PaymentAndDeliveryScreen from './payment_Selection_screen';
import ProductSelectionScreen from './product_selection_screen';
import Stepper from './stepper';
import CustomButton from '../../../components/custom_app_button';

import {Promotion} from '../../home/models/promotion_model';
import {useDeliveryController} from '../controller/delivery_controller';
import {ScrollView} from 'react-native-gesture-handler';
import {Product} from '../model/product_model';
import User from '../../login/models/user_model';
import CustomSnackbar from '../../../components/custom_snackbar';
import {format} from 'date-fns';
import {ROUTES} from '../../../routes/routes_name';
import {Const} from '../../../constants/const_value';
import {usePosContext} from '../pos_screen';
import RNFS from 'react-native-fs';

const DeliveryScreen: React.FC<any> = ({navigation}) => {
  const {foundOutlet} = usePosContext();
  useEffect(() => {
    setStep(1);
    setQuantities({});
    setPhotoUri('');
    setComments('');
    setSelectedCoupon(null);
    setSelectedPayment(null);
  }, [foundOutlet]);

  const [step, setStep] = useState(1); // Step 1: Product Selection, Step 2: Apply Coupon, Step 3: Payment & Delivery
  const [quantities, setQuantities] = React.useState<Record<string, number>>(
    {},
  );
  const handleQuantityChange = (
    productId: number,
    increment: boolean,
    quantity?: number,
  ) => {
    console.log('productId', productId);
    console.log('quantity', quantity);

    if (quantity !== undefined) {
      if (isNaN(quantity)) {
        setQuantities(prevQuantities => {
          const newQuantity = 0;
          return {...prevQuantities, [productId]: newQuantity};
        });
        return;
      }

      setQuantities(prevQuantities => {
        const newQuantity = quantity;
        return {...prevQuantities, [productId]: newQuantity};
      });
      return;
    }
    //console.log('quantities', quantities);
    setQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[productId] || 0;
      //console.log('currentQuantity', currentQuantity);
      const newQuantity = increment
        ? currentQuantity + 1
        : Math.max(currentQuantity - 1, 0);
      if (newQuantity === 0) {
        delete prevQuantities[productId];
        //console.log('prevQuantities', prevQuantities);
        return {...prevQuantities};
      }
      return {...prevQuantities, [productId]: newQuantity};
    });
  };
  const {
    createSale,
    salesLoading,
    setSalesLoading,
    showSnackBar,
    setShowSnackBar,
    errorMessage,
    products,
    setError,
  } = useDeliveryController(1);

  const [selectedCoupon, setSelectedCoupon] = useState<Promotion | null>(null);

  const handleCouponSelect = (coupon: Promotion | null) => {
    //console.log('coupon', coupon);
    setSelectedCoupon(coupon);
  };

  const [photoUri, setPhotoUri] = useState('');
  const [comments, setComments] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const calculateTotal = (): number => {
    if (updateProductQuantities().length === 0) {
      return 0;
    }
    var sum = updateProductQuantities().reduce((total, product) => {
      return total + product.product_price * product.quantity;
    }, 0);
    var total = sum - (selectedCoupon?.attributes.discount ?? 0);
    return total; // 0 is the initial value for the total sum
  };
  const updateProductQuantities = (): Product[] => {
    var selectedProducts = Object.keys(quantities);
    //console.log('selectedProducts', selectedProducts);
    return products
      .filter(product =>
        selectedProducts.some(q => q === product.main_product_id.toString()),
      ) // Get products that exist in quantities
      .map(product => {
        const matchingQuantity = selectedProducts.find(
          q => q === product.main_product_id.toString(),
        );
        return {
          ...product,
          quantity: quantities[matchingQuantity ?? ''], // Set the quantity if found
        };
      });
  };
  const [paymentOptions] = useState([
    {id: '1', name: Const.languageData?.Cash ?? 'Cash'},
    {id: '2', name: Const.languageData?.Cheque ?? 'Cheque'},
  ]);

  return (
    <ScrollView style={styles.container}>
      <Stepper
        currentStep={step}
        onStepChange={setStep}
        steps={[
          {label: 'Product Selection', iconName: 'shopping-cart'}, // Example icon
          {label: 'Apply Coupon', iconName: 'local-offer'}, // Example icon
          {label: 'Payment & Delivery', iconName: 'payment'}, // Example icon
        ]}
      />
      <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      />
      <View style={styles.content}>
        {step === 1 && (
          <ProductSelectionScreen
            quantities={quantities}
            handleQuantityChange={handleQuantityChange}
          />
        )}
        {step === 2 && (
          <ApplyCouponScreen
            total={calculateTotal()}
            products={updateProductQuantities()}
            selectCoupon={selectedCoupon}
            onCouponSelect={handleCouponSelect}
          />
        )}
        {step === 3 && (
          <PaymentAndDeliveryScreen
            showPaymentModal={true}
            comments={comments}
            setComments={setComments}
            photoUri={photoUri}
            setPhotoUri={setPhotoUri}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: step === 1 ? 'center' : 'space-between',
          marginBottom: 30,
        }}>
        {step === 1 ? (
          <View />
        ) : (
          <CustomButton
            title={Const.languageData?.Back ?? 'Back'}
            buttonStyle={{width: '48%'}}
            textStyle={{color: COLORS.PRIMARY}}
            makeBorderButton={true}
            onPress={() => {
              if (step === 2) {
                setSelectedCoupon(null);
              }
              setStep(step - 1);
            }}
          />
        )}
        <CustomButton
          loading={salesLoading}
          title={
            step === 3
              ? Const.languageData?.Finish ?? 'Finish'
              : Const.languageData?.Next ?? 'Next'
          }
          onPress={async () => {
            //console.log('selectedOutlet', selectedOutlet);
            for (const key in quantities) {
              if (quantities[key] === 0) {
                delete quantities[key];
              }
            }
            if (step === 3) {
              setSalesLoading(true);
              var productWithQuantity = products.map(product => {
                product.quantity = quantities[product.main_product_id];
                return product;
              });
              var productWithQuantity = productWithQuantity.filter(
                product => product.quantity > 0,
              );
              if (productWithQuantity.length === 0) {
                setError(
                  Const.languageData?.Please_select_atleast_one_product ??
                    'Please select at least one product',
                );
                setSalesLoading(false);
                setShowSnackBar(true);
                return;
              } else if (selectedPayment === null) {
                setError(
                  Const.languageData?.Please_select_payment_method ??
                    'Please select payment method',
                );
                setShowSnackBar(true);
                setSalesLoading(false);
                return;
              } else if (photoUri === null || photoUri === '') {
                setError(
                  Const.languageData?.Please_upload_product_photo ??
                    'Please select product photo',
                );
                setShowSnackBar(true);
                setSalesLoading(false);
                return;
              }
              const currentDate = new Date();
              const formattedDate = format(currentDate, 'yyyy-MM-dd');
              //console.log('formattedDate', formattedDate);
              const imageBase = await RNFS.readFile(photoUri, 'base64');
              var user = await User.getUser();
              var response = await createSale({
                date: formattedDate,
                is_sale_created: 'true',
                image: `data:image/jpeg;base64,${imageBase}`,
                customer_id: `${foundOutlet?.id}`,
                salesman_id: user?.id,
                warehouse_id: products[0]?.stock?.warehouse_id??1,
                discount: selectedCoupon?.attributes.discount ?? 0,
                tax_rate: '0.00',
                tax_amount: '0.00',
                sale_items: productWithQuantity.map(product => {
                  return {
                    name: product.name,
                    code: product.code,
                    stock:0,
                    short_name: product.code,
                    product_unit: product.purchase_unit,
                    product_id: product.main_product_id,
                    product_price: product.product_price,
                    net_unit_price: product.product_price,
                    fix_net_unit: product.sale_unit,
                    tax_type: '0',
                    tax_value: 1,
                    tax_amount: 0,
                    discount_type: '0',
                    discount_value: 0,
                    discount_amount: 0,
                    sale_unit: product.sale_unit,
                    quantity: product.quantity,
                    sub_total: product.quantity * product.product_price,
                    id: product.id,
                    sale_item_id: product.sale_unit_name.id,
                    sale_return_item_id: null,
                    adjustMethod: 1,
                    adjustment_item_id: null,
                    quotation_item_id: null,
                    quantity_limit: null,
                  };
                }),

                shipping: '0.00',
                grand_total: calculateTotal(),
                received_amount: 0,
                paid_amount: 0,
                note: comments,
                status: 1,
                payment_status: 1,
                payment_type: selectedPayment ?? '1',
              });
              if (response) {
                navigation.navigate(ROUTES.ReturnSuccessScreen, {
                  screenType: 1,
                  data: {
                    outletName: foundOutlet?.name,
                    date: formattedDate,
                    paymentType:
                      selectedPayment === null
                        ? '-'
                        : paymentOptions.filter(
                            option => option.id === selectedPayment,
                          )[0].name,
                    promotion: selectedCoupon?.attributes.code ?? '-',
                    products: productWithQuantity.map(product => {
                      return {
                        name: product.name,
                        quantity: product.quantity,
                        image: product.images[0],
                      };
                    }),
                  },
                });
                setQuantities({});
                setPhotoUri('');
                setComments('');
                setSelectedCoupon(null);
                setSelectedPayment(null);
                setStep(1);
              }
              return;
            } else {
              var length = Object.values(quantities).filter(
                quantity => quantity > 0,
              );
              if (length.length === 0) {
                setError(
                  Const.languageData?.Please_select_atleast_one_product ??
                    'Please select at least one product',
                );
                setShowSnackBar(true);
                return;
              }

              setStep(step + 1);
            }
          }}
          buttonStyle={{width: '48%'}}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',

    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
  },
  backButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeliveryScreen;
