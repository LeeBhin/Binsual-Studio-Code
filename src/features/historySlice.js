import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
    name: 'history',
    initialState: {
        currentFiles: [],
        history: [],
        focusedFile: '',
        focusedTask: 'files',
        isLayoutActive: { isActive: true, width: 170 },
        rowAndCol: { row: 0, col: 0 },
        selected: 0,
        errors: { err: 0, warning: 0 }
    },
    reducers: {
        setCurrentFiles: (state, action) => {
            state.currentFiles = action.payload;
        },
        setHistory: (state, action) => {
            state.history = action.payload;
            console.log('his', state.history)
        },
        setFocusedFile: (state, action) => {
            state.focusedFile = action.payload;
            console.log('focus', state.focusedFile)
        },
        setFocusedTask: (state, action) => {
            state.focusedTask = action.payload;
        },
        setIsLayoutActive: (state, action) => {
            state.isLayoutActive = action.payload
            console.log(state.isLayoutActive)
        },
        setRowCol: (state, action) => {
            state.rowAndCol = action.payload
        },
        setSelected: (state, action) => {
            state.selected = action.payload
        },
        setErr: (state, action) => {
            state.errors = action.payload
        },
    },
});

export const { setCurrentFiles, setHistory, setFocusedFile, setFocusedTask, setIsLayoutActive, setRowCol, setSelected, setErr } = historySlice.actions;
export default historySlice.reducer;