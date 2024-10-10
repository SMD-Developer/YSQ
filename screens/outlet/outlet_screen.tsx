/* eslint-disable react/react-in-jsx-scope */
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import CustomTextField from '../../components/custom_text_field';
import {ROUTES} from '../../routes/routes_name';
import MainAppBar from '../../components/custom_main_app_bar';
import {COLORS} from '../../constants/colors';
import useOutletController from './controller/outlets_controller';
import {AddOutletModel} from './modle/add_outlet_model';
import {Icon} from 'react-native-paper';
import {Const} from '../../constants/const_value';
import {useState, useCallback} from 'react';

interface CustomerCardProps {
  outlet: AddOutletModel;
  navigation: any; // Adjust the type according to your navigation setup (e.g., StackNavigationProp)
}

const CustomerCard: React.FC<CustomerCardProps> = ({outlet, navigation}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={async () => {
        //console.log('outlet', outlet);
        await navigation.navigate(ROUTES.AddOutletScreen, {outletData: outlet});
      }}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{outlet.name}</Text>
      </View>
      <Text style={styles.cardText}>
        {outlet.channelDetails?.name ?? 'None'} -{' '}
        {outlet.areaDetails?.name ?? 'None'}
      </Text>

      <Text style={styles.cardText}>
        <Icon source="email" size={14} /> {outlet.email}
      </Text>
      <Text style={styles.cardText}>
        <Icon source="phone" size={14} /> {outlet.phone}
      </Text>
      <Text style={styles.cardText}>
        <Icon source="map-marker" size={14} /> {outlet.address}
      </Text>
      <View style={styles.cardFooter}>
        <View
          style={[styles.pointsContainer, {backgroundColor: COLORS.PRIMARY}]}>
          <Text style={styles.points}>
            {Const.languageData?.Credit_limit ?? 'Credit Limit'} -{' '}
            {outlet.credit_limit}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              //console.log('outlet', outlet);
              await navigation.navigate(ROUTES.AddOutletScreen, {
                outletData: outlet,
              });
            }}>
            <Icon source="clipboard-edit-outline" size={20} color="#1E90FF" />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.actionButton}>
            <Icon name="delete-outline" size={20} color="#FF6347" />
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};
const OutletScreen: React.FC<any> = ({navigation}) => {
  const {allOutlets, loading, searchQuery, handleSearch, fetchOutlets} =
    useOutletController(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);

    await fetchOutlets();
    setRefreshing(false);
  }, []);
  return (
    <View style={styles.container}>
      <MainAppBar
        title={Const.languageData?.Customers ?? 'Outlets'}
        isPrimary={false}
      />

      {/* Display loading spinner if loading is true */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY}
          style={styles.loadingIndicator}
        />
      ) : (
        <>
          <CustomTextField
            // eslint-disable-next-line react-native/no-inline-styles
            style={{paddingHorizontal: 15}}
            value={searchQuery}
            placeholder={
              Const.languageData?.Search_customer ?? 'Search Customer'
            }
            onChangeText={(text: string) => handleSearch(text)}
          />
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={allOutlets}
            ListEmptyComponent={
              <Text style={{color: 'black'}}>
                {' '}
                {Const.languageData?.No_data_available ?? 'No data available'}
              </Text>
            }
            keyExtractor={(item, index) => (item?.id?.toString() ?? '') + index}
            renderItem={({item}) => (
              <CustomerCard outlet={item} navigation={navigation} />
            )}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          navigation.navigate(ROUTES.AddOutletScreen);
        }}>
        <Text style={styles.createButtonText}>
          + {Const.languageData?.Add_Customer ?? 'Create Outlet'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  pointsContainer: {
    backgroundColor: '#FFDD44',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  points: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardType: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
  },
});

export default OutletScreen;
