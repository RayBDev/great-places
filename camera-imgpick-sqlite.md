# Camera, Image Picker and SQLite

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
