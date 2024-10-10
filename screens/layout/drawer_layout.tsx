/* eslint-disable react-native/no-inline-styles */
import {createDrawerNavigator} from '@react-navigation/drawer';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {Icon} from 'react-native-paper';
import HomeScreen from '../home/home_screen';
import {Const} from '../../constants/const_value';
import User from '../login/models/user_model';
import {CommonActions, RouteProp} from '@react-navigation/native';
import LayoutScreen from './layout_screen';
import {COLORS} from '../../constants/colors';

type DrawerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.DrawerScreen
>;
type DrawerScreenRouteProp = RouteProp<
  RootStackParamList,
  typeof ROUTES.DrawerScreen
>;

interface DrawerScreenProps {
  navigation: DrawerScreenNavigationProp;
  route: DrawerScreenRouteProp;
}
const Drawer = createDrawerNavigator();
const DrawerNavigator: React.FC<DrawerScreenProps> = ({route}) => {
  const params = route.params;
  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen
        name="DashBoard"
        component={LayoutScreen}
        initialParams={params}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
const DrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getUser();
  });
  const getUser = async () => {
    var use = await User.getUser();
    setUser(use);
  };
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          {(user?.imageUrl.trim() ?? '') === '' ? (
            <Image
              source={require('../../assets/dummy_user.png')}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={{
                uri: user?.imageUrl ?? 'https://via.placeholder.com/150',
              }}
              style={styles.profileImage}
            />
          )}
        </View>
        <Text style={styles.userName}>{user?.fullName ?? ''}</Text>
        <Text style={styles.userType}>
          {Const.languageData?.Salesman_ID} {user?.unique_code}
        </Text>
        <Text style={styles.userType}>{user?.email ?? ''}</Text>

        <View style={styles.drawerItemsContainer}>
          <DrawerItem
            label={Const.languageData?.Dashboard ?? 'Dashboard'}
            icon="view-dashboard"
            setColor={COLORS.PRIMARY}
            titleColor="white"
            onPress={() => {}}
          />
          <DrawerItem
            label={Const.languageData?.Products ?? 'Products'}
            icon="package"
            onPress={() => props.navigation.navigate(ROUTES.ProductListScreen)}
          />

          <DrawerItem
            label={Const.languageData?.Customers ?? 'Customers'}
            icon="store"
            onPress={() => props.navigation.navigate(ROUTES.OutletScreen)}
          />
          <DrawerItem
            label={Const.languageData?.Sales ?? 'Sales'}
            icon="cash"
            onPress={() =>
              props.navigation.navigate(ROUTES.SaleHistoryScreen, {
                screenType: 1,
              })
            }
          />
          <DrawerItem
            label={Const.languageData?.Returns ?? 'Returns'}
            icon="undo"
            onPress={() =>
              props.navigation.navigate(ROUTES.SaleHistoryScreen, {
                screenType: 2,
              })
            }
          />
          <DrawerItem
            label={Const.languageData?.Gifts ?? 'Gifts'}
            icon="gift"
            onPress={() =>
              props.navigation.navigate(ROUTES.GiftHistoryScreen, {
                screenType: 3,
              })
            }
          />

          <DrawerItem
            label={Const.languageData?.Cash_History ?? 'Cash History'}
            icon="account-cash"
            onPress={() => {
              props.navigation.navigate(ROUTES.OpeningCash, {screenType: 0});
            }}
          />
          <DrawerItem
            label={Const.languageData?.Mileage_History ?? 'Mileage History'}
            icon="history"
            onPress={() => {
              props.navigation.navigate(ROUTES.AllRecord);
            }}
          />
          <DrawerItem
            label={Const.languageData?.Profile ?? 'Profile'}
            icon="account"
            onPress={() => props.navigation.navigate('Profile')}
          />
          <DrawerItem
            label={Const.languageData?.Change_language ?? 'Change Languge'}
            icon="translate"
            onPress={() =>
              props.navigation.navigate(ROUTES.Language, {isBack: true})
            }
          />
          <DrawerItem
            label={Const.languageData?.Logout ?? 'Logout'}
            icon="logout"
            onPress={() => {
              Const.clearToken();
              User.clear();
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: ROUTES.Login}],
                }),
              );
            }}
          />

          <Text
            style={{
              color: 'black',
              marginTop: 30,
              textAlign: 'center',
              marginBottom: 30,
            }}>
            V(0.0.1)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const DrawerItem: React.FC<{
  label: string;
  icon: string;
  setColor?: string;
  onPress: () => void;
  titleColor?: string;
}> = ({label, icon, setColor = '#80FF0000', onPress, titleColor}) => (
  <TouchableOpacity
    style={[styles.drawerItem, {backgroundColor: setColor}]}
    onPress={onPress}>
    <Icon source={icon} size={24} color={titleColor ?? 'grey'} />
    <Text style={[styles.drawerLabel, {color: titleColor ?? 'grey'}]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  profileContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular image
    borderWidth: 4,
    borderColor: 'grey',
  },
  userName: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userType: {
    marginTop: 5,
    fontSize: 14,
    color: 'grey',
    fontWeight: '300', // "thin" is not a valid weight, "300" is more common
    textAlign: 'center',
  },
  drawerItemsContainer: {
    marginTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  drawerLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: 'grey',
  },
});
