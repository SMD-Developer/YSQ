import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Icon} from 'react-native-paper';
import CustomButton from '../../../components/custom_app_button';
import {COLORS} from '../../../constants/colors';
import { Const } from '../../../constants/const_value';

type PaymentOption = {
  id: string;
  name: string;
};

type Props = {
  paymentOptions: PaymentOption[];
  selectedPayment: string | null;
  onSelectPayment: (id: string) => void;
  onClose: () => void;
};

const PaymentSelection: React.FC<Props> = ({
  paymentOptions,
  selectedPayment,
  onSelectPayment,
  onClose,
}) => {
  const renderPaymentOption = (option: PaymentOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionContainer,
        selectedPayment === option.id && styles.selectedOption,
      ]}
      onPress={() => onSelectPayment(option.id)}>
      <Text
        style={[
          styles.optionText,
          selectedPayment === option.id && styles.selectedOptionText,
        ]}>
        {option.name}
      </Text>
      {selectedPayment === option.id && (
        <Icon source="check" size={20} color="white" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.modalContent}>
      <ScrollView>{paymentOptions.map(renderPaymentOption)}</ScrollView>

      <CustomButton
        onPress={onClose}
        title={Const.languageData?.Close ?? 'Close'}
        buttonStyle={{marginTop: 20}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    marginTop: 'auto',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.8,
    borderRadius: 10,
  },
  selectedOptionText: {
    color: '#fff',
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default PaymentSelection;
