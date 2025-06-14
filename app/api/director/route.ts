import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration - Expanded to test pagination
const allDirectors = [
  { directorId: 1, name: "Christopher Nolan", nationality: "Británico", age: 53, active: true },
  { directorId: 2, name: "Quentin Tarantino", nationality: "Estadounidense", age: 60, active: true },
  { directorId: 3, name: "Martin Scorsese", nationality: "Estadounidense", age: 81, active: true },
  { directorId: 4, name: "Steven Spielberg", nationality: "Estadounidense", age: 76, active: true },
  { directorId: 5, name: "Denis Villeneuve", nationality: "Canadiense", age: 56, active: true },
  { directorId: 6, name: "Ridley Scott", nationality: "Británico", age: 86, active: true },
  { directorId: 7, name: "David Fincher", nationality: "Estadounidense", age: 61, active: true },
  { directorId: 8, name: "Coen Brothers", nationality: "Estadounidense", age: 69, active: true },
  { directorId: 9, name: "Paul Thomas Anderson", nationality: "Estadounidense", age: 54, active: true },
  { directorId: 10, name: "Wes Anderson", nationality: "Estadounidense", age: 54, active: true },
  { directorId: 11, name: "Guillermo del Toro", nationality: "Mexicano", age: 59, active: true },
  { directorId: 12, name: "Alejandro González Iñárritu", nationality: "Mexicano", age: 60, active: true },
  { directorId: 13, name: "Alfonso Cuarón", nationality: "Mexicano", age: 62, active: true },
  { directorId: 14, name: "Pedro Almodóvar", nationality: "Español", age: 74, active: true },
  { directorId: 15, name: "Wong Kar-wai", nationality: "Chino", age: 65, active: true },
  { directorId: 16, name: "Akira Kurosawa", nationality: "Japonés", age: 88, active: false },
  { directorId: 17, name: "Stanley Kubrick", nationality: "Estadounidense", age: 70, active: false },
  { directorId: 18, name: "Francis Ford Coppola", nationality: "Estadounidense", age: 84, active: true },
  { directorId: 19, name: "Woody Allen", nationality: "Estadounidense", age: 88, active: true },
  { directorId: 20, name: "Tim Burton", nationality: "Estadounidense", age: 65, active: true },
  { directorId: 21, name: "Jordan Peele", nationality: "Estadounidense", age: 44, active: true },
  { directorId: 22, name: "Greta Gerwig", nationality: "Estadounidense", age: 40, active: true },
  { directorId: 23, name: "Chloé Zhao", nationality: "China", age: 42, active: true },
  { directorId: 24, name: "Bong Joon-ho", nationality: "Surcoreano", age: 54, active: true },
  { directorId: 25, name: "Lulu Wang", nationality: "China-Estadounidense", age: 41, active: true },
]

const directors = [...allDirectors]
let nextId = 26

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
  const search = searchParams.get("search")

  let filteredDirectors = directors

  if (search) {
    filteredDirectors = directors.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.nationality.toLowerCase().includes(search.toLowerCase()),
    )
  }

  const totalItems = filteredDirectors.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedDirectors = filteredDirectors.slice(startIndex, endIndex)

  return NextResponse.json({
    totalItems,
    page,
    pageSize,
    items: paginatedDirectors,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newDirector = {
    directorId: nextId++,
    name: body.name,
    nationality: body.nationality,
    age: body.age,
    active: body.active,
  }

  directors.push(newDirector)

  return NextResponse.json(newDirector, { status: 201 })
}
