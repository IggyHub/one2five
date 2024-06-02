import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import getStyles from '../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import CardEditModal from './CardEditModal'; // Import the modal component
import { userStore } from '../stores/UserStore';
import RatingStars from './RatingStars';
import AddNoteModal from './AddNoteModal';
import { observer } from 'mobx-react';

const PollCard = observer(({ data, onLongPress ,columnIndex}) => {
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const [starCount, setStarCount] = useState(data.rating);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteAdded, setNoteAdd] = useState(false);
  const resetNoteAddedFlag = () => setNoteAdd(false);
  const [ratingAdded, setRatingAdd] = useState(false);
  const resetRatingAddedFlag = () => setRatingAdd(false);
  const [last_rate_ID, setLast_rate_ID] = useState(-1);
  const icon_size = 20;
  const [modalVisible, setModalVisible] = useState(false);

  const debugPollCard = true
  console.log("PollCard _start",data)
  const onSaveNote = (added) => {
    if (debugPollCard)
      console.log("PollCard onSaveNote", added,cardData.id, noteText)
    
    if (added) {
      setLast_rate_ID(-1)
      setNoteAdd(added)
    }
  };
  
  const openNoteModal = () => setNoteModalVisible(true);
  const closeNoteModal = () => setNoteModalVisible(false);


  const onRate = (cardData, rating) => {
    if (debugPollCard)
      console.log("PollCard onRate 0", cardData, rating);
    // Assuming you have cardData and rating available
    if (cardData.rating!=-1){// Iggy change here for testing
      //update
      if (debugPollCard)
        console.log("PollCard update",  rating);
      content=''
      TIMESTAMP=''
      userStore.update_observation(cardData, rating,content,TIMESTAMP)
    }
    else{
      if (debugPollCard)
        console.log("PollCard new",  rating);
      cardData.rating  =rating
      userStore.rate_card(cardData, rating,'')
      .then(insertId => {
        //console.log("Rate card succeeded with new row ID:", insertId);
        setLast_rate_ID(insertId)
        setRatingAdd(true)
        // You can now use insertId as needed, e.g., update UI or state
      })
      .catch(error => {
        console.error("Rate card failed:", error);
        // Handle the error, e.g., show an error message
      });
    };
    }
    

  const openEditModal = (cardData) => {
    //console.log("openEditModal", cardData);
    setModalVisible(true);
    setStarCount(cardData.rating)
  };

  return (
    <TouchableOpacity
      onPress={() => openEditModal(data)}
      onLongPress={() => onLongPress && onLongPress(data)} // Long press handler for reordering
      style={styles.card}
    >
      <Text style={styles.text_input}>{data.title}</Text>
      <Text style={styles.text_input}>{data.description}</Text>

      <RatingStars
        data={data} // Pass the relevant data here
        starCount={starCount}
        setStarCount={setStarCount}
        onRate={onRate}
        last_rate_ID={last_rate_ID}
        openNoteModal={openNoteModal}
      />

      <CardEditModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        cardData={data}
        resetNoteAddedFlag={resetNoteAddedFlag}
        noteAdded_flag={noteAdded}
        resetRatingAddedFlag={resetRatingAddedFlag}
        ratingAdded_flag={ratingAdded}
        columnIndex={columnIndex}
      />
      <AddNoteModal
        isVisible={noteModalVisible}
        onClose={closeNoteModal}
        cardData={data}
        last_rate_ID={last_rate_ID}
        onSaveNote={onSaveNote}
      />


    </TouchableOpacity>
  );
});

export default PollCard;
