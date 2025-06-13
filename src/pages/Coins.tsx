import styled, { ThemeProvider } from 'styled-components';
import { useRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import { isDarkModeState } from '../atoms/theme';
import { lightTheme, darkTheme } from '../theme';
import { fetchCoins, getCoinImageUrl, getFallbackImageUrl } from '../api';
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
const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.textColor};
  margin-bottom: 2rem;
  text-align: center;
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${props => props.theme.buttonColor};
  color: ${props => props.theme.textColor};
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  z-index: 100;

  &:hover {
    background-color: ${props => props.theme.hoverColor};
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

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 20px;
  text-decoration: none;
  color: ${props => props.theme.textColor};
`;

const CoinIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  object-fit: contain;
`;

const CoinName = styled.span`
  font-size: 18px;
  font-weight: 600;
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
    queryKey: ['coins'],
    queryFn: fetchCoins
  });

  console.log('isLoading:', isLoading);
  console.log('data:', data);
  console.log('error:', error);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <Header>
          <Title>Crypto Coins</Title>
          <ToggleButton onClick={toggleTheme}>
            {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </ToggleButton>
        </Header>
        {error ? (
          <div>Error: {error.message}</div>
        ) : (
          <CoinList>
            {data?.slice(0, 100).map((coin) => (
             
                <CoinItem>
                   <StyledLink to={`/${coin.id}`} key={coin.id}>
                  <CoinIcon 
                    src={getCoinImageUrl(coin.symbol)}
                    alt={coin.name}
                    onError={(e) => {
                      e.currentTarget.src = getFallbackImageUrl();
                    }}
                  />
                  <CoinName>{coin.name}</CoinName>
                  </StyledLink>
                </CoinItem>
             
            ))}
          </CoinList>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Coins; 