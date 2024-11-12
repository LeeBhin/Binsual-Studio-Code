import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
    name: 'history',
    initialState: {
        currentFiles: [],
        history: [],
        focusedFile: '',
    },
    reducers: {
        setCurrentFiles: (state, action) => {
            state.currentFiles = action.payload;
            console.log('currentfiles', state.currentFiles)
        },
        setHistory: (state, action) => {
            state.history = action.payload;
            console.log('his', state.history)
        },
        setFocusedFile: (state, action) => {
            state.focusedFile = action.payload;
            console.log('focus', state.focusedFile)
        },
    },
});

export const { setCurrentFiles, setHistory, setFocusedFile } = historySlice.actions;
export default historySlice.reducer;
