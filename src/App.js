import { useEffect } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import './styles/App.css';

const App = () => {
  let vh = 0;

  useEffect(() => {
    const updateVH = () => {
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateVH();

    window.addEventListener('resize', updateVH);

    return () => {
      window.removeEventListener('resize', updateVH);
    };
  }, []);

  return (
    <div>
      <Layout>
        <Home />
      </Layout>
    </div>
  );
};

export default App;
