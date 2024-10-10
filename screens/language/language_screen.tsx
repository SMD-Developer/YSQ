import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  Text,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {COLORS} from '../../constants/colors';
import AppBar from '../../components/custom_app_bar';
import ListItem from './components/list_item';
import CustomButton from '../../components/custom_app_button';
import {useLanguageController} from './controller/language_controller';
import {Const} from '../../constants/const_value';
import LoginService from '../login/service/loin_service';
import {CommonActions, RouteProp} from '@react-navigation/native';
import {delay} from 'lodash';

type LanguageScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.Language
>;

type LanguageScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.Language
>;

interface LanguageScreenProps {
  navigation: LanguageScreenNavigationProp;
  route: LanguageScreenRouteProp;
}

const LanguageScreen: React.FC<LanguageScreenProps> = ({navigation, route}) => {
  const {
    languages,
    loading,
    error,
    selectedId,
    selectLanguage,
    selectionChanged,
    setSlectionChanged,
  } = useLanguageController(route.params.isBack === true);
  const [updating, setUpdating] = useState(false); // New state for updating status

  const renderItem = ({item}: {item: (typeof languages)[0]}) => {
    return (
      <ListItem
        image={
          item.image ? {uri: item.image} : require('../../assets/chair.png')
        }
        title={item.name}
        isSelected={selectedId === item.iso_code.toString()}
        onPress={async () => {
          selectLanguage(item.iso_code.toString());
          //console.log('selectedId', selectedId);
          await Const.saveLaunguageAsyncStorage(item.iso_code.toString());
          // var country = await Const.getCountryAsyncStorage();
          await LoginService.updateLanguage(item.iso_code.toString()!);
          // setTimeout(() => {
          //   selectLanguage(item.iso_code.toString());
          //   //console.log('selectedId', selectedId);
          // }, 3000); //
          setSlectionChanged(true);
          setUpdating(!updating);
          // setTimeout(() => {
          //   setUpdating(!updating); // Set updating to false after the update
          // }, 1000);
        }}
      />
    );
  };
  return (
    <View style={styles.safeArea}>
      <View style={styles.mainScreen}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <AppBar
          title={
            route.params.isBack === true
              ? Const.languageData?.Change_language ?? 'Change Language'
              : Const.languageData?.Choose_language ?? 'Choose Language'
          }
          onBackPress={() => {
            if (selectionChanged) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0, // The index of the route to make active
                  routes: [{name: ROUTES.DrawerScreen}], // Array of routes to reset to, with the desired screen
                }),
              );
              return;
            } else {
              navigation.goBack();
            }
          }}
          showBackButton={route.params.isBack === true ? true : false}
        />
        <View style={styles.whiteContainer}>
          <View style={{flex: 1}}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={COLORS.PRIMARY}
                style={{marginTop: 250}}
              />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <FlatList
                style={styles.FlatList}
                data={languages}
                renderItem={renderItem}
                ListEmptyComponent={
                  <Text style={{color:"black"}}> {'No Language found'}</Text>
                }
                keyExtractor={item => item.id.toString()}
              />
            )}
          </View>
          <CustomButton
            onPress={async () => {
              if (!selectedId) {
                return;
              }

              // Save language and navigate to next screen
              Const.saveLaunguageAsyncStorage(selectedId!);
              // var country = await Const.getCountryAsyncStorage();
              await LoginService.updateLanguage(selectedId!);
              // if (country == null) {
              //   navigation.replace(ROUTES.Country);
              // } else {
              if (route.params.isBack === true) {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0, // The index of the route to make active
                    routes: [{name: ROUTES.DrawerScreen}], // Array of routes to reset to, with the desired screen
                  }),
                );
                return;
              }
              navigation.replace(ROUTES.Login);
              // }
            }}
            title={
              route.params.isBack === true
                ? Const.languageData?.Save ?? 'Save'
                : Const.languageData?.Next ?? 'Next'
            }
          />
        </View>
      </View>
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainScreen: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
  },
  whiteContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: COLORS.WHITE,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  FlatList: {
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
