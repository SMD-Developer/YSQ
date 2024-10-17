// screens/DeliveryScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import CustomButton from '../../../components/custom_app_button';

import {ROUTES} from '../../../routes/routes_name';
import {COLORS} from '../../../constants/colors';
import Stepper from './stepper';
import PaymentAndDeliveryScreen from './payment_Selection_screen';
import GiftSelectionScreen from './gift_selection_scree';
import {useDeliveryController} from '../controller/delivery_controller';
import CustomSnackbar from '../../../components/custom_snackbar';
import User from '../../login/models/user_model';
import {format} from 'date-fns';
import {ScrollView} from 'react-native-gesture-handler';
import {usePosContext} from '../pos_screen';
import {Const} from '../../../constants/const_value';

const GiftScreen: React.FC<any> = ({navigation, route}) => {
  const {foundOutlet} = usePosContext();
  useEffect(() => {
    setStep(1);
    setQuantities({});
    setPhotoUri('');
    setComments('');
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
  const [comments, setComments] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const {
    giftLoading,
    submitGift,
    showSnackBar,
    setShowSnackBar,
    errorMessage,
    setError,
    setGiftLoading,
    gifts,
  } = useDeliveryController(3);

  return (
    <ScrollView style={styles.container}>
      <CustomSnackbar
        visible={showSnackBar}
        message={errorMessage!}
        onDismiss={() => setShowSnackBar(false)}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={() => setShowSnackBar(false)}
      />
      <Stepper
        currentStep={step}
        onStepChange={setStep}
        steps={[
          {label: 'Product Selection', iconName: 'shopping-cart'}, // Example icon/ Example icon
          {label: 'Payment & Delivery', iconName: 'payment'}, // Example icon
        ]}
      />
      <View style={styles.content}>
        {step === 1 && (
          <GiftSelectionScreen
            quantities={quantities}
            handleQuantityChange={handleQuantityChange}
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
          loading={giftLoading}
          title={
            step === 2
              ? Const.languageData?.Finish ?? 'Finish'
              : Const.languageData?.Next ?? 'Next'
          }
          onPress={async () => {
            setGiftLoading(true);
            for (const key in quantities) {
              if (quantities[key] === 0) {
                delete quantities[key];
              }
            }
            var productWithQuantity = gifts.map(product => {
              product.quantity = quantities[product.id];
              return product;
            });
            var productWithQuantity = productWithQuantity.filter(
              product => product.quantity > 0,
            );
            if (step === 2) {
              if (photoUri === null || photoUri === '') {
                setError('Please select product photo');
                setShowSnackBar(true);
                setGiftLoading(false);
                return;
              }
              const currentDate = new Date();
              const formattedDate = format(currentDate, 'dd-MM-yyyy hh:mm:ss');
              //console.log(formattedDate);
              var user = await User.getUser();

              var response = await submitGift({
                sales_man_id: user?.id,
                outlet_id: foundOutlet?.id,
                gift_id: Object.keys(quantities)[0],
                quantity: Object.values(quantities)[0],
                dscription: comments,
                location: "",
                uploaded_date: formattedDate,
                image: photoUri,
              });

              if (response) {
                //console.log('response:',  {
                //   outletName: selectedOutlet.name,
                //   date: currentDate,
                //   products: productWithQuantity.map(product => {
                //     return {
                //       name: product.title,
                //       quantity: product.quantity,
                //       image: product.image,
                //     };
                //   }),
                // });
                navigation.navigate(ROUTES.ReturnSuccessScreen, {
                  screenType: 3,
                  data: {
                    outletName: foundOutlet!.name,
                    date: formattedDate,
                    paymentType: '',
                    promotion: '',
                    outletId:foundOutlet?.id,
                    products: productWithQuantity.map(product => {
                      return {
                        name: product.title,
                        quantity: product.quantity.toString(),
                        image: product.image,
                      };
                    }),
                  },
                });
                setQuantities({});
                setPhotoUri('');
                setComments('');
                setStep(1);
              }
              return;
            } else {
          
              if (productWithQuantity.length === 0) {
                setError(
                  Const.languageData?.Please_select_atleast_one_gift ??
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
    flex: 1,
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

export default GiftScreen;
