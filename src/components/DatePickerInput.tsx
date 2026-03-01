import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {formatDate} from '../utils/dateUtils';

interface DatePickerInputProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
}

/**
 * Input component that wraps the native DateTimePicker.
 * Displays a button to open the picker and shows the selected date.
 */
const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  label = 'Due Date',
}) => {
  const [show, setShow] = useState(false);

  const handleChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate !== undefined) {
      onChange(selectedDate);
    }
  };

  const handleClear = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShow(true)}
          accessibilityLabel={`Pick ${label}`}>
          <Text style={value ? styles.dateText : styles.placeholder}>
            {value ? formatDate(value) : 'Select date…'}
          </Text>
        </TouchableOpacity>
        {value !== null && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton} accessibilityLabel="Clear date">
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {show && (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFAFA',
  },
  dateText: {
    fontSize: 15,
    color: '#212121',
  },
  placeholder: {
    fontSize: 15,
    color: '#9E9E9E',
  },
  clearButton: {
    marginLeft: 8,
    padding: 8,
  },
  clearText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
});

export default DatePickerInput;
