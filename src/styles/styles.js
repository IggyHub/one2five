import { StyleSheet } from 'react-native';

const getStyles = (scheme) => {
  const backgroundColor = scheme === 'dark' ? 'rgba(60, 90,140, 1.0)' : '#fff';
  const columnBackgroundColor = scheme === 'dark' ? 'rgba(46, 68,105, 1.0)' : '#fff';
  const cardBackgroundColor = scheme === 'dark' ? 'rgba(33, 50,78, 1.0)' : '#fff';
  const textColor = scheme === 'dark' ? '#FFF' : '#000';
  const btnColor = scheme === 'dark' ? '#bbb' : '#333';
  const modalBackgroundColor = scheme === 'dark' ? 'rgba(0, 54,108, 1.0)' : 'rgba(236, 238,240, 1.0)';
  const activeColor = 'rgba(91, 126,185, 1.0)'; // A pleasant blue for active elements, adjust as needed
  const closeButtonColor = 'rgba(151, 29,24, 0.90)';
  const cardBorderRadius = 20
  //const textColor= 'red'
  //const placeholderTextColor= scheme === 'dark' ? '#F0F' : '#F55'; // Optional: Adjust placeholder text color based on the theme

  
  return StyleSheet.create({
    
    main: {
      flex: 1,
      padding: 1,
      backgroundColor: backgroundColor,
    },
    ScrollViewTrelloLikeScreen: {
      //flex: 1,
      backgroundColor: backgroundColor,
      maxHeight: 800,
    },
    text_input: {
      //borderWidth: 2, // Set the border width
      //borderColor: '#010', // Set the border color
      //borderRadius: 5, // Optional: if you want rounded corners
      //padding: 3, // Add some padding inside the TextInput
      //textColor: textColor,
      color: textColor,
      fontSize:14
      //placeholderTextColor : 'green'
    },    
    header: {
      flexDirection: 'row', // Align items horizontally
      alignItems: 'center', // Vertically center the items in the container
      justifyContent: 'space-between', // Space out the Text and Button on opposite ends
      // Add any other styling as needed (e.g., padding, backgroundColor)
    },

    row: {
      flexDirection: 'row', // Align children horizontally
      alignItems: 'center', // Center children vertically in the container
      justifyContent: 'space-between', // Distribute extra space evenly
      backgroundColor: backgroundColor,
      // Add any additional styling as needed
    },
    picker: {
      width: '50%', // Adjust the width as needed
      // Add any additional styling as needed
      color: textColor,
      backgroundColor: backgroundColor,
    },
    switch: {
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'space-between',
      color: textColor
    },

    dobwrap: {
      flexDirection: 'row', // Align items in a row
      alignItems: 'center', // Vertically center the items
      justifyContent: 'space-between', // Space out the Text and Button
      padding: 10, // Add padding around the container for better spacing
      //width: '80%',
      //marginBottom: 20,
    },
    dob: {
      //borderRadius: 4,
      //alignItems: 'flex-start',
      marginLeft: 10,
    },
    general_text: {
      color: textColor, // Example text color
      fontSize:12
      //textColor: textColor
      // Add other text styling as needed (e.g., fontSize)
    },
    card: {
      padding: 10,
      backgroundColor: cardBackgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      borderRadius: cardBorderRadius,
      overflow: 'hidden',
      marginBottom: 10,
      },
      dateTimeDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
      },
    activeCard: {
      borderRadius: cardBorderRadius,
      overflow: 'hidden',
      backgroundColor: cardBackgroundColor, // Set your desired color here
      marginBottom: 10,
        },
      cardContainerDrugged: {
        borderRadius: cardBorderRadius, // Adjust the value as needed for the desired roundness
        overflow: 'hidden', // Ensure content is clipped to the rounded shape
        marginBottom: 10, // Add margin between cards if needed
        backgroundColor: cardBackgroundColor,
        },
    column: {
      width: 300,
      backgroundColor: columnBackgroundColor,
      padding: 10,
      margin: 10,
      flex: 1
    },
    columnHeader:{
      flexDirection: 'row',
      //alignItems: 'flex-start',
      alignSelf: 'flex-end',
    
      right: 0,
      //alignItems: 'center', 
      //justifyContent: 'space-between',
    },

    columnTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      //marginBottom: 10,
      color: textColor,
      //padding: 5,
    },
    ColumnEdit: {
      marginTop: -7, // Adjust the margin top to align the icon with the top of the text
      padding: 10,
      color: btnColor,
    },
    Icon: {
      //marginTop: -15, // Adjust the margin top to align the icon with the top of the text
      //padding: 20,
      color: btnColor,
    },
    IconStar: {
      //marginTop: -15, // Adjust the margin top to align the icon with the top of the text
      //padding: 20,
      color: btnColor,
    },
    flatListContainer: {
        flex: 1,
        marginTop: 10, // Add some margin to create space between the FlatList and the button
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftBtn: {
      margin: 5,
      padding: 5,
      backgroundColor: activeColor,
      borderRadius: 15,
      //position: 'absolute',
      //left: 5, // Adjust the position as needed
      //flexGrow: 1, // Take up available space
      //flexShrink: 1, // Allow shrinking if needed
    },
    space: {
      width: 100, // or whatever size you need
      height: 20,
    },
    closeBtn: {
      margin: 5,
      padding: 5,
      backgroundColor: closeButtonColor,

      borderRadius: 15,
      //position: 'absolute',
      //right: 5, // Adjust the position as needed
      //flexGrow: 1, // Take up available space
      //flexShrink: 1, // Allow shrinking if needed
    },
    newColumnBtn: {
      margin: 10,
      padding: 10,
            backgroundColor: activeColor,
      borderRadius: 15,
      alignSelf: 'flex-start',
      left: 1,
      minWidth: 300, 
    },
    export_dataBtn: {
      margin: 10,
      padding: 10,
            backgroundColor: activeColor,
      borderRadius: 15,

    },

    addButtonText: {
      fontWeight: 'bold',
      color: '#FFFFFF',
          },
    noteText: {
      marginRight: 10,
      flexWrap: 'wrap',
      color: textColor,
    },
    noteActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    noteContainer: {
      flex: 1,
    },
    addNoteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    modalBackdrop: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Adjust based on your layout preference
      width: '100%', // Match width with the text input
    },
    buttonSpacer: {
      width: 10, // Adjust the space between the buttons
    },
    closeButton: {
      //color: closeButtonColor,
      alignSelf: 'flex-end',
      right: 0,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      alignItems: 'center',
      margin: 20,
      width: '80%',
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    ratingsGraphContainer: {
      width: '100%', // Adjust as needed
      alignItems: 'center', // Center content horizontally
      justifyContent: 'center', // Center content vertically if needed
      marginBottom: 20,
      marginTop: 20,
    },

    container: {
      flexDirection: 'column',
      //borderWidth: 1,
      //borderRadius: 5,
      //padding: 10,
      //marginBottom: 20,
      width: '100%',
    },
    flatListContainer: {
      
      //Height: 200, // Set a fixed height
      height: '50%',
      width: '100%',
      borderWidth: 3, // Width of the border
      borderColor: '#10C', // Color of the border
      borderRadius: 5, // Optional: if you want rounded corners
      //flex: 1, // Use flex if you want it to expand to fill the available space
      padding: 10, // Add padding if you want some space around the FlatList
    },
    MultilineInput_textInputParentView: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 10,
      height: 100, // Set your desired height
      width: 250, // Set your desired width
      // Add any additional styles for your input container
    },
    MultilineInput_rtlTextInputParentView: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
    },
    MultilineInput_text_input: {
      flex: 1,
      //borderWidth: 2, // Set the border width
      //borderColor: '#010', // Set the border color
      //borderRadius: 5, // Optional: if you want rounded corners
      //padding: 3, // Add some padding inside the TextInput
      //textColor: textColor,
      color: textColor,
      fontSize:14
      //placeholderTextColor : 'green'
    }, 
  });
};

export default getStyles;
