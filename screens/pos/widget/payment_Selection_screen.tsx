// PaymentAndDeliveryScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import {COLORS} from '../../../constants/colors';
import CustomTextField from '../../../components/custom_text_field';
import CustomButton from '../../../components/custom_app_button';
import SelectedPaymentDisplay from './payment_display_component';
import {Const} from '../../../constants/const_value';
import PaymentSelection from './payment_selection';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';

interface PaymentAndDeliveryScreenProps {
  photoUri: string;
  setPhotoUri: (uri: string) => void;
  comments: string;
  setComments: (comments: string) => void;
  selectedPayment: string | null;
  setSelectedPayment: (payment: string) => void;
  showPaymentModal: boolean;
}

const PaymentAndDeliveryScreen: React.FC<PaymentAndDeliveryScreenProps> = ({
  photoUri,
  setPhotoUri,
  comments,
  setComments,
  selectedPayment,
  setSelectedPayment,
  showPaymentModal = true,
}) => {
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentOptions] = useState([
    {id: '1', name: Const.languageData?.Cash ?? 'Cash'},
    {id: '2', name: Const.languageData?.Cheque ?? 'Cheque'},
    {id: '5', name: Const.languageData?.Credit_limit ?? 'Credit Limit'},
  ]);

  const pickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', // Can be 'photo' or 'video'
      quality: 0.3,
      selectionLimit: 1,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        //console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        //console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setPhotoUri(response.assets![0].uri!);
      }
    });
  };

  return (
    <View style={styles.container}>
      {showPaymentModal && (
        <Text style={styles.heading}>
          {Const.languageData?.Payment_Method ?? 'Payment Method'}
        </Text>
      )}
      {/* {showPaymentModal && (
        <View style={styles.header}>
          <Text style={styles.heading}>
            {Const.languageData?.Payment ?? 'Payment'}
          </Text>
        </View>
      )} */}
      {showPaymentModal && (
        <TouchableOpacity onPress={() => setPaymentModalVisible(true)}>
          <SelectedPaymentDisplay
            selectedPayment={selectedPayment}
            paymentOptions={paymentOptions}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.heading}>
        {Const.languageData?.Items_Photo ?? 'Items photo'}
      </Text>
      <CustomButton
        title={Const.languageData?.Upload_photo ?? 'Upload Photo'}
        onPress={pickImage}
        makeBorderButton={true}
        textStyle={{color: 'grey'}}
        buttonStyle={{marginBottom: 20}}
      />
      {photoUri ? (
        <Image source={{uri: photoUri}} style={styles.previewImage} />
      ) : null}
      <CustomTextField
        onChangeText={setComments}
        label={Const.languageData?.Comments ?? 'Comments'}
        value={comments}
        placeholder={Const.languageData?.Add_comments ?? 'Add comments'}
      />

      <Modal
        visible={paymentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}>
        <PaymentSelection
          paymentOptions={paymentOptions}
          selectedPayment={selectedPayment}
          onSelectPayment={setSelectedPayment}
          onClose={() => setPaymentModalVisible(false)}
        />
      </Modal>
      <View style={{marginTop: 20}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  uploadButton: {
    backgroundColor: 'grey',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginVertical: 15,
    borderRadius: 8,
  },
  commentsInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    marginBottom: 15,
  },
  deliverButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliverButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    backgroundColor: '#e0e0e0',
    padding: 5,
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PaymentAndDeliveryScreen;
