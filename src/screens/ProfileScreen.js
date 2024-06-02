import React, { useState, useEffect } from 'react';
import { useColorScheme, View,Switch,TouchableOpacity } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import * as RNLocalize from 'react-native-localize';
import i18n from '../../i18n';
import getStyles from '../styles/styles';
import { userStore } from '../stores/UserStore';
import { observer } from 'mobx-react';

const ProfileScreen = observer(() => {
  const scheme = useColorScheme();
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const { t } = useTranslation();
  const [userName, setName] = useState('');
  const [aboutYourself, setAboutYourself] = useState('');
  const [goals, setGoals] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dark_mode, setDark_mode] = useState(scheme === 'dark');
  const [extended_mode, setExtended_mode] = useState(false);
  const [open, setOpen] = useState(false);
  const systemLanguage = RNLocalize.getLocales()[0].languageCode;
  const storedLanguage = userStore.Language; 
  const [_language, setLanguage] = useState(storedLanguage);



  useEffect(() => {

    const fetchUserData = async () => {
      try {
        
        const Profile = await userStore.read_Profile();
        if (Profile){
          const { name, aboutYourself, goals, birthday, extended_mode, dark_mode } = Profile;
          setName(name);
          setAboutYourself(aboutYourself);
          setGoals(goals);
          setDateOfBirth(birthday ? new Date(birthday) : new Date());
          setExtended_mode(extended_mode);
          setDark_mode(dark_mode);
        } 
        }
        catch (error) {
          console.error('Error fetching user data:', error);
        }
    };
    fetchUserData();
  }, []);

  // Save data whenever form fields or language change

    const saveData = async () => {
      try {
        await userStore.set_Profile(userName, aboutYourself, goals, dateOfBirth.toDateString(), extended_mode, dark_mode, userStore.Language, "");
        userStore.setUserName(userName);
        userStore.setExtended_mode(extended_mode);
        userStore.setDark_mode(dark_mode);
        
      } catch (error) {
        console.error('Error saving Profile data:', error);
      }
    };

  // Handle language change
  const _handleLanguageChange = async (selectedLanguage) => {
    try {
      //console.log('_handleLanguageChange:', selectedLanguage);
      setLanguage(selectedLanguage); // Update language state
      userStore.setLanguage(selectedLanguage);
      await saveData(); // Wait for data to be saved
      await i18n.changeLanguage(selectedLanguage); // Change language
      
    } catch (error) {
      console.error('Error updating language:', error);
    }
  };
  

  return (
    <View style={styles.main}>
      <Input
        label={t('Name')}
        value={userName}
        onChangeText={setName}
        onSubmitEditing={() => saveData()}
        mode="outlined"
        style={styles.text_input}
      />

      <Input
        label={t('Tell about yourself')}
        value={aboutYourself}
        onChangeText={setAboutYourself}
        onBlur={() => saveData()}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.text_input}
      />
      <Input
        label={t('What are your goals with this app?')}
        value={goals}
        onChangeText={setGoals}
        onBlur={() => saveData()}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.text_input}
      />
      <View style={styles.dobwrap}>
        <Text style={styles.general_text}>{t('date_of_birth')}</Text>
        <Button
          type="outline"
          buttonStyle={styles.dob}
          onPress={() => setOpen(true)}
          title={dateOfBirth.toDateString()}
          titleStyle={styles.general_text} 
        />
        <DatePicker
          modal
          open={open}
          date={dateOfBirth}
          onConfirm={date => {
            setOpen(false);
            setDateOfBirth(date);
            saveData(); 
          }}
          onCancel={() => setOpen(false)}
          mode='date'
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.general_text}>{t('language')}</Text>
        <Picker
          selectedValue={_language}
          onValueChange={_handleLanguageChange}
          style={styles.picker}
        >
          <Picker.Item label="עברית" value="he" />
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Português" value="pt" />

        </Picker>
      </View>
      <View style={styles.switch}>
        <Text style={styles.general_text}>{t('dark_mode')}</Text>
        <Switch 
          value={dark_mode} 
          onValueChange={(Value) => {
            setDark_mode(Value); // Update the name state
            saveData(); // Save the data
          }}
          trackColor={{ false: "#767577", true: "#81b0ff" }} 
          thumbColor={dark_mode ? 'rgb(0, 40,81)' : 'rgb(198, 226,255)'} />
      </View>
      <View style={styles.switch}>
        <Text style={styles.general_text}>{t('extended_mode')}</Text>
        <Switch 
          value={extended_mode} 
          onValueChange={(Value) => {
            setExtended_mode(Value); // Update the name state
            saveData(); // Save the data
          }}
          trackColor={{ false: "#767577", true: "#81b0ff" }} 
          thumbColor={extended_mode ? 'rgb(0, 40,81)' : 'rgb(198, 226,255)'} 
        />
      </View>
      {extended_mode && (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => userStore.export_data()} style={styles.export_dataBtn}>
            <Text style={styles.text_input}>{t('export data')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

export default ProfileScreen;
