import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import SQLite from 'react-native-sqlite-storage';
import Share from 'react-native-share';
  // Function to convert data to CSV format
  const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(',');
    const csvData = data.map(row => Object.values(row).join(',')).join('\n');
    return `${header}\n${csvData}`;
  };

// Function to export data to CSV file
const exportToCSV = async (lang) => {
  try {
    const databaseName = 'one2five.db';
    const dbExport = SQLite.openDatabase({ name: databaseName, location: 'default' });

    
    const filteredResultes = await getFilteredResults(dbExport);
    const columnIds = filteredResultes.map(result => result.columnId);

    const columnsData = await getColumns(dbExport, columnIds);
    const questionIdS = filteredResultes.map(result => result.questionId);
    const questionsData = await getQuestions(dbExport, questionIdS);
    const resultsData = await getResults(dbExport, questionIdS);

    const notesData = await getTableData(dbExport,"Notes", questionIdS);
    const notesPastData = await getTableData(dbExport, "Notes_past");
    const notesFutureData = await getTableData(dbExport, "Notes_future");
    // Combine data from all tables
    const combinedData = [...columnsData, ...questionsData, ...notesData, ...notesPastData, ...notesFutureData, ...resultsData];

    // Convert combined data to CSV format
    const csvData = convertToCSV(combinedData);

    // Create file with CSV data
    const filePath = `${RNFS.DocumentDirectoryPath}/data.csv`;
    let utf8Bom = ''
    if (lang == "he") {
      utf8Bom = '\uFEFF'; // UTF-8 Byte Order Mark
    }
    await RNFS.writeFile(filePath, utf8Bom + csvData, 'utf8');

    //console.error('shareCSV filePath:', filePath);
    // Share the CSV file
    await shareCSV(filePath);
    
    dbExport.close();
  } catch (error) {
    console.error('Error exporting data:', error);
  }

  };
const getColumns = async (dbExport, columnIds) => {

  // Create a Set to remove duplicates
  const uniqueColumnIds = new Set(columnIds);

  // Convert Set back to array (if needed)
  const uniqueColumnIdsArray = Array.from(uniqueColumnIds);

  // Generate placeholders for the IDs
  const placeholders = uniqueColumnIdsArray.map(() => '?').join(', ');

  // SQL query with placeholders
  const sqlQuery = `SELECT * FROM Columns WHERE id IN (${placeholders});`;
  return new Promise((resolve, reject) => {
  // Execute the query with uniqueColumnIdsArray as parameters
  dbExport.transaction(tx => {
    tx.executeSql(
      sqlQuery,
      uniqueColumnIdsArray,
      (_, results) => {
        let data = [];
        for (let i = 0; i < results.rows.length; i++) {
          data.push(results.rows.item(i));
        }
        resolve(data);
      },
      (_, error) => {
        console.error("Error retrieving data from table:", table_name, error.message); // More detailed error message
        reject(error);
      }
    );
  });
});
}
const getQuestions = async (dbExport, QuestionsIds) => {

  // Create a Set to remove duplicates
  const uniqueColumnIds = new Set(QuestionsIds);

  // Convert Set back to array (if needed)
  const uniqueColumnIdsArray = Array.from(uniqueColumnIds);

  // Generate placeholders for the IDs
  const placeholders = uniqueColumnIdsArray.map(() => '?').join(', ');

  // SQL query with placeholders
  const sqlQuery = `SELECT * FROM Questions WHERE id IN (${placeholders});`;
  return new Promise((resolve, reject) => {
  // Execute the query with uniqueColumnIdsArray as parameters
  dbExport.transaction(tx => {
    tx.executeSql(
      sqlQuery,
      uniqueColumnIdsArray,
      (_, results) => {
        let data = [];
        for (let i = 0; i < results.rows.length; i++) {
          data.push(results.rows.item(i));
        }
        resolve(data);
      },
      (_, error) => {
        console.error("Error retrieving data from table:", table_name, error.message); // More detailed error message
        reject(error);
      }
    );
  });
});
}
const getResults = async (dbExport, QuestionsIds) => {

  // Create a Set to remove duplicates
  const uniqueColumnIds = new Set(QuestionsIds);

  // Convert Set back to array (if needed)
  const uniqueColumnIdsArray = Array.from(uniqueColumnIds);

  // Generate placeholders for the IDs
  const placeholders = uniqueColumnIdsArray.map(() => '?').join(', ');

  // SQL query with placeholders
  const sqlQuery = `SELECT * FROM Results WHERE pollid IN (${placeholders});`;
  return new Promise((resolve, reject) => {
  // Execute the query with uniqueColumnIdsArray as parameters
  dbExport.transaction(tx => {
    tx.executeSql(
      sqlQuery,
      uniqueColumnIdsArray,
      (_, results) => {
        let data = [];
        for (let i = 0; i < results.rows.length; i++) {
          data.push(results.rows.item(i));
        }
        resolve(data);
      },
      (_, error) => {
        console.error("Error retrieving data from table:", table_name, error.message); // More detailed error message
        reject(error);
      }
    );
  });
});
}
  const getTableData = async (dbExport, table_name,QuestionsIds) => {

      // Create a Set to remove duplicates
      const uniqueColumnIds = new Set(QuestionsIds);
    
      // Convert Set back to array (if needed)
      const uniqueColumnIdsArray = Array.from(uniqueColumnIds);
    
      // Generate placeholders for the IDs
      const placeholders = uniqueColumnIdsArray.map(() => '?').join(', ');
    
      // SQL query with placeholders
      const sqlQuery = `SELECT * FROM ${table_name} WHERE cardid IN (${placeholders});`;
      return new Promise((resolve, reject) => {
      // Execute the query with uniqueColumnIdsArray as parameters
      dbExport.transaction(tx => {
        tx.executeSql(
          sqlQuery,
          uniqueColumnIdsArray,
          (_, results) => {
            let data = [];
            for (let i = 0; i < results.rows.length; i++) {
              data.push(results.rows.item(i));
            }
            resolve(data);
          },
          (_, error) => {
            console.error("Error retrieving data from table:", table_name, error.message); // More detailed error message
            reject(error);
          }
        );
      });
    });
    }
  
  const shareCSV = async (filePath) => {
    try {
      const shareOptions = {
        title: 'Share CSV File',
        message: 'Please find the CSV file attached.',
        url: `file://${filePath}`,
        type: 'text/csv',
      };
      if (Platform.OS === 'ios') {
        // For iOS, add additional options
        shareOptions.subject = 'Share CSV File';
      }
  
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing CSV:', error.message);
    }
    };
const getFilteredResults = async (dbExport) => {
  try {
    const sqlQuery = `
      SELECT DISTINCT C.id AS ciD, Q.id AS qiD
      FROM Columns C
      JOIN Questions Q ON C.id = Q.columnId
      JOIN Results R ON Q.id = R.pollId
      GROUP BY Q.id
      HAVING COUNT(DISTINCT R.id) > 3
    `;

    return new Promise((resolve, reject) => {
      dbExport.transaction(tx => {
        tx.executeSql(
          sqlQuery,
          [],
          (_, results) => {
            
            const mappedResults = [];
            for (let i = 0; i < results.rows.length; i++) {
                const row = results.rows.item(i);
                mappedResults.push({
                    columnId: row.ciD,
                    questionId: row.qiD
                });
            }
          
            //console.log("Mapped Results:", mappedResults);
            resolve(mappedResults);
            
          },
          (_, error) => {
            console.error("Error executing SQL query:", error.message);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error("Error in getFilteredResults:", error);
    throw error;
  }
};

  export { exportToCSV}; 
