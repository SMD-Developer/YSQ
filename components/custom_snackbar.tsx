/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {COLORS} from '../constants/colors';

interface CustomSnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  actionLabel?: string;
  onActionPress?: () => void;
  bottomMargin?: boolean; // New prop to control padding from bottom
  autoDismiss?: boolean; // New prop to control auto-dismiss
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  visible,
  message,
  onDismiss,
  actionLabel = 'OK', // Default action label to 'OK'
  onActionPress,
  bottomMargin = false, // Default to no bottom padding
  autoDismiss = true, // Default to no auto-dismiss
}) => {
  useEffect(() => {
    if (autoDismiss && visible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 2000); // Dismiss after 2 seconds

      return () => clearTimeout(timer); // Cleanup timer if component unmounts or autoDismiss changes
    }
  }, [autoDismiss, visible, onDismiss]);

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      style={[
        styles.snackbar,
        bottomMargin && {marginBottom: 65}, // Apply bottom padding if specified
      ]}
      action={{
        label: actionLabel,
        onPress: onActionPress || onDismiss, // Fallback to onDismiss if no action press is provided
        textColor: '#FFFFFF', // White text color for the action button
      }}>
      <Text style={styles.snackbarText}>{message}</Text>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    zIndex: 9999, // Set z-index to 9999 to ensure it's on top of everything
    backgroundColor: COLORS.PRIMARY, // Blue background color for the Snackbar
  },
  snackbarText: {
    color: '#FFFFFF', // White text color
    fontWeight: 'bold',
  },
});

export default CustomSnackbar;
