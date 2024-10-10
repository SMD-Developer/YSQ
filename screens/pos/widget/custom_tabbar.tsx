import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../../../constants/colors';
import {Const} from '../../../constants/const_value';

const CustomTabBar: React.FC<MaterialTopTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer} edges={['bottom']}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Map route names to icon names
          const getIconName = (routeName: string) => {
            switch (routeName.toLowerCase()) {
              case Const.languageData?.Delivery.toLowerCase() ?? 'delivery':
                return 'delivery-dining';
              case Const.languageData?.Return.toLowerCase() ?? 'return':
                return 'undo';
              case Const.languageData?.Gifts.toLowerCase() ?? 'gifts':
                return 'card-giftcard';
              default:
                return 'help'; // Default icon if route name doesn't match
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={[styles.tabButton, isFocused && styles.tabButtonActive]}>
              <MaterialIcons
                name={getIconName(route.name)}
                size={24}
                color={isFocused ? '#fff' : '#ff9248'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {color: isFocused ? '#fff' : '#ff9248'},
                ]}>
                {label.toString()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: 'transparent',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

    backgroundColor: 'transparent',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0', // Background color for inactive tabs
    marginHorizontal: 4,
    marginBottom: 10,
  },
  tabButtonActive: {
    backgroundColor: '#ff9248', // Background color for active tab
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default CustomTabBar;
