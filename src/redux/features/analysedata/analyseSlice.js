import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadPdf } from "../../../api/api";

const initialState = {
  analyse: [],
};

export const getAnalyseData = createAsyncThunk('getAnalyseData', async(file) => {
  try {
    const result = await uploadPdf(file);
    sessionStorage.setItem("token", result.analysis.user_id )
    const analysisObj = JSON.parse(result.analysis.analysis);
    return analysisObj
  } catch (error) {
      console.log(error)
  }
})

export const analyseSlice = createSlice({
  name: "analyse",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getAnalyseData.fulfilled, (state, action)=>{
        state.analyse = action.payload
    })
    .addCase(getAnalyseData.rejected, (state) => {
      state.analyse = null; // Clear the market state on rejection
    });
  }
})


export default analyseSlice.reducer;
