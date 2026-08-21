import AsyncStorage from '@react-native-async-storage/async-storage'

export const storageService = {
  get: key => AsyncStorage.getItem(key),
  set: (key, value) => AsyncStorage.setItem(key, value),
  remove: key => AsyncStorage.removeItem(key),
  clear: () => AsyncStorage.clear(),
}
