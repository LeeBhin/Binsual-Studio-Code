import { useEffect, useRef } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import './styles/App.css';
import { useSelector } from 'react-redux';
import { db, setDoc, doc } from './firebase';
import { getDoc } from 'firebase/firestore';

const App = () => {
  const { activeFile } = useSelector((state) => state.history);
  const { focusedFile } = useSelector(state => state.history.windows[activeFile]);
  const vh = useRef(0);
  const triggerCount = useRef(0);
  const sendCount = useRef(0);
  const lastTriggeredTime = useRef(Date.now());
  const timeoutRef = useRef(null);

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
    return path.split("/").at(-1);
  };

  useEffect(() => {
    if (focusedFile) {
      if (focusedFile.includes('시작.vs')) {
        document.title = `시작 - 작업 영역 - Binsual Studio Code`;
      } else {
        document.title = `${getFileName(focusedFile)} - 작업 영역 - Binsual Studio Code`;
      }
    } else {
      document.title = '작업 영역 - Binsual Studio Code';
    }
  }, [focusedFile]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.altKey && event.code === 'KeyG') {
        window.open('https://github.com/LeeBhin/portfolio', '_blank');
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.altKey && event.code === 'Enter') {
        const currentTime = Date.now();

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        triggerCount.current++;
        sendCount.current++;
        if (triggerCount.current >= 20) {
          createBigThumb();
          triggerCount.current = 0;
        }
        createRainThumbs();

        timeoutRef.current = setTimeout(async () => {
          await saveThumbs();
          triggerCount.current = 0;
        }, 5000);

        lastTriggeredTime.current = currentTime;
      }
    };

    const createBigThumb = () => {
      const emoji = document.createElement('div');
      emoji.textContent = '👍';
      emoji.style.cssText = `position: fixed; font-size: 500px; left: 50%; top: -500px; transform: translateX(-50%); z-index: 1000; animation: dropEmoji 1s forwards;`;
      const style = document.createElement('style');
      style.textContent = `
        @keyframes dropEmoji {
          0% { top: -500px; transform: translate(-50%, 0); }
          100% { top: 50vh; transform: translate(-50%, -50%); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(emoji);

      setTimeout(() => {
        emoji.remove();
        style.remove();
      }, 3000);
    };

    const createRainThumbs = () => {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = 0;
      container.style.left = 0;
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.zIndex = '100';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);

      for (let i = 0; i < 50; i++) {
        const emoji = document.createElement('div');
        emoji.textContent = '👍';
        emoji.style.position = 'absolute';
        emoji.style.fontSize = `${Math.random() * 40 + 20}px`;
        emoji.style.left = `${Math.random() * 100}vw`;
        emoji.style.top = `-10vh`;
        emoji.style.animation = `fall ${Math.random() * 2 + 2}s linear`;
        emoji.style.opacity = `${Math.random() * 0.5 + 0.5}`;
        container.appendChild(emoji);

        emoji.addEventListener('animationend', () => {
          emoji.remove();
        });
      }

      setTimeout(() => {
        container.remove();
      }, 4000);
    };

    const saveThumbs = async () => {
      try {
        const docRef = doc(db, 'rainThumbsData', 'triggerCount');
        const docSnap = await getDoc(docRef);

        let existingCount = 0;
        if (docSnap.exists()) {
          existingCount = docSnap.data().count || 0;
        }

        await setDoc(docRef, {
          count: existingCount + sendCount.current,
          lastTriggered: lastTriggeredTime.current,
        });
        sendCount.current = 0;
      } catch (error) {
        console.error('Error saving to Firebase:', error);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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