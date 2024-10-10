// Loader.tsx
import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

interface LoaderProps {
  text?: string; // Optional prop for custom text
  size?: 'small' | 'large'; // Optional prop for loader size
  color?: string; // Optional prop for loader color
}

const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  color = COLORS.PRIMARY,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: 'grey',
  },
});

export default Loader;
