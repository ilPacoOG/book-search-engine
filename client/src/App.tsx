import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import './App.css';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;