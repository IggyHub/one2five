import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
const databaseName = 'one2five.db'
function errorCB(err) {
  console.error("SQL Error: " + err);
}

function successCB() {
  console.log("SQL executed successfully");
}

function openDatabase() {
  return SQLite.openDatabase({ name: databaseName, location: 'default' });
}

async function runQuery(db, query, params = []) {
  return db.executeSql(query, params);
}

async function migrateData() {
  let db;
  try {
    db = await openDatabase();
    console.log('start migrateData');

    // Migrate Columns to subject
    await runQuery(db, `INSERT INTO subject (title, description) SELECT title, description FROM Columns;`);

    // Migrate Questions to Insight
    await runQuery(db, `INSERT INTO Insight (subjectId, title, description, order)
                        SELECT s.subjectId, q.title, q.description, q.Questions_order
                        FROM Questions q
                        INNER JOIN subject s ON CAST(q.columnId AS INTEGER) = s.subjectId;`);

    // Merge Notes and Results into observation
    await runQuery(db, `INSERT INTO observation (insightId, rating, content, createdAt)
                        SELECT i.insightId, r.rating, n.content || ' Result Date: ' || r.date, n.createdAt
                        FROM Notes n
                        INNER JOIN Results r ON n.rateId = r.id
                        INNER JOIN Questions q ON n.cardId = q.id
                        INNER JOIN Insight i ON q.id = CAST(i.subjectId AS INTEGER);`);

    console.log('Data migration completed successfully.');
  } catch (error) {
    console.error('Migration failed: ', error);
  } finally {
    if (db) {
      db.close()
        .then((status) => console.log("Database CLOSED", status))
        .catch((error) => console.error("Error closing database", error));
    }
  }
}

export { migrateData };
