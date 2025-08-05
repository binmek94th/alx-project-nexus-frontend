import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import {client} from "./services/graphql.ts";
import {ApolloProvider} from "@apollo/client";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
      </Provider>
  </StrictMode>,
)
