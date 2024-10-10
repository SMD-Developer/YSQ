import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import { COLORS } from '../constants/colors';
import { Const } from '../constants/const_value';

interface AppBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ title, showBackButton = true, onBackPress }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}>
          <Icon source="arrow-left" size={24} color={COLORS.WHITE} />
        </TouchableOpacity>
      )}
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Const.PADDING_HORIZONTAL,
  },
  backButton: {
    marginRight: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
});

export default AppBar;
