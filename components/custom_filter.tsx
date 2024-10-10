/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have this icon package installed
import {COLORS} from '../constants/colors';
import CustomButton from './custom_app_button';
import {RadioButton} from 'react-native-paper';
import {Const} from '../constants/const_value';

interface FilterDialogProps {
  onFilterApply: (filter: string, startDate?: Date, endDate?: Date) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({onFilterApply}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('All'); // Default to 'All'
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openFilterModal = () => setModalVisible(true);
  const closeFilterModal = () => setModalVisible(false);

  const getDateRange = (option: string) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (option) {
      case 'Yesterday':
        startDate.setDate(today.getDate() - 1);
        endDate = startDate;
        break;
      case 'Last 7 Days':
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;
      case 'This Month':
        startDate.setDate(1);
        startDate.setMonth(today.getMonth());
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'Last Month':
        startDate.setDate(1);
        startDate.setMonth(today.getMonth() - 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        startDate = today;
        endDate = today;
        break;
    }

    return {startDate, endDate};
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    setCustomStartDate(selectedDate || customStartDate);
    onFilterApply('Custom', selectedDate, selectedDate);
  };

  const applyFilter = (option: string) => {
    setSelectedOption(option);
    if (option === 'Custom') {
      setShowDatePicker(true);
    } else {
      const {startDate, endDate} = getDateRange(option);
      onFilterApply(option, startDate, endDate);
      closeFilterModal();
    }
  };

  const filterOptions = [
    {id: 'All', name: Const.languageData?.All ?? 'All'},
    {id: 'Today', name: Const.languageData?.Today ?? 'Today'},
    {id: 'Yesterday', name: Const.languageData?.Yesterday ?? 'Yesterday'},
    {id: 'Last 7 Days', name: Const.languageData?.Last_7_Days ?? 'Last 7 Days'},
    {id: 'This Month', name: Const.languageData?.This_Month ?? 'This Month'},
    {id: 'Last Month', name: Const.languageData?.Last_Month ?? 'Last Month'},
    {id: 'Custom', name: Const.languageData?.Custom ?? 'Custom'},
  ];

  return (
    <View style={styles.container}>
      {/* TouchableOpacity to open filter dialog */}
      <TouchableOpacity
        style={{
          marginRight: 15,
          alignSelf: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
        onPress={openFilterModal}>
        <Icon name="filter-outline" size={30} color={COLORS.PRIMARY} />
      </TouchableOpacity>

      {/* Main filter modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{Const.languageData?.Select_Filter ?? 'Select Filter'}</Text>

            {/* Vertical list with radio buttons */}
            <FlatList
              style={styles.listContainer}
              data={filterOptions}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => applyFilter(item.name)}>
                  <View style={styles.radioContainer}>
                    <Text
                      style={[
                        styles.radioText,
                        selectedOption === item.name && {color: COLORS.PRIMARY},
                      ]}>
                      {item.name}
                    </Text>
                    <RadioButton
                    onPress={() => applyFilter(item.name)}
                      value={item.name}
                      color={COLORS.PRIMARY}
                      status={
                        selectedOption === item.name ? 'checked' : 'unchecked'
                      }
                    />
                  </View>
                </TouchableOpacity>
              )}
            />

            {/* Show Date Picker if Custom filter is selected */}
            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={customStartDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date)}
                />
              </View>
            )}

            <CustomButton title={Const.languageData?.Select ?? "Select"} onPress={closeFilterModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c0c0c0',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY,
  },
  radioText: {
    fontSize: 16,
    color: '#000',
  },
  datePickerContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default FilterDialog;
