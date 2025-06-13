const BASE_URL = 'https://api.coinpaprika.com/v1';
const IMAGE_BASE_URL = 'https://www.cryptocompare.com/media/37746251';

export interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

export interface ICoinDetail {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  description: string;
}

export interface IPriceData {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

export const getCoinImageUrl = (symbol: string | undefined) => {
  if (!symbol) return `${IMAGE_BASE_URL}/btc.png`;
  return `${IMAGE_BASE_URL}/${symbol.toLowerCase()}.png`;
};

export const getFallbackImageUrl = () => `${IMAGE_BASE_URL}/btc.png`;

export const fetchCoins = async (): Promise<ICoin[]> => {
  const response = await fetch(`${BASE_URL}/coins`);
  if (!response.ok) {
    throw new Error('Failed to fetch coins');
  }
  return response.json();
};

export const fetchCoinInfo = async (coinId: string) => {
  try {
    const [infoResponse, priceResponse] = await Promise.all([
      fetch(`${BASE_URL}/coins/${coinId.toLowerCase()}`),
      fetch(`https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId.toLowerCase()}`)
    ]);

    if (!infoResponse.ok || !priceResponse.ok) {
      throw new Error('Failed to fetch coin data');
    }

    const [info, priceData] = await Promise.all([
      infoResponse.json() as Promise<ICoinDetail>,
      priceResponse.json() as Promise<IPriceData[]>
    ]);

    if (!info || !priceData || priceData.length === 0) {
      throw new Error('Invalid data received from API');
    }

    const latestPrice = priceData[0];

    return {
      ...info,
      price: latestPrice.close,
      high: latestPrice.high,
      low: latestPrice.low,
      volume: latestPrice.volume,
      marketCap: latestPrice.market_cap,
      timeOpen: new Date(latestPrice.time_open).toLocaleDateString(),
      timeClose: new Date(latestPrice.time_close).toLocaleDateString()
    };
  } catch (error) {
    console.error('Error fetching coin data:', error);
    throw error;
  }
};

export function fetchCoinTicker(coinId: string) {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) => response.json())
}

export function fetchCoinHistory(coinId: string) {
  // const endDate = Math.floor(Date.now() / 1000);
  // const startDate = endDate - 60 * 60 * 24 * 7 * 2
  //`${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}$end=${endDate}`

  return fetch(`https://ohlcv-api.nomadcoders.workers.dev/?coinId=${coinId}`).then((response) => response.json())
}