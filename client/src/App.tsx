import { ApolloProvider, InMemoryCache, ApolloClient, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; // Import setContext middleware
import './App.css';
import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';

// Create HTTP Link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: '/graphql', // Adjust as needed
});

// Add the Authorization header dynamically using setContext
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token'); // Retrieve token from localStorage
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '', // Attach token if it exists
    },
  };
});

// Combine authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Use authLink before httpLink
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
