
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store, persistor } from './store';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <QueryClientProvider client={queryClient}>

    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </QueryClientProvider>,
  </Provider>
)
