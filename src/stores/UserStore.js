import { makeObservable, observable, action, computed,runInAction  } from 'mobx';
import * as Database from './database';
import * as InitializeDatabase from './initializeDatabase';
import { readString  } from 'react-native-csv'
import RNFS from 'react-native-fs';
import {exportToCSV} from './exportToCSV';
import initial_question_en from '../column_data/initial_question_en.json';
import initial_question_he from '../column_data/initial_question_he.json';
import initial_question_pt from '../column_data/initial_question_pt.json';
class UserStore {
  
  userName = "Default User";
  lists = []; // Observable array to store lists and cards
  columnSuggestions = [];
  extended_mode = false;
  dark_mode = false;
  score = 0;
  Profile = "";
  Language = "";

  setProfile(Profile){
    this.Profile=Profile
  }
  setLanguage(Language){
    this.Language=Language
  }

  getScore = async () => {
    const score = await Database.get_score();
    this.setScore(score);
  }
  setScore(score) {
    this.score = score;
  }  
  addScore = async (new_points, Reason = "") => {
    await Database.add_score(new_points, Reason);
    runInAction(() => {
        this.score += new_points; // Ensuring state modification is done within an action
    });
};

  setLists(newLists) {
    this.lists = newLists;
  }  
  removeColumnFromList(columnIndex) {
    this.lists.splice(columnIndex, 1);
  }
  updateCard(updatedCard){
    const columnIndex = this.lists.findIndex(column => column.id === updatedCard.columnId); // Find the column by columnId
    if (columnIndex !== -1) {
      const cardIndex = this.lists[columnIndex].polls.findIndex(card => card.id === updatedCard.id); // Find the card by id within the column
      if (cardIndex !== -1) {
        // Update the card's title and description
        this.lists[columnIndex].polls[cardIndex].title = updatedCard.title;
        this.lists[columnIndex].polls[cardIndex].description = updatedCard.description;
      }
    }
  }

  addNewColumnToList(newColumn){
    this.lists.push(newColumn);
  }
  addNewQuestionsToColumn(columnIndex,newItem){
    this.lists[columnIndex].polls.push(newItem);
  } 
  initDB = async () => {
    //console.log('UserStore initDB 1');
    
    await InitializeDatabase.initDB(); // Initialize the database
    //console.log('UserStore initDB 2');
    await this.get_Profile();
    //console.log('UserStore initDB 3');
    this.read_suggested_column_data();
    //console.log('UserStore initDB 4');
    data = await Database.readDataFromDB(); // Read data after initialization is complete
    console.log('--UserStore initDB 5',data);
    this.setLists(data);
    await this.getScore();
    //console.log('UserStore initDB 6');
    //this.testToReset();
    //console.log('UserStore initDB 7');
    //console.log('UserStore initDB 2', this.dark_mode);
    //I18nManager.allowRTL(true);
    // Force RTL on Android
    //I18nManager.forceRTL(true);
    
  };

  constructor() {
    
    makeObservable(this, {
      Profile: observable,
      Language: observable,
      setProfile: action,
      setLanguage: action,
      setScore: action,
      score: observable,
      columnSuggestions: observable,
      setColumnSuggestions: action,
      userName: observable,
      lists: observable,
      extended_mode: observable,
      dark_mode: observable,
      isDarkModeEnabled: computed,
      isExtended_modeEnabled: computed,
      setUserName: action,
      setLists: action,
      renameColumn : action,
      renameColumnDesc : action,
      addNewColumnToList : action,
      deletePollFromColumn: action, 
      removeColumnFromList: action,
      updateCard: action,
      addNewQuestionsToColumn: action,
      setDark_mode: action,
      setExtended_mode: action,
    });
    //this.initDB();

  }

  async initUserName() {
    this.setUserName(this.userName || 'my name'); // Fallback to 'Default User' if no name is found
  }
  setUserName(newName) {
    this.userName = newName;
  }
  setExtended_mode(value) {
    this.extended_mode = value;
    //console.log('UserStore extended_mode', value, this.extended_mode);
  }
  setDark_mode(value) {
    this.dark_mode = value;
    //console.log('UserStore dark_mode', value);
  }
  get isDarkModeEnabled() {
    return this.dark_mode;
  };
  get isExtended_modeEnabled() {
    return this.extended_mode;
  };


