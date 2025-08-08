import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import {ApolloProvider} from "@apollo/client";
import {client} from "./apollo/client.ts";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <ApolloProvider client={client}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
          </ApolloProvider>
      </Provider>
  </StrictMode>,
)
