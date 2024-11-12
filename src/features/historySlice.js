import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
    name: 'history',
    initialState: {
        currentFiles: [],
        history: [],
        focusedFile: 0,
    },
    reducers: {
        setCurrentFiles: (state, action) => {
            state.currentFiles = action.payload;
        },
        setHistory: (state, action) => {
            state.history = action.payload;
        },
        setFocusedFile: (state, action) => {
            state.focusedFile = action.payload;
        },
    },
});

export const { setCurrentFiles, setHistory, setFocusedFile } = historySlice.actions;
export default historySlice.reducer;
