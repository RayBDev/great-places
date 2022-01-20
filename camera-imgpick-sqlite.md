# Camera, Image Picker, File System and SQLite

The Great Places app is really for learning how to use the camera, image picker and SQLite. Expo has a ton of modules that you can use to access native device features. Note that all these modules now have permission APIs built in so we don't need to install a separate permissions module.

## Camera

Expo has a Camera module that you can use to build something like Instagram where you need a lot of camera customization. For the Great Places app we'll just use the Image Picker module since we just need basic camera access.

`expo install expo-image-picker`

Now what we'll do is create an ImagePicker component where we'll add all the logic for providing a button to click and add an image from the camera.

Let's import everything from the image picker module like so:
`import * as ImagePicker from 'expo-image-picker';`

Every method in the expo-image-picker module is asynchronous so let's create the async button handler. It's not too complicated. First we take care of the permissions and if the user has granted permissions, we can launch the camera and take a picture along with some constraints like aspect ratio, quality, and editing capability. I've added comments inline below.

```ts
const [pickedImage, setPickedImage] = useState('');

const takeImageHandler = async () => {
  // Ask whether the user will grant permission to use the camera and media library. If it has been granted move along. verifyPermissions will be created soon.
  const hasPermission = await verifyPermissions();
  if (!hasPermission) {
    return;
  }

  // Launch the camera using the passed options
  const image = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.5,
  });

  // If the user doesn't hit cancel, grab the temporary URI and save it in state which will in turn be used to instantly display a sample of the image. We will also trigger a prop function so that the parent components can do something with the URI
  if (!image.cancelled) {
    setPickedImage(image.uri);
    onImageTaken(image.uri);
  }
};
```

Now lets deal with the permissions and create the asynchronous `verifyPermissions` function. We will need permissions for both the camera and the media library here.

```ts
const verifyPermissions = async () => {
  // Get permission for both the camera and the media library
  const cameraPermissionResult =
    await ImagePicker.requestCameraPermissionsAsync();
  const mediaLibraryPermissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  // If either of the permissions are not granted we'll alert the user the the permissions are insufficient and also return false so that our camera module will not launch.
  if (
    cameraPermissionResult.status !== 'granted' ||
    mediaLibraryPermissionResult.status !== 'granted'
  ) {
    Alert.alert(
      'Insufficient permissions!',
      'You need to grant camera and media library permissions to use this app.',
      [{ text: 'Okay' }]
    );
    return false;
  }

  // If both permissions are granted we return true and the camera will launch
  return true;
};
```

## File System

The image that gets created by the camera is added to a temp directory and will eventually be deleted. Because of this, we need to move the image to a more permanent directory on the local device. You can of course send the image to Cloudinary or something but it's good to know how to use the local file system.

`expo install expo-file-system`

Since all the file system methods are asynchronous and also since we want to update the global redux state with the image location, let's use a thunk to move the image on dispatch and update the global state. In the slice file we'll add the following code, comments are in line.

```ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as FileSystem from 'expo-file-system';

export const addPlace = createAsyncThunk(
  'cart/addPlace',
  async (place: Omit<Place, 'id'>) => {
    // Get the filename by splitting the current path into an array and popping off the last item, aka the fileName
    const fileName = place.image.split('/').pop();
    if (FileSystem.documentDirectory && fileName) {
      // Create a new path string by using the app directory and appending the filename
      const newPath = FileSystem.documentDirectory + fileName;

      try {
        // Move the temp file to the new location
        await FileSystem.moveAsync({
          from: place.image,
          to: newPath,
        });
        // Create the new state using the new path
        const newPlace: Place = {
          id: new Date().toString(),
          title: place.title,
          image: newPath,
        };
        // Return state
        return newPlace;
      } catch (err) {
        // Console log any errors and throw error
        console.log(err);
        throw err;
      }
    }
  }
);
```

Now we'll create the extraReducer and simply return the new state by using the thunk's return.

```ts
export const placesSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addPlace.fulfilled, (state, action) => {
      if (action.payload) {
        return {
          places: state.places.concat(action.payload),
        };
      } else {
        return state;
      }
    });
  },
});
```

