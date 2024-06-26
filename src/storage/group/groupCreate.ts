import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError } from '@utils/AppError';

import { GROUP_COLLECTION } from '@storage/storageConfig';
import { groupGetAll } from './groupGetAll';

export async function groupCreate(newGroup: string) {
  try {
    const groupStored = await groupGetAll();

    const groupAlreadyExists = groupStored.includes(newGroup);

    if (groupAlreadyExists) {
      throw new AppError('Turma ja existe! Cadastre uma nova turma.');
    }

    const storage = JSON.stringify([newGroup, ...groupStored]);
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}