import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError } from '@utils/AppError';

import { PLAYER_COLLECTION } from '@storage/storageConfig';
import { playersGetByGroup } from './playerGetByGroups';
import { PlayerStoreDTO } from './playerStorageDTO';

export async function playerAddByGroup(newPlayer: PlayerStoreDTO, group: string) {
  try {

    const storedPlayers = await playersGetByGroup(group);

    const playerAlreadyExists = storedPlayers.filter(player => player.name === newPlayer.name);

    if (playerAlreadyExists.length > 0) {
      throw new AppError('Jogador já cadastrado');
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);
    
  } catch (error) {
    throw (error);
  }
}