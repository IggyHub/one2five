import React, { useEffect, useState } from 'react';
import { Modal, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { userStore } from '../stores/UserStore';
import getStyles from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import EditableTextInput from './EditableTextInput';
import CardDetails from './CardDetails';
import RatingsGraph from './RatingsGraph';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

const CardEditModal = observer(({ isVisible, onClose, cardData, resetNoteAddedFlag, noteAdded_flag = false, resetRatingAddedFlag, ratingAdded_flag = false, columnIndex }) => {
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const [notes, setNotes] = useState([]);
  const [recentPast, setRecentPast] = useState('');
  const [recentFuture, setRecentFuture] = useState('');
  const { t } = useTranslation();
  const [editedNotes, setEditedNotes] = useState({});
  const [ratingsData, setRatingsData] = useState([]);

  useEffect(() => {
    // Fetch the ratings data for the card
    // This is a placeholder for your actual data fetching logic
    // Replace it with your real data source
    const fetchRatingsData = async () => {
      // Assume we have a function to fetch ratings data
      loadRatingsData()
    };
    loadNotes();
    fetchRatingsData();
  }, [cardData.id]);

  useEffect(() => {
    if (isVisible && noteAdded_flag) {
      resetNoteAddedFlag();
      loadNotes();
    }
  }, [isVisible, noteAdded_flag]);

  useEffect(() => {
    if (isVisible && ratingAdded_flag) {
      resetRatingAddedFlag();
      loadRatingsData()
    }
  }, [isVisible, ratingAdded_flag]);
  const close = () => {
    onClose();
  }
  const trashData = () => {
    Alert.alert(
      t('Are you sure you want to delete?'),
      '',
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Delete'),
          onPress: () => {
            userStore.deletePollFromColumn(columnIndex, cardData.id);
            onClose();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const loadRatingsData = async () => {
    const data = await userStore.fetchRatingsForCard(cardData.id);
    setRatingsData(data);
  };

  const loadNotes = async () => {
    try {
      const fetchedNotes = await userStore.getCardsObservation(cardData.id);
      const recent = await userStore.getRecentNotesForCard(cardData.id);
      if (recent.mostRecentFuture) {
        setRecentFuture(recent.mostRecentFuture)
      }
      if (recent.mostRecentPast) {
        setRecentPast(recent.mostRecentPast)
      }
      const reversedNotes = [...fetchedNotes].reverse();
      setNotes(reversedNotes);
    } catch (error) {
      console.error('Error loading notes: CardEditModal', error);
    }
  };

  const handleSave = async () => {
    await userStore.update_card(cardData.id, cardData.title, cardData.description);
    onClose();
  };

  const handleNoteChange = (noteId, text) => {
    setEditedNotes(prevNotes => ({ ...prevNotes, [noteId]: text }));
  };

  const handleSaveNote = async (noteId) => {
    const newContent = editedNotes[noteId];
    if (newContent !== undefined) {
      try {
        await userStore.editNoteOnCard(cardData.id, noteId, newContent);
        delete editedNotes[noteId];
        loadNotes();
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const handleSaveTitle = async (newTitle) => {
    await userStore.update_card(cardData.id, newTitle, cardData.description);
  };

  const handleSaveDescription = async (newDescription) => {
    await userStore.update_card(cardData.id, cardData.title, newDescription);
  };

  const handleSaveRecentPast = async (text) => {
    await userStore.addNote_pastToCard(cardData.id, -1, text);
    setRecentPast(text)
  };

  const handleSaveRecentFuture = async (text) => {
    await userStore.addNote_futureToCard(cardData.id, -1, text);
    setRecentFuture(text)
  };

  const handleDeleteNote = async (noteId) => {
    await userStore.deleteNoteFromCard(cardData.id, noteId);
    loadNotes();
  };

  return (
    <Modal
  animationType="slide"
  transparent={true}
  visible={isVisible}
  onRequestClose={handleSave}
>
  <View style={styles.modalView}>
    <TouchableOpacity 
      style={styles.closeButton} 
      onPress={onClose}
      hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
    >
      <Icon name="times" size={20} style={styles.Icon} titleStyle={styles.general_text} />
    </TouchableOpacity>

    <EditableTextInput
      multiline
      description={t("question")}
      initialValue={cardData.title}
      placeholder={t("question_placeholder")}
      onSave={handleSaveTitle}
    />
    <EditableTextInput
      multiline
      initialValue={cardData.description}
      description={t("Description")}
      placeholder={t("Description_placeholder")}
      onSave={handleSaveDescription}
    />
    {notes.length > 0 && 
      <View style={styles.flatListContainer}>
      
      <ScrollView style={styles.scrollView} persistentScrollbar={true}>
        {notes.map(item => (
          <CardDetails
            key={item.id.toString()}
            initialValue={item}
            onChangeText={(text) => handleNoteChange(item.id, text)}
            onSave={() => handleSaveNote(item.id)}
            deleteBTN={true}
            onDeleteNote={() => handleDeleteNote(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  }
    {ratingsData.length > 3 && (
      <View style={styles.ratingsGraphContainer}>
        <RatingsGraph data={ratingsData} />
      </View>
      )}
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => trashData()} style={styles.closeBtn}>
        <Text style={styles.text_input}>{t('delete card')} </Text>
      </TouchableOpacity>
      <View style={styles.space} /> 
      <TouchableOpacity onPress={() => close()} style={styles.leftBtn}>
        <Text style={styles.text_input}>{t('Close')} </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

  );
});

export default CardEditModal;
