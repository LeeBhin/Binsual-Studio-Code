import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
    name: 'history',
    initialState: {
        listOne: [],
        listTwo: [],
        count: 0,
    },
    reducers: {
        setListOne: (state, action) => {
            state.listOne = action.payload;
        },
        setListTwo: (state, action) => {
            state.listTwo = action.payload;
        },
        setCount: (state, action) => {
            state.count = action.payload;
        },
    },
});

export const { setListOne, setListTwo, setCount } = historySlice.actions;
export default historySlice.reducer;
