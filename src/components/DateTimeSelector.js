import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { userStore } from '../stores/UserStore';
import getStyles from '../styles/styles';

const DateTimeSelector = ({ initialValue, onDateTimeChange }) => {
    const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
    // Convert initialValue to a Date object, assuming initialValue is in ISO string format
    const initialDate = initialValue ? new Date(initialValue) : new Date();
    const [date, setDate] = useState(initialDate);
    const [showPicker, setShowPicker] = useState(false);
    const [mode, setMode] = useState('date'); // 'date' or 'time'

    const onChange = (event, selectedValue) => {
        setShowPicker(Platform.OS === 'ios'); // Optionally hide picker for Android after selection
        if (selectedValue) {
        setDate(selectedValue); // Update date or time based on user selection
        onDateTimeChange(selectedValue); // Pass the new date back to the parent
        }
    };

    const showMode = (currentMode) => {
        setShowPicker(true); // Show picker
        setMode(currentMode); // Set picker to date or time mode
    };

    // Use moment.js for formatting, providing fallback formats for demonstration
    const formatDate = (date) => moment(date).format('LL'); // E.g., 'September 4, 1986'
    const formatTime = (date) => moment(date).format('LT'); // E.g., '5:00 PM'

    return (
        <View style={styles.container}>
            <View style={styles.dateTimeDisplay}>
                <TouchableOpacity onPress={() => showMode('time')} >
                <Text style={styles.text_input}>{formatTime(date)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showMode('date')} >
                <Text style={styles.text_input}>{formatDate(date)}</Text>
                </TouchableOpacity>
            </View>
        {showPicker && (
            <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            />
        )}
        </View>
    );
};

// const styles = StyleSheet.create({
//   card: {
//     margin: 10,
//     padding: 10,
//     borderRadius: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   dateTimeDisplay: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
// });


export default DateTimeSelector;
