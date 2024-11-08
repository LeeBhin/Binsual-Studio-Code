import Layout from './components/Layout';
import Home from './pages/Home';
import './styles/App.css';

const App = () => {
  return (
    <div>
      <Layout>
        <Home />
      </Layout>
    </div>
  );
};

export default App;