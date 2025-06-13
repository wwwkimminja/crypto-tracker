import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { isDarkModeState } from '../atoms/theme';
import { lightTheme, darkTheme } from '../theme';
import { useQuery } from '@tanstack/react-query';
import { fetchCoinInfo, getCoinImageUrl, getFallbackImageUrl } from '../api';
import type { ICoinDetail } from '../api';
import { useState } from 'react';
import Chart from '../components/Chart';
import Price from '../components/Price';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background-color: ${props => props.theme.bgColor};
  color: ${props => props.theme.textColor};
  transition: all 0.3s ease;
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

const DescriptionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.textColor};
  margin-bottom: 1rem;
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  margin: 20px auto;
  gap: 20px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  flex: 1;
  background-color: ${props => props.theme.buttonColor};
  padding: 20px;
  border-radius: 10px;
  box-shadow: ${props => props.theme.cardShadow};
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease-in-out;
  color: ${props => props.theme.textColor};
  font-weight: ${props => props.isActive ? '600' : '400'};
  border: 2px solid ${props => props.isActive ? props.theme.accentColor : 'transparent'};

  &:hover {
    background-color: ${props => props.theme.hoverColor};
  }
`;

const TabContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
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
  const [activeTab, setActiveTab] = useState<'chart' | 'price'>('chart');

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
        <BackButton to="/">← Back to Coins</BackButton>
        <Header>
          <Title>
            <CoinIcon 
              src={getCoinImageUrl(data.symbol)}
              alt={data.name}
              onError={(e) => {
                e.currentTarget.src = getFallbackImageUrl();
              }}
            />
            {data.name}
          </Title>
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
        <Description>
          <DescriptionTitle>Description</DescriptionTitle>
          <p>{data.description}</p>
        </Description>
        <TabContainer>
          <Tab 
            isActive={activeTab === 'chart'} 
            onClick={() => setActiveTab('chart')}
          >
            Chart
          </Tab>
          <Tab 
            isActive={activeTab === 'price'} 
            onClick={() => setActiveTab('price')}
          >
            Price
          </Tab>
        </TabContainer>
        <TabContent>
          {activeTab === 'chart' && coinId && <Chart coinId={coinId} />}
          {activeTab === 'price' && coinId && <Price coinId={coinId} />}
        </TabContent>
      </Container>
    </ThemeProvider>
  );
}

export default Coin; 