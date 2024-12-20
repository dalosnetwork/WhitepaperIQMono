import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chat } from "../../../api/api";

// Initial state: 'chat' is an array to hold all messages
const initialState = {
  chat: [],  // Array of messages: [{ message: "str", from: "user" }, { message: "str", from: "api" }]
  loading: false,
  error: null,
};

// Async thunk for sending a message and getting the API response
export const getChatData = createAsyncThunk('getChatData', async (message, { rejectWithValue }) => {
  try {
    const result = await chat(message);
    console.log(result)
    return { message: result.response.analysis, from: 'api' };
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to get API response");
  }
});

// Slice for handling chat state
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Reducer to add the user's message before making the API call
    addUserMessage: (state, action) => {
      state.chat.push({ message: action.payload, from: 'user' });  // Append user's message to the chat array
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatData.fulfilled, (state, action) => {
        state.chat.push(action.payload);  // Append the API response to the chat array
        state.loading = false;
      })
      .addCase(getChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get API response";
      });
  }
});

export const { addUserMessage } = chatSlice.actions;  // Export the new action
export default chatSlice.reducer;
