import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation/index';
import { store } from './store';
import { init } from './helpers/db';

init()
  .then(() => {
    console.log('Initialized database');
  })
  .catch((err) => {
    console.log('Initializing db failed.');
    console.log(err);
  });

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
