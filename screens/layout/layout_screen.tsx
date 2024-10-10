/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedbackBase,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-paper';
import {COLORS} from '../../constants/colors';
import RecordScreen from '../record/record_screen';
import RouteScreen from '../route/route_screen';
import PosScreen from '../pos/pos_screen';
import SalesScreen from '../sales/sale_screen';
import DrawerNavigator from './drawer_layout';
import {CurvedBottomBar} from 'react-native-curved-bottom-bar';
import {ROUTES} from '../../routes/routes_name';
import HomeScreen from '../home/home_screen';
import {Const} from '../../constants/const_value';

interface LayoutScreenProps {
  route: {
    params?: {
      initialRoute?: string;
      outletId?: string;
    };
  };
}
const Tab = createBottomTabNavigator();
const LayoutScreen: React.FC<LayoutScreenProps> = ({route}) => {
  const initialScreen = route.params?.initialRoute ?? 'Home';
  const outletId = route.params?.outletId ?? '';
  const _renderIcon = (routeName: any, selectedTab: any) => {
    let iconName: string = '';
    let name: string = '';

    if (routeName === 'Home') {
      iconName = 'home-outline';
      name = Const.languageData?.Home ?? 'Home';
    } else if (routeName === 'Routes') {
      iconName = 'directions';
      name = Const.languageData?.Trips ?? 'Trips';
    } else if (routeName === 'Pos') {
      iconName = 'note-text-outline';
      name = Const.languageData?.POS ?? 'Pos';
    } else if (routeName === 'Record') {
      iconName = 'book-edit-outline';
      name = Const.languageData?.Record ?? 'Record';
    } else if (routeName === 'Sales') {
      iconName = 'note-multiple-outline';
      name = Const.languageData?.Sales ?? 'Sales';
    }

    return (
      <View
        style={{
          alignContent: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        <Icon
          source={iconName}
          size={25}
          color={routeName === selectedTab ? COLORS.PRIMARY : 'gray'}
        />
        <Text
          style={{
            color: routeName === selectedTab ? COLORS.PRIMARY : 'gray',
          }}>
          {name}
        </Text>
      </View>
    );
  };
  type RenderTabBarParams = {
    routeName: string;
    selectedTab: string;
    navigate: (selectedTab: string) => void;
  };
  const renderTabBar = (params: RenderTabBarParams) => {
    
    return (
      <TouchableOpacity
        onPress={() => params.navigate(params.routeName)}
        style={styles.tabbarItem}>
        {_renderIcon(params.routeName, params.selectedTab)}
      </TouchableOpacity>
    );
  };
  //console.log('initialScreen', outletId);
  return (
    <CurvedBottomBar.Navigator
    
      type="DOWN"
      height={55}
      circleWidth={50}
      style={styles.shawdow}
      shadowStyle={styles.shawdow}
      bgColor="white"
    
      initialRouteName={initialScreen}
      screenOptions={{
        headerShown: false,
      }}
      renderCircle={({selectedTab, navigate, routeName}) => (
        <Animated.View style={styles.btnCircleUp}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigate(routeName)}>
            <View>
              <Icon
                source={'note-text'}
                color={routeName === selectedTab ? 'white' : 'white'}
                size={25}
              />
              {/* <Text
          style={{
            color: routeName === selectedTab ? "black" : 'white',
          }}>
          Pos
        </Text> */}
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
      tabBar={renderTabBar}>
      <CurvedBottomBar.Screen
        name="Home"
        position="LEFT"
        component={HomeScreen}
      />
      <CurvedBottomBar.Screen
        name="Routes"
        position="LEFT"
        component={RouteScreen}
      />
      <CurvedBottomBar.Screen
      
        name="Pos"
        position="CIRCLE"

        component={PosScreen}
        options={{
          unmountOnBlur: true, // This ensures the component is unmounted when the tab loses focus
        }}
        initialParams={{outletId: outletId}}
      />
      <CurvedBottomBar.Screen
        name="Record"
        position="RIGHT"
        component={RecordScreen}
      />
      <CurvedBottomBar.Screen
        name="Sales"
        position="RIGHT"
        component={SalesScreen}
      />
    </CurvedBottomBar.Navigator>
  );
};

export default LayoutScreen;
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  shawdow: {
    elevation: 0,
    borderColor: 'black',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomBar: {},
  btnCircleUp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY,
    bottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
  },
  imgCircle: {
    width: 30,
    height: 30,
    tintColor: 'gray',
  },
  tabbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
  screen1: {
    flex: 1,
    backgroundColor: '#BFEFFF',
  },
  screen2: {
    flex: 1,
    backgroundColor: '#FFEBCD',
  },
});
