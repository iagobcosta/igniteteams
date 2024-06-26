import { useNavigation } from '@react-navigation/native';
import { Container, Logo, BackButton, BackIcon } from './styles';
import LogoImg from '@assets/Logo.png';

type Props = {
  showBackButton?: boolean;
}

export function Header({ showBackButton = false }: Props) {

  const navigation = useNavigation();

  function handleBack() {
    navigation.navigate('groups')
  }

  return (
    <Container>
      {
        showBackButton &&
          <BackButton onPress={handleBack}>
            <BackIcon />
          </BackButton>
      }
      <Logo source={LogoImg} />
    </Container>
  );
}