const BASE_URL = `https://api.coinpaprika.com/v1`;

export async function fetchCoins() {
  console.log('Fetching coins...');
  try {
    const response = await fetch(`${BASE_URL}/coins`);
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
}

export function fetchCoinInfo(coinId: string) {
  return fetch(`${BASE_URL}/coins/${coinId}`).then((response) => response.json())
}

export function fetchCoinTicker(coinId: string) {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) => response.json())
}

export function fetchCoinHistory(coinId: string) {
  // const endDate = Math.floor(Date.now() / 1000);
  // const startDate = endDate - 60 * 60 * 24 * 7 * 2
  //`${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}$end=${endDate}`

  return fetch(`https://ohlcv-api.nomadcoders.workers.dev/?coinId=${coinId}`).then((response) => response.json())
}