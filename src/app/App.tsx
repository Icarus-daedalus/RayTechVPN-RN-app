import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { Text, View } from 'react-native';
import '../global.css';

const queryClient = new QueryClient();
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister, maxAge: 1000 * 60 * 60 * 24 }}
    >
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-4xl font-bold text-blue-500">Hello NativeWind!</Text>
      </View>
      <StatusBar style="auto" />
    </PersistQueryClientProvider>
  );
}
