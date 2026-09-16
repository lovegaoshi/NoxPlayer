import './wdyr'; // <--- first import
// @ts-expect-error ignore type def for css
import '../css/popup.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = globalThis.document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<App />);