  addNewItemToColumn = action( async (columnId, newItemTitle,newDescription) => {
    let columnIndex = this.lists.findIndex(column => column.columnIndex === columnId);
    console.log('UserStore addNewItemToColumn', columnId, newItemTitle,columnIndex);
    
    if (columnIndex !== -1) {
      let Questions_order = this.lists[columnIndex].polls.length;

      console.log("Before Before adding to polls:", this.lists[columnIndex].polls);
      console.log("Before Before adding to polls:", this.lists[columnIndex].polls.length);


      console.log('UserStore Questions_order','columnId', columnId,'newItemTitle', newItemTitle,'newDescription', newDescription,'Questions_order',Questions_order);
      let results = await  Database.addInsight (columnId, newItemTitle, newDescription,Questions_order );
      console.log('UserStore addNewItemToColumn results', results);
      const newItem = {
        id: results.insertId, 
        title: newItemTitle,
        description: newDescription, // or any default description
        Questions_order: Questions_order,
        rating:-1,
        rating_id:-1,
      };
      console.log('UserStore addNewItemToColumn end newItem', newItem);
      console.log("Before adding to polls:", this.lists[columnIndex].polls);
      console.log("Before adding to polls:", this.lists[columnIndex].polls.length);
      this.addNewQuestionsToColumn(columnIndex,newItem)
      console.log("after adding to polls:", this.lists[columnIndex].polls);
      console.log("after adding to polls:", this.lists[columnIndex].polls.length);
      console.log('UserStore addNewItemToColumn end lists polls', this.lists[columnIndex].polls);
    }
    
  });

  handleDragEnd = action((columnId, newData) => {
    const columnIndex = this.lists.findIndex(column => column.columnIndex === columnId);
    //console.log('UserStore handleDragEnd', columnTitle,columnIndex," end data", newData);
    if (columnIndex !== -1) {
      // Directly updating the polls of the specific column
      this.lists[columnIndex].polls = newData.reverse();
      Database.updatePollOrderInDB(columnId,newData);
    }
  });

  addNewColumn = async (title = '') => { // Default title if none provided
    this.addScore(1)
    console.log('UserStore addNewColumn',title);
    try {
      const columnIndex = await Database.addSubject(title);
      if (typeof columnIndex !== 'undefined') { // Validate columnIndex
        const newColumn = {
          title: title,
          columnIndex: columnIndex,
          polls: [],
        };
        this.addNewColumnToList(newColumn)
        //console.log('UserStore addNewColumn', columnIndex);
      } else {
        console.error('Failed to add new column, no index returned');
      }
    } catch (error) {
      console.error('Error in addNewColumn:', error);
      // Handle the error appropriately (e.g., user feedback, retry logic)
    }
  };

  renameColumn = (columnId, newTitle) => {
    //console.log('UserStore renameColumn', oldTitle, newTitle);
    const columnIndex = this.lists.findIndex(column => column.columnIndex === columnId);
    if (columnIndex !== -1) {
      this.lists[columnIndex].title = newTitle;
      //console.log('UserStore renameColumn 2', columnIndex, newTitle);
      Database.renameColumn(this.lists[columnIndex].columnIndex, newTitle)
    }
  };  
  renameColumnDesc = (columnId, description) => {
    //console.log('UserStore renameColumn', oldTitle, newTitle);
    const columnIndex = this.lists.findIndex(column => column.columnIndex === columnId);
    if (columnIndex !== -1) {
      this.lists[columnIndex].description = description;
      //console.log('UserStore renameColumn 2', columnIndex, newTitle);
      Database.renameColumnDesc(this.lists[columnIndex].columnIndex, description)
    }
  };
  deletePollFromColumn = (columnId, pollId) => {
    //console.log('UserStore deletePollFromColumn', columnId, pollId);
    const columnIndex = this.lists.findIndex(column => column.columnIndex === columnId);
    if (columnIndex !== -1) {
      this.lists[columnIndex].polls = this.lists[columnIndex].polls.filter(poll => poll.id !== pollId);
    }
    Database.deleteCard(pollId);
  };
  update_observation = (cardData, rating,content,TIMESTAMP) => {
    //return Database.update_card_rating(cardData.rating_id, rating);
    return Database.update_observation(cardData.rating_id,rating,content,TIMESTAMP);
  };
  rate_card = (cardData, rating,content) => {
    this.addScore(1)
    // Return the promise chain
    return Database.add_new_observation = (cardData.id, rating,content)
      .then(insertId => {
        //console.log("New row ID:", insertId);
        // Resolve the promise with the insertId
        return insertId;
      })
      .catch(error => {
        console.error("Error inserting new rating:", error);
        // Reject the promise with an error or return a specific value indicating failure
        throw error; // This will allow the caller to catch this error
        // Or return a specific value (e.g., return -1) if you don't want to throw an error
      });
  };
  

