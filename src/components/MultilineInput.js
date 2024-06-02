import React, { useState, useEffect, useCallback } from 'react';
import { View, Keyboard, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import getStyles from '../styles/styles';
import { userStore } from '../stores/UserStore';
import { useTranslation } from 'react-i18next';

const MultilineInput = ({ initialValue, placeholder, onSave }) => {
  const [text, setText] = useState(initialValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir(i18n.language) === 'rtl';

  const handleSubmit = () => {

    if (text.trim()) {
      onSave(text.trim()); // Ensure text is trimmed when sending
    }
  }; 

  useEffect(() => {
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', 
      () => {
        handleSubmit(); // Call handleSubmit when the keyboard hides 

      }
    );
    return () => {
      hideSubscription.remove();
    };
  }, [text]); // Add 'text' to dependency array if handleSubmit uses the current text state
  
  return (
      <View style={[styles.MultilineInput_textInputParentView, isRTL && styles.MultilineInput_rtlTextInputParentView]}>
        <Input
          style={styles.MultilineInput_text_input}
          multiline={true}
          placeholder={placeholder}
          placeholderTextColor="#888"
          underlineColorAndroid="transparent"
          value={text}
          onChangeText={setText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity onPress={handleSubmit}>
          <Icon name="send" size={20} color={text.trim() && isFocused ? "#4CAF50" : "gray"} />
        </TouchableOpacity>
      </View>
  );
};

export default MultilineInput;
