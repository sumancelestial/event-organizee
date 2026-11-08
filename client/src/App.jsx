import { useState } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import React from 'react';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from '@apollo/client/link/context'

const sessionUser = sessionStorage.getItem('user');
const currUser = sessionUser ? JSON.parse(sessionUser) : null;

const App = () => {
    const [user, setUser] = useState(currUser);
    let contents;

    if (!user) {
        contents = <Login setUser={setUser} />
    }
    else {
        contents = <Home user={user} />
    }

    const httpLink = new HttpLink({
        uri: 'http://localhost:4000'
    })
    const apolloMiddlewares = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                token: user?.token
            }
        }
    })
    const client = new ApolloClient({
        link: from([apolloMiddlewares, httpLink]),
        cache: new InMemoryCache()
    })

    return (
        <ApolloProvider client={client}>
            <div className="container">
                {contents}
            </div>
        </ApolloProvider>
    );
}

export default App;