  update_card = (cardId, title, description) => {
    //console.log('UserStore update_card',cardId, title, description);
    Database.update_card(cardId, title, description);
    this.getCardById(cardId)// update card
  };

  addNote_pastToCard = async (cardId, rateId, note_past) => {
    this.addScore(1)
    try {
      // If Database.addNoteToCard is asynchronous and returns a Promise:
      const result = await Database.addNote_pastToCard(cardId, rateId, note_past);
      // Assuming Database.addNoteToCard resolves with some result or value on success
      return result; // or simply return true if there's no meaningful result to return
    } catch (error) {
      console.error('Error in addNote past:', error);
      throw error; // Rethrow or handle error as needed
    }
  }
  addNote_currentToCard = async (cardId, rateId, note_current) => {
    this.addScore(1)
    try {
      // If Database.addNoteToCard is asynchronous and returns a Promise:
      const result = await Database.addNote_currentToCard(cardId, rateId,  note_current);
      // Assuming Database.addNoteToCard resolves with some result or value on success
      return result; // or simply return true if there's no meaningful result to return
    } catch (error) {
      console.error('Error in addNote current:', error);
      throw error; // Rethrow or handle error as needed
    }
  }  
  addNote_futureToCard = async (cardId, rateId, note_future) => {
    this.addScore(1)
    try {
      // If Database.addNoteToCard is asynchronous and returns a Promise:
      const result = await Database.addNote_futureToCard(cardId, rateId, note_future);
      // Assuming Database.addNoteToCard resolves with some result or value on success
      return result; // or simply return true if there's no meaningful result to return
    } catch (error) {
      console.error('Error in addNote future:', error);
      throw error; // Rethrow or handle error as needed
    }
  }
  editNoteOnCard = (cardId, noteId, newContent) => {
    //console.log('UserStore editNoteOnCard',noteId, newContent);
    Database.editNoteOnCard(cardId, noteId, newContent);
  }
  deleteNoteFromCard = (cardId, noteId) => {
    //console.log('UserStore deleteNoteFromCard',cardId, noteId);
    Database.deleteNoteFromCard(cardId, noteId) ;
  }
  getCardsObservation = async (cardId) => {
    //console.log('UserStore getCardsObservation', cardId);
    try {
      const notes = await Database.getCardsObservation(cardId);
      //console.log('getCardsObservation notes', notes);

      return notes;
    } catch (error) {
      console.error('Error in getCardsObservation:', error);
      // Handle the error appropriately
    }
  }
  getRecentNotesForCard = async (cardId) => {
    //console.log('UserStore getRecentNotesForCard', cardId);
    try {
      const mostRecent = await Database.fetchMostRecentPastAndFutureNotes(cardId)
      //console.log('getRecentNotesForCard mostRecentPast, mostRecentFuture', mostRecent);
      return mostRecent;
    } catch (error) {
      console.error('Error in getRecentNotesForCard:', error);
      // Handle the error appropriately
    }
  }
  handleDeleteColumn = async (columnId) => {

    try {
      const columnIndex = this.lists.findIndex(column => column.columnIndex === columnId);
  
      if (columnIndex !== -1) {
        // First, handle any associated polls
        if (Array.isArray(this.lists[columnIndex].polls) && this.lists[columnIndex].polls.length > 0) {
          this.lists[columnIndex].polls.forEach((poll, index) => {
            //console.log('handleDeleteColumn poll:', poll);
            Database.deleteCard(poll.id); // Assuming this is an async operation but not awaited here
          });
        }
        await Database.deleteColumn(columnId); 
        // Delete the column from the database
        //const id = this.lists[columnIndex].id;
        
  
        // Finally, remove the column from the lists array
        // Wrap modifications in runInAction
        this.removeColumnFromList(columnIndex)

        // Optionally, if this method is part of a class component, you might need to update the state to re-render the component
        // this.setState({ lists: this.lists });
        // Or if using a functional component with hooks, setLists([...this.lists]);
      }
    } catch (error) {
      console.error(`Failed to delete column ${columnId}:`, error);
      throw error; // Rethrow or handle as needed
    }
  };
  fetchRatingsForCard = async (cardId) => {
      //console.log('UserStore fetchRatingsForCard', cardId);
      try {
        const ratings = await Database.fetchRatingsForCard(cardId);
        //console.log('UserStore fetchRatingsForCard', cardId, ratings);
        return ratings;
      } catch (error) {
        console.error('Error in fetchRatingsForCard:', error);
        // Handle the error appropriately
      }
    }
  getCardById = async (cardId) => {
      //console.log('UserStore getCardById 1', cardId);
      try {
        const Card = await Database.getCardById(cardId);
        //console.log('UserStore getCardById 2 ', cardId, Card);
        this.updateCard(Card)
        //console.log('UserStore getCardById 3 ');
        return Card;
      } catch (error) {
        console.error('userStore Error in getCardById:', error);
        // Handle the error appropriately
      }
    }
    setColumnSuggestions  = (data) => {
      this.columnSuggestions = data
    }

