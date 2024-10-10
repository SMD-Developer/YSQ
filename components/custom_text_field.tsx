/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-paper';

interface TextFieldProps extends TextInputProps {
  editable?: boolean;
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  error?: string; // Add an error prop for validation messages
  onBlur?: () => void; // Optional: function to call when input loses focus
}

const CustomTextField: React.FC<TextFieldProps> = ({
  editable,
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  inputStyle,
  labelStyle,
  error,
  onBlur,
  ...props
}) => {
  const [isSecure, setIsSecure] = React.useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecure(prev => !prev);
  };
  const hasError = error && error.trim() !== '';

  const getInputStyle = (): TextStyle => {
    let baseStyle: TextStyle = styles.input;
    if (hasError) {
      baseStyle = {...baseStyle, ...styles.inputError};
    }
    if (containsSearch) {
      return {...baseStyle, ...inputStyle, paddingLeft: 40};
    }
    return {...baseStyle, ...inputStyle};
  };
  const containsSearch = placeholder?.toLowerCase().includes('search'); // Check if label contains "search"

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.inputContainer}>
        {containsSearch && (
          <View
            style={{
              position: 'absolute',
              left: 10,
              height: 50,
              justifyContent: 'center',
            }}>
            <Icon source="magnify" size={23} color="#333" />
          </View>
        )}
        <TextInput
          style={getInputStyle()}
          editable={editable == false ? false : true}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="black"
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          onBlur={onBlur}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity style={styles.eyeIcon} onPress={toggleSecureEntry}>
            <Icon
              source={isSecure ? 'eye-off' : 'eye'}
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && error.trim() !== '' && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  inputContainer: {
    position: 'relative', // Ensure the eye icon is positioned correctly
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: 'red', // Red border color for the input field when there's an error
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: 50,
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 5,
    fontSize: 14,
    color: 'red',
  },
});

export default CustomTextField;
