import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
    name: 'history',
    initialState: {
        currentFiles: [],
        history: [],
        focusedFile: '',
        focusedTask: '',
        isLayoutActive: { isActive: true, width: 170 },
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
    },
});

export const { setCurrentFiles, setHistory, setFocusedFile, setFocusedTask, setIsLayoutActive } = historySlice.actions;
export default historySlice.reducer;
