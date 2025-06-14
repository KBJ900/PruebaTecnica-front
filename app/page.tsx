"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Film, Users } from "lucide-react"
import DirectorCrudRedux from "@/components/director-crud-redux"
import MoviesCrudRedux from "@/components/movies-crud-redux"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎬 Prueba Tecnica CRUD de Películas</h1>
          <p className="text-slate-300">Realizado por Kevin Bryan Jonathan Cobian Franco</p>
        </div>

        <Tabs defaultValue="directors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50 border border-slate-700 p-1">
            <TabsTrigger
              value="directors"
              className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors rounded-md px-4 py-2"
            >
              <Users className="w-4 h-4" />
              Gestión de Directores
            </TabsTrigger>
            <TabsTrigger
              value="movies"
              className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors rounded-md px-4 py-2"
            >
              <Film className="w-4 h-4" />
              Gestión de Películas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="directors" className="mt-0">
            <DirectorCrudRedux />
          </TabsContent>

          <TabsContent value="movies" className="mt-0">
            <MoviesCrudRedux />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
