"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Film, Calendar, Clock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  setCurrentPage,
  setSearchTerm,
  clearError,
  type Movie,
  type MovieCreateDto,
} from "@/store/slices/moviesSlice"
import { fetchDirectors } from "@/store/slices/directorSlice"

export default function MoviesCrudRedux() {
  const dispatch = useAppDispatch()
  const { movies, loading, error, totalItems, currentPage, pageSize, searchTerm } = useAppSelector(
    (state) => state.movies as { movies: Movie[]; loading: boolean; error: string | null; totalItems: number; currentPage: number; pageSize: number; searchTerm: string },
  )
  const { directors } = useAppSelector((state) => state.directors)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [formData, setFormData] = useState<MovieCreateDto>({
    name: "",
    releaseYear: "",
    gender: "",
    duration: "",
    directorId: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchMovies({ page: currentPage, pageSize, search: searchTerm }))
    dispatch(fetchDirectors()) // Cargar todos los directores
  }, [dispatch, currentPage, pageSize, searchTerm])

  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
      dispatch(clearError())
    }
  }, [error, toast, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.directorId || formData.directorId === 0) {
      alert('Por favor selecciona un director.');
      return;
    }
    try {
      if (editingMovie) {
        await dispatch(updateMovie({ ...formData, moviesId: editingMovie.moviesId })).unwrap()
        toast({ title: "Éxito", description: "Película actualizada exitosamente" })
      } else {
        await dispatch(createMovie(formData)).unwrap()
        toast({ title: "Éxito", description: "Película creada exitosamente" })
      }
      setIsDialogOpen(false)
      resetForm()
      dispatch(fetchMovies({ page: currentPage, pageSize, search: searchTerm }))
    } catch {
      toast({ title: "Error", description: `Error al ${editingMovie ? "actualizar" : "crear"} la película`, variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta película?")) return
    try {
      await dispatch(deleteMovie(id)).unwrap()
      toast({ title: "Éxito", description: "Película eliminada exitosamente" })
      dispatch(fetchMovies({ page: currentPage, pageSize, search: searchTerm }))
    } catch {
      toast({ title: "Error", description: "Error al eliminar la película", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({ name: "", releaseYear: "", gender: "", duration: "", directorId: 0 })
    setEditingMovie(null)
  }

  const openEditDialog = (movie: Movie) => {
    const releaseDate = new Date(movie.releaseYear)
    const formattedDate = releaseDate.toISOString().split("T")[0] // => YYYY-MM-DD
  
    setEditingMovie(movie)
    setFormData({
      name: movie.name,
      releaseYear: formattedDate,
      gender: movie.gender,
      duration: movie.duration,
      directorId: movie.directorId,
    })
    setIsDialogOpen(true)
  }
  

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const formatYear = (dateString: string): string => {
    const date = new Date(dateString)
    return date.getFullYear().toString()
  }

  const formatDuration = (duration: string): string => {
    const [hours, minutes, seconds] = duration.split(":")
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Film className="w-5 h-5" />
            Gestión de Películas
          </CardTitle>
          <CardDescription className="text-slate-300">
            Administra las películas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar películas..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Película
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingMovie ? "Editar Película" : "Agregar Nueva Película"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    {editingMovie ? "Actualizar información de la película" : "Crear una nueva entrada de película"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Título de la Película
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="releaseYear" className="text-white">
                      Fecha de Estreno
                    </Label>
                    <Input
                      id="releaseYear"
                      type="date"
                      value={formData.releaseYear}
                      onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white">
                      Género
                    </Label>
                    <Input
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder="ej. Acción, Drama, Comedia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-white">
                      Duración (HH:MM:SS)
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                      placeholder="02:30:00"
                    />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="directorId" className="text-white">
                      Director
                    </Label>
                    <Select
                      value={formData.directorId.toString()}
                      onValueChange={(value) => setFormData({ ...formData, directorId: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Seleccionar un director" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {directors.map((director) => (
                          <SelectItem key={director.directorId} value={director.directorId.toString()}>
                            {director.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    {loading ? "Guardando..." : editingMovie ? "Actualizar Película" : "Crear Película"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-white">Cargando películas...</div>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <Film className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300">No se encontraron películas</p>
              {searchTerm && <p className="text-slate-400 text-sm mt-2">Intenta ajustar tus términos de búsqueda</p>}
            </div>
          ) : (
            <div className="grid gap-4">
              {movies.map((movie) => (
                <Card key={movie.moviesId} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white">{movie.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatYear(movie.releaseYear)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Film className="w-4 h-4" />
                            {movie.gender || "Género Desconocido"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(movie.duration)}
                          </div>
                          {movie.director && (
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {movie.director.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(movie)}
                          className="border-white/20 text-green-400 hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(movie.moviesId)}
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-sm text-slate-300">
                Mostrando {Math.min((currentPage - 1) * pageSize + 1, totalItems)} a{" "}
                {Math.min(currentPage * pageSize, totalItems)} de {totalItems} películas
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="border-white/20 hover:bg-white/10"
                >
                  Primero
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-white/20 hover:bg-white/10"
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 py-1 bg-emerald-600 text-white rounded text-sm font-medium">
                  {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-white/20 hover:bg-white/10"
                >
                  Siguiente
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="border-white/20 hover:bg-white/10"
                >
                  Último
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
