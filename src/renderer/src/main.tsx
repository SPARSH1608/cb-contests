import './assets/main.css'
import { QueryClient, QueryClientProvider } from "react-query";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</React.StrictMode>
)
