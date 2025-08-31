import RandomNameDrawApp from './RandomNameDrawApp';
import './RandomNameDrawApp.css';

export default function App() {
  return (
    <div>
      <h1>Deployment Test: {Date.now()}</h1>
      <RandomNameDrawApp />
      <div>TESTING - 2025-08-13 - HELLO WORLD</div>
    </div>
  );
}
