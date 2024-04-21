import React from 'react';
import { createRoot } from 'react-dom/client'

import App from './Components/App';

import { UserContextProvider } from './Components/Auth/Context/UserContext';

import '../styles/styles.scss'


const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <UserContextProvider>
            <App />
        </UserContextProvider>
    </React.StrictMode>
);