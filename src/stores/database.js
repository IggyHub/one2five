import SQLite from 'react-native-sqlite-storage';

const databaseName = 'one2five.db';
const dbPromise = SQLite.openDatabase({ name: databaseName, location: 'default' });

// Insert or update an observation rating
const writeObservationRating = async (insightId, rating) => {
  console.log("writeObservationRating", insightId, rating);
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO observation (insightId, rating, createdAt) VALUES (?, ?, ?)',
        [insightId, rating, currentDate],
        (_, results) => resolve(results.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

// Update an existing observation rating
const updateObservationRating = async (observationId, rating) => {
  console.log("updateObservationRating", insightId, rating);
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE observation SET rating = ? WHERE observationId = ?',
        [rating, observationId],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

// Add a new insight
const addInsight = async (subjectId, title, description, order) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO Insight (subjectId, title, description, insightOrder) VALUES (?, ?, ?, ?);`,
        [subjectId, title, description, order],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

// Update an existing insight
const updateInsight = async (insightId, title, description) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Insight SET title = ?, description = ? WHERE insightId = ?',
        [title, description, insightId],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

// Add a new subject
const addSubject = async (title, description = '') => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO subject (title, description) VALUES (?, ?);',
        [title, description],
        (_, results) => resolve(results.insertId),
        (_, error) => reject(error)
      );
    });
  });
};

// Delete a subject
const deleteSubject = async (subjectId) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM subject WHERE subjectId = ?',
        [subjectId],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

// Rename a subject
const renameSubject = async (subjectId, title) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE subject SET title = ? WHERE subjectId = ?',
        [title, subjectId],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

// Delete an insight
const deleteInsight = async (insightId) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Insight WHERE insightId = ?',
        [insightId],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

// Fetch insights by subject
const getInsightsBySubject = async (subjectId) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Insight WHERE subjectId = ? ORDER BY order',
        [subjectId],
        (_, results) => {
          let insights = [];
          for (let i = 0; i < results.rows.length; i++) {
            insights.push(results.rows.item(i));
          }
          resolve(insights);
        },
        (_, error) => reject(error)
      );
    });
  });
};
const readDataFromDB = async () => {
  try {
    const debug = true;
    const db = await dbPromise;
    let subjects = {};

    const data = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM subject;', [], async (tx, subjectResults) => {
          for (let i = 0; i < subjectResults.rows.length; i++) {
            let subject = subjectResults.rows.item(i);
            subjects[subject.subjectId] = {
              subjectId: subject.subjectId,
              title: subject.title,
              description: subject.description,
              insights: []
            };
          }
          if (debug) console.log("Subjects fetched successfully. ", subjects);

          const subjectIds = Object.keys(subjects);
          if (debug) console.log("Subjects fetched successfully. Number of subjects: ", subjectIds.length);

          try {
            await Promise.all(subjectIds.map(subjectId => fetchInsightsAndObservations(tx, subjectId, subjects, debug)));
            resolve(Object.values(subjects));
          } catch (error) {
            reject(error);
          }
        }, (tx, error) => {
          reject(error);
        });
      });
    });

    console.log("Data organized and ready to be returned", data);
    return data;
  } catch (error) {
    console.error("Error reading data from database:", error);
    return [];
  }
};

async function fetchInsightsAndObservations(tx, subjectId, subjects, debug) {
  return new Promise(async (resolve, reject) => {
    tx.executeSql(`
      SELECT * FROM Insight WHERE subjectId = ? ORDER BY insightOrder;
    `, [subjectId], async (tx, insightsResults) => {
      const insights = [];
      for (let i = 0; i < insightsResults.rows.length; i++) {
        let insight = insightsResults.rows.item(i);
        insights.push({
          insightId: insight.insightId,
          title: insight.title,
          description: insight.description,
          order: insight.insightOrder,
          observations: []
        });
      }
      subjects[subjectId].insights = insights;

      if (debug) console.log(`Insights for subject ${subjectId}:`, insights);

      try {
        await Promise.all(insights.map(insight => fetchObservations(tx, insight, debug)));
        resolve();
      } catch (error) {
        reject(error);
      }
    }, (tx, error) => {
      reject(error);
    });
  });
}

async function fetchObservations(tx, insight, debug) {
  return new Promise((resolve, reject) => {
    tx.executeSql(`
      SELECT * FROM observation WHERE insightId = ?;
    `, [insight.insightId], (tx, observationsResults) => {
      if (debug) console.log(`Observations fetched for insight ID ${insight.insightId}`);
      for (let j = 0; j < observationsResults.rows.length; j++) {
        let observation = observationsResults.rows.item(j);
        insight.observations.push({
          observationId: observation.observationId,
          content: observation.content,
          createdAt: observation.createdAt,
          rating: observation.rating
        });
      }
      resolve();
    }, (tx, error) => {
      reject(error);
    });
  });
}



// Function to update the order of polls in the database
const updatePollOrderInDB = async (columnId, newPollsOrder) => {
  try {
    const db = await dbPromise;
    //console.log ("updatePollOrderInDB", columnId, newPollsOrder);
    // Start a transaction to update the order of polls
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        newPollsOrder.forEach((Questions, index) => {
          // Assuming each poll has an 'id' and 'order' column to update
          // 'columnId' is used to ensure we are updating polls in the correct column

          //console.log ("updatePollOrderInDB", Questions.Questions_order, Questions.id, columnId);
          tx.executeSql('UPDATE insight SET insightOrder = ? WHERE insightId = ? AND subjectId = ?;', 
                        [index, Questions.id, columnId], 
                        () => {}, 
                        (tx, error) => {
                          console.error("Error updating insight insightOrder:", error);
                          reject(error);
                        });
        });
        resolve();
      });
    });
    //console.log('Poll Questions_order updated in database');
  } catch (error) {
    console.error('Failed to update poll Questions_order in database:', error);
  }
};

  const addNote_currentToCard = async (cardId, rating,note_current) => {
    //console.log("addNoteToCard", cardId, rateId, note_current)
    // Assuming you have some db instance
    const db = await dbPromise;
    const query = `INSERT INTO observationId (insightId, rating,content) VALUES (?, ?, ?);`;
    db.transaction(tx => {
        tx.executeSql(query, [cardId, rating, note_current],
            (_, results) => console.log("Note added", results),
            (_, error) => console.log("Error adding note", error)
        );
    });
  }
  
  const editNoteOnCard = async (insightId, observationId, newContent) => {
    const db = await dbPromise;
    const query = `UPDATE observation SET content = ? WHERE observationId = ? AND insightId = ?;`;
    db.transaction(tx => {
        tx.executeSql(query, [newContent, observationId, insightId],
            (_, results) => console.log("Note edited", results),
            (_, error) => console.log("Error editing note", error)
        );
    });
  }
  const deleteNoteFromCard = async (cardId, noteId) => {
    const db = await dbPromise;
    const query = `DELETE FROM observation WHERE observationId = ? AND insightId = ?;`;
    db.transaction(tx => {
        tx.executeSql(query, [noteId, cardId],
            (_, results) => console.log("Note deleted", results),
            (_, error) => console.log("Error deleting note", error)
        );
    });
  }
const fetchRatingsForCard = async (cardId) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
      const query = `SELECT * FROM observation
      WHERE insightId = ?;`;
      db.transaction(tx => {
          tx.executeSql(query, [cardId],
              (_, results) => {
                  let notes = [];
                  for (let i = 0; i < results.rows.length; i++) {
                      notes.push(results.rows.item(i));
                      
                  }
                  //console.log('getNotesForCard',notes);
                  resolve(notes);
              },
              (_, error) => {
                  console.log("Error retrieving rating", error);
                  reject(error);
              }
          );
      });
  });
}
const getCardById = async (cardId) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    // Corrected the query string syntax
    const query = `SELECT * FROM Insight WHERE InsightId = ?;`;
    db.transaction(tx => {
      tx.executeSql(query, [cardId],
        (_, results) => {
          // Assuming you expect a single card for the given ID
          if (results.rows.length > 0) {
            // Directly resolve the first item if found
            resolve(results.rows.item(0));
          } else {
            // If no items are found, you might want to resolve to null or reject
            resolve(null); // Or reject(new Error('Card not found'));
          }
        },
        (_, error) => {
          console.log("Error retrieving getCardById", error);
          reject(error);
        }
      );
    });
  });
};
const getScoreByIntervalNumber = async (cardId, numIntervals) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
      const queryIntervals = `
          SELECT 
              INTERVAL_START,
              INTERVAL_END
          FROM (
              SELECT 
                  DATETIME(MIN(timestamp), '+' || (interval_number * interval_duration) || ' SECONDS') AS INTERVAL_START,
                  DATETIME(MIN(timestamp), '+' || ((interval_number + 1) * interval_duration) || ' SECONDS') AS INTERVAL_END
              FROM scores
              GROUP BY interval_number
              ORDER BY INTERVAL_START DESC
              LIMIT ${numIntervals}
          ) AS intervals
          ORDER BY INTERVAL_START ASC;
      `;

      const queryScores = `
          SELECT 
              INTERVAL_START,
              INTERVAL_END,
              SUM(score) AS interval_score
          FROM (
              SELECT 
                  DATETIME(MIN(timestamp), '+' || (interval_number * interval_duration) || ' SECONDS') AS INTERVAL_START,
                  DATETIME(MIN(timestamp), '+' || ((interval_number + 1) * interval_duration) || ' SECONDS') AS INTERVAL_END,
                  score
              FROM scores
              GROUP BY interval_number
              ORDER BY INTERVAL_START DESC
              LIMIT ${numIntervals}
          ) AS intervals
          GROUP BY INTERVAL_START, INTERVAL_END
          ORDER BY INTERVAL_START DESC;
      `;

      db.transaction(tx => {
          tx.executeSql(queryIntervals, [],
              (_, results) => {
                  const intervals = results.rows.raw();
                  tx.executeSql(queryScores, [],
                      (_, results) => {
                          const scores = results.rows.raw();
                          resolve({ intervals, scores });
                      },
                      (_, error) => {
                          console.log("Error retrieving scores by interval", error);
                          reject(error);
                      }
                  );
              },
              (_, error) => {
                  console.log("Error retrieving interval start and end times", error);
                  reject(error);
              }
          );
      });
  });
};

const add_score = async ( score,Reason) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Scores (score,Reason, date) VALUES (?, ?, ?)',
        [score, Reason, currentDate],
        (_, results) => {
          //console.log("Inserted row ID:", results.insertId); // Log the insertId
          resolve(results.insertId); // Resolve the promise with the insertId
        },
        (_, error) => reject(error)
      );
    });
  });
};
const get_score = async () => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(score) AS score FROM Scores;',
        [],
        (_, results) => {
          //console.log("get_score ", results.rows.item(0).score); 
          resolve(results.rows.item(0).score); // Resolve the promise with the count
        },
        (_, error) => reject(error)
      );
    });
  });
};

const get_Profile = async () => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Profile ORDER BY id DESC LIMIT 1;',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            const profileData = results.rows.item(0);
            const name = profileData.name;
            const aboutYourself = profileData.aboutYourself;
            const goals = profileData.goals;
            const birthday = profileData.birthday;
            const extended_mode = profileData.extended_mode;
            const dark_mode = profileData.dark_mode;
            const Language = profileData.Language;
            const additional_info = profileData.additional_info;
            
            resolve({ name, aboutYourself, goals, birthday, extended_mode, dark_mode, Language, additional_info });
          } else {
            resolve(null);
          }
        },
        (_, error) => reject(error)
      );
    });
  });
};
const set_Profile = async (name, aboutYourself, goals, birthday, extended_mode, dark_mode, Language, additional_info) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString();
    db.transaction(tx => {
      // Check if a profile with the given name exists
      tx.executeSql(
        'SELECT COUNT(*) AS count FROM Profile',
        [],
        (_, results) => {
          const count = results.rows.item(0).count;
          if (count > 0) {
            // Profile exists, perform update
            tx.executeSql(
              'UPDATE Profile SET aboutYourself = ?, goals = ?, birthday = ?, extended_mode = ?, dark_mode = ?, Language = ?, additional_info = ? , name = ?;',
              [aboutYourself, goals, birthday, extended_mode, dark_mode, Language, additional_info, name],
              (_, results) => {
                //console.log("Profile updated successfully");
                resolve(results);
              },
              (_, error) => {
                console.error("Error updating profile:", error);
                reject(error);
              }
            );
          } else {
            // Profile does not exist, perform insert
            tx.executeSql(
              'INSERT INTO Profile (name, aboutYourself, goals, birthday, extended_mode, dark_mode, Language, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
              [name, aboutYourself, goals, birthday, extended_mode, dark_mode, Language, additional_info],
              (_, results) => {
                console.log("Profile inserted successfully");
                resolve(results);
              },
              (_, error) => {
                console.error("Error inserting profile:", error);
                reject(error);
              }
            );
          }
        },
        (_, error) => {
          console.error("Error checking profile existence:", error);
          reject(error);
        }
      );
    });
  });
};
const getCardsObservation = async (insightId) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const query = `SELECT * from observation WHERE observationId.insightId = ?;`; // Adjusted to insightId and observation table
    db.transaction(tx => {
      tx.executeSql(query, [insightId], (_, results) => {
          let notes = [];
          for (let i = 0; i < results.rows.length; i++) {
              notes.push(results.rows.item(i));
          }
          resolve(notes);
        },
        (_, error) => {
          console.error("Error retrieving notes: ", error.message); // More detailed error message
          reject(error);
        }
      );
    });
  });
};

const deleteColumn = async (id) => {
  const db = await dbPromise;
  //console.log('database delete Column', id);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM subject WHERE subjectId = ?',
        [id],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};
const renameColumn = async (id,title) => {
  const db = await dbPromise;
  //console.log('database renameColumn', id, title);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE subject SET title = ? WHERE subjectId = ?',
        [title, id],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};
const renameColumnDesc = async(id,description) => {
  const db = await dbPromise;
  //console.log('database renameColumn', id, title);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE subject SET description = ? WHERE subjectId = ?',
        [description, id],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};
const deleteCard = async(cardId) => {
  const db = await dbPromise;
  //console.log("database deleteCard:", cardId);
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM insight WHERE insightId = ?',
        [cardId],
        (_, results) => resolve(results),
        (_, error) => reject(error)
      );
    });
  });
};

const closeDB = async () => {
  db.close();
}

const add_new_observation = async (insightId, rating,content) => {
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO results (insightId, rating,content) VALUES (?, ?, ?)',
        [insightId, rating,content],
        (_, results) => {
          //console.log("Inserted row ID:", results.insertId); // Log the insertId
          resolve(results.insertId); // Resolve the promise with the insertId
        },
        (_, error) => reject(error)
      );
    });
  });
};
const update_observation = async(observationId,rating,content,TIMESTAMP) => {
  console.log("update_observation 0) ", observationId,rating,content,TIMESTAMP); 
  const db = await dbPromise;
  return new Promise((resolve, reject) => {
    //const currentDate = new Date().toISOString();
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE results SET rating = ?,content = ?,TIMESTAMP = ? WHERE id = ?',
        [ rating,content,TIMESTAMP,observationId],
        (_, results) => {
          console.log("update_observation", rating, rating_ID,results); 
          resolve(results); // Resolve the promise
        },
        (_, error) => reject(error)
      );
    });
  });
};

export {
  writeObservationRating,
  updateObservationRating,
  addInsight,
  updateInsight,
  addSubject,
  deleteSubject,
  renameSubject,
  deleteInsight,
  getInsightsBySubject,
  readDataFromDB, // Make sure to include the updated readDataFromDB function
  get_Profile,set_Profile,closeDB,
  get_score,add_score,
  getCardsObservation,
  getScoreByIntervalNumber,
  update_observation,add_new_observation,getCardById,renameColumn,renameColumnDesc,deleteColumn, deleteCard,updatePollOrderInDB,addNote_currentToCard,editNoteOnCard,deleteNoteFromCard,fetchRatingsForCard

};
