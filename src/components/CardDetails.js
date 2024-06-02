import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import DateTimeSelector from './DateTimeSelector';
import EditableTextInput from './EditableTextInput';
import { userStore } from '../stores/UserStore';
import getStyles from '../styles/styles';
import { useTranslation } from 'react-i18next';
import RatingStars from './RatingStars';

const CardDetails = ({ initialValue, onChangeText, onSave, onDeleteNote, deleteBTN }) => {
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const [note_current, setText] = useState(initialValue.content || '');
  const [rating, setRating] = useState(initialValue.rating ? initialValue.rating.toString() : '');
  const [date, setDate] = useState(initialValue.date ? new Date(initialValue.date) : new Date());
  const [show, setShow] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const { t } = useTranslation();

  const [message, setMessage] = useState('');
  
  const handleDateTimeChange = (newDateTime) => {
    setSelectedDateTime(newDateTime);
    // Now selectedDateTime state in this component will update when the date changes in DateTimeSelector
  };
  useEffect(() => {
    if (initialValue.date) {
      setSelectedDateTime(new Date(initialValue.date));
    }
  }, [initialValue.date]); // Re-run this effect if initialValue.date changes

  const onRate = (cardData, rating) => {
    console.log("onRate")
    //# maybe take this in to RatingStars componenet
  }; 
  const saveNote = (text ) => {
    console.log("saveNote",text)
  };  
  const handleSendMessage = (text) => {
    console.log("handleSendMessage",text)
  };
  return (
    <View style={styles.container}>

      <RatingStars
        data={initialValue.date} // Pass the relevant data here
        starCount={initialValue.Rating}
        setStarCount={setRating}
        onRate={onRate}
        last_rate_ID={-1}
      />
      <DateTimeSelector
        initialValue={selectedDateTime.toISOString()}
        onDateTimeChange={handleDateTimeChange}
      />
      <EditableTextInput
            multiline
            //style={styles.text_input}
            placeholder={t("note_current")}
            initialValue={note_current}
            onSave={saveNote}
          />
      <View style={styles.buttonContainer}>
      {deleteBTN && (
        <TouchableOpacity onPress={() => onDeleteNote} style={styles.closeBtn}>
          <Text style={styles.text_input}>{t('delete note')} </Text>
        </TouchableOpacity>
        )}
        <View style={styles.space} /> 
        <TouchableOpacity onPress={() => onSave({ text, rating: parseInt(rating, 10), date })} style={styles.leftBtn}>
          <Text style={styles.text_input}>{t('Close')} </Text>
        </TouchableOpacity>
        {/* {deleteBTN && (
          <Button
            title="Delete Note"
            onPress={onDeleteNote}
          />
        )}
        <Button
          title="Save"
          onPress={() => onSave({ text, rating: parseInt(rating, 10), date })}
        /> */}
      </View>
    </View>
  );
};

export default CardDetails;
