/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import {COLORS} from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Icon} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import User from '../login/models/user_model';
import {Const} from '../../constants/const_value';

interface UserDetail {
  icon: string;
  title: string;
  value: string;
}

const ProfileScreen: React.FC = ({navigation}: any) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getUser();
  });
  const getUser = async () => {
    var use = await User.getUser();
    setUser(use);
  };

  const userDetails: UserDetail[] = [
    {
      icon: 'id-card',
      title: Const.languageData?.Salesman_ID ?? '',
      value: user?.unique_code ?? '',
    },
    {
      icon: 'face-man-shimmer',
      title: Const.languageData?.Name ?? 'Name',
      value: user?.fullName ?? '',
    },
    {
      icon: 'email',
      title: Const.languageData?.Email ?? 'Email',
      value: user?.email ?? '',
    },
    {
      icon: 'phone',
      title: Const.languageData?.Phone ?? 'Phone',
      value: user?.phone ?? '',
    },
    {
      icon: 'home',
      title: Const.languageData?.Warehouse_Name ?? 'Warehouse Name',
      value: user?.wareHouseName ?? '',
    },
    {
      icon: 'map-marker',
      title: Const.languageData?.Language ?? 'Language',
      value: user?.language ?? '',
    },
    // {icon: 'account-box', title: 'Gender', value: 'Male'},
  ];
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="white" barStyle={'dark-content'} />
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.WHITE]}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon source="arrow-left" size={30} color={COLORS.WHITE} />
          </TouchableOpacity>

          <View style={styles.profileContainer}>
            {(user?.imageUrl?.trim() ?? '') === '' ? (
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
            {Const.languageData?.Salesman_ID} {user?.unique_code ?? ''}
          </Text>
          <Text style={styles.userType}>{user?.email ?? ''}</Text>

          <View style={styles.detailsContainer}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontWeight: 'bold',
                marginBottom: 15,
              }}>
              {Const.languageData?.Account_information ?? 'Account Information'}
            </Text>
            {userDetails.map((detail, index) => (
              <View key={index} style={styles.detailItem}>
                <Icon source={detail.icon as any} size={24} color="black" />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailTitle}>{detail.title}</Text>
                  <Text style={styles.detailValue}>{detail.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: '100%',
    alignContent: 'flex-start',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  profileContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75, // Circular image
    borderWidth: 4,
    borderColor: 'white',
  },
  userName: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  userType: {
    marginTop: 5,
    fontSize: 16,
    color: 'white',
    fontWeight: 'thin',
  },

  detailsContainer: {
    width: '90%',
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderColor: 'black',
    borderWidth: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  icon: {
    marginRight: 15,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;
