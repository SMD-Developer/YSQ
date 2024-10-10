import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Adjust to your icon set

import { COLORS } from '../../../constants/colors';

interface StepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  steps: { label: string; iconName: string }[]; // Updated to include icon names
}

const Stepper: React.FC<StepperProps> = ({
  currentStep,
  onStepChange,
  steps,
}) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={[
              styles.stepCircle,
              {
                backgroundColor:
                  index + 1 === currentStep ? "#ff9248" : '#e0e0e0',
              },
            ]}
            onPress={() => {}}>
            <Icon
              name={step.iconName}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          {index < steps.length - 1 && (
            <View style={styles.dotLineContainer}>
              {Array.from({ length: 11 }).map((_, i) => (
                <View key={i} style={styles.dot} />
              ))}
            </View>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical:15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Ensures the Stepper takes full width
    paddingHorizontal: 10, // Optional: Add some horizontal padding
  },
  stepCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 1, // Space between dots
  },
});

export default Stepper;
