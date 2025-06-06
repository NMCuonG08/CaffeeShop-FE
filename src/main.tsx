import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store, persistor } from './store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/configs/apolloClient.ts'

const queryClient = new QueryClient()

const providers = [
  { component: Provider, props: { store } },
  { component: QueryClientProvider, props: { client: queryClient } },
  { component: ApolloProvider, props: { client: apolloClient } },
  { component: PersistGate, props: { loading: null, persistor } }
]

const createTree = (providers: any[], children: any) => {
  return providers.reduceRight((acc, { component: Component, props = {} }) => {
    return <Component {...props}>{acc}</Component>
  }, children)
}

createRoot(document.getElementById('root')!).render(
  createTree(providers, <App />)
)