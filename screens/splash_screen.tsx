import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Image} from 'react-native';
import {RootStackParamList, ROUTES} from '../routes/routes_name';
import {Const} from '../constants/const_value';
import LoginService from './login/service/loin_service';
import User from './login/models/user_model';

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.SPLASH
>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}
const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  React.useEffect(() => {
    setTimeout(async () => {
      var token = await Const.getTokenAsyncStorage();

      var language = await Const.getLaunguageAsyncStorage();
      if (language != null) {
        LoginService.updateLanguage(language);
      }
      if (token == null) {
        //console.log('country', country);
        //console.log('language', language);
        if (language == null) {
          navigation.replace(ROUTES.Language, {isBack: false});
          return;
        }
        // else if (country == null) {
        //   navigation.replace(ROUTES.Country);
        //   return;
        // }
        else {
          navigation.replace(ROUTES.Login);
          return;
        }
      } else {
        await LoginService.getUserData();
        await Const.getUserData();
        navigation.replace(ROUTES.DrawerScreen);
        return;
      }
    }, 2000);
  }, [navigation]);
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/logo.jpeg')}
        style={{height: 70, width: 150, resizeMode: 'contain'}}
      />
    </View>
  );
};

export default SplashScreen;
