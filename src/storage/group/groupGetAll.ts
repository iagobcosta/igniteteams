import AsyncStorage from '@react-native-async-storage/async-storage';

import { GROUP_COLLECTION } from '@storage/storageConfig';

export async function groupGetAll() {
  try {
    const groupStored = await AsyncStorage.getItem(GROUP_COLLECTION);
    const groups: string[] = groupStored ? JSON.parse(groupStored) : [];
    return groups;
  } catch (error) {
    throw error;
  }
}