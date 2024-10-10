import { GiftTransaction } from '../screens/layout/model/gift_history';
import {AddOutletModel} from '../screens/outlet/modle/add_outlet_model';
import {Product} from '../screens/pos/model/product_model';
import { Sale } from '../screens/pos/model/sales_mode';
import {RecordMileageModel} from '../screens/record/modle/record_mileage_model';

export const ROUTES = {
  Language: 'Language',
  Country: 'Country',
  OpenCash: 'OpenCash',
  Notification: 'Notification',
  RecordSuccessScreen: 'RecordSuccessScreen',
  ProductDetails: 'ProductDetails',
  SPLASH: 'Splash',
  SaleDetailScreen: 'SaleDetailScreen',
  GiftDetailScreen: 'GiftDetailScreen',
  Login: 'Login',
  Test: 'Test',
  DrawerScreen: 'DrawerScreen',
  Profile: 'Profile',
  Layout: 'Layout',
  Home: 'Home',
  OpeningCash: 'OpeningCash',
  Record: 'Record',
  AllRecord: 'AllRecord',
  RecordDetails: 'RecordDetails',
  AllPromotions: 'AllPromotions',
  RecordFormScreen: 'RecordFormScreen',
  MapScreen: 'MapScreen',
  Pos: 'Pos',
  RouteScreen: 'RouteScreen',
  OutletScreen: 'OutletScreen',
  AddOutletScreen: 'AddOutletScreen',
  ReturnSuccessScreen: 'ReturnSuccessScreen',
  AddOutletSuccessScreen: 'AddOutletSuccessScreen',
  PosScreen: 'PosScreen',
  Delivery: 'Delivery',
  MapRouteSuccessScreen: 'MapRouteSuccessScreen',
  ProductListScreen: 'ProductListScreen',
  SaleHistoryScreen: 'SaleHistoryScreen',
  GiftHistoryScreen: 'GiftHistoryScreen',
  CashHistory: 'CashHistory',
  MileageHistory: 'MileageHistory',
} as const;

export type RootStackParamList = {
  Splash: undefined;
  CashHistory: undefined;
  GiftHistoryScreen: undefined;
  MileageHistory: undefined;
  Language: {isBack: boolean | undefined};
  Country: undefined;
  Delivery: {outlet: AddOutletModel};
  RecordDetails: {recordMileage: RecordMileageModel};
  ProductDetails: {product: Product};
  Login: undefined;
  Profile: undefined;
  AllPromotions: undefined;
  Notification: undefined;
  Layout: undefined;
  Test: undefined;
  SaleDetailScreen: {sale: Sale,screenType:number};
  GiftDetailScreen: {gift: GiftTransaction};
  DrawerScreen: {
    initialRoute?: string;
    outletId?: string;
  };
  Pos: {
    outletId?: string;
  };
  Home: undefined;
  OpeningCash: {screenType?: number};
  Record: undefined;
  RecordSuccessScreen: undefined;
  AllRecord: undefined;
  RecordFormScreen: {screenType?: number};
  MapScreen: {
    long: string;
    lat: string;
    outletId: string;
    outletData: AddOutletModel;
  };
  OutletScreen: undefined;
  RouteScreen: undefined;
  AddOutletScreen: {outletData: AddOutletModel | null};
  PosScreen: undefined;
  AddOutletSuccessScreen: undefined;
  MapRouteSuccessScreen: undefined;
  ProductListScreen: undefined;
  SaleHistoryScreen: {screenType?: number};
  ReturnSuccessScreen: {
    screenType?: number;
    data: {
      products: {
        image: string;
        name: string;
        quantity: number;
      }[];
      outletName: string;
      date: string;
      paymentType?: string;
      promotion?: string;
    };
  };
};