    getCategoryValues = () => {
      // Initialize an empty array to hold all the Category values
      let allCategoryValues = [];
    
      // Iterate over each key in the columnSuggestions object
      Object.keys(this.columnSuggestions).forEach(catKey => {
        // For each category key, access its array of objects
        const objectsArray = this.columnSuggestions[catKey];
    
        // Extract the Category value from each object in the array (if it exists) and add to the allCategoryValues array
        objectsArray.forEach(obj => {
          // Assuming the object has a property named 'Category' you want to extract
          if(obj.Category && !allCategoryValues.includes(obj.Category)) {
            allCategoryValues.push(obj.Category);
          }
        });
      });
    
      //console.log("All unique Category values:", allCategoryValues);
      return allCategoryValues;
    };

    
    getNewColumnsNames  = () => {

      const newCategories = this.getCategoryValues();

      const existCategories = this.lists.map(list => list.title); // Assuming each list item has a 'title' property that matches the category names
      
      const uniqueNewCategories = newCategories.filter(category => !existCategories.includes(category));
    
      return uniqueNewCategories
    }
    // Function to group data by category
    groupByCategory(items,_init) {
      return items.reduce((acc, item) => {
        //console.log('userStore Error in getCardById:', acc);
          // Trim to ensure no leading/trailing whitespace issues
          const category = item["Main"];
        
          // Initialize the category list if not already present
          if (!acc[category]) {
              acc[category] = [];
          }
          // Check if item.init matches the provided init or is empty if init is ""
          if ((_init === "1" && item.init === "1") || (_init === "" && !item.init)) {
            //console.log('userStore Error in getCardById:',_init, item);
            acc[category].push(item);
          }

          return acc;
      }, {});
      //console.log('userStore Error in getCardById:', acc);
    }
    
