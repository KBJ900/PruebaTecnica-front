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
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Edit, Trash2, User, Globe, Calendar, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchDirectors,
  createDirector,
  updateDirector,
  deleteDirector,
  setCurrentPage,
  setSearchTerm,
  clearError,
  type Director,
  type DirectorCreateDto,
} from "@/store/slices/directorSlice"

export default function DirectorCrudRedux() {
  const dispatch = useAppDispatch()
  const { directors, loading, error, totalItems, currentPage, pageSize, searchTerm } = useAppSelector(
    (state) => state.directors,
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDirector, setEditingDirector] = useState<Director | null>(null)
  const [formData, setFormData] = useState<DirectorCreateDto>({
    name: "",
    nationality: "",
    age: 0,
    active: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchDirectors({ page: currentPage, pageSize, search: searchTerm }))
  }, [dispatch, currentPage, pageSize, searchTerm])

  useEffect(() => {
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" })
      dispatch(clearError())
    }
  }, [error, toast, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingDirector) {
        await dispatch(updateDirector({ ...formData, directorId: editingDirector.directorId })).unwrap()
        toast({ title: "Éxito", description: "Director actualizado exitosamente" })
      } else {
        await dispatch(createDirector(formData)).unwrap()
        toast({ title: "Éxito", description: "Director creado exitosamente" })
      }
      setIsDialogOpen(false)
      resetForm()
      dispatch(fetchDirectors({ page: currentPage, pageSize, search: searchTerm }))
    } catch {
      toast({ title: "Error", description: `Error al ${editingDirector ? "actualizar" : "crear"} el director`, variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este director?")) return
    try {
      await dispatch(deleteDirector(id)).unwrap()
      toast({ title: "Éxito", description: "Director eliminado exitosamente" })
      dispatch(fetchDirectors({ page: currentPage, pageSize, search: searchTerm }))
    } catch {
      toast({ title: "Error", description: "Error al eliminar el director", variant: "destructive" })
    }
  }

  const resetForm = () => {
    setFormData({ name: "", nationality: "", age: 0, active: true })
    setEditingDirector(null)
  }

  const openEditDialog = (director: Director) => {
    setEditingDirector(director)
    setFormData({ name: director.name, nationality: director.nationality, age: director.age, active: director.active })
    setIsDialogOpen(true)
  }

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value))
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Gestión de Directores
          </CardTitle>
          <CardDescription className="text-slate-300">
            Administra los directores de las películas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar directores..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Director
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-green-400">
                    {editingDirector ? "Editar Director" : "Agregar Nuevo Director"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    {editingDirector ? "Actualizar información del director" : "Crear un nuevo perfil de director"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Nombre
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
                    <Label htmlFor="nationality" className="text-white">
                      Nacionalidad
                    </Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">
                      Edad
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) || 0 })}
                      className="bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        formData.active ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ${
                          formData.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </Switch>
                    <Label
                      htmlFor="active"
                      className={`ml-2 text-sm font-medium transition-colors ${
                        formData.active ? "text-green-400" : "text-gray-300"
                      }`}
                    >
                      {formData.active ? "Activo" : "Inactivo"}
                    </Label>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    {loading ? "Guardando..." : editingDirector ? "Actualizar Director" : "Crear Director"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-white">Cargando directores...</div>
            </div>
          ) : directors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300">No se encontraron directores</p>
              {searchTerm && <p className="text-slate-400 text-sm mt-2">Intenta ajustar tus términos de búsqueda</p>}
            </div>
          ) : (
            <div className="grid gap-4">
              {directors.map((director) => (
                <Card key={director.directorId} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      {/* ——— encabezado que ya tenías ——— */}
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">{director.name}</h3>
                        <Badge
                          variant={director.active ? "default" : "secondary"}
                          className={director.active ? "bg-emerald-600" : ""}
                        >
                          {director.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
              
                      {/* ——— datos básicos que ya tenías ——— */}
                      <div className="flex items-center gap-4 text-sm text-slate-300">
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {director.nationality || "Desconocida"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {director.age} años
                        </div>
                      </div>
              
                      {/* ——— NUEVO: lista de películas ——— */}
                      {director.movies?.length > 0 ? (
                        <ul className="mt-2 pl-5 list-disc text-slate-400 text-sm">
                          {director.movies.map((m) => (
                            <li key={m.moviesId}>{m.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-slate-500 text-sm italic">Sin películas registradas</p>
                      )}
                    </div>
              
                    {/* botones de editar / eliminar (sin cambios) */}
                    <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(director)}
                          className="border-white/20 text-green-400 hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(director.directorId)}
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
                {Math.min(currentPage * pageSize, totalItems)} de {totalItems} directores
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
                <span className="flex items-center px-3 py-1 bg-emerald-600 rounded text-sm font-medium">
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