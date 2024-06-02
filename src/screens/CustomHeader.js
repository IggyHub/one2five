import React from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { inject, observer } from 'mobx-react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { useTranslation } from 'react-i18next';

const CustomHeader = inject('userStore')(observer(({ userStore }) => {
  const navigation = useNavigation(); // Hook to get the navigation object
  const { t } = useTranslation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <MaterialIcons name="person" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{userStore.userName}</Text>
      </View>
      <View style={styles.userScoreContainer}>
        <Text style={styles.userScore}>{t('score')} {userStore.score}</Text>
      </View>
    </View>
  );
}));

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute items along the main axis (horizontally) evenly
    padding: 10,
    backgroundColor: '#d0d0d0',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: '#000',
  },
  userScoreContainer: {
    flexDirection: 'row', // Ensure the score is displayed horizontally
  },
  userScore: {
    marginLeft: 10,
    color: '#000',
  },
});

export default CustomHeader;
