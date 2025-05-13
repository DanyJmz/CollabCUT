
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Task } from "@/lib/types";
import { Calendar, CheckCircle, Circle, Filter, ListChecks, MoreHorizontal, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label"; 
import { Separator } from "@/components/ui/separator";

const mockUserTasks: (Task & { projectName: string, projectAvatarSeed: string })[] = [
  { id: "t2", projectId: "1", projectName: "Renovación Plataforma E-commerce", projectAvatarSeed: "project-ecom", title: "Diseño de Wireframes para Checkout", assigneeIds: ["currentUser", "user3"], dueDate: "2024-06-30", status: "inprogress", createdAt: "2024-05-10Z", updatedAt: "2024-05-20Z" },
  { id: "t4", projectId: "1", projectName: "Renovación Plataforma E-commerce", projectAvatarSeed: "project-ecom", title: "Desarrollo Frontend - Página de Inicio", assigneeIds: ["currentUser", "user3"], dueDate: "2024-08-01", status: "todo", createdAt: "2024-06-01Z", updatedAt: "2024-06-01Z"},
  { id: "t5", projectId: "2", projectName: "Funcionalidades App Móvil Q3", projectAvatarSeed: "project-mobile", title: "Implementar Notificaciones Push", assigneeIds: ["currentUser"], dueDate: "2024-07-10", status: "todo", createdAt: "2024-06-05Z", updatedAt: "2024-06-05Z"},
  { id: "t6", projectId: "3", projectName: "Actualización Web de Marketing", projectAvatarSeed: "project-marketing", title: "Redactar Contenido Nuevo Blog", assigneeIds: ["currentUser"], status: "done", createdAt: "2024-05-15Z", updatedAt: "2024-05-28Z"},
];

const getStatusIcon = (status: Task['status']) => {
    switch(status) {
        case 'done': return <CheckCircle className="h-5 w-5 text-accent" />;
        case 'inprogress': return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
        case 'todo': return <Circle className="h-5 w-5 text-muted-foreground" />;
        default: return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
};

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<(Task & { projectName: string, projectAvatarSeed: string })[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTasks(mockUserTasks);
  }, []);

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
          : task
      )
    );
  };
  
  if (!isMounted) {
    return <AppLayout><div className="text-center p-10">Cargando tareas...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ListChecks className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Tareas</h1>
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtrar Tareas
          </Button>
        </div>

        {tasks.length === 0 ? (
          <Card className="text-center p-10 shadow-sm">
             <CardHeader>
              <CardTitle className="text-2xl">¡Todo Limpio!</CardTitle>
              <CardDescription>No tienes tareas pendientes. ¡Buen trabajo!</CardDescription>
            </CardHeader>
            <CardContent>
              <Image src="https://picsum.photos/seed/no-tasks/400/300" alt="No hay tareas" width={400} height={300} className="mx-auto rounded-md opacity-70" data-ai-hint="tareas vacias"/>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={task.status === 'done'} 
                      onCheckedChange={() => toggleTaskStatus(task.id)}
                      aria-label={`Marcar tarea ${task.title} como ${task.status === 'done' ? 'no hecha' : 'hecha'}`}
                      className="h-6 w-6 rounded data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`task-${task.id}`} className={`text-base font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </Label>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Link href={`/projects/${task.projectId}`} className="hover:underline flex items-center gap-1">
                          <Image src={`https://picsum.photos/seed/${task.projectAvatarSeed}/16/16`} alt={task.projectName} width={16} height={16} className="rounded-sm" data-ai-hint="icono proyecto"/>
                          {task.projectName}
                        </Link>
                        {task.dueDate && (
                          <>
                            <Separator orientation="vertical" className="h-3"/>
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(task.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Opciones de tarea</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                        <DropdownMenuItem>Editar Tarea</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Eliminar Tarea</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
