import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
const BASE_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5033"

// Types
export interface Director {
  directorId: number
  name: string
  nationality: string
  age: number
  active: boolean
  movies?: {
    $values: any[]
  }
}

export interface DirectorCreateDto {
  name: string
  nationality: string
  age: number
  active: boolean
}

export interface DirectorState {
  directors: Director[]
  loading: boolean
  error: string | null
  totalItems: number
  currentPage: number
  pageSize: number
  searchTerm: string
}

const initialState: DirectorState = {
  directors: [],
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  pageSize: 10,
  searchTerm: "",
}

export interface FetchDirectorsParams {
  page?: number
  pageSize?: number
  search?: string
}

export interface PaginatedDirectorResponse {
  totalItems: number
  page: number
  pageSize: number
  items: Director[]
}

export const fetchDirectors = createAsyncThunk<
  PaginatedDirectorResponse,          // ① lo que **devuelve** el thunk
  void,                               // ② no recibe args porque leeremos del state
  { state: { directors: DirectorState } }
>("directors/fetchDirectors", async (_, thunkAPI) => {
  // 1. lee la paginación y el search del store
  const { currentPage, pageSize, searchTerm } = thunkAPI.getState().directors

  // 2. arma los query‑params
  const params = new URLSearchParams({
    page: currentPage.toString(),
    pageSize: pageSize.toString(),
    ...(searchTerm && { search: searchTerm }),
  })

  // 3. llama a la API
  const res = await fetch(`${BASE_URL}/api/Director?${params}`)
  if (!res.ok) throw new Error("Error fetching directors")
  const raw = await res.json()


  return {
    totalItems: raw.totalItems,
    page: raw.page,
    pageSize: raw.pageSize,
    items: (raw.directors?.$values ?? []).map((d: any) => ({
      ...d,
      movies: d.movies?.$values ?? [],
    })),
  }
})


export const createDirector = createAsyncThunk(
  "directors/createDirector",
  async (director: DirectorCreateDto) => {
    const response = await fetch("${BASE_URL}/api/Director", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(director),
    })
    if (!response.ok) throw new Error("Error creating director")
    return await response.json()
  },
)

export const updateDirector = createAsyncThunk(
  "directors/updateDirector",
  async (director: Director) => {
    const response = await fetch(`${BASE_URL}/api/Director/${director.directorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(director),
    })
    if (!response.ok) throw new Error("Error updating director")
    return await response.json()
  },
)

export const deleteDirector = createAsyncThunk(
  "directors/deleteDirector",
  async (directorId: number) => {
    const response = await fetch(`${BASE_URL}/api/Director/${directorId}`, { method: "DELETE" })
    if (!response.ok) throw new Error("Error deleting director")
    return directorId
  },
)

// Slice
const directorSlice = createSlice({
  name: "directors",
  initialState,
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
      .addCase(fetchDirectors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDirectors.fulfilled, (state, action) => {
        state.loading = false
        state.directors = action.payload.items
        state.totalItems = action.payload.totalItems
      })
      .addCase(fetchDirectors.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Error fetching directors"
      })
      .addCase(createDirector.fulfilled, (state, action) => {
        state.directors.push(action.payload)
        state.totalItems += 1
      })
      .addCase(updateDirector.fulfilled, (state, action) => {
        const index = state.directors.findIndex((d) => d.directorId === action.payload.directorId)
        if (index !== -1) state.directors[index] = action.payload
      })
      .addCase(deleteDirector.fulfilled, (state, action) => {
        state.directors = state.directors.filter((d) => d.directorId !== action.payload)
        state.totalItems -= 1
      })
  },
})

export const { setCurrentPage, setSearchTerm, clearError } = directorSlice.actions
export default directorSlice.reducer
