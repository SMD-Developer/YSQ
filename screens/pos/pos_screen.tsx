/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CustomButton from '../../components/custom_app_button';
import {COLORS} from '../../constants/colors';
import CustomTabBar from './widget/custom_tabbar';
import DeliveryScreen from './widget/delivery_screen';
import {Icon, RadioButton} from 'react-native-paper';
import GiftScreen from './widget/giftScreen';
import ReturnScreen from './widget/returnScreen';
import MainAppBar from '../../components/custom_main_app_bar';
import {Const} from '../../constants/const_value';
import useOutletController from '../outlet/controller/outlets_controller';
import Loader from '../../components/custom_loader';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {AddOutletModel} from '../outlet/modle/add_outlet_model';

type PosScreenRouteProp = RouteProp<RootStackParamList, typeof ROUTES.Pos>;

interface PosProps {
  route: PosScreenRouteProp;
}

type CheckInComponentProps = {
  outlet: string;
  onCheckIn: (selectedOutlet: string) => void;
  foundOutlet: AddOutletModel | null;
  setFoundOutlet: React.Dispatch<React.SetStateAction<AddOutletModel | null>>;
};

const CheckInComponent: React.FC<CheckInComponentProps> = ({
  outlet,
  onCheckIn,
  foundOutlet,
  setFoundOutlet,
}) => {
  const {outlets, loading} = useOutletController();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    //console.log('selectedOutlet', outlet);
    //console.log('outlets', outlets);

    for (let i = 0; i < outlets.length; i++) {
      if (outlets[i].id === outlet) {
        setFoundOutlet(outlets[i]);
        break;
      }
    }
  }, [loading, outlets, outlet, foundOutlet, setFoundOutlet, onCheckIn]);
  return (
    <View
      style={[
        styles.checkInContainer,
        foundOutlet === null &&
          outlet === '' && {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          },
      ]}>
      <TouchableOpacity
        style={styles.checkInButton}
        onPress={() => (outlet ? '' : setModalVisible(true))}>
        {outlet ? (
          <View style={styles.selectedOutletContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon source="store" size={27} color="white" />
              {foundOutlet?.name != null ? (
                <View
                  style={{
                    justifyContent: 'flex-start',
                    marginLeft: 15,
                  }}>
                  <Text style={styles.outletText}>{foundOutlet?.name}</Text>
                  <Text style={{color: 'white'}}>
                    {foundOutlet?.channelDetails?.name}
                  </Text>
                  <Text style={{color: 'white'}}>{foundOutlet?.address}</Text>
                </View>
              ) : (
                <Text style={styles.outletText}>{'Loading...'}</Text>
              )}
            </View>
            <Icon source="check-circle" size={27} color="white" />
          </View>
        ) : (
          <Text style={styles.checkInText}>
            {Const.languageData?.Checkin ?? 'Check In'}
          </Text>
        )}
      </TouchableOpacity>
      {foundOutlet === null && outlet === '' && (
        <Text style={{color: 'black', marginBottom: 5, textAlign: 'center'}}>
          {Const.languageData?.Chekin_at_outlet_hint ??
            'Click on above button to Checkin at the outlet and sell products.'}
        </Text>
      )}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              <View style={{height: 100, justifyContent: 'center'}}>
                <Loader />
              </View>
            ) : (
              <FlatList
                data={outlets}
                ListEmptyComponent={
                  <Text style={{color: 'black'}}>
                    {Const.languageData?.No_data_available ??
                      'No data available'}
                  </Text>
                }
                renderItem={({item}) => (
                  <TouchableOpacity
                    onPress={() => {
                      onCheckIn(item.id!);
                      setFoundOutlet(item);
                    }}>
                    <View style={styles.modalItemContainer}>
                      <View style={styles.modalMainContainer}>
                        <Icon source="store" size={27} color={COLORS.PRIMARY} />
                        <View
                          style={{
                            justifyContent: 'flex-start',
                            marginLeft: 15,
                            alignItems: 'flex-start',
                          }}>
                          <Text style={styles.modalItemText}>
                            {item.name.trim()}
                          </Text>
                          <Text style={{color: COLORS.PRIMARY}}>
                            {item?.channelDetails?.name}
                          </Text>
                          <Text style={{color: 'black'}}>{item.address}</Text>
                        </View>
                      </View>

                      <RadioButton
                        color={COLORS.PRIMARY}
                        value={item.id!}
                        status={outlet === item.id ? 'checked' : 'unchecked'}
                        onPress={() => onCheckIn(item.id!)}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
            <View style={styles.modalButtonContainer}>
              <CustomButton
                onPress={function (): void {
                  setModalVisible(false);
                }}
                title={Const.languageData?.Cancel ?? 'Cancel'}
                makeBorderButton={true}
                buttonStyle={styles.cancelButton}
                textStyle={{color: COLORS.PRIMARY}}
              />
              <CustomButton
                onPress={function (): void {
                  setModalVisible(false);
                }}
                title={Const.languageData?.Confirm ?? 'Confirm'}
                buttonStyle={{width: '50%'}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();
const PosContext = createContext<{foundOutlet: AddOutletModel | null}>({
  foundOutlet: null,
});

export const usePosContext = () => useContext(PosContext);
const PosScreen: React.FC<PosProps> = ({route}) => {
  const [foundOutlet, setFoundOutlet] = useState<AddOutletModel | null>(null);
  const [outlet, setOutlet] = useState<string>('');

  const handleCheckIn = (selectedOutlet: string) => {
    setOutlet(selectedOutlet);
  };

  useEffect(() => {
    if (Const.selectedOutlet !== null) {
      setOutlet(Const.selectedOutlet!);
      Const.selectedOutlet = null;
    }
  }, []);

  return (
    <PosContext.Provider value={{foundOutlet}}>
      <View style={styles.safeArea}>
        <MainAppBar
          title={Const.languageData?.POS ?? 'Pos'}
          showBackButton={false}
          isPrimary={true}
        />

        <View style={{marginTop: 20, flex: 1}}>
          <CheckInComponent
            outlet={outlet}
            onCheckIn={handleCheckIn}
            foundOutlet={foundOutlet}
            setFoundOutlet={setFoundOutlet}
          />

          {outlet && (
            <View style={{flexGrow: 1, marginHorizontal: 20}}>
              <Tab.Navigator
                tabBar={props => <CustomTabBar {...props} />}
                screenOptions={{swipeEnabled: false}}>
                <Tab.Screen
                  name={Const.languageData?.Delivery ?? 'Delivery'}
                  initialParams={{outlet: foundOutlet}}
                  component={DeliveryScreen}
                  listeners={({navigation}) => ({
                    tabPress: e => {
                      e.preventDefault();
                      navigation.navigate('Delivery', {outlet: foundOutlet});
                    },
                  })}
                  // initialParams={{outlet: foundOutlet}}
                />
                <Tab.Screen
                  name={Const.languageData?.Return ?? 'Return'}
                  component={ReturnScreen}
                  initialParams={{outlet: foundOutlet}}
                />
                <Tab.Screen
                  name={Const.languageData?.Gifts ?? 'Gifts'}
                  component={GiftScreen}
                  initialParams={{outlet: foundOutlet}}
                />
              </Tab.Navigator>
            </View>
          )}
          <View style={{height: 55}} />
        </View>
      </View>
    </PosContext.Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    textAlign: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appBarTitle: {
    color: 'grey',
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
    justifyContent: 'center',
  },
  checkInContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  checkInButton: {
    // borderWidth: 1,

    width: '100%',
    // borderColor: 'grey',
    // borderStyle: 'dotted',
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // elevation: 2,
  },
  checkInText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  checkedInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  outletText: {
    fontSize: 16,

    color: 'white',

    fontWeight: 'bold',
  },

  modalItem: {
    padding: 20,
    fontSize: 18,
    color: '#34495e',
    textAlign: 'center',
  },

  selectedOutletContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  modalMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',

    color: 'black',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButton: {
    // backgroundColor: 'transparent', // Tra
    // borderRadius: 5,
    // flex: 1,
    // alignItems: 'center',
    // borderWidth: 1,
    // borderColor: COLORS.PRIMARY,
    marginRight: 10,
    width: '50%',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});

export default PosScreen;
