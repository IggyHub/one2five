import React from 'react';
import { View, Dimensions, ScrollView, Platform ,StyleSheet } from 'react-native';
import PollColumn from '../components/PollColumn';
import AddNewColumn from '../components/AddNewColumn';
import { observer } from 'mobx-react';
import { userStore } from '../stores/UserStore'; 
import { toJS } from 'mobx';
import getStyles from '../styles/styles'; // Assuming this path is correct

const TrelloLikeScreen = () => {
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const handleAddNewColumn = () => {
    userStore.addNewColumn(); // Ensure this method exists in your userStore
  };


  const { width: screenWidth } = Dimensions.get('window');

    // Calculate the spacer size to center the first and last item
    // Assuming all your columns are of the same width, and you want them centered
    cardWidth = screenWidth * 0.8; // Example: Your items are 80% of screen width
  const spacingForCardInset = screenWidth * 0.1; // Adjust as needed

  return (
    <View style={styles.main}> 
    <ScrollView  
    style={styles.ScrollViewTrelloLikeScreen}
    //style={styles.fullScreen}
    horizontal 
    //nestedScrollEnabled={true}
      pagingEnabled={false} // Disable default paging to use custom snap interval
      decelerationRate={0} // Disable deceleration to snap directly
      snapToInterval={cardWidth + 10} // Adjust the interval to the card width plus some spacing
      snapToAlignment="start" // Ensure cards align to the start
      contentInset={{ // iOS only
        top: 0,
        left: spacingForCardInset, // Space for the first item
        bottom: 0,
        right: spacingForCardInset // Space for the last item
      }}
      contentContainerStyle={{
        paddingHorizontal: Platform.OS === 'android' ? spacingForCardInset : 0 // Android alternative for contentInset
      }}
      showsHorizontalScrollIndicator={false}
    >

      {toJS(userStore.lists).map((column, index) => (
        <View key={index} style={{ width: cardWidth + 10, paddingHorizontal: 5 }}>
          <PollColumn
          key={index}
            columnData={column}
          />
        </View>
      ))}
      <View style={{ width: cardWidth + 10, paddingHorizontal: 5 }}>
        <AddNewColumn onAddNewColumn={handleAddNewColumn} />
      </View>
    </ScrollView>
    </View>
  );
};

export default observer(TrelloLikeScreen);
