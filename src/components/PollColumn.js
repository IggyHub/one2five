import React, { useState } from 'react';
import { View, TouchableOpacity, useColorScheme, StyleSheet } from 'react-native'; // Import StyleSheet
import { Input, Text } from 'react-native-elements';
import PollCard from './PollCard';
import getStyles from '../styles/styles';
import { userStore } from '../stores/UserStore';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import ColumnEditModal from './ColumnEditModal'; // Import the modal component
import Icon from 'react-native-vector-icons/FontAwesome';

const PollColumn = observer(({columnData}) => {
    //console.log("PollColumn",columnData)
     const { t } = useTranslation();
    const { description, insights, subjectId, title} = columnData;
    console.log("columnData --------------", columnData);
    console.log("--------------",description, insights, subjectId, title);
    console.log("--------------", insights);

      const reversedPolls = [...insights].reverse();
     const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
     const [isEditMode, setIsEditMode] = useState(false);
     const [newTitle, setNewTitle] = useState(title);
    const [newItemTitle, setNewItemTitle] = useState('');
     const [isAdding, setIsAdding] = useState(false);
     const [ColumnEditModalVisible, setColumnEditModalVisible] = useState(false);

     const openColumnEditModal = () => setColumnEditModalVisible(true);

    const handleNewItemSubmit = async () => {
        if (newItemTitle.trim()) {
            await userStore.addNewItemToColumn(subjectId, newItemTitle, '');
            setNewItemTitle('');
        }
        setIsAdding(false);
    };
    
    const onCloseColumnEditModal = (changedTitle) => { 
        //console.log("onCloseColumnEditModal",changedTitle)
        setNewItemTitle(changedTitle)
        setColumnEditModalVisible(false)
    }
        
    const handleTitleSubmit = () => {
        //console.log("handleTitleSubmit",newTitle,title)
        if (newTitle.trim() && newTitle !== title) {
            userStore.renameColumn(subjectId, newTitle);
        }
        setIsEditMode(false);
    };

    const renderItem = ({ item, drag, isActive }) => (
        <View style={[styles.cardContainerDrugged, isActive ? styles.activeCard : {}]}>
            { <PollCard
                data={item}
                onLongPress={drag}
                columnIndex={subjectId}
            /> }
        </View>
    );

     const handleDragEnd = ({ data }) => {
         userStore.handleDragEnd(columnIndex, data);
     };

    return (
      <View style={styles.column}>
          {isEditMode ? (
              <Input
                  style={styles.text_input}
                  value={newTitle}
                  placeholder={t('Column name')}
                  onChangeText={setNewTitle}
                  onSubmitEditing={handleTitleSubmit}
                  onBlur={handleTitleSubmit}
                  autoFocus
              />
          ) : (
              <View style={styles.columnHeader}>
                  {/* <TouchableOpacity onPress={() => setIsEditMode(true)}>
                      <Text style={styles.columnTitle}>{newTitle || t('Column name')}</Text>
                  </TouchableOpacity> */}
                  <Text style={styles.columnTitle}>{newItemTitle || t('Column name')}</Text>
                  <TouchableOpacity onPress={openColumnEditModal}>
                      <Icon name="ellipsis-v" size={25} style={styles.ColumnEdit} /> 
                  </TouchableOpacity>
              </View>
          )}
  
          {isAdding ? (
              <Input
                  style={styles.text_input}
                  value={newItemTitle}
                  onChangeText={setNewItemTitle}
                  onSubmitEditing={handleNewItemSubmit}
                  onBlur={handleNewItemSubmit}
                  placeholder={t('Add_New_Item')}
                  autoFocus
              />
          ) : (
              <TouchableOpacity onPress={() => setIsAdding(true)} style={styles.leftBtn}>
                  <Text style={styles.text_input}>{t('Add_New_Item')}</Text>
              </TouchableOpacity>
          )}
  
          <View style={{ flex: 1 , marginTop: 10}}>
              <DraggableFlatList
                  data={reversedPolls}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.insightId.toString()}
                  onDragEnd={handleDragEnd}
                  activationDistance={10}
              />
          </View>
          
          <ColumnEditModal
              isVisible={ColumnEditModalVisible}
              onClose={() => setColumnEditModalVisible(false)}
              columnData={columnData}
              onCloseColumnEditModal={onCloseColumnEditModal}
          />
      </View>
  );
  });

export default PollColumn;
