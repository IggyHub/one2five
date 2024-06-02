import SQLite from 'react-native-sqlite-storage';
import {migrateData} from './migrateData';
const databaseName = 'one2five.db'
const db = SQLite.openDatabase({ name: databaseName, location: 'default' });


const initDB = async () => {
  
    await initializeDatabase()

    //setDatabaseVersion(db, 1)
    await updateDatabaseSchema(db)
  };
  async function updateDatabaseSchema(db) {
    try {
      const currentVersion = await getDatabaseVersion(db);
      //console.log('updateDatabaseSchema:', currentVersion);
      if (currentVersion < 2) { // Assuming version 1 does not have these columns
        //console.log('updateDatabaseSchema: migrateData',currentVersion);
        setDatabaseVersion(db, 2);
        migrateData().catch(console.error);
        
      }
  
      
    } catch (error) {
      console.error('Failed to update database schema:', error);
      //setDatabaseVersion(db, 2);
    }
  }
  
  async function getDatabaseVersion(db) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql('PRAGMA user_version;', [], (tx, results) => {
          // The result of PRAGMA user_version is in the rows item 0, column 'user_version'
          const version = results.rows.item(0).user_version;
          resolve(version);
        },
        (tx, error) => reject(error));
      });
    });
  }

  
// Function to initialize the database
const initializeDatabase = async () => {
  //console.log('initializeDatabase start');
    try {
        //console.log("initializeDatabase createTables start");
        await createTables(db);
        //console.log("initializeDatabase createTables end");
        const columnCount = await new Promise((resolve, reject) => {
          db.transaction(tx => {
            tx.executeSql(
              `SELECT COUNT(subjectId) as count FROM subject;`,
              [],
              (_, results) => {
                const count = results.rows.item(0).count;
                resolve(count);
              },
              (_, error) => reject(error)
            );
          });
        });
        //console.log("Column count: ", columnCount);
  
        // if (columnCount === 0) {
        //     await insertInitialData(db, columnsData);
        // };
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };
  
  const createTables = async (db) => {
    //console.log('createTables start');
    //#list
    const subjectTableSQL = `CREATE TABLE
     IF NOT EXISTS subject (
      subjectId INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT
    );`;
  
    //Insight
    const insightTableSQL = `CREATE TABLE IF NOT EXISTS Insight (
      insightId INTEGER PRIMARY KEY AUTOINCREMENT,
      subjectId INTEGER,
      title TEXT,
      description TEXT,
      insightOrder INTEGER, 
      FOREIGN KEY (subjectId) REFERENCES subject(subjectId)
    );`;
    
    
    
    // Create 'note table'
    // Define the SQL statement for creating the 'Notes' table
    const observationTableSQL = `CREATE TABLE IF NOT EXISTS observation (
      observationId INTEGER PRIMARY KEY AUTOINCREMENT,
      insightId INTEGER,
      rating INTEGER,
      content TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (insightId) REFERENCES Insight(insightId)
    );`;
    

        // Define the SQL statement for creating the 'Scores' table
        const ScoresTableSQL = `CREATE TABLE IF NOT EXISTS Scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Score Float,
          date TEXT,
          Reason TEXT
          );`;
        // Define the SQL statement for creating the 'Profile' table
        const ProfileTableSQL = `CREATE TABLE IF NOT EXISTS Profile  (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          aboutYourself TEXT,
          goals TEXT,
          birthday TEXT,
          extended_mode TEXT,
          dark_mode TEXT,
          Language TEXT,
          additional_info TEXT
          );`;

      //console.log('createTables before transaction');
      // Open a transaction to execute the SQL statements
      db.transaction(tx => {
        
        tx.executeSql(subjectTableSQL, [], null, ( error) => {
            console.log('Error creating subject table:', error);
        });
        //console.log('createTables subjectTableSQL end');
        tx.executeSql(insightTableSQL, [], null, ( error) => {
            console.log('Error creating insight table:', error);
        });
        //console.log('createTables insightTableSQL end');
        // Create the 'Notes' table
        tx.executeSql(observationTableSQL, [], null, ( error) => {
            console.log('Error creating observation table:', error);
        });
        //console.log('createTables observationTableSQL end');
        tx.executeSql(ScoresTableSQL, [], null, ( error) => {
            console.log('Error creating Scores table:', error);
        });  
        //console.log('createTables Scores end');  
        tx.executeSql(ProfileTableSQL, [], null, ( error) => {
            console.log('Error creating Profile table:', error);
        });  
        //console.log('createTables Profile end');  
        //console.log('createTables end');
      //console.log('initDB: finished') 
    }, error => {
      console.error('initDB: Transaction error:', error); // Log for overall transaction error
    }, () => {
      //console.log('createTables  transaction successful');
      // Callback for successful completion of the transaction
      // This block will be executed once the transaction is successful
      // If you want to perform any action upon successful creation of tables, you can do it here.
    });
    //console.log('createTables after transaction');
  };
  const executeSql = (tx, sql, params) => {
    return new Promise((resolve, reject) => {
      tx.executeSql(sql, params,
        (tx, resultSet) => {
          resolve(resultSet);
        },
        (tx, error) => {
          console.error("Error in executeSql:", sql, params, error);
          reject(error);
        }
      );
    });
  };
  
  // Usage inside insertInitialData
  const insertInitialData = async (db, columnsData) => {
    try {
      await new Promise((resolve, reject) => {
        db.transaction(tx => {
          let totalOperations = 0;
          let completedOperations = 0;
  
          const checkCompletion = () => {
            if (completedOperations === totalOperations) {
              resolve(); // Resolve the promise when all operations are completed
            }
          };
  
          for (const column of columnsData) {
            totalOperations += 1 + column.polls.length; // Count INSERT operations for column and polls
  
            // Insert subject
            tx.executeSql(
              `INSERT INTO subject (title, description) VALUES (?, ?);`,
              [column.title, column.description],
              (_, result) => {
                completedOperations++;
                const columnId = result.insertId;
                //console.log("Inserted column ID: ", columnId);
  
                // Insert associated polls
                for (const [index, poll] of column.polls.entries()) {
                  tx.executeSql(
                    `INSERT INTO Insight (subjectId, title, description,Questions_order) VALUES (?, ?, ?, ?);`,
                    [columnId, poll.title, poll.description, index],
                    () => {
                      completedOperations++;
                      checkCompletion();
                    },
                    (_, error) => {
                      console.error("Error during Insight INSERT operation:", error);
                      reject(error);
                    }
                  );
                }
                checkCompletion();
              },
              (_, error) => {
                console.error("Error during subjectId INSERT operation:", error);
                reject(error);
              }
            );
          }
        });
      });
  
    } catch (error) {
      console.error("Error in insertInitialData:", error);
    }
  };

  
  function setDatabaseVersion(db, version) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(`PRAGMA user_version = ${version};`, [], () => {
          resolve();
        },
        (tx, error) => reject(error));
      });
    });

    const closeDB = async () => {
      if (db) {
        await db.close();
        console.log("Database closed");
      }
    };
    
  }
  export { initDB}; 