    getInitial_questionJSON = ()=> {
      let lang = this.Language;

      let initial_question = initial_question_en
      if (lang == 'he'){
         initial_question = initial_question_he
       }
       if (lang == 'pt'){
        initial_question = initial_question_pt
      }
       return initial_question;
    }
    read_suggested_column_data = async ()=> {
      try {
        //console.log('read_suggested_column_data start')
        const initial_question = this.getInitial_questionJSON();
        //console.log('read_suggested_column_data initial_question',categorizedData)
        const categorizedData = this.groupByCategory(initial_question,"");
        //console.log('read_suggested_column_data categorizedData',categorizedData)
        this.setColumnSuggestions(categorizedData)
        //console.log('read_suggested_column_data end')

      }catch (error) {
        console.error('CsvReader: 1', error);
        // Handle the error appropriately
      }
    }
  export_data = async () => {
    let Language = this.Language
    //console.log('lang:', lang);
    await exportToCSV(Language);
  }  

  addNewColumnFromInit_list = async (categoryName) => {
    // Find the Main value that corresponds to the given category name
    let foundMain = null;
    Object.entries(this.columnSuggestions).forEach(([main, items]) => {
        const hasCategory = items.some(item => item.Category === categoryName);
        if (hasCategory) {
            foundMain = main;
            return;
        }
    });

    if (foundMain) {
      await this.addNewColumn(categoryName); // Adds a new column based on the found Main value
      
      // Use the found Main value to access the corresponding items
      const categoryData = this.columnSuggestions[foundMain];
      //console.log('Category Data:', categoryData);
      
      // Assuming `this.lists` is updated to include the new column, find its index
      const columnIndex = this.lists.findIndex(column => column.title === categoryName);
      if (columnIndex !== -1) {
          const columnId = this.lists[columnIndex].columnIndex; // Assuming it's columnIndex and not columnId
          //console.log('Column Index:', columnIndex, 'Column ID:', columnId);
          for (const item of categoryData) {
            try {
                await this.addNewItemToColumn(columnId, item["Questions"], item["Description"]);
            } catch (error) {
                console.error("Error adding new item to column:", error);
                // Handle the error appropriately (e.g., continue with the next item, or break out of the loop)
            }
        }
      }
    } else {
        console.log('No Main group found for category:', categoryName);
    }
}
read_Profile = async () => {
  return await Database.get_Profile();
}
get_Profile = async () => {
  const Profile = await this.read_Profile();
  //console.log('Profile:', Profile);
  if (Profile) {
    const { name, aboutYourself, goals, birthday, extended_mode, dark_mode, Language, additional_info } = Profile;
    this.setUserName(name)
    this.setExtended_mode(extended_mode)
    this.setDark_mode(dark_mode)
    this.setProfile(Profile)
    this.setLanguage(Language)

  } else {
    //console.log('No profile found');
  }
};
 
set_Profile = async ( name,aboutYourself,goals,birthday,extended_mode,dark_mode,Language,additional_info) => {
  //console.log('set_Profile:', name,aboutYourself,goals,birthday,extended_mode,dark_mode,Language,additional_info);
  await Database.set_Profile( name,aboutYourself,goals,birthday,extended_mode,dark_mode,Language,additional_info);

} 
testToReset = async () => {
  //console.log('testToReset');
  if (this.lists.length === 0) {
    const initial_question = this.getInitial_questionJSON();
    const initCategorizedData = this.groupByCategory(initial_question, "1");
    for (const categoryName in initCategorizedData) {
      for (const [foundMain, items_cat] of Object.entries(initCategorizedData)) {
        const hasCategory = items_cat.some(item => item.Main === categoryName && item.init === "1");
        if (hasCategory) {
          const categoryData = initCategorizedData[foundMain];
          for (const _item of categoryData) {

            let columnIndex = this.lists.findIndex(column => column.title === _item.Category);
            if (columnIndex === -1) {
              await this.addNewColumn(_item.Category);
              columnIndex = this.lists.findIndex(column => column.title === _item.Category);
            }
            if (columnIndex !== -1) {
              const columnId = this.lists[columnIndex].columnIndex;
              console.log('Column Index:', columnIndex, 'Column ID:', columnId);
              await this.addNewItemToColumn(columnId, _item["Questions"], _item["Description"]);
            } else {
              console.log('No Main group found for category:', categoryName);
            }
          }
        }
      }
    }
  }
};


}

export const userStore = new UserStore();