Ok that's great. We have an thunk action we can dispatch which will move the file and update the global state. The problem now is that the image path will be forgotten when we refresh the app. This is where a database would come in handy.

## SQLite

We can of course have a database on a server somewhere but we can also have a database locally so our app works offline. This is where the SQLite module comes in.

`expo install expo-sqlite`
`import * as SQLite from 'expo-sqlite';`

The SQLite module documentation isn't that great on the expo site but I will try to explain how this all works.

```ts
import * as SQLite from 'expo-sqlite';
import { SQLError, SQLResultSet, SQLResultSetRowList } from 'expo-sqlite';

// Create a new database giving it a name of places.db
const db = SQLite.openDatabase('places.db');

// Create a database init function that returns a promise
export const init = () => {
  // Create a promise so that we can resolve and reject based on what happens when the SQL transaction is executed
  // Types come from expo and if you type the resolve and reject directly typing works great in components
  return new Promise(
    (
      resolve: (result: SQLResultSet) => void,
      reject: (result: SQLError) => void
    ) => {
      db.transaction((tx) => {
        // Create database and create tables
        // Accepts (sql statement, args, callback, errorCallBack)
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
```

Now we want to initialize this database as soon as the app loads so in the `Apps.tsx` file we can add init().

```ts
import { init } from './helpers/db';

init()
  .then(() => {
    console.log('Initialized database');
  })
  .catch((err) => {
    console.log('Initializing db failed.');
    console.log(err);
  });
```

Now that the database is set up we can start creating records in it. First we'll create the database transaction logic and then we an add the resulting function to our placesSlice to make adding images more permanent.

Let's create the insertPlace function. It uses the same transaction syntax as the init() function but this time we will pass it some arguments like title, imageUri, etc. and insert that data into the database.

**NOTE**: The question marks below helps with security so someone can't inject their own values. We add our values to the array instead.

```ts
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
```

Now we an update our thunk for adding a place from before but now add the insertPlace function to add the place details into our database.

```ts
export const addPlace = createAsyncThunk(
  'cart/addPlace',
  async (place: Omit<Place, 'id'>) => {
    const fileName = place.imageUri.split('/').pop();
    if (FileSystem.documentDirectory && fileName) {
      const newPath = FileSystem.documentDirectory + fileName;
      try {
        await FileSystem.moveAsync({
          from: place.imageUri,
          to: newPath,
        });

        // Add place to the database
        const dbResult = await insertPlace(
          place.title,
          newPath,
          'Dummy Address',
          15.6,
          12.3
        );

        // Return the result from the database so we can use it in our state
        if (dbResult.insertId) {
          return {
            id: dbResult.insertId,
            title: place.title,
            imageUri: newPath,
          };
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }
);
```

And then modify our builder case slightly to capture the new data in state.:

```ts
.addCase(addPlace.fulfilled, (state, action) => {
        if (action.payload) {
          return {
            places: state.places.concat(action.payload),
          };
        } else {
          return state;
        }
      })
```

Ok great, so we can add a place into our database permanently and add it to our state. Now we should also fetch the data from our database when our component first loads and add that data to our state.

Our fetchPlaces transaction will look like this. Note that I created custom types for the result since we know that it's going to be an array of places and it really helps when using the results from the fetch transaction.

```ts
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
```

Our thunk simply calls the transaction and returns the resulting array.

```ts
export const setPlaces = createAsyncThunk('cart/setPlaces', async () => {
  try {
    const dbResult = await fetchPlaces();

    return {
      places: dbResult.rows._array,
    };
  } catch (err) {
    throw err;
  }
});
```

Our builder case will look like this. We get an array from the thunk above so we map through it to create a new array with only the data we want to add to our state.

```ts
.addCase(setPlaces.fulfilled, (state, action) => {
        if (action.payload) {
          return {
            places: action.payload.places.map((place) => {
              return {
                id: place.id,
                title: place.title,
                imageUri: place.imageUri,
              };
            }),
          };
        }
      });
```
