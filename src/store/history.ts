import { create } from 'zustand'

export interface CurrentFileEntry {
  pinned: boolean
  path: string
}

export interface WindowData {
  currentFiles: CurrentFileEntry[]
  history: string[]
  focusedFile: string
  isCurrentActive?: Record<string, unknown>
}

export interface LayoutActive {
  isActive: boolean
  width: number
  from?: string
}

export interface RowCol {
  row: number
  col: number
}

export interface ErrorState {
  err: number
  warning: number
}

interface HistoryState {
  windows: Record<number, WindowData>
  focusedTask: string
  isLayoutActive: LayoutActive
  rowAndCol: RowCol
  selected: number
  errors: ErrorState
  fileSplit: number[]
  activeFile: number
  startLink: unknown[]
}

interface HistoryActions {
  addWindow: (id: number) => void
  removeWindow: (id: number) => void
  setCurrentFiles: (payload: { id: number; currentFiles: CurrentFileEntry[] }) => void
  setHistory: (payload: { id: number; history: string[] }) => void
  setFocusedFile: (payload: { id: number; focusedFile: string }) => void
  setFocusedTask: (val: string) => void
  setIsLayoutActive: (val: LayoutActive) => void
  setRowCol: (val: RowCol) => void
  setSelected: (val: number) => void
  setErr: (val: ErrorState) => void
  setFileSplit: (val: number[]) => void
  setActiveFile: (val: number) => void
  setStartLink: (val: unknown[]) => void
  setIsCurrentActive: (payload: { id: number; isCurrentActive: Record<string, unknown> }) => void
}

const initialState: HistoryState = {
  windows: {
    0: {
      currentFiles: [{ pinned: false, path: 'LEE BHIN/시작.vs' }],
      history: [],
      focusedFile: 'LEE BHIN/시작.vs',
      isCurrentActive: {},
    },
  },
  focusedTask: 'files',
  isLayoutActive: { isActive: true, width: 170 },
  rowAndCol: { row: 0, col: 0 },
  selected: 0,
  errors: { err: 0, warning: 0 },
  fileSplit: [0],
  activeFile: 0,
  startLink: [],
}

export const useHistory = create<HistoryState & HistoryActions>((set) => ({
  ...initialState,

  addWindow: (id) =>
    set((state) => {
      if (state.windows[id]) return state
      const focusedFile = state.windows[state.activeFile]?.focusedFile || ''
      return {
        windows: {
          ...state.windows,
          [id]: {
            currentFiles: [{ pinned: false, path: focusedFile }],
            history: [focusedFile],
            focusedFile,
          },
        },
      }
    }),

  removeWindow: (id) =>
    set((state) => {
      if (!state.windows[id]) return state
      const newWindows = { ...state.windows }
      delete newWindows[id]
      return {
        windows: newWindows,
        fileSplit: state.fileSplit.slice(0, -1),
        activeFile: Math.max(0, state.activeFile - 1),
      }
    }),

  setCurrentFiles: ({ id, currentFiles }) =>
    set((state) => {
      const target = state.windows[id]
      if (!target) return state

      if (currentFiles.length === 0) {
        if (Object.keys(state.windows).length === 1) {
          return {
            windows: {
              ...state.windows,
              [id]: { currentFiles: [], history: [], focusedFile: '' },
            },
          }
        }
        const reordered: Record<number, WindowData> = {}
        Object.entries(state.windows).forEach(([key, value]) => {
          const numKey = parseInt(key)
          if (numKey < id) reordered[numKey] = value
          else if (numKey > id) reordered[numKey - 1] = value
        })
        const nextSplit = [...state.fileSplit]
        nextSplit.splice(id, 1)
        return {
          windows: reordered,
          fileSplit: nextSplit,
          activeFile: Math.max(0, id - 1),
        }
      }

      return {
        windows: { ...state.windows, [id]: { ...target, currentFiles } },
      }
    }),

  setHistory: ({ id, history }) =>
    set((state) => {
      const target = state.windows[id]
      if (!target) return state
      return {
        windows: { ...state.windows, [id]: { ...target, history } },
      }
    }),

  setFocusedFile: ({ id, focusedFile }) =>
    set((state) => {
      const target = state.windows[id]
      if (!target) return state

      if (focusedFile && !focusedFile.includes('vs') && !focusedFile.includes('debug.exe')) {
        try {
          const recent = JSON.parse(localStorage.getItem('recent') || '[]') as string[]
          const updatedRecent = [focusedFile, ...recent.filter((f) => f !== focusedFile)]
          if (updatedRecent.length > 5) updatedRecent.pop()
          localStorage.setItem('recent', JSON.stringify(updatedRecent))
        } catch {
          // ignore localStorage errors
        }
      }

      return {
        windows: { ...state.windows, [id]: { ...target, focusedFile } },
      }
    }),

  setFocusedTask: (val) => set({ focusedTask: val }),
  setIsLayoutActive: (val) => set({ isLayoutActive: val }),
  setRowCol: (val) => set({ rowAndCol: val }),
  setSelected: (val) => set({ selected: val }),
  setErr: (val) => set({ errors: val }),
  setFileSplit: (val) => set({ fileSplit: val }),
  setActiveFile: (val) => set({ activeFile: val }),
  setStartLink: (val) => set({ startLink: val }),

  setIsCurrentActive: ({ id, isCurrentActive }) =>
    set((state) => {
      const target = state.windows[id]
      if (!target) return state
      return {
        windows: { ...state.windows, [id]: { ...target, isCurrentActive } },
      }
    }),
}))

// Imperative action shortcuts — direct replacements for `dispatch(action(payload))`.
// Components keep their existing call sites: `dispatch(setFocusedTask('x'))` becomes `setFocusedTask('x')`.
export const addWindow: HistoryActions['addWindow'] = (...a) => useHistory.getState().addWindow(...a)
export const removeWindow: HistoryActions['removeWindow'] = (...a) => useHistory.getState().removeWindow(...a)
export const setCurrentFiles: HistoryActions['setCurrentFiles'] = (...a) => useHistory.getState().setCurrentFiles(...a)
export const setHistory: HistoryActions['setHistory'] = (...a) => useHistory.getState().setHistory(...a)
export const setFocusedFile: HistoryActions['setFocusedFile'] = (...a) => useHistory.getState().setFocusedFile(...a)
export const setFocusedTask: HistoryActions['setFocusedTask'] = (...a) => useHistory.getState().setFocusedTask(...a)
export const setIsLayoutActive: HistoryActions['setIsLayoutActive'] = (...a) => useHistory.getState().setIsLayoutActive(...a)
export const setRowCol: HistoryActions['setRowCol'] = (...a) => useHistory.getState().setRowCol(...a)
export const setSelected: HistoryActions['setSelected'] = (...a) => useHistory.getState().setSelected(...a)
export const setErr: HistoryActions['setErr'] = (...a) => useHistory.getState().setErr(...a)
export const setFileSplit: HistoryActions['setFileSplit'] = (...a) => useHistory.getState().setFileSplit(...a)
export const setActiveFile: HistoryActions['setActiveFile'] = (...a) => useHistory.getState().setActiveFile(...a)
export const setStartLink: HistoryActions['setStartLink'] = (...a) => useHistory.getState().setStartLink(...a)
export const setIsCurrentActive: HistoryActions['setIsCurrentActive'] = (...a) => useHistory.getState().setIsCurrentActive(...a)
