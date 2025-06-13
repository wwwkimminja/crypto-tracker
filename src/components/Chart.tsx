import { useQuery } from '@tanstack/react-query';
import { fetchCoinHistory } from '../api';
import styled from 'styled-components';
import ApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { isDarkModeState } from '../atoms/theme';
import type { ApexOptions } from 'apexcharts';

const ChartContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: ${props => props.theme.buttonColor};
  border-radius: 10px;
  box-shadow: ${props => props.theme.cardShadow};
`;

interface ChartProps {
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
const Chart = ({ coinId }: ChartProps) => {
  const isDarkMode = useRecoilValue(isDarkModeState);
  const { isLoading, data } = useQuery<IHistorical[]>({
    queryKey: ['ohlcv', coinId],
    queryFn: () => fetchCoinHistory(coinId)
  });

  if (isLoading) {
    return <div>Loading chart...</div>;
  }

  const chartData = {
    series: [{
      data: data?.map((v: IHistorical) => ({
        x: new Date(v.time_open),
        y: [v.open, v.high, v.low, v.close]
      })) ?? []
    }],
    options: {
      theme: {
        mode: isDarkMode ? 'dark' : 'light',
      },
      chart: {
        type: 'candlestick' as const,
        height: 350,
        toolbar: {
          show: false,
        },
        background: 'transparent',
      },
      title: {
        text: 'CandleStick Chart',
        align: 'left',
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: isDarkMode ? '#fff' : '#000',
          },
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
        labels: {
          style: {
            colors: isDarkMode ? '#fff' : '#000',
          },
          formatter: (value: number) => `$${value.toFixed(2)}`,
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#0be881',
            downward: '#ff3f34',
          },
        },
      },
    } as ApexOptions,
  };

  return (
    <ChartContainer>
      <ApexChart 
        type="candlestick" 
        series={chartData.series} 
        options={chartData.options} 
      />
    </ChartContainer>
  );
};

export default Chart; 