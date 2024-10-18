import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import CustomButton from '../../components/custom_app_button';
import {COLORS} from '../../constants/colors';
import {Const} from '../../constants/const_value';

interface ConfirmationModalProps {
  isVisible: boolean;
  message:string|null;
  ok:string|null;
  cancel:string|null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onConfirm,
message,
ok,cancel,
  onCancel,
}) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.modalContent}>
        <Text style={styles.heading}>
          {Const.languageData?.Confirmation ?? 'Confirmation'}
        </Text>
        <Text style={styles.title}>
          {message??(Const.languageData?.Want_to_start_trip ??
            'Do you want to start the trip?')}
        </Text>
        <View style={styles.buttonContainer}>
          <CustomButton
            title={cancel??(Const.languageData?.Cancel ?? 'Cancel')}
            onPress={onCancel}
            makeBorderButton
            buttonStyle={{width: '48%'}}
            textStyle={{color: COLORS.PRIMARY}}
          />
          <CustomButton
            title={ok??(Const.languageData?.Start ?? 'Start')}
            onPress={onConfirm}
            buttonStyle={{width: '48%'}}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: COLORS.PRIMARY,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ConfirmationModal;
