import './wdyr'; // <--- first import
import '../css/popup.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = window.document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);
