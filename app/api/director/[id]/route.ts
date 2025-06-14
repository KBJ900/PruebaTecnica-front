import { type NextRequest, NextResponse } from "next/server"

// Mock data (same as in route.ts)
const directors = [
  { directorId: 1, name: "Christopher Nolan", nationality: "British", age: 53, active: true },
  { directorId: 2, name: "Quentin Tarantino", nationality: "American", age: 60, active: true },
  { directorId: 3, name: "Martin Scorsese", nationality: "American", age: 81, active: true },
  { directorId: 4, name: "Steven Spielberg", nationality: "American", age: 76, active: true },
  { directorId: 5, name: "Denis Villeneuve", nationality: "Canadian", age: 56, active: true },
]

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const director = directors.find((d) => d.directorId === Number.parseInt(id))

  if (!director) {
    return NextResponse.json({ error: "Director not found" }, { status: 404 })
  }

  return NextResponse.json(director)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const directorIndex = directors.findIndex((d) => d.directorId === Number.parseInt(id))

  if (directorIndex === -1) {
    return NextResponse.json({ error: "Director not found" }, { status: 404 })
  }

  directors[directorIndex] = {
    directorId: Number.parseInt(id),
    name: body.name,
    nationality: body.nationality,
    age: body.age,
    active: body.active,
  }

  return NextResponse.json(directors[directorIndex])
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const directorIndex = directors.findIndex((d) => d.directorId === Number.parseInt(id))

  if (directorIndex === -1) {
    return NextResponse.json({ error: "Director not found" }, { status: 404 })
  }

  directors.splice(directorIndex, 1)

  return NextResponse.json({}, { status: 204 })
}
