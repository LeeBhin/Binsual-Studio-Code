import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
    name: 'history',
    initialState: {
        windows: {
            0: {
                currentFiles: [],
                history: [],
                focusedFile: '',
            }
        },
        focusedTask: 'files',
        isLayoutActive: { isActive: true, width: 170 },
        rowAndCol: { row: 0, col: 0 },
        selected: 0,
        errors: { err: 0, warning: 0 },
        fileSplit: 0,
        activeFile: 0,
    },
    reducers: {
        addWindow: (state, action) => {
            const id = action.payload;
            const activeFile = state.activeFile;

            if (!state.windows[id]) {
                state.windows[id] = {
                    currentFiles: [
                        {
                            pinned: false,
                            path: state.windows[activeFile]?.focusedFile || '',
                        }
                    ],
                    history: [state.windows[activeFile]?.focusedFile || ''],
                    focusedFile: state.windows[activeFile]?.focusedFile || '',
                };
            }
        },
        removeWindow: (state, action) => {
            const id = action.payload;
            if (state.windows[id]) {
                delete state.windows[id];
                state.fileSplit = Math.max(-1, state.fileSplit - 1);
                state.activeFile = Math.max(0, state.activeFile - 1);
            }
            console.log('removeWindow state.windows:', state.windows);
        },
        setCurrentFiles: (state, action) => {
            const { id, currentFiles } = action.payload;
            console.log(id, JSON.parse(JSON.stringify(state.windows[id])))
            if (state.windows[id]) {
                if (currentFiles.length === 0) {
                    // const hasNextWindow = Object.keys(state.windows).some(windowId => Number(windowId) > id);
                    // delete state.windows[id]
                    state.windows[id] = {
                        currentFiles: [],
                        history: [],
                        focusedFile: '',
                    }
                    // if (hasNextWindow) {
                    //     const maxWindowId = Math.max(...Object.keys(state.windows).map(Number));
                    //     for (let i = id + 1; i <= maxWindowId; i++) {
                    //         if (state.windows[i]) {
                    //             state.windows[i].id = i - 1;
                    //         }
                    //     }
                    // }

                    // state.fileSplit = state.fileSplit - 1;
                    // state.activeFile = Math.max(0, state.activeFile - 1);
                } else {
                    state.windows[id].currentFiles = currentFiles;
                }
            }
        },
        setHistory: (state, action) => {
            const { id, history } = action.payload;
            if (state.windows[id]) {
                state.windows[id].history = history;
            }
        },
        setFocusedFile: (state, action) => {
            const { id, focusedFile } = action.payload;
            if (state.windows[id]) {
                state.windows[id].focusedFile = focusedFile;
            }
            console.log('setFocusedFile focusedFile:', focusedFile);
        },
        setFocusedTask: (state, action) => {
            state.focusedTask = action.payload;
        },
        setIsLayoutActive: (state, action) => {
            state.isLayoutActive = action.payload;
        },
        setRowCol: (state, action) => {
            state.rowAndCol = action.payload;
        },
        setSelected: (state, action) => {
            state.selected = action.payload;
        },
        setErr: (state, action) => {
            state.errors = action.payload;
        },
        setFileSplit: (state, action) => {
            state.fileSplit = action.payload;
            console.log('setFileSplit fileSplit:', state.fileSplit);
        },
        setActiveFile: (state, action) => {
            state.activeFile = action.payload;
            console.log('setActiveFile activeFile:', state.activeFile);
        },
    },
});

export const {
    addWindow,
    removeWindow,
    setCurrentFiles,
    setHistory,
    setFocusedFile,
    setFocusedTask,
    setIsLayoutActive,
    setRowCol,
    setSelected,
    setErr,
    setFileSplit,
    setActiveFile,
} = historySlice.actions;

export default historySlice.reducer;
