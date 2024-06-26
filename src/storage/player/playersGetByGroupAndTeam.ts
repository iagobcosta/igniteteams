import { playersGetByGroup } from './playerGetByGroups';

export async function playersGetByGroupAndTeam(group: string, team: string) {
  try {
    const players = await playersGetByGroup(group);

    return players.filter(player => player.team === team);
    
  } catch (error) {
    throw (error);
  }
}