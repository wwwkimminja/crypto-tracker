import { useQuery } from '@tanstack/react-query';
import { fetchCoinHistory } from '../api';
import styled from 'styled-components';

const PriceContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: ${props => props.theme.buttonColor};
  border-radius: 10px;
  box-shadow: ${props => props.theme.cardShadow};
`;

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
`;

const PriceItem = styled.div`
  background-color: ${props => props.theme.cardBgColor};
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    background-color: ${props => props.theme.hoverColor};
  }
`;

const PriceLabel = styled.div`
  font-size: 14px;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
  margin-bottom: 8px;
`;

const PriceValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.accentColor};
`;

interface PriceProps {
  coinId: string;
}
interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

const Price = ({ coinId }: PriceProps) => {
  const { isLoading, data } = useQuery<IHistorical[]>({
    queryKey: ['ohlcv', coinId],
    queryFn: () => fetchCoinHistory(coinId)
  });

  if (isLoading) {
    return <div>Loading price data...</div>;
  }

  const latestPrice = data?.[data.length - 1];
  if (!latestPrice) {
    return <div>No price data available</div>;
  }

  const open = parseFloat(latestPrice.open);
  const close = parseFloat(latestPrice.close);
  const high = parseFloat(latestPrice.high);
  const low = parseFloat(latestPrice.low);
  const volume = parseFloat(latestPrice.volume);

  const priceChange = ((close - open) / open) * 100;
  const isPositive = priceChange >= 0;

  return (
    <PriceContainer>
      <PriceGrid>
        <PriceItem>
          <PriceLabel>Open Price</PriceLabel>
          <PriceValue>{formatNumber(open)}</PriceValue>
        </PriceItem>
        <PriceItem>
          <PriceLabel>Close Price</PriceLabel>
          <PriceValue>{formatNumber(close)}</PriceValue>
        </PriceItem>
        <PriceItem>
          <PriceLabel>Highest Price</PriceLabel>
          <PriceValue>{formatNumber(high)}</PriceValue>
        </PriceItem>
        <PriceItem>
          <PriceLabel>Lowest Price</PriceLabel>
          <PriceValue>{formatNumber(low)}</PriceValue>
        </PriceItem>
        <PriceItem>
          <PriceLabel>Volume</PriceLabel>
          <PriceValue>{formatNumber(volume)}</PriceValue>
        </PriceItem>
        <PriceItem>
          <PriceLabel>Price Change</PriceLabel>
          <PriceValue style={{ color: isPositive ? '#0be881' : '#ff3f34' }}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </PriceValue>
        </PriceItem>
      </PriceGrid>
    </PriceContainer>
  );
};

export default Price; 