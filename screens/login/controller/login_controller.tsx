import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/user_model';

import axios from 'axios';
import {ROUTES} from '../../../routes/routes_name';
import LoginService from '../service/loin_service';
import {Const} from '../../../constants/const_value';

const useLoginController = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onDismissSnackBar = () => setVisible(false);

  const validate = () => {
    const newErrors: {email?: string; password?: string} = {};

    if (!email) {
      newErrors.email =
        Const.languageData?.Email_is_required ?? 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email =
        Const.languageData?.Invalid_email_or_password ??
        'Email address is invalid';
    }

    if (!password) {
      newErrors.password =
        Const.languageData?.Password_is_required ?? 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async (navigation: any) => {
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const language = await Const.getLaunguageAsyncStorage();
      const data = await LoginService.login(email, password, language!);
      console.log('data', data);
      const user = new User(data.data);
      await user.save();
      //console.log('user', data.data.name);
      await Const.saveTokenAsyncStorage(data.data.token);
      await Const.getUserData();
      navigation.replace(ROUTES.DrawerScreen);
    } catch (error: any) {
      //console.log(error);
      const message =
        error.message || 'An unexpected error occurred. Please try again.';

      setSnackbarMessage(message);
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    setVisible,
    errors,
    visible,
    snackbarMessage,
    loading,
    onDismissSnackBar,
    login,
  };
};

export default useLoginController;
