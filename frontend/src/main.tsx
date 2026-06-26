import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import { store } from './stores';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
        locale={koKR}
        theme={{
          token: {
            colorPrimary: '#171C61',
            borderRadius: 4,
            fontSize: 13,
          },
        }}
      >
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
