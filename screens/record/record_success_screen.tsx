import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SuccessIcon from '../../assets/success-icon.svg';
import CustomButton from '../../components/custom_app_button';
import {Const} from '../../constants/const_value';

const RecordSuccessScreen: React.FC<any> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <SuccessIcon width={130} height={130} style={{marginBottom: 30}} />

      <Text style={styles.title}>
        {Const.languageData?.Success ?? 'Success'}
      </Text>
      <Text style={styles.message}>
        {Const.languageData?.Record_submitted_description ??
          ' Record Added successfully. You can continue or add another record.'}
      </Text>

      <CustomButton
        onPress={function (): void {
          navigation.goBack();
        }}
        title={Const.languageData?.Go_Back ?? 'Go Back'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 60,
    marginHorizontal: 20,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden', // Ensures the gradient doesn't exceed the button boundaries
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default RecordSuccessScreen;
