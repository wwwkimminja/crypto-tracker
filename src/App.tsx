import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RecoilRoot } from 'recoil';
import Coins from './pages/Coins';
import Coin from './pages/Coin';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Coins />} />
            <Route path="/:coinId" element={<Coin />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
