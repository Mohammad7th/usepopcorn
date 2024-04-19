import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StartRating from './components/StarRating';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StartRating maxRating={5} messages={['very bad', 'bad', 'normal', 'good', 'very good']} />
    <StartRating color='red' maxRating={4} size={24} className='test' defaultRating={3} /> */}
  </React.StrictMode>
);

