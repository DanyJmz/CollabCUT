
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Project, Task, Document, ChatMessage, Decision } from "@/lib/types";
import { ArrowLeft, CalendarDays, CheckCircle2, ChevronRight, Edit, FileText, MessageCircle, Paperclip, PlusCircle, Send, Users, Trash2, Clock, Circle, UserCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";


const mockProject: Project = {
  id: "1",
  name: "Renovación Plataforma E-commerce",
  description: "Una revisión completa de la plataforma de e-commerce existente para mejorar la experiencia del usuario, el rendimiento y la escalabilidad. Este proyecto implica rediseñar la UI/UX, migrar a una nueva arquitectura backend e integrar analíticas avanzadas.",
  methodology: "agile",
  ownerId: "user1",
  teamMemberIds: ["user1", "user2", "user3", "user4"],
  createdAt: "2023-01-15T09:00:00Z",
  updatedAt: "2024-05-20T14:30:00Z",
};

const initialMockTasks: Task[] = [
  { id: "t1", projectId: "1", title: "Investigación de Usuarios y Definición de Personas", assigneeIds: ["user2"], dueDate: "2024-06-15", status: "done", createdAt: "2024-05-01Z", updatedAt: "2024-05-10Z" },
  { id: "t2", projectId: "1", title: "Diseño de Wireframes", assigneeIds: ["user3"], dueDate: "2024-06-30", status: "inprogress", createdAt: "2024-05-10Z", updatedAt: "2024-05-20Z" },
  { id: "t3", projectId: "1", title: "Desarrollar API Backend", assigneeIds: ["user4"], dueDate: "2024-07-15", status: "todo", createdAt: "2024-05-20Z", updatedAt: "2024-05-20Z" },
  { id: "t4", projectId: "1", title: "Desarrollo Frontend - Página de Inicio", assigneeIds: ["user2", "user3"], dueDate: "2024-08-01", status: "todo", createdAt: "2024-06-01Z", updatedAt: "2024-06-01Z"},
];

const mockDocuments: Document[] = [
  { id: "d1", projectId: "1", name: "Resumen del Proyecto v1.2.pdf", type: "pdf", url: "#", uploadedBy: "user1", uploadedAt: "2024-05-02Z", size: 2400000 },
  { id: "d2", projectId: "1", name: "Estudio de Personas de Usuario.docx", type: "docx", url: "#", uploadedBy: "user2", uploadedAt: "2024-05-15Z", size: 120000 },
  { id: "d3", projectId: "1", name: "endpoints_API.json", type: "json", url: "#", uploadedBy: "user4", uploadedAt: "2024-05-25Z", size: 50000 },
];

const mockMessages: ChatMessage[] = [
  { id: "m1", channelId: "1", senderId: "user2", content: "Hola equipo, ¿cómo va el progreso de los wireframes?", timestamp: "2024-05-28T10:00:00Z" },
  { id: "m2", channelId: "1", senderId: "user3", content: "¡Va bien! Debería tener un borrador para el final del día.", timestamp: "2024-05-28T10:05:00Z" },
  { id: "m3", channelId: "1", senderId: "user1", content: "Genial, sincronicemos mañana por la mañana para revisar.", timestamp: "2024-05-28T10:15:00Z" },
];

const mockDecisions: Decision[] = [
  { id: "dec1", projectId: "1", title: "Adoptar Next.js para Frontend", description: "Se decidió usar Next.js para sus capacidades de SSR y experiencia de desarrollo.", madeBy: "Líder Técnico", date: "2024-05-05Z" },
  { id: "dec2", projectId: "1", title: "Priorizar Diseño Mobile-First", description: "Todos los diseños UI seguirán un enfoque mobile-first.", madeBy: "Líder UX", date: "2024-05-12Z" },
];

const teamMembers = [
    { id: "user1", name: "Alicia", role: "Gestora de Proyecto", avatarSeed: "alicia" },
    { id: "user2", name: "Roberto", role: "Desarrollador Principal", avatarSeed: "roberto" },
    { id: "user3", name: "Carol", role: "Diseñadora UX", avatarSeed: "carol" },
    { id: "user4", name: "David", role: "Ingeniero Backend", avatarSeed: "david" },
];

const taskStatusTranslations: Record<Task['status'], string> = {
    todo: "Pendiente",
    inprogress: "En Progreso",
    done: "Hecho",
    archived: "Archivado"
};

const taskStatusIcons: Record<Task['status'], React.ElementType> = {
    todo: Circle,
    inprogress: Clock,
    done: CheckCircle2,
    archived: Circle, 
};

const TaskStatusIcon = ({ status }: { status: Task['status'] }) => {
    const IconComponent = taskStatusIcons[status];
    const colorClass = status === 'done' ? 'text-accent' : status === 'inprogress' ? 'text-blue-500 animate-pulse' : 'text-muted-foreground';
    return <IconComponent className={`h-4 w-4 ${colorClass}`} />;
};

const taskSchema = z.object({
  title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres." }),
  description: z.string().optional(),
  assigneeIds: z.array(z.string()).min(1, { message: "Debes seleccionar al menos un asignado." }),
  dueDate: z.date().optional(),
});
type TaskFormValues = z.infer<typeof taskSchema>;


export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [currentTasks, setCurrentTasks] = useState<Task[]>(initialMockTasks);
  const { toast } = useToast();

  const taskForm = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      assigneeIds: [],
      dueDate: undefined,
    },
  });

  useEffect(() => {
    setIsMounted(true);
    // In a real app, you would fetch project data and tasks based on projectId
    // For now, using mock data. If projectId exists, find the project, else use default mockProject.
    // This logic can be enhanced if multiple mock projects are needed for testing.
    setProject(mockProject); 
  }, [projectId]);
  
  const getProgress = () => {
    if (!currentTasks || currentTasks.length === 0) return 0;
    const doneTasks = currentTasks.filter(task => task.status === 'done').length;
    return Math.round((doneTasks / currentTasks.length) * 100);
  };

  const handleCreateTask = (values: TaskFormValues) => {
    if (!project) return;

    const newTask: Task = {
      id: `t${Date.now()}`,
      projectId: project.id,
      title: values.title,
      description: values.description,
      assigneeIds: values.assigneeIds,
      dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentTasks(prev => [newTask, ...prev]);
    taskForm.reset();
    setIsTaskDialogOpen(false);
    toast({
      title: "Tarea Creada",
      description: `La tarea "${newTask.title}" ha sido añadida al proyecto.`,
    });
  };


  if (!isMounted || !project) {
    return (
        <AppLayout>
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-muted-foreground">Cargando detalles del proyecto...</p>
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <Link href="/projects" className="flex items-center text-sm text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Proyectos
        </Link>

        <Card className="shadow-xl overflow-hidden">
            <div className="relative h-48 md:h-64 w-full">
                <div
                  className="absolute inset-0 bg-primary"
                  aria-label={`Banner de ${project.name}`}
                  data-ai-hint="banner proyecto color"
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <Badge variant="default" className="capitalize mb-2 bg-opacity-80 backdrop-blur-sm">{project.methodology}</Badge>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white shadow-strong">{project.name}</h1>
                </div>
            </div>
            <CardContent className="p-6 md:p-8">
                <p className="text-muted-foreground mb-6">{project.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                    <div>
                        <Label className="text-xs font-semibold text-muted-foreground">Creado</Label>
                        <p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-muted-foreground">Última Actualización</Label>
                        <p className="font-medium">{new Date(project.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-muted-foreground">Tamaño del Equipo</Label>
                        <p className="font-medium">{project.teamMemberIds.length} miembros</p>
                    </div>
                    <div>
                        <Label className="text-xs font-semibold text-muted-foreground">Progreso</Label>
                        <div className="flex items-center gap-2">
                             <Progress value={getProgress()} className="w-full h-2.5" />
                             <span className="font-medium">{getProgress()}%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6 shadow-sm">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="decisions">Decisiones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader><CardTitle>Resumen del Proyecto</CardTitle></CardHeader>
              <CardContent>
                <p>Resumen del estado del proyecto, hitos clave y miembros del equipo.</p>
                 <div className="mt-4">
                    <h3 className="font-semibold mb-2">Miembros del Equipo:</h3>
                    <div className="flex flex-wrap gap-4">
                        {teamMembers.filter(tm => project.teamMemberIds.includes(tm.id)).map(member => (
                            <div key={member.id} className="flex items-center gap-2 p-2 border rounded-lg bg-secondary/50" title={`${member.name} (${member.role})`}>
                                <Avatar className="h-8 w-8">
                                  <UserCircle2 className="h-full w-full text-muted-foreground" />
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
             <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestión de Tareas</CardTitle>
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/>Añadir Tarea</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Añadir Nueva Tarea</DialogTitle>
                      <DialogDescription>Completa los detalles para crear una nueva tarea.</DialogDescription>
                    </DialogHeader>
                    <Form {...taskForm}>
                      <form onSubmit={taskForm.handleSubmit(handleCreateTask)} className="space-y-4 py-4">
                        <FormField
                          control={taskForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título de la Tarea</FormLabel>
                              <FormControl>
                                <Input placeholder="ej., Diseñar la página de inicio" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={taskForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descripción (Opcional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Describe la tarea en detalle..." {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={taskForm.control}
                          name="assigneeIds"
                          render={() => (
                            <FormItem>
                              <FormLabel>Asignar a</FormLabel>
                              <ScrollArea className="h-32 border rounded-md p-2">
                                {teamMembers
                                  .filter(tm => project?.teamMemberIds.includes(tm.id))
                                  .map((member) => (
                                  <FormField
                                    key={member.id}
                                    control={taskForm.control}
                                    name="assigneeIds"
                                    render={({ field }) => {
                                      return (
                                        <FormItem key={member.id} className="flex flex-row items-center space-x-3 space-y-0 py-1">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(member.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), member.id])
                                                  : field.onChange(
                                                      (field.value || []).filter(
                                                        (value) => value !== member.id
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal flex items-center gap-2">
                                            <Avatar className="h-5 w-5">
                                                <UserCircle2 className="h-full w-full text-muted-foreground" />
                                            </Avatar>
                                            {member.name}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </ScrollArea>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                            control={taskForm.control}
                            name="dueDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Fecha de Entrega (Opcional)</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP", { locale: es })
                                        ) : (
                                          <span>Elige una fecha</span>
                                        )}
                                        <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) }
                                      initialFocus
                                      locale={es}
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => {setIsTaskDialogOpen(false); taskForm.reset();}}>Cancelar</Button>
                          <Button type="submit">Añadir Tarea</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Asignado</TableHead>
                      <TableHead>Fecha de Entrega</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTasks.map(task => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>
                            <div className="flex -space-x-2">
                            {task.assigneeIds.map(assigneeId => {
                                const member = teamMembers.find(m => m.id === assigneeId);
                                return member ? (
                                    <Avatar key={assigneeId} className="h-6 w-6 border-2 border-card" title={member.name}>
                                        <UserCircle2 className="h-full w-full text-muted-foreground" />
                                    </Avatar>
                                ) : null;
                            })}
                            </div>
                        </TableCell>
                        <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                            <Badge 
                                variant={task.status === 'done' ? 'default' : task.status === 'inprogress' ? 'secondary' : 'outline'} 
                                className={cn(task.status === 'done' ? 'bg-accent text-accent-foreground' : '', 'flex items-center gap-1.5')}
                            >
                                <TaskStatusIcon status={task.status} />
                                {taskStatusTranslations[task.status]}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestión de Documentos</CardTitle>
                <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/>Subir Archivo</Button>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockDocuments.map(doc => (
                        <div key={doc.id} className="border p-4 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <FileText className="h-8 w-8 text-primary"/>
                                <div>
                                    <p className="font-medium text-sm">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">{(doc.size/1024/1024).toFixed(2)} MB - Subido por {teamMembers.find(tm => tm.id === doc.uploadedBy)?.name || doc.uploadedBy}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4"/></Button>
                        </div>
                    ))}
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="shadow-lg h-[600px] flex flex-col">
              <CardHeader><CardTitle>Comunicación del Equipo</CardTitle></CardHeader>
              <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
                {mockMessages.map(msg => {
                  const sender = teamMembers.find(tm => tm.id === msg.senderId);
                  const isCurrentUser = msg.senderId === "user1"; 
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : ''}`}>
                      {!isCurrentUser && sender && (
                        <Avatar className="h-8 w-8">
                          <UserCircle2 className="h-full w-full text-muted-foreground" />
                        </Avatar>
                      )}
                      <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {!isCurrentUser && sender && <p className="text-xs font-semibold mb-0.5">{sender.name}</p>}
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} text-right`}>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      {isCurrentUser && sender && (
                        <Avatar className="h-8 w-8">
                          <UserCircle2 className="h-full w-full text-muted-foreground" />
                        </Avatar>
                      )}
                    </div>
                  );
                })}
              </CardContent>
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Input placeholder="Escribe tu mensaje..." className="flex-grow"/>
                  <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5"/></Button>
                  <Button><Send className="h-5 w-5"/></Button>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="decisions" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Línea de Tiempo de Decisiones</CardTitle>
                <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/>Registrar Decisión</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 relative pl-6 before:absolute before:inset-y-0 before:w-px before:bg-border before:left-2.5">
                  {mockDecisions.map(decision => (
                    <div key={decision.id} className="relative">
                        <div className="absolute -left-[29px] top-1.5 w-5 h-5 bg-primary rounded-full border-4 border-card"></div>
                        <p className="text-xs text-muted-foreground mb-1">
                            {new Date(decision.date).toLocaleDateString()} - por {decision.madeBy}
                        </p>
                        <h4 className="font-semibold text-md mb-1 text-primary">{decision.title}</h4>
                        <p className="text-sm text-muted-foreground">{decision.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

    
