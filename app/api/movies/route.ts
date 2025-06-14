import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration - Expanded to test pagination
const allMovies = [
  {
    moviesId: 1,
    name: "Inception",
    releaseYear: "2010-07-16",
    gender: "Ciencia Ficción",
    duration: "02:28:00",
    directorId: 1,
    director: { directorId: 1, name: "Christopher Nolan", nationality: "Británico", age: 53, active: true },
  },
  {
    moviesId: 2,
    name: "Pulp Fiction",
    releaseYear: "1994-10-14",
    gender: "Crimen",
    duration: "02:34:00",
    directorId: 2,
    director: { directorId: 2, name: "Quentin Tarantino", nationality: "Estadounidense", age: 60, active: true },
  },
  {
    moviesId: 3,
    name: "The Departed",
    releaseYear: "2006-10-06",
    gender: "Crimen",
    duration: "02:31:00",
    directorId: 3,
    director: { directorId: 3, name: "Martin Scorsese", nationality: "Estadounidense", age: 81, active: true },
  },
  {
    moviesId: 4,
    name: "Dune",
    releaseYear: "2021-10-22",
    gender: "Ciencia Ficción",
    duration: "02:35:00",
    directorId: 5,
    director: { directorId: 5, name: "Denis Villeneuve", nationality: "Canadiense", age: 56, active: true },
  },
  {
    moviesId: 5,
    name: "Blade Runner 2049",
    releaseYear: "2017-10-06",
    gender: "Ciencia Ficción",
    duration: "02:44:00",
    directorId: 5,
    director: { directorId: 5, name: "Denis Villeneuve", nationality: "Canadiense", age: 56, active: true },
  },
  {
    moviesId: 6,
    name: "Interstellar",
    releaseYear: "2014-11-07",
    gender: "Ciencia Ficción",
    duration: "02:49:00",
    directorId: 1,
    director: { directorId: 1, name: "Christopher Nolan", nationality: "Británico", age: 53, active: true },
  },
  {
    moviesId: 7,
    name: "The Dark Knight",
    releaseYear: "2008-07-18",
    gender: "Acción",
    duration: "02:32:00",
    directorId: 1,
    director: { directorId: 1, name: "Christopher Nolan", nationality: "Británico", age: 53, active: true },
  },
  {
    moviesId: 8,
    name: "Kill Bill: Vol. 1",
    releaseYear: "2003-10-10",
    gender: "Acción",
    duration: "01:51:00",
    directorId: 2,
    director: { directorId: 2, name: "Quentin Tarantino", nationality: "Estadounidense", age: 60, active: true },
  },
  {
    moviesId: 9,
    name: "Goodfellas",
    releaseYear: "1990-09-21",
    gender: "Crimen",
    duration: "02:26:00",
    directorId: 3,
    director: { directorId: 3, name: "Martin Scorsese", nationality: "Estadounidense", age: 81, active: true },
  },
  {
    moviesId: 10,
    name: "Saving Private Ryan",
    releaseYear: "1998-07-24",
    gender: "Guerra",
    duration: "02:49:00",
    directorId: 4,
    director: { directorId: 4, name: "Steven Spielberg", nationality: "Estadounidense", age: 76, active: true },
  },
  {
    moviesId: 11,
    name: "Schindler's List",
    releaseYear: "1993-12-15",
    gender: "Drama",
    duration: "03:15:00",
    directorId: 4,
    director: { directorId: 4, name: "Steven Spielberg", nationality: "Estadounidense", age: 76, active: true },
  },
  {
    moviesId: 12,
    name: "Gladiator",
    releaseYear: "2000-05-05",
    gender: "Acción",
    duration: "02:35:00",
    directorId: 6,
    director: { directorId: 6, name: "Ridley Scott", nationality: "Británico", age: 86, active: true },
  },
  {
    moviesId: 13,
    name: "Fight Club",
    releaseYear: "1999-10-15",
    gender: "Drama",
    duration: "02:19:00",
    directorId: 7,
    director: { directorId: 7, name: "David Fincher", nationality: "Estadounidense", age: 61, active: true },
  },
  {
    moviesId: 14,
    name: "No Country for Old Men",
    releaseYear: "2007-11-21",
    gender: "Thriller",
    duration: "02:02:00",
    directorId: 8,
    director: { directorId: 8, name: "Coen Brothers", nationality: "Estadounidense", age: 69, active: true },
  },
  {
    moviesId: 15,
    name: "There Will Be Blood",
    releaseYear: "2007-12-26",
    gender: "Drama",
    duration: "02:38:00",
    directorId: 9,
    director: { directorId: 9, name: "Paul Thomas Anderson", nationality: "Estadounidense", age: 54, active: true },
  },
]

const movies = [...allMovies]
let nextId = 16

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
  const search = searchParams.get("search")

  let filteredMovies = movies

  if (search) {
    filteredMovies = movies.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.gender.toLowerCase().includes(search.toLowerCase()) ||
        (m.director && m.director.name.toLowerCase().includes(search.toLowerCase())),
    )
  }

  const totalItems = filteredMovies.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex)

  return NextResponse.json({
    totalItems,
    page,
    pageSize,
    items: paginatedMovies,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Find director for the movie
  const directors = [
    { directorId: 1, name: "Christopher Nolan", nationality: "Británico", age: 53, active: true },
    { directorId: 2, name: "Quentin Tarantino", nationality: "Estadounidense", age: 60, active: true },
    { directorId: 3, name: "Martin Scorsese", nationality: "Estadounidense", age: 81, active: true },
    { directorId: 4, name: "Steven Spielberg", nationality: "Estadounidense", age: 76, active: true },
    { directorId: 5, name: "Denis Villeneuve", nationality: "Canadiense", age: 56, active: true },
  ]

  const director = directors.find((d) => d.directorId === body.directorId)

  const newMovie = {
    moviesId: nextId++,
    name: body.name,
    releaseYear: body.releaseYear,
    gender: body.gender,
    duration: body.duration,
    directorId: body.directorId,
    director,
  }

  movies.push(newMovie)

  return NextResponse.json(newMovie, { status: 201 })
}
