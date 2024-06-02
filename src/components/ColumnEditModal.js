import React, { useEffect, useState } from 'react';
import { Modal, View,TouchableOpacity, Alert } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { userStore } from '../stores/UserStore';
import getStyles from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import EditableTextInput from './EditableTextInput';
import RatingsGraph from './RatingsGraph';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
//import MultilineInput from './MultilineInput';

const ColumnEditModal = observer(({ isVisible, onClose, columnData,onCloseColumnEditModal}) => {
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const [newItemTitle, setNewItemTitle] = useState('');
  const { t } = useTranslation();

  const handleSave = async () => {
    //console.log('ColumnEditModal handleSave:');
    //await userStore.update_card(cardData.id, cardData.title, cardData.description);
    //onSave(cardData);
    onCloseColumnEditModal(newItemTitle);
    onClose();
  };

  
  const handleSaveDescription = async(newDescription) => {
    // Save logic for description
    //console.log("handleSaveDescription",newDescription)
    await userStore.renameColumnDesc(columnData.columnIndex, newDescription);
  };
  const handleSaveTitle = async(newTitle) => {
    // Save logic for description
    //console.log("handleSaveTitle",newTitle)
    await userStore.renameColumn(columnData.columnIndex, newTitle );
    setNewItemTitle(newTitle)
  };
    
  const DeleteColumn = (columnIndex) => {
    // Delete the entire column

    Alert.alert(
      t('Are you sure you want to delete?'), // Title of the dialog
      '', // Message of the dialog
      [
        {
          text: t('Cancel'), // Cancel button text
          //onPress: () => console.log('Cancel Pressed'), // Function to call when cancel button is pressed
          style: 'cancel', // Style of the button (optional)
        },
        {
          text: t('Delete'), // Delete button text
          //text: t('Delete'), // Delete button text
          onPress: () => {
            userStore.handleDeleteColumn(columnIndex);
            onClose();
          },
        },
      ],
      { cancelable: false } // Whether the dialog can be dismissed by tapping outside (optional)
    );


  }
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
          onPress={handleSave}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          >
            <Icon name="times" size={20} style={styles.Icon} />
          </TouchableOpacity>
          <EditableTextInput
          multiline
          description = {t("Column_title")}
          initialValue={columnData.title}
          placeholder={t("Column_title_placeholder")}
          onSave={handleSaveTitle}
        />
        <EditableTextInput
          multiline
          initialValue={columnData.description}
          description = {t("Column_Description")}
          placeholder={t("Column_Description_placeholder")}
          onSave={handleSaveDescription}
        />
        
        <TouchableOpacity onPress={() => DeleteColumn(columnData.columnIndex)}  style={styles.closeBtn} >
            <Text style={styles.text_input}>{t('delete column')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  );
});

export default ColumnEditModal;
