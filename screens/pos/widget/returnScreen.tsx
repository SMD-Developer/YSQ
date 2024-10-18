// screens/DeliveryScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import CustomButton from '../../../components/custom_app_button';

import {ROUTES} from '../../../routes/routes_name';
import {COLORS} from '../../../constants/colors';
import {format} from 'date-fns';
import CustomSnackbar from '../../../components/custom_snackbar';
import User from '../../login/models/user_model';
import {useDeliveryController} from '../controller/delivery_controller';
import PaymentAndDeliveryScreen from './payment_Selection_screen';
import Stepper from './stepper';
import {Sale} from '../model/sales_mode';
import ReturnProductScreen from './return_product_screen';
import {ScrollView} from 'react-native-gesture-handler';
import {usePosContext} from '../pos_screen';
import RNFS from 'react-native-fs';
import {Const} from '../../../constants/const_value';
import NetInfo from '@react-native-community/netinfo';

const ReturnScreen: React.FC<any> = ({navigation, route}) => {
  const {foundOutlet} = usePosContext();
  useEffect(() => {
    setStep(1);
    setQuantities({});
    setSelectedSales(null);
    setPhotoUri('');
    setComments('');
    setSelectedPayment(null);
  }, [foundOutlet]);
  //console.log('saifselectedOutlet', selectedOutlet);
  const [step, setStep] = useState(1); // Step 1: Product Selection, Step 2: Apply Coupon, Step 3: Payment & Delivery
  const [quantities, setQuantities] = React.useState<Record<string, number>>(
    {},
  );

  const handleQuantityChange = (
    productId: number,
    increment: boolean,
    quantity?: number,
  ) => {
    //console.log('productId', productId);
    //console.log('quantity', quantity);
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

  const [photoUri, setPhotoUri] = useState('');
  const [selectedSales, setSelectedSales] = useState<Sale | null>(null);
  const [comments, setComments] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const {
    returnLoading,
    createReturnSale,
    showSnackBar,
    setShowSnackBar,
    errorMessage,
    setError,
    setReturnLoading,
  } = useDeliveryController(
    3,
    foundOutlet?.id ?? '0',
    foundOutlet?.chanel_id ?? '0',
  );

  return (
    <ScrollView style={styles.container}>
      {/* <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel={Const.languageData?.Close ?? "Close"}
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      /> */}
      <Stepper
        currentStep={step}
        onStepChange={setStep}
        steps={[
          {label: 'Product Selection', iconName: 'shopping-cart'}, // Example icon/ Example icon
          // {label: 'Product Selection', iconName: 'inventory'}, // Example icon/ Example icon
          {label: 'Payment & Delivery', iconName: 'payment'}, // Example icon
        ]}
      />
      <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel="Close"
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      />
      <View style={styles.content}>
        {step === 1 && (
          <ReturnProductScreen
            setSelectedSales={setSelectedSales}
            handleQuantityChange={handleQuantityChange}
            quantities={quantities}
            selectedSales={selectedSales}
            outletId={foundOutlet?.id ?? 0}
            channelID={foundOutlet?.channel ?? 0}
            setQuantities={setQuantities}
          />
        )}

        {step === 2 && (
          <PaymentAndDeliveryScreen
            showPaymentModal={false}
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
            onPress={() => setStep(step - 1)}
          />
        )}
        <CustomButton
          loading={returnLoading}
          title={
            step === 2
              ? Const.languageData?.Finish ?? 'Finish'
              : Const.languageData?.Next ?? 'Next'
          }
          onPress={async () => {
            for (const key in quantities) {
              if (quantities[key] === 0) {
                delete quantities[key];
              }
            }
            var productWithQuantity = selectedSales?.attributes.sale_items.map(
              product => {
                product.quantity =
                  quantities[product.product_id[0].main_product_id] || 0;
                return product;
              },
            );
            var finalProducts =
              productWithQuantity?.filter(product => product.quantity > 0) ??
              [];

            if (step === 2) {
              setReturnLoading(true);
              const currentDate = new Date();
              const formattedDate = format(currentDate, 'dd-MM-yyyy hh:mm:ss');
              var user = await User.getUser();


   
              let loaction: any;
              try {
                const networkState = await NetInfo.fetch();

                if (networkState.isConnected) {
                  loaction = await Const.getCurrentLocationName();
                } else {
                  loaction = 'offline';
                }
                console.log(loaction);
              } catch (e) {}
              const imageBase = await RNFS.readFile(photoUri, 'base64');
              var response = await createReturnSale({
                date: currentDate,
                image: `data:image/jpeg;base64,${imageBase}`,
                customer_id: foundOutlet?.id,
                location: loaction,
                salesman_id: user?.id,
                warehouse_id: selectedSales?.attributes.warehouse_id,
                discount: 0,
                tax_rate: 0,
                tax_amount: 0,
                shipping: 0,
                grand_total: 2000,
                received_amount: 0,
                payment_type: 0,
                paid_amount: 0,
                status: 1,
                note: comments,
                sale_id: selectedSales?.id,
                sale_reference: selectedSales?.attributes.reference_code,
                sale_return_items: finalProducts.map(product => {
                  return {
                    code: product.product_id[0].code,
                    name: product.product_id[0].name,
                    product_unit: product.product_id[0].product_unit,
                    product_id: product.product_id[0].main_product_id,
                    short_name: product.product_id[0].brand_name,
                    stock_alert: product.product_id[0].stock_alert,
                    product_price: product.product_price,
                    fix_net_unit: 0,
                    net_unit_price: 0,
                    tax_type: 2,
                    tax_value: 1,
                    tax_amount: 0,
                    discount_type: 2,
                    discount_value: 0,
                    discount_amount: 0,
                    isEdit: true,
                    stock: '',
                    sold_quantity: 100,
                    sub_total: 0,
                    sale_unit: product.product_id[0].sale_unit,
                    quantity: product.quantity,
                    id: selectedSales?.attributes.sale_items[0].id,
                    sale_item_id: selectedSales?.attributes.sale_items[0].id,
                    newItem: '',
                    isSaleReturn: true,
                  };
                }),
              });

              if (response) {
                navigation.navigate(ROUTES.ReturnSuccessScreen, {
                  screenType: 2,
                  data: {
                    outletName: foundOutlet!.name,
                    date: formattedDate,
                    outletId:foundOutlet?.id,
                    paymentType: selectedPayment,
                    promotion: '',
                    products: productWithQuantity!.map(product => {
                      return {
                        name: product.product_id[0].name,
                        quantity: product.quantity,
                        image: product.product_id[0].images.imageUrls[0],
                      };
                    }),
                  },
                });
                setQuantities({});
                setPhotoUri('');
                setComments('');
                setStep(1);
                setSelectedSales(null);
              }
              return;
            } else {
              if (step === 1) {
                if (selectedSales === null) {
                  setError(
                    Const.languageData?.Please_select_any_order_id ??
                      'Please select any order id',
                  );
                  setShowSnackBar(true);
                  return;
                }
                if (finalProducts.length === 0) {
                  setError(
                    Const.languageData?.Please_select_atleast_one_product ??
                      'Please select at least one product to return',
                  );
                  setShowSnackBar(true);
                  return;
                }
                setStep(step + 1);
              }
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
    flex: 1,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
  content: {
    flexGrow: 1,
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

export default ReturnScreen;
