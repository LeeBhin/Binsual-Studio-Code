import { useEffect, useRef } from 'react'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import { useHistory } from './store/history'
import { useShortcuts } from './features/useShortcuts'

const App = () => {
  const activeFile = useHistory((s) => s.activeFile)
  const focusedFile = useHistory((s) => s.windows[activeFile]?.focusedFile ?? '')

  useShortcuts()

  const vh = useRef(0)
  const triggerCount = useRef(0)

  useEffect(() => {
    const updateVH = () => {
      vh.current = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh.current}px`)
    }

    updateVH()
    window.addEventListener('resize', updateVH)
    return () => window.removeEventListener('resize', updateVH)
  }, [])

  const getFileName = (path: string) => path.split('/').at(-1) ?? ''

  useEffect(() => {
    if (focusedFile) {
      if (focusedFile.includes('시작.vs')) {
        document.title = `시작 - 작업 영역 - Binsual Studio Code`
      } else {
        document.title = `${getFileName(focusedFile)} - 작업 영역 - Binsual Studio Code`
      }
    } else {
      document.title = '작업 영역 - Binsual Studio Code'
    }
  }, [focusedFile])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.altKey && event.code === 'Enter') {
        event.preventDefault()
        triggerCount.current++
        if (triggerCount.current >= 20) {
          createBigThumb()
          triggerCount.current = 0
        }
        createRainThumbs()
      }
    }

    const createBigThumb = () => {
      const emoji = document.createElement('div')
      emoji.textContent = '👍'
      emoji.style.cssText =
        'position: fixed; font-size: 500px; left: 50%; top: -500px; transform: translateX(-50%); z-index: 1000; animation: dropEmoji 1s forwards;'
      const style = document.createElement('style')
      style.textContent = `
        @keyframes dropEmoji {
          0% { top: -500px; transform: translate(-50%, 0); }
          100% { top: 50vh; transform: translate(-50%, -50%); }
        }
      `
      document.head.appendChild(style)
      document.body.appendChild(emoji)

      setTimeout(() => {
        emoji.remove()
        style.remove()
      }, 3000)
    }

    const createRainThumbs = () => {
      const container = document.createElement('div')
      container.style.position = 'fixed'
      container.style.top = '0'
      container.style.left = '0'
      container.style.width = '100vw'
      container.style.height = '100vh'
      container.style.zIndex = '100'
      container.style.pointerEvents = 'none'
      document.body.appendChild(container)

      for (let i = 0; i < 50; i++) {
        const emoji = document.createElement('div')
        emoji.textContent = '👍'
        emoji.style.position = 'absolute'
        emoji.style.fontSize = `${Math.random() * 40 + 20}px`
        emoji.style.left = `${Math.random() * 100}vw`
        emoji.style.top = `-10vh`
        emoji.style.animation = `fall ${Math.random() * 2 + 2}s linear`
        emoji.style.opacity = `${Math.random() * 0.5 + 0.5}`
        container.appendChild(emoji)

        emoji.addEventListener('animationend', () => emoji.remove())
      }

      setTimeout(() => container.remove(), 4000)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div>
      <Layout>
        <Home />
      </Layout>
    </div>
  )
}

export default App
