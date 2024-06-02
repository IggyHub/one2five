import React, { useState } from 'react';
import { Modal, View, StyleSheet ,TouchableOpacity} from 'react-native';
import { Input, Text } from 'react-native-elements';
import EditableTextInput from './EditableTextInput';
import Icon from 'react-native-vector-icons/FontAwesome';
import { userStore } from '../stores/UserStore';
import getStyles from '../styles/styles';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';

const AddNoteModal = observer(({ isVisible, onClose, cardData, onSaveNote,last_rate_ID }) => {
  const { t } = useTranslation();
  const [note_current, setNote_current] = useState('');
  const [saveResult, setSaveResult] = useState(false); // Track the save operation result
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const saveNote = async (note_current) => {
  let needsUpdate = false

    if (note_current.trim()) {
      await userStore.addNote_currentToCard(cardData.id, last_rate_ID,note_current); 
      setNote_current(''); // Clear the note text after saving;
      needsUpdate = true
    }
    if (needsUpdate){
      onSaveNote( true);
    }
    else{
      onSaveNote( false);
    }
      onClose(); // Close the modal
    }
  
  
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          >
            <Icon name="times" size={20} style={styles.Icon} />
          </TouchableOpacity>

          <EditableTextInput
            multiline
            //style={styles.text_input}
            placeholder={t("note_current")}
            initialValue={note_current}
            onSave={saveNote}
          />

            
        </View>
      </View>
    </Modal>
  );
});

export default AddNoteModal;