import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, FlatList, TextInput } from 'react-native';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';

import { Container, Form, HeaderList, NumberOfPlayers } from './styles';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { playerAddByGroup } from '@storage/player/playerAddGroups';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { PlayerStoreDTO } from '@storage/player/playerStorageDTO';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { Loading } from '@components/Loading';


type RouteParams = {
  group: string;
}

export function Players() {
  const navigation = useNavigation();

  const [team, setTeam] = useState('Time A');
  const [teams, setTeams] = useState(['Time A', 'Time B']);

  const [players, setPlayers] = useState<PlayerStoreDTO[]>([]);

  const route = useRoute();
  const { group } = route.params as RouteParams;

  const [newPlayer, setNewPlayer] = useState('');

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const [isLoading, setIsLoading] = useState(true);

  async function handleAddPlayer() {
    if (newPlayer.trim().length === 0) {
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.')
    }
    const newPlayerDTO = {
      name: newPlayer,
      team
    }

    try {
      await playerAddByGroup(newPlayerDTO, group);
      newPlayerNameInputRef.current?.blur();
      setNewPlayer('');
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message)
      } else {
        Alert.alert('Nova pessoa', 'Não foi possível adicionar a pessoa')
        console.log(error);
      }
    }

  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const players = await playersGetByGroupAndTeam(group, team);
      setPlayers(players);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoa', 'Não foi possível ler as pessoas do time')
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoa', 'Não foi possível remover a pessoa')
    }
  }

  async function removeGroup() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');
    } catch (error) {
      console.log(error);
      Alert.alert('Turma', 'Não foi possível remover a turma')
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => removeGroup() }
      ]
    )
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          value={newPlayer}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayer}
          onSubmitEditing={handleAddPlayer}
          returnKeyType='done'
        />

        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>

      <HeaderList>
        <FlatList
          data={teams}
          keyExtractor={item => String(item)}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          horizontal
        />
        <NumberOfPlayers>
          {players.length} jogador(s)
        </NumberOfPlayers>
      </HeaderList>

      {
        isLoading ? <Loading /> :
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() =>handlePlayerRemove(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty
              message="Nenhum jogador encontrado"
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 }
          ]}
        />
      }

      <Button
        title="Remover turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />

    </Container>
  );
}