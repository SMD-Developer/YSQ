/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-paper';
import {COLORS} from '../constants/colors';
import User from '../screens/login/models/user_model';
import {RootStackParamList, ROUTES} from '../routes/routes_name';

type AppBarProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  isPrimary?: boolean;
  showUser?: boolean;
  centerText?: string; // Prop for center text
};

const MainAppBar: React.FC<AppBarProps> = ({
  title,
  showBackButton = true,
  onBackPress,
  isPrimary = false,
  showUser = false,
}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<any>(null); // State for storing user data

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const use = await User.getUser(); // Fetch user data
      setUser(use); // Set user data to state
    };
    fetchUser();
  }, []); // Empty dependency array ensures this runs once on mount

  // Determine styles based on the `isPrimary` prop
  const backgroundColor = isPrimary ? COLORS.PRIMARY : '#FFF';
  const textColor = isPrimary ? '#FFF' : COLORS.PRIMARY;
  const statusBarStyle = isPrimary ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle={statusBarStyle} />
      <View style={[styles.appBar, {paddingTop: insets.top, backgroundColor}]}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={onBackPress || (() => navigation.goBack())}
            style={styles.leftIcon}>
            <Icon source="arrow-left" size={25} color={textColor} />
          </TouchableOpacity>
        ) : isPrimary ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Icon source="menu" size={25} color="white" />
            </TouchableOpacity>
            {showUser && (
              <View style={styles.leadingItem}>
                <View style={styles.profileContainer}>
                  {(user?.imageUrl.trim()??'') === '' ? (
                    <Image
                      source={require('../assets/dummy_user.png')}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={{
                        uri:
                          user?.imageUrl ?? 'https://via.placeholder.com/150',
                      }}
                      style={styles.profileImage}
                    />
                  )}
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user?.fullName ?? ''}</Text>
                  <Text style={styles.userType}>{user?.email ?? ''}</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholder} /> // Placeholder to maintain spacing
        )}
        <Text style={[styles.appBarTitle, {color: textColor}]}>{title}</Text>

        {isPrimary ? (
          <TouchableOpacity
            style={styles.trailingItem}
            onPress={() => navigation.navigate(ROUTES.Notification)}>
            <Icon source="bell-outline" size={25} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </>
  );
};

export default MainAppBar;

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appBarTitle: {
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 23,
    fontWeight: 'bold',
  },
  leftIcon: {
    zIndex: 1, // Ensure the icon doesn't overlap with the title
  },
  primaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%', // Ensure it takes full width
  },
  leadingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  profileContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  userType: {
    color: '#FFF',
  },
  centerTextContainer: {
    flex: 1, // Take up available space in the center
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  trailingItem: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'white',
  },
  placeholder: {
    width: 25, // Width of the icon to maintain alignment
  },
});
