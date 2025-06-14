import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5033"

// Types
export interface Director {
  directorId: number
  name: string
  nationality: string
  age: number
  active: boolean
}

export interface Movie {
  moviesId: number
  name: string
  releaseYear: string
  gender: string
  duration: string
  directorId: number
  director?: Director
}

export interface MovieCreateDto {
  name: string
  releaseYear: string
  gender: string
  duration: string
  directorId: number
}

export interface MovieUpdateDto extends MovieCreateDto {
  moviesId: number
}

export interface MovieState {
  movies: Movie[]
  directors: Director[]
  loading: boolean
  error: string | null
  totalItems: number
  currentPage: number
  pageSize: number
  searchTerm: string
}

export interface FetchMoviesParams {
  page?: number
  pageSize?: number
  search?: string
}

// Initial state
const initialState: MovieState = {
  movies: [],
  directors: [],
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  pageSize: 10,
  searchTerm: "",
}

export interface PaginatedMovieResponse {
  totalItems: number
  page: number
  pageSize: number
  items: Movie[]
}

export const fetchMovies = createAsyncThunk<
  PaginatedMovieResponse,
  FetchMoviesParams | undefined,
  { state: { movies: MovieState } }
>("movies/fetchMovies", async (params, thunkAPI) => {
  // Usa los que vengan en params o los que estén en el store
  const state = thunkAPI.getState().movies
  const page      = params?.page      ?? state.currentPage
  const pageSize  = params?.pageSize  ?? state.pageSize
  const search    = params?.search    ?? state.searchTerm

  const qs = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search }),
  })

  const res = await fetch(`${BASE_URL}/api/Movies?${qs}`)
  if (!res.ok) throw new Error("Error fetching movies")
  const raw = await res.json()

  // ---------- NORMALIZACIÓN ----------
  // 1) Elimina los objetos duplicados ($ref)
  const unique: Record<number, any> = {}
  ;(raw.movies?.$values ?? []).forEach((m: any) => {
    if (m.$ref) return                           // es duplicado
    unique[m.moviesId] = m
  })

  // 2) Convierte a la forma que tu UI espera
  const items: any[] = Object.values(unique).map((m: any) => ({
    moviesId: m.moviesId,
    name: m.name,
    releaseYear: m.releaseYear,
    gender: m.gender,
    duration: m.duration,
    directorId: m.directorId,
    director: m.director
      ? { directorId: m.director.directorId, name: m.director.name }
      : undefined,
  }))

  return {
    totalItems: raw.totalItems,
    page: raw.page,
    pageSize: raw.pageSize,
    items,
  }
})

export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (movie: MovieCreateDto) => {
    const response = await fetch("${BASE_URL}/api/Movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    })
    if (!response.ok) throw new Error("Error creating movie")
    return await response.json()
  },
)

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async (movie: MovieUpdateDto) => {
    const response = await fetch(`${BASE_URL}/api/Movies/${movie.moviesId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    })
    if (!response.ok) throw new Error("Error updating movie")
    return await response.json()
  },
)

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (moviesId: number) => {
    const response = await fetch(`${BASE_URL}/api/Movies/${moviesId}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Error deleting movie")
    return moviesId
  },
)

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [] as Movie[],
    loading: false,
    error: null,
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    searchTerm: "",
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload.items
        state.totalItems = action.payload.totalItems
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = null
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.movies.push(action.payload)
        state.totalItems += 1
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex((m) => m.moviesId === action.payload.moviesId)
        if (index !== -1) state.movies[index] = action.payload
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter((m) => m.moviesId !== action.payload)
        state.totalItems -= 1
      })
  },
})

export const { setCurrentPage, setSearchTerm, clearError } = movieSlice.actions
export default movieSlice.reducer
