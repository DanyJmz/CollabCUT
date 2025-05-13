
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Decision } from "@/lib/types";
import { CalendarClock, PlusCircle, UserCircle, Tag, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const mockDecisionsData: (Decision & { projectName: string, projectAvatarSeed: string, tags?: string[] })[] = [
  { id: "dec1", projectId: "project-ecom", projectName: "Plataforma E-commerce", projectAvatarSeed: "project-ecom", title: "Adoptar Next.js para Reconstrucción Frontend", description: "Tras evaluar varios frameworks, el equipo decidió usar Next.js por sus beneficios de rendimiento, capacidades SSR/SSG y robusto ecosistema. Esto mejorará significativamente los tiempos de carga de página y el SEO.", madeBy: "Consejo de Líderes Técnicos", date: new Date(Date.now() - 86400000 * 30).toISOString(), outcomes: ["SEO Mejorado", "Tiempos de carga más rápidos", "DX Mejorada"], tags: ["Tecnología", "Frontend", "Crítico"] },
  { id: "dec2", projectId: "project-ecom", projectName: "Plataforma E-commerce", projectAvatarSeed: "project-ecom", title: "Priorizar Enfoque de Diseño Mobile-First", description: "Dado que más del 60% de nuestro tráfico proviene de dispositivos móviles, todos los diseños UI/UX seguirán una metodología mobile-first. Las vistas de escritorio se adaptarán de los diseños móviles.", madeBy: "Departamento UX", date: new Date(Date.now() - 86400000 * 25).toISOString(), outcomes: ["Mejor UX móvil", "Aumento conversión móvil"], tags: ["UX", "Diseño", "Estrategia"] },
  { id: "dec3", projectId: "project-mobile", projectName: "App Móvil Q3", projectAvatarSeed: "project-mobile", title: "Integrar Stripe para Pagos", description: "Se eligió Stripe como pasarela de pago por su facilidad de integración, conjunto completo de funciones y APIs amigables para desarrolladores. Esto reemplazará el sistema de pago interno heredado.", madeBy: "Equipo de Producto", date: new Date(Date.now() - 86400000 * 15).toISOString(), outcomes: ["Procesamiento de pagos simplificado", "Cumplimiento PCI"], tags: ["Integración", "Pagos", "Funcionalidad"] },
  { id: "dec4", projectId: "project-marketing", projectName: "Web de Marketing", projectAvatarSeed: "project-marketing", title: "Cambiar a CMS Headless", description: "Para mejorar la flexibilidad del contenido y el rendimiento del sitio, la web de marketing migrará a un CMS headless (Contentful). Esto permite actualizaciones de contenido más fáciles y distribución omnicanal.", madeBy: "Marketing y Dev Ops", date: new Date(Date.now() - 86400000 * 10).toISOString(), outcomes: ["Actualizaciones de contenido más rápidas", "Velocidad del sitio mejorada"], tags: ["CMS", "Infraestructura", "Marketing"] },
];

const decisionSchema = z.object({
  title: z.string().min(3, { message: "El título debe tener al menos 3 caracteres." }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
  madeBy: z.string().min(2, { message: "El campo 'Tomada por' debe tener al menos 2 caracteres." }),
  projectId: z.string().min(1, { message: "Debes seleccionar un proyecto." }),
  tags: z.string().optional(),
  outcomes: z.string().optional(),
});

type DecisionFormValues = z.infer<typeof decisionSchema>;

interface ProjectOption {
    id: string;
    name: string;
    avatarSeed: string;
}

export default function DecisionsTimelinePage() {
  const [decisions, setDecisions] = useState<(Decision & { projectName: string, projectAvatarSeed: string, tags?: string[] })[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [availableProjects, setAvailableProjects] = useState<ProjectOption[]>([]);
  const { toast } = useToast();

  const form = useForm<DecisionFormValues>({
    resolver: zodResolver(decisionSchema),
    defaultValues: {
      title: "",
      description: "",
      madeBy: "",
      projectId: "",
      tags: "",
      outcomes: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
    const sortedDecisions = [...mockDecisionsData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setDecisions(sortedDecisions);
    
    const uniqueProjects = Array.from(new Set(mockDecisionsData.map(d => JSON.stringify({ id: d.projectId, name: d.projectName, avatarSeed: d.projectAvatarSeed }))))
      .map(s => JSON.parse(s) as ProjectOption);
    setAvailableProjects(uniqueProjects);
  }, []);

  function handleRegisterDecision(values: DecisionFormValues) {
    const selectedProject = availableProjects.find(p => p.id === values.projectId);
    if (!selectedProject) {
        toast({
            title: "Error",
            description: "Proyecto seleccionado no válido.",
            variant: "destructive",
        });
        return;
    }

    const newDecision: Decision & { projectName: string, projectAvatarSeed: string, tags?: string[] } = {
      id: `dec${Date.now()}`,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      projectAvatarSeed: selectedProject.avatarSeed,
      title: values.title,
      description: values.description,
      madeBy: values.madeBy,
      date: new Date().toISOString(),
      outcomes: values.outcomes ? values.outcomes.split(',').map(s => s.trim()).filter(s => s) : [],
      tags: values.tags ? values.tags.split(',').map(s => s.trim()).filter(s => s) : [],
    };

    setDecisions(prev => [newDecision, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    form.reset();
    setIsDialogOpen(false);
    toast({
        title: "Decisión Registrada",
        description: `La decisión "${newDecision.title}" ha sido añadida a la línea de tiempo.`,
    });
  }

  if (!isMounted) {
    return <AppLayout><div className="text-center p-10">Cargando línea de tiempo de decisiones...</div></AppLayout>;
  }
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Línea de Tiempo de Decisiones</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-md hover:shadow-primary/40">
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Nueva Decisión
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl">Registrar Nueva Decisión</DialogTitle>
                <DialogDescription>
                  Completa los detalles a continuación para añadir una nueva decisión a la línea de tiempo.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleRegisterDecision)} className="space-y-4 py-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título de la Decisión</FormLabel>
                        <FormControl>
                          <Input placeholder="ej., Adoptar nueva tecnología..." {...field} />
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
                        <FormLabel>Descripción / Razón</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Detalles sobre la decisión y su justificación..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proyecto Asociado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un proyecto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableProjects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>
                                <div className="flex items-center gap-2">
                                <Image src={`https://picsum.photos/seed/${project.avatarSeed}/16/16`} alt={project.name} width={16} height={16} className="rounded-sm" data-ai-hint="icono proyecto"/>
                                {project.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="madeBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tomada por</FormLabel>
                        <FormControl>
                          <Input placeholder="ej., Equipo de Liderazgo, Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="outcomes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resultados Clave (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ej., Mejora de rendimiento, Reducción de costos" {...field} />
                        </FormControl>
                        <FormDescription>Separados por comas.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etiquetas (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ej., Tecnología, Estrategia, Frontend" {...field} />
                        </FormControl>
                        <FormDescription>Separadas por comas.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); form.reset(); }}>Cancelar</Button>
                    <Button type="submit" className="shadow-sm">Registrar Decisión</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {decisions.length === 0 ? (
          <Card className="text-center p-10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Aún no hay Decisiones Registradas</CardTitle>
              <CardDescription>Usa el botón "Registrar Nueva Decisión" para comenzar a construir el historial de tu proyecto.</CardDescription>
            </CardHeader>
            <CardContent>
              <Image src="https://picsum.photos/seed/no-decisions/400/300" alt="No hay decisiones" width={400} height={300} className="mx-auto rounded-md opacity-70" data-ai-hint="cronograma vacio"/>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 relative">
            <div className="absolute left-5 md:left-7 top-0 bottom-0 w-0.5 bg-border -z-10"></div>

            {decisions.map((decision, index) => (
              <div key={decision.id} className="relative pl-12 md:pl-16">
                <div className="absolute left-[13px] md:left-[21px] top-1.5 w-6 h-6 bg-card border-4 border-primary rounded-full shadow-sm"></div>
                
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                   <Accordion type="single" collapsible>
                    <AccordionItem value={`item-${decision.id}`} className="border-b-0">
                        <AccordionTrigger className="p-4 md:p-6 hover:no-underline group">
                             <div className="flex flex-col md:flex-row md:items-center justify-between w-full text-left">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Image src={`https://picsum.photos/seed/${decision.projectAvatarSeed}/20/20`} alt={decision.projectName} width={20} height={20} className="rounded-sm" data-ai-hint="icono proyecto"/>
                                        <span className="text-xs font-medium text-primary">{decision.projectName}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{decision.title}</h3>
                                </div>
                                <div className="text-xs text-muted-foreground mt-2 md:mt-0 md:text-right">
                                    <div className="flex items-center gap-1 md:justify-end"><CalendarClock size={14}/> {new Date(decision.date).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-1 md:justify-end"><UserCircle size={14}/> Por: {decision.madeBy}</div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                            <p className="text-sm text-muted-foreground mb-3">{decision.description}</p>
                            {decision.outcomes && decision.outcomes.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="text-xs font-semibold text-foreground mb-1">Resultados Clave:</h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-0.5">
                                        {decision.outcomes.map((outcome, i) => <li key={i}>{outcome}</li>)}
                                    </ul>
                                </div>
                            )}
                             {decision.tags && decision.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {decision.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                    ))}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                   </Accordion>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
