import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import getStyles from '../styles/styles';
import { useTranslation } from 'react-i18next';
import { userStore } from '../stores/UserStore';
import { observer } from 'mobx-react';

const AddNewColumn = observer(({ onAddNewColumn }) => {
  const { t } = useTranslation();
  const styles = getStyles(userStore.isDarkModeEnabled ? 'dark' : 'light');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      // Assuming getNewColumnsNames is now an async function
      const newCategories = await userStore.getNewColumnsNames();
      setCategories(newCategories);
    }
  
    fetchCategories();
  }, []);
  // Function to handle category button press
  const onCategoryPress = (createNewCategory) => {
    // Implement what happens when a category is pressed

    const updatedCategories = categories.filter(category => category !==  createNewCategory);

    setCategories(updatedCategories);
    userStore.addNewColumnFromInit_list(createNewCategory)
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Add New Column Button */}
      <TouchableOpacity onPress={onAddNewColumn} style={styles.newColumnBtn}>
        <Text style={styles.addButtonText}>{t('Add_New_column')}</Text>
      </TouchableOpacity>

      {/* Dynamically generated category buttons */}
      {categories.map((category, index) => (
        <TouchableOpacity key={index} onPress={() => onCategoryPress(category)} style={styles.newColumnBtn}>
          <Text style={styles.addButtonText}>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

export default AddNewColumn;
