import { configureStore } from "@reduxjs/toolkit"
import directorReducer from "./slices/directorSlice"
import moviesReducer from "./slices/moviesSlice"
import dotenv from "dotenv"

dotenv.config()
export const store = configureStore({
  reducer: {
    directors: directorReducer,
    movies: moviesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
