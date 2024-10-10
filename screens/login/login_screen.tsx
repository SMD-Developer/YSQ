/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import CustomTextField from '../../components/custom_text_field';
import CustomButton from '../../components/custom_app_button';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {StackNavigationProp} from '@react-navigation/stack';
import useLoginController from './controller/login_controller';
import {Snackbar} from 'react-native-paper';
import CustomSnackbar from '../../components/custom_snackbar';
import {Const} from '../../constants/const_value';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.Login
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const handleForgotPassword = () => {
    setModalVisible(true);
  };
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    visible,
    snackbarMessage,
    loading,
    onDismissSnackBar,
    login,
  } = useLoginController();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.jpeg')} style={styles.logo} />

      <CustomTextField
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        placeholder={Const.languageData?.Email ?? 'Email'}
        keyboardType="email-address"
      />

      <CustomTextField
        value={password}
        onChangeText={setPassword}
        placeholder={Const.languageData?.Password ?? 'Password'}
        error={errors.password}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>
          {Const.languageData?.Forgot_Password ?? 'Forgot Password?'}
        </Text>
      </TouchableOpacity>

      <CustomButton
        title={Const.languageData?.Login ?? 'Login'}
        onPress={() => login(navigation)}
        loading={loading}
      />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
              width: '80%',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 20,
                color: 'black',
              }}>
              Forgot Password
            </Text>
            <Text style={{color: 'black'}}>
              Please contact your assigned supervisor to reset your password.
            </Text>
            <CustomButton
              title="Close"
              buttonStyle={{marginTop: 20}}
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
      <CustomSnackbar
        visible={visible}
        message={snackbarMessage}
        onDismiss={onDismissSnackBar}
        actionLabel={Const.languageData?.Cancel ?? 'Cancel'}
        onActionPress={onDismissSnackBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
  forgotPasswordText: {
    marginBottom: 15,
    color: '#808080',
    textAlign: 'right',
  },
});

export default LoginScreen;
