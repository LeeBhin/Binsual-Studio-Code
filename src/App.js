import { useEffect, useRef } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import './styles/App.css';
import { useSelector } from 'react-redux';

const App = () => {
  const { activeFile } = useSelector((state) => state.history);
  const { focusedFile } = useSelector(
    (state) => state.history.windows[activeFile]
  );
  const vh = useRef(0);

  useEffect(() => {
    const updateVH = () => {
      vh.current = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh.current}px`);
    };

    updateVH();
    window.addEventListener('resize', updateVH);

    return () => {
      window.removeEventListener('resize', updateVH);
    };
  }, []);

  const getFileName = (path) => {
    return path.split("/").at(-1)
  }

  useEffect(() => {
    if (focusedFile) {
      document.title = `${getFileName(focusedFile)} - 작업 영역 - Visual Studio Code`;
    } else {
      document.title = '작업 영역 - Visual Studio Code'
    }
  }, [focusedFile]);

  return (
    <div>
      <Layout>
        <Home />
      </Layout>
    </div>
  );
};

export default App;