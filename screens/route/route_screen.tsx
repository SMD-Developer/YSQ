import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  RefreshControl,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Icon} from 'react-native-paper';
import MainAppBar from '../../components/custom_main_app_bar';
import {COLORS} from '../../constants/colors';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import Loader from '../../components/custom_loader';
import useOutletController from '../outlet/controller/outlets_controller';
import {Const} from '../../constants/const_value';
import {AddOutletModel} from '../outlet/modle/add_outlet_model';
import ConfirmationModal from './confirmation_dialog';

type RouteScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.RouteScreen
>;

interface RouteScreenProps {
  navigation: RouteScreenNavigationProp;
}

const RouteScreen: React.FC<RouteScreenProps> = ({navigation}) => {
  const {
    outlets,
    loading,
    completedOutlets,
    upcomingOutlets,
    totalOutletCount,
    fetchCompletedOutlets,
    fetchUpcomingOutlets,
    fetchOutlets,
    fetchTotalOutlets,
  } = useOutletController();
  const [selectedFilter, setSelectedFilter] = useState('Today');

  const handleFilterChange = (filter: string) => {
    console.log('Filter changed to:', filter);
    setSelectedFilter(filter);
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AddOutletModel | null>(null); // State to hold the selected item

  const handleDirectionButtonPress = () => {
    setModalVisible(true);
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);
    await fetchOutlets();
    fetchCompletedOutlets();
    fetchUpcomingOutlets();
    fetchTotalOutlets();
    setRefreshing(false);
  }, []);
  const handleConfirm = (item: AddOutletModel) => {
    navigation.push(ROUTES.MapScreen, {
      lat: item.latitude,
      long: item.longitude,
      outletId: item.id!,
      outletData: item,
    });
    setModalVisible(false);
  };
  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <MainAppBar
        title={Const.languageData?.Trips ?? 'Trips'}
        showBackButton={false}
        isPrimary={true}
      />
      <ScrollView
        style={{marginBottom: 20}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Render the stats and filter sections */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>
              {Const.languageData?.Today ?? 'Today'}
            </Text>
            <Icon source="directions" size={30} color={COLORS.PRIMARY} />
            <Text style={styles.statValue}>{outlets.length}</Text>
            <Text style={styles.statSubtitle}>
              {Const.languageData?.Customers ?? 'Customers'}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>
              {Const.languageData?.All ?? 'All'}
            </Text>
            <Icon source="directions" size={30} color={COLORS.PRIMARY} />
            <Text style={styles.statValue}>{totalOutletCount}</Text>
            <Text style={styles.statSubtitle}>
              {Const.languageData?.Customers ?? 'Customers'}
            </Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => handleFilterChange('Today')}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'Today' && styles.filterActive,
              ]}>
              {Const.languageData?.Today ?? 'Today'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFilterChange('Upcoming')}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'Upcoming' && styles.filterActive,
              ]}>
              {Const.languageData?.Upcoming ?? 'Upcoming'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleFilterChange('Completed')}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === 'Completed' && styles.filterActive,
              ]}>
              {Const.languageData?.Completed ?? 'Completed'}
            </Text>
          </TouchableOpacity>
        </View>
        <ConfirmationModal
          isVisible={isModalVisible}
          onConfirm={() => handleConfirm(selectedItem!)}
          onCancel={handleCancel}
        />
        {/* Render the routes list */}
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            scrollEnabled={false}
            keyExtractor={(item, index) => item?.id?.toString() + '-' + index} //
            data={
              selectedFilter === 'Upcoming'
                ? upcomingOutlets
                : selectedFilter === 'Completed'
                ? completedOutlets
                : outlets
            }
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  height: 300,
                }}>
                <Text style={{color: 'black', textAlign: 'center'}}>
                  {' '}
                  {Const.languageData?.No_data_available ?? 'No data available'}
                </Text>
              </View>
            }
            renderItem={({item}) => (
              <View style={styles.employeeCard}>
                {/* <Image
                  source={{uri: 'https://via.placeholder.com/100'}}
                  style={styles.employeeImage}
                /> */}
                <Icon source="store" size={50} color={COLORS.PRIMARY} />
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{item.name}</Text>
                  <Text style={styles.employeeDate}>
                    {item?.channelDetails?.name}
                  </Text>
                  <Text style={styles.employeePhone}>{item.address}</Text>
                  <Text style={styles.employeePhone}>+{item.phone}</Text>
                  <Text style={styles.employeeDate}>{item.assigned_date}</Text>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={
                      selectedFilter === 'Today'
                        ? styles.actionButton
                        : styles.inactiveActionButton
                    }
                    onPress={() => {
                      if (selectedFilter === 'Today') {
                        let phoneNumber = '';

                        if (Platform.OS === 'android') {
                          phoneNumber = `tel:${item.phone}`;
                        } else {
                          phoneNumber = `telprompt:${item.phone}`;
                        }

                        Linking.openURL(phoneNumber);
                      }
                    }}>
                    <Icon source="phone" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      selectedFilter === 'Today'
                        ? styles.actionButton
                        : styles.inactiveActionButton
                    }
                    onPress={() => {
                      if (selectedFilter === 'Today') {
                        setSelectedItem(item);
                        handleDirectionButtonPress();
                      }
                    }}>
                    <Icon source="directions" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
        <View style={{height: 55}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 10,
    elevation: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7D8A99',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  statImage: {
    marginTop: 10,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#7D8A99',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  filterButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  filterText: {
    fontSize: 16,
    color: 'grey',
  },
  filterActive: {
    color: COLORS.PRIMARY,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PRIMARY,
    paddingBottom: 5,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 15,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 10,
    elevation: 5,
  },
  employeeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  employeePhone: {
    fontSize: 14,
    color: '#7D8A99',
  },
  employeeDate: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  inactiveActionButton: {
    backgroundColor: COLORS.PimaryLight,
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});

export default RouteScreen;
