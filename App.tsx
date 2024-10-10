import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './screens/splash_screen';
import LanguageScreen from './screens/language/language_screen';

import CountryScreen from './screens/country/countryscreen';
import LoginScreen from './screens/login/login_screen';
import ProfileScreen from './screens/profile/profile_screen';
import LayoutScreen from './screens/layout/layout_screen';
import HomeScreen from './screens/home/home_screen';
import TodaysCashScreen from './screens/home/opnening_cash_screen';
import RecordScreen from './screens/record/record_screen';
import RecordFormScreen from './screens/record/record_form_screen';
import MapScreen from './screens/route/map_screen';
import RouteScreen from './screens/route/route_screen';
import CustomerScreen from './screens/outlet/outlet_screen';
import AddOutletScreen from './screens/outlet/add_outlet_screen';
import {StatusBar} from 'react-native';
import ReturnSuccessScreen from './screens/pos/widget/success_screen';
import AddOutletSuccessScreen from './screens/outlet/add_outlet_success_screen';
import MapRouteSuccessScreen from './screens/route/route_end_success';
import ProductListScreen from './screens/pos/product_screen';
import SaleHistoryScreen from './screens/layout/sales_history_screen';
import DrawerNavigator from './screens/layout/drawer_layout';
import {ROUTES} from './routes/routes_name';
import AllRecordScreen from './screens/record/all_record_screen';
import NotificationScreen from './screens/notification/notification_screen';
import AllPromtionsScreen from './screens/home/all_promotion_screen';
import RecordDeatilScreen from './screens/record/record_detail';
import ProductDetailScreen from './screens/pos/product_detail_screen';
import SaleDetailScreen from './screens/layout/sale_details';
import RecordSuccessScreen from './screens/record/record_success_screen';
import CashHistoryScreen from './screens/layout/cash_history';
import MileageHistoryScreen from './screens/layout/Mileage_history';
import GiftHistoryScreen from './screens/layout/gift_history_screen';
import GiftDetailScreen from './screens/layout/gift_details';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#fffff'},
        }}
        initialRouteName={ROUTES.SPLASH}>
        <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
        <Stack.Screen
          name={ROUTES.AllPromotions}
          component={AllPromtionsScreen}
        />
        <Stack.Screen name={ROUTES.Language} component={LanguageScreen} />
        <Stack.Screen
          name={ROUTES.GiftDetailScreen}
          component={GiftDetailScreen}
        />
        <Stack.Screen name={ROUTES.Country} component={CountryScreen} />
        <Stack.Screen name={ROUTES.Login} component={LoginScreen} />
        <Stack.Screen
          name={ROUTES.RecordSuccessScreen}
          component={RecordSuccessScreen}
        />
        {/* <Stack.Screen name={ROUTES.CashHistory} component={CashHistoryScreen} /> */}
        <Stack.Screen
          name={ROUTES.GiftHistoryScreen}
          component={GiftHistoryScreen}
        />
        {/* <Stack.Screen
          name={ROUTES.MileageHistory}
          component={MileageHistoryScreen}
        /> */}
        <Stack.Screen
          name={ROUTES.RecordDetails}
          component={RecordDeatilScreen}
        />
        <Stack.Screen
          name={ROUTES.ProductDetails}
          component={ProductDetailScreen}
        />
        <Stack.Screen name={ROUTES.Profile} component={ProfileScreen} />
        <Stack.Screen name={ROUTES.Layout} component={LayoutScreen} />
        <Stack.Screen name={ROUTES.DrawerScreen} component={DrawerNavigator} />
        <Stack.Screen
          name={ROUTES.SaleDetailScreen}
          component={SaleDetailScreen}
        />
        <Stack.Screen name={ROUTES.AllRecord} component={AllRecordScreen} />
        <Stack.Screen name={ROUTES.Home} component={HomeScreen} />
        <Stack.Screen
          name={ROUTES.Notification}
          component={NotificationScreen}
        />
        <Stack.Screen name={ROUTES.OpeningCash} component={TodaysCashScreen} />
        <Stack.Screen
          name={ROUTES.ReturnSuccessScreen}
          component={ReturnSuccessScreen}
        />
        <Stack.Screen
          name={ROUTES.RecordFormScreen}
          component={RecordFormScreen}
        />
        <Stack.Screen name={ROUTES.Record} component={RecordScreen} />
        <Stack.Screen
          name={ROUTES.MapRouteSuccessScreen}
          component={MapRouteSuccessScreen}
        />
        <Stack.Screen name={ROUTES.MapScreen} component={MapScreen} />
        <Stack.Screen name={ROUTES.RouteScreen} component={RouteScreen} />
        <Stack.Screen name={ROUTES.OutletScreen} component={CustomerScreen} />
        <Stack.Screen
          name={ROUTES.SaleHistoryScreen}
          component={SaleHistoryScreen}
        />
        <Stack.Screen
          name={ROUTES.ProductListScreen}
          component={ProductListScreen}
        />
        <Stack.Screen
          name={ROUTES.AddOutletSuccessScreen}
          component={AddOutletSuccessScreen}
        />
        <Stack.Screen
          name={ROUTES.AddOutletScreen}
          component={AddOutletScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
