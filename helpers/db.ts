import * as SQLite from 'expo-sqlite';
import { SQLError, SQLResultSet, SQLResultSetRowList } from 'expo-sqlite';
import { Place } from '../types/place';

const db = SQLite.openDatabase('places.db');

export const init = () => {
  return new Promise(
    (
      resolve: (result: SQLResultSet) => void,
      reject: (result: SQLError) => void
    ) => {
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL);',
          [],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
            return false;
          }
        );
      });
    }
  );
};

export const insertPlace = (
  title: string,
  imageUri: string,
  address: string,
  lat: number,
  lng: number
) => {
  return new Promise(
    (
      resolve: (result: SQLResultSet) => void,
      reject: (result: SQLError) => void
    ) => {
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)`,
          [title, imageUri, address, lat, lng],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
            return false;
          }
        );
      });
    }
  );
};

type SQLRowResults = Omit<SQLResultSetRowList, '_array'> & {
  _array: Place[];
};

type CustomSQLResultSet = Omit<SQLResultSet, 'rows'> & {
  rows: SQLRowResults;
};

export const fetchPlaces = () => {
  return new Promise(
    (
      resolve: (result: CustomSQLResultSet) => void,
      reject: (result: SQLError) => void
    ) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM places`,
          [],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
            return false;
          }
        );
      });
    }
  );
};
