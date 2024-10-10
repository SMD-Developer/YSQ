import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {View, Text, StyleSheet, FlatList, StatusBar} from 'react-native';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {COLORS} from '../../constants/colors';
import AppBar from '../../components/custom_app_bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Const} from '../../constants/const_value';
import CustomButton from '../../components/custom_app_button';
import ListItem from '../language/components/list_item';

type CountryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.Country
>;

interface CountryScreenProps {
  navigation: CountryScreenNavigationProp;
}
const CountryScreen: React.FC<CountryScreenProps> = ({navigation}) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const data = [
    {id: '1', image: require('../../assets/indo.png'), title: 'Indonesia'},
    {id: '2', image: require('../../assets/taiwan.png'), title: 'Taiwan'},
  ];

  const renderItem = ({item}: {item: (typeof data)[0]}) => {
    return (
      <ListItem
        image={item.image}
        title={item.title}
        isSelected={selectedId === item.id}
        onPress={() => setSelectedId(item.id)}
      />
    );
  };
  return (
    <View style={styles.safeArea}>
      <View style={styles.mainScreen}>
        <StatusBar backgroundColor="white" barStyle={'dark-content'} />
        <AppBar
          title={Const.languageData?.Country ?? 'Country'}
          showBackButton={false}
        />
        <View style={styles.whiteContainer}>
          <FlatList
            style={styles.FlatList}
            data={data}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{color: 'black'}}> {'No Country found'}</Text>
            }
            keyExtractor={item => item.id}
          />
          <CustomButton
            onPress={() => {
              if (!selectedId) {
                return;
              }
              Const.saveCountryAsyncStorage(selectedId!);
              navigation.replace(ROUTES.Login);
            }}
            title={Const.languageData?.Next ?? 'Next'}
          />
        </View>
      </View>
    </View>
  );
};

export default CountryScreen;

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
    paddingHorizontal: Const.PADDING_HORIZONTAL,
    paddingBottom: 20,
  },
  FlatList: {
    marginTop: 30,
  },
});
