import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { userStore } from '../stores/UserStore';
import getStyles from '../styles/styles';
import { useTranslation } from 'react-i18next';

const EditableTextInput = ({ initialValue, description, placeholder, onSave, onDeleteNote, multiline = false, clearSubmitedText = false, deleteBTN = false,editable=true }) => {
  const [_text, setText] = useState(initialValue || '');
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const [isFocused, setIsFocused] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir(i18n.language) === 'rtl';

  const handleChange = (newText) => {
    setText(newText);
  };

  const handleSubmit = () => {
    onSave(_text);
    setIsFocused(false)
    if (clearSubmitedText) {
      setText("");
    }
  };

  const handleDeleteNote = () => {
    onDeleteNote();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.general_text}>{description}</Text>
        {deleteBTN && (
          <TouchableOpacity onPress={handleDeleteNote} >
            <Icon name="trash" size={15} style={styles.Icon} />
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.MultilineInput_textInputParentView, isRTL && styles.MultilineInput_rtlTextInputParentView]}>
      <Input
        value={_text}
        onChangeText={handleChange}
        placeholder={placeholder}
        style={styles.MultilineInput_text_input}
        multiline={multiline}
        onBlur={handleSubmit} // Handle submit when TextInput loses focus
        onSubmitEditing={handleSubmit}
        onFocus={() => setIsFocused(true)}
        editable={editable}
        containerStyle={{
        // Adjust the overall container size and padding
        padding: 0,
        margin: 0,
      }}
      inputContainerStyle={{
        // Make the input field border tighter
        borderBottomWidth: 1,
        padding: 0,
        //height: 30, // Smaller height
      }}
      />
      { multiline && <TouchableOpacity onPress={handleSubmit}>
        <Icon name="send" size={20} color={_text.trim() && isFocused ? "#4CAF50" : "gray"} />
      </TouchableOpacity>}
      </View>
    </View>
  );
};

export default EditableTextInput;
