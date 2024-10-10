import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Const } from '../../../constants/const_value';

type Props = {
  selectedPayment: string | null;
  paymentOptions: {id: string; name: string}[];
};

const SelectedPaymentDisplay: React.FC<Props> = ({
  selectedPayment,
  paymentOptions,
}) => {
  const selectedPaymentOption = paymentOptions.find(
    option => option.id === selectedPayment,
  );

  return (
    <View style={styles.container}>
      {selectedPaymentOption ? (
        <Text style={styles.text}>{selectedPaymentOption.name}</Text>
      ) : (
        <View style={{flexDirection: 'row'}}>
          <MaterialIcons name="payment" size={25} color="grey" />
          <Text style={styles.text}>
            {Const.languageData?.Choose_payment_method ?? 'Choose payment method'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: 'grey',
    marginLeft: 10,
  },
});

export default SelectedPaymentDisplay;
