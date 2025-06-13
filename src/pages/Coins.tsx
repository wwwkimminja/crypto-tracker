import styled, { ThemeProvider } from 'styled-components';
import { useRecoilState } from 'recoil';
import { isDarkModeState } from '../atoms/theme';
import { lightTheme, darkTheme } from '../styles/theme';
import { fetchCoins } from '../api';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/Spinner';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background-color: ${props => props.theme.bgColor};
  color: ${props => props.theme.textColor};
  transition: all 0.3s ease;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.textColor};
  margin-bottom: 2rem;
  text-align: center;
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  background-color: ${props => props.theme.buttonColor};
  color: ${props => props.theme.textColor};
  cursor: pointer;
  transition: all 0.3s ease;
  position: fixed;
  top: 1rem;
  right: 1rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const CoinList = styled.ul`
  max-width: 400px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
`;

const CoinItem = styled.li`
  background-color: ${props => props.theme.buttonColor};
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(10px);
  }
`;

const CoinIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const CoinName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Coins = () => {
  const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeState);

  const { isLoading, data, error } = useQuery<ICoin[]>({
    queryKey: ['allCoins'],
    queryFn: fetchCoins
  });

  console.log('isLoading:', isLoading);
  console.log('data:', data);
  console.log('error:', error);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <Title>Crypto Coins</Title>
        <ToggleButton onClick={toggleTheme}>
          {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </ToggleButton>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <CoinList>
            {data?.slice(0, 100).map((coin) => (
              <CoinItem key={coin.id}>
                <CoinIcon 
                  src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                  alt={coin.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/30';
                  }}
                />
                <CoinName>{coin.name}</CoinName>
              </CoinItem>
            ))}
          </CoinList>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Coins; 