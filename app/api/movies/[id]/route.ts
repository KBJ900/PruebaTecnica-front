import { type NextRequest, NextResponse } from "next/server"

// Mock data (same as in route.ts)
const movies = [
  {
    moviesId: 1,
    name: "Inception",
    releaseYear: "2010-07-16",
    gender: "Sci-Fi",
    duration: "02:28:00",
    directorId: 1,
    director: { directorId: 1, name: "Christopher Nolan", nationality: "British", age: 53, active: true },
  },
  {
    moviesId: 2,
    name: "Pulp Fiction",
    releaseYear: "1994-10-14",
    gender: "Crime",
    duration: "02:34:00",
    directorId: 2,
    director: { directorId: 2, name: "Quentin Tarantino", nationality: "American", age: 60, active: true },
  },
  {
    moviesId: 3,
    name: "The Departed",
    releaseYear: "2006-10-06",
    gender: "Crime",
    duration: "02:31:00",
    directorId: 3,
    director: { directorId: 3, name: "Martin Scorsese", nationality: "American", age: 81, active: true },
  },
  {
    moviesId: 4,
    name: "Dune",
    releaseYear: "2021-10-22",
    gender: "Sci-Fi",
    duration: "02:35:00",
    directorId: 5,
    director: { directorId: 5, name: "Denis Villeneuve", nationality: "Canadian", age: 56, active: true },
  },
]

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movie = movies.find((m) => m.moviesId === Number.parseInt(id))

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 })
  }

  return NextResponse.json(movie)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const movieIndex = movies.findIndex((m) => m.moviesId === Number.parseInt(id))

  if (movieIndex === -1) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 })
  }

  // Find director for the movie
  const directors = [
    { directorId: 1, name: "Christopher Nolan", nationality: "British", age: 53, active: true },
    { directorId: 2, name: "Quentin Tarantino", nationality: "American", age: 60, active: true },
    { directorId: 3, name: "Martin Scorsese", nationality: "American", age: 81, active: true },
    { directorId: 4, name: "Steven Spielberg", nationality: "American", age: 76, active: true },
    { directorId: 5, name: "Denis Villeneuve", nationality: "Canadian", age: 56, active: true },
  ]

  const director = directors.find((d) => d.directorId === body.directorId)

  movies[movieIndex] = {
    moviesId: Number.parseInt(id),
    name: body.name,
    releaseYear: body.releaseYear,
    gender: body.gender,
    duration: body.duration,
    directorId: body.directorId,
    director,
  }

  return NextResponse.json(movies[movieIndex])
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movieIndex = movies.findIndex((m) => m.moviesId === Number.parseInt(id))

  if (movieIndex === -1) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 })
  }

  const deletedMovie = movies[movieIndex]
  movies.splice(movieIndex, 1)

  return NextResponse.json({
    message: "Película eliminada exitosamente",
    deletedMovie,
  })
}
