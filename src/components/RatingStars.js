import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ensure you have the right import for Icon
import { userStore } from '../stores/UserStore';
import getStyles from '../styles/styles';

const RatingStars = ({ data, starCount, setStarCount, onRate, last_rate_ID, openNoteModal }) => {
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const icon_size = 20; // Define the base icon size, adjust as needed

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row' }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setStarCount(index + 1);
              onRate(data, index + 1);
            }}
            style={{ paddingHorizontal: 4 }}
          >
            <Icon
              name="star"
              size={icon_size + index * 1.5}
              color={index < starCount ? '#F44336' : '#E0E0E0'}
            />
          </TouchableOpacity>
        ))}
      </View>
      {last_rate_ID >= 0 && (
        <TouchableOpacity onPress={openNoteModal} hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}>
          <Icon name="sticky-note" size={icon_size + 3 * 1.5} style={styles.IconStar} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RatingStars;
