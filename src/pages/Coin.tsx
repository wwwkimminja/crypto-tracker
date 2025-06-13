import { useParams, Link } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';
import { isDarkModeState } from '../atoms/theme';
import { lightTheme, darkTheme } from '../theme';
import { fetchCoinInfo, getCoinImageUrl, getFallbackImageUrl } from '../api';
import type { ICoinDetail, IPriceData } from '../api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background-color: ${props => props.theme.bgColor};
  color: ${props => props.theme.textColor};
  transition: all 0.3s ease;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: inline-block;
`;

const BackButton = styled(Link)`
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: ${props => props.theme.buttonColor};
  color: ${props => props.theme.textColor};
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  z-index: 100;

  &:hover {
    background-color: ${props => props.theme.hoverColor};
  }
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

const CoinIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  object-fit: contain;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
  padding: 0 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const InfoItem = styled.div`
  background-color: ${props => props.theme.buttonColor};
  padding: 20px;
  border-radius: 10px;
  box-shadow: ${props => props.theme.cardShadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.2s ease-in-out;

`;

const InfoLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
  margin-bottom: 8px;
`;

const InfoValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.textColor};
`;

const Description = styled.div`
  background-color: ${props => props.theme.buttonColor};
  padding: 20px;
  border-radius: 10px;
  box-shadow: ${props => props.theme.cardShadow};
  margin: 20px auto;
  max-width: 760px;
`;


function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(num);
}

function Coin() {
  const { coinId } = useParams<{ coinId: string }>();
  const isDarkMode = useRecoilValue(isDarkModeState);

  const { isLoading, data, error } = useQuery<ICoinDetail & {
    price: number;
    high: number;
    low: number;
    volume: number;
    marketCap: number;
    timeOpen: string;
    timeClose: string;
  }>({
    queryKey: ['coin', coinId],
    queryFn: () => fetchCoinInfo(coinId!),
    enabled: !!coinId,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Coin not found</div>;
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Container>
        <Header>
          <BackButton to="/">
            ← Back
          </BackButton>
          <CoinIcon 
            src={getCoinImageUrl(data.symbol)}
            alt={data.name}
            onError={(e) => {
              e.currentTarget.src = getFallbackImageUrl();
            }}
          />
          <Title>{data.name}</Title>
        </Header>

        <InfoGrid>
          <InfoItem>
            <InfoLabel>Rank</InfoLabel>
            <InfoValue>#{data.rank || 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Symbol</InfoLabel>
            <InfoValue>{data.symbol?.toUpperCase() || 'N/A'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Price</InfoLabel>
            <InfoValue>${formatNumber(data.price)}</InfoValue>
          </InfoItem>

        </InfoGrid>

        {data.description && (
          <Description>
            <InfoLabel>Description</InfoLabel>
            <p>{data.description}</p>
          </Description>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default Coin; 