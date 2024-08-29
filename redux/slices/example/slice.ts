// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ExampleState {
  value: number;
  sideEffectCount: number;
  fetchData?: unknown[];
  loading: boolean;
  error: string | null;
  reviewData: unknown[];
}

const initialState: ExampleState = {
  value: 0,
  sideEffectCount: 0,
  loading: false,
  error: null,
  reviewData: [],
};

export const fetchMovies = createAsyncThunk(
  "example/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://www.omdbapi.com/?s=all&apikey=aa9f2983"
      );

      const moviesWithFlag = response.data.Search.map((movie: any) => ({
        ...movie,
        flag: true,
      }));

      return {
        ...response.data,
        Search: moviesWithFlag,
      };
    } catch (error) {
      return rejectWithValue("Error Fetching Data");
    }
  }
);

export const slice = createSlice({
  initialState,
  name: "example",
  reducers: {
    fetch: () => {},
    clearData: (state) => {
      state.fetchData = undefined;
    },
    loaded: (state, action: PayloadAction<{ data: unknown[] }>) => {
      state.fetchData = action.payload.data;
    },
    loadError: (state) => {
      state.fetchData = ["Error Fetching :("];
    },
    increment: (state) => {
      state.value += 1;
    },

    allReview: (
      state,
      action: PayloadAction<{
        imdbId: string;
        newComment: string;
        selectComment: string;
      }>
    ) => {
      const { imdbId, newComment, preComment, update } = action.payload;

      console.log(action.payload, "if action.payload");
      if (update) {
        const updatedData = state.reviewData.map((item) => {
          if (item.imdbId === imdbId && item.comment === preComment) {
            return {
              ...item,
              comment: newComment,
              flag: false,
            };
          }
          return item;
        });

        state.reviewData = updatedData;
      } else {
        state.reviewData = [...state.reviewData, action.payload];
      }
    },
    epicSideEffect: (state) => {
      state.sideEffectCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMovies.fulfilled,
        (state, action: PayloadAction<unknown[]>) => {
          state.loading = false;
          state.fetchData = action.payload;
        }
      )
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.fetchData = ["Error Fetching :("];
      });
  },
});

export const { actions } = slice;
export type SliceAction = typeof actions;
export default slice.reducer;
