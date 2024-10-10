import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import MainAppBar from '../../components/custom_main_app_bar';
import Loader from '../../components/custom_loader';
import CustomSnackbar from '../../components/custom_snackbar';
import useHomeController from './controller/home_controller';
import {Promotion} from './models/promotion_model';
import {Const} from '../../constants/const_value';

type RecordNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.AllPromotions
>;

interface RecordScreenProps {
  navigation: RecordNavigationProp;
}

const AllPromtionsScreen: React.FC<RecordScreenProps> = ({navigation}) => {
  const {visible, fetchData, loading, promotions} = useHomeController();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing...');
    setRefreshing(true);

    await fetchData();
    setRefreshing(false);
  }, []);
  const renderPromotion = ({item}: {item: Promotion}) => {
    return (
      <View style={styles.promotionContainer}>
        <View style={styles.promotionTextContainer}>
          <Text style={styles.promotionTitle}>{item.attributes.name}</Text>
          <Text style={styles.promotionDescription}>
            {item.attributes.code}
          </Text>
        </View>
        <Text style={styles.validDate}>
          {Const.languageData?.Valid_till ?? 'Valid till'}
          {' \n'}
          {`${item.attributes.end_date}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <MainAppBar
        title={Const.languageData?.All_Promotions ?? 'All Promotions'}
        showBackButton={true}
        isPrimary={false}
      />

      <View style={styles.container}>
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={promotions}
            renderItem={renderPromotion}
            ListEmptyComponent={
              <Text style={{color: 'black'}}> {'No Promotions found'}</Text>
            }
          />
        )}
      </View>
    </View>
  );
};

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
    marginBottom: 20,
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
  container: {
    flex: 1,
    padding: 20,
  },
  box: {
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'dotted',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  boxTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  promotionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(228,239,253)', // Blue background
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  promotionTextContainer: {
    flexDirection: 'column',
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // White text
  },
  promotionDescription: {
    fontSize: 14,
    color: 'black', // White text
  },
  validDate: {
    fontSize: 14,
    textAlign: 'center',
    color: 'black', // White text
  },
});

export default AllPromtionsScreen;
