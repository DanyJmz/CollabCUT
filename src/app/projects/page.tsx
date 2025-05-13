
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_METHODOLOGIES } from "@/lib/constants";
import type { Project, ProjectMethodology } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Edit3, Trash2, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const projectSchema = z.object({
  name: z.string().min(3, "El nombre del proyecto debe tener al menos 3 caracteres."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres."),
  methodology: z.enum(PROJECT_METHODOLOGIES.map(pm => pm.id) as [ProjectMethodology, ...ProjectMethodology[]]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const initialProjects: Project[] = [
  { id: "1", name: "Plataforma E-commerce", description: "Construir una nueva experiencia de compra online.", methodology: "agile", ownerId: "user1", teamMemberIds: ["user1", "user2"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "2", name: "Desarrollo App Móvil", description: "Desarrollar una aplicación móvil multiplataforma.", methodology: "scrum", ownerId: "user1", teamMemberIds: ["user1", "user3"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "3", name: "Campaña de Marketing", description: "Lanzar una nueva campaña de marketing para el Q3.", methodology: "kanban", ownerId: "user2", teamMemberIds: ["user2", "user4"], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setProjects(initialProjects);
  }, []);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      methodology: "agile",
    },
  });

  function handleCreateProject(values: ProjectFormValues) {
    console.log("Datos del nuevo proyecto:", values);
    const newProject: Project = {
      id: String(projects.length + 1 + Date.now()),
      ...values,
      ownerId: "currentUser", 
      teamMemberIds: ["currentUser"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [newProject, ...prev]);
    form.reset();
    setIsDialogOpen(false);
  }

  if (!isMounted) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Cargando Proyectos...</h1>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Proyectos</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-md hover:shadow-primary/40">
                <PlusCircle className="mr-2 h-5 w-5" /> Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl">Crear Nuevo Proyecto</DialogTitle>
                <DialogDescription>
                  Completa los detalles a continuación para configurar tu nuevo proyecto.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateProject)} className="space-y-6 py-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Proyecto</FormLabel>
                        <FormControl>
                          <Input placeholder="ej., Lanzamiento Producto Q4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe brevemente los objetivos y el alcance del proyecto." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="methodology"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metodología</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una metodología" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROJECT_METHODOLOGIES.map((method) => (
                              <SelectItem key={method.id} value={method.id}>
                                {method.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" className="shadow-sm">Crear Proyecto</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center p-10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">¡Aún no hay Proyectos!</CardTitle>
              <CardDescription>Haz clic en "Nuevo Proyecto" para comenzar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Image src="https://picsum.photos/seed/no-projects/400/300" alt="No hay proyectos" width={400} height={300} className="mx-auto rounded-md opacity-70" data-ai-hint="estado vacio"/>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold leading-tight text-primary">{project.name}</CardTitle>
                     <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-medium capitalize">
                        {project.methodology}
                      </span>
                  </div>
                  <CardDescription className="text-sm h-16 overflow-hidden text-ellipsis line-clamp-3 pt-1">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                   <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" /> {project.teamMemberIds.length} Miembros del Equipo
                   </div>
                   <div className="flex items-center text-sm text-muted-foreground">
                      <BarChart3 className="mr-2 h-4 w-4" /> {Math.floor(Math.random() * 20) + 5} Tareas Activas
                   </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <Link href={`/projects/${project.id}`} passHref legacyBehavior>
                    <Button variant="default" size="sm" className="shadow-sm">Ver Panel</Button>
                  </Link>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Edit3 className="h-4 w-4" />
                       <span className="sr-only">Editar</span>
                    </Button>
                     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
