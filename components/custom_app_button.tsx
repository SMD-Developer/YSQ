import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../constants/colors';

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  makeBorderButton?: boolean;
  loading?: boolean; // Add loading prop
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  buttonStyle,
  textStyle,
  makeBorderButton = false,
  loading = false, // Default to false
}) => {
  const buttonContent = loading ? (
    <ActivityIndicator
      size="large"
      color={makeBorderButton ? COLORS.PRIMARY : '#FFFFFF'}
    />
  ) : (
    <Text style={[styles.text, textStyle]}>{title}</Text>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading} // Disable button while loading
      style={[styles.buttonContainer, buttonStyle]}>
      {makeBorderButton ? (
        <View style={[styles.button, styles.borderButton]}>
          {buttonContent}
        </View>
      ) : (
        <LinearGradient colors={['#FF5722', '#FFA270']} style={styles.button}>
          {buttonContent}
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderButton: {
    borderRadius: 8,
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
