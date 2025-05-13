
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Document } from "@/lib/types";
import { FileText, UploadCloud, MoreHorizontal, Download, Edit, Trash2, Search, Folder, Grid, List } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const mockDocumentsData: (Document & { projectAvatarSeed: string, projectName: string })[] = [
  { id: "doc1", projectId: "1", projectName: "Plataforma E-commerce", projectAvatarSeed: "project-ecom", name: "Acta de Proyecto v2.pdf", type: "pdf", url: "#", uploadedBy: "Alice", uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(), size: 1200000 },
  { id: "doc2", projectId: "1", projectName: "Plataforma E-commerce", projectAvatarSeed: "project-ecom", name: "Historias de Usuario.xlsx", type: "xlsx", url: "#", uploadedBy: "Bob", uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(), size: 450000 },
  { id: "doc3", projectId: "2", projectName: "App Móvil Q3", projectAvatarSeed: "project-mobile", name: "Documentación API.docx", type: "docx", url: "#", uploadedBy: "Carol", uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(), size: 800000 },
  { id: "doc4", projectId: "2", projectName: "App Móvil Q3", projectAvatarSeed: "project-mobile", name: "Maquetas Diseño_v3.zip", type: "zip", url: "#", uploadedBy: "Alice", uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(), size: 25000000 },
  { id: "doc5", projectId: "3", projectName: "Web de Marketing", projectAvatarSeed: "project-marketing", name: "Análisis Competencia.pptx", type: "pptx", url: "#", uploadedBy: "David", uploadedAt: new Date(Date.now() - 86400000 * 10).toISOString(), size: 5300000 },
];

const fileTypeIcons: { [key: string]: React.ElementType } = {
  pdf: () => <FileText className="text-red-500 h-6 w-6" />,
  xlsx: () => <FileText className="text-green-500 h-6 w-6" />,
  docx: () => <FileText className="text-blue-500 h-6 w-6" />,
  zip: () => <FileText className="text-yellow-500 h-6 w-6" />, 
  pptx: () => <FileText className="text-orange-500 h-6 w-6" />,
  png: () => <FileText className="text-purple-500 h-6 w-6" />,
  jpg: () => <FileText className="text-indigo-500 h-6 w-6" />,
  jpeg: () => <FileText className="text-indigo-500 h-6 w-6" />,
  txt: () => <FileText className="text-gray-500 h-6 w-6" />,
  default: () => <FileText className="text-muted-foreground h-6 w-6" />,
};

const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
};

const FileIcon = ({ type, fileName }: { type?: string, fileName: string }) => {
  const extension = type || getFileExtension(fileName);
  const IconComponent = fileTypeIcons[extension] || fileTypeIcons.default;
  return <IconComponent />;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<(Document & { projectAvatarSeed: string, projectName: string })[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setDocuments(mockDocumentsData);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument: Document & { projectAvatarSeed: string, projectName: string } = {
        id: `doc${Date.now()}`,
        projectId: "temp-project", // Or a default project, or allow selection
        projectName: "Proyecto Asignado", // Placeholder
        projectAvatarSeed: "project-generic", // Placeholder
        name: file.name,
        type: getFileExtension(file.name),
        url: "#", // Placeholder URL, in reality this would be from backend
        uploadedBy: "Usuario Actual", // Placeholder
        uploadedAt: new Date().toISOString(),
        size: file.size,
      };
      setDocuments(prev => [newDocument, ...prev]);
      toast({
        title: "Archivo Subido",
        description: `"${file.name}" ha sido añadido a los documentos.`,
      });

      // Reset file input to allow uploading the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  if (!isMounted) {
    return <AppLayout><div className="text-center p-10">Cargando documentos...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Todos los Documentos</h1>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Buscar documentos..." className="w-64 pl-10" />
                </div>
                <Button variant="outline" onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                    {viewMode === 'list' ? <Grid className="h-4 w-4 mr-2" /> : <List className="h-4 w-4 mr-2" />}
                    {viewMode === 'list' ? 'Vista de Cuadrícula' : 'Vista de Lista'}
                </Button>
                <Button className="shadow-md hover:shadow-primary/40" onClick={() => fileInputRef.current?.click()}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Subir Nuevo
                </Button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg" // Example file types
                />
            </div>
        </div>

        {documents.length === 0 ? (
          <Card className="text-center p-10 shadow-sm">
             <CardHeader>
              <CardTitle className="text-2xl">No se Encontraron Documentos</CardTitle>
              <CardDescription>Sube documentos para comenzar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Image src="https://picsum.photos/seed/no-docs/400/300" alt="No hay documentos" width={400} height={300} className="mx-auto rounded-md opacity-70" data-ai-hint="documentos vacios"/>
            </CardContent>
          </Card>
        ) : (
          viewMode === 'list' ? (
            <Card className="shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Subido Por</TableHead>
                    <TableHead>Fecha de Subida</TableHead>
                    <TableHead>Tamaño</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell><FileIcon fileName={doc.name} type={doc.type} /></TableCell>
                      <TableCell className="font-medium">{doc.name}</TableCell>
                      <TableCell>
                        <Link href={`/projects/${doc.projectId}`} className="hover:underline flex items-center gap-1.5 text-sm">
                            <Image src={`https://picsum.photos/seed/${doc.projectAvatarSeed}/20/20`} alt={doc.projectName} width={20} height={20} className="rounded-sm" data-ai-hint="icono proyecto"/>
                            {doc.projectName}
                        </Link>
                      </TableCell>
                      <TableCell>{doc.uploadedBy}</TableCell>
                      <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{(doc.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Descargar</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Renombrar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {documents.map(doc => (
                    <Card key={doc.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col">
                        <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
                           <FileIcon fileName={doc.name} type={doc.type} />
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Download className="mr-2 h-4 w-4" />Descargar</DropdownMenuItem>
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Renombrar</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-1">
                            <CardTitle className="text-base font-semibold leading-tight line-clamp-2">{doc.name}</CardTitle>
                            <CardDescription className="text-xs">{(doc.size / 1024 / 1024).toFixed(2)} MB</CardDescription>
                             <Link href={`/projects/${doc.projectId}`} className="hover:underline flex items-center gap-1 text-xs text-muted-foreground pt-1">
                                <Image src={`https://picsum.photos/seed/${doc.projectAvatarSeed}/16/16`} alt={doc.projectName} width={16} height={16} className="rounded-sm" data-ai-hint="icono proyecto"/>
                                {doc.projectName}
                            </Link>
                        </CardContent>
                        <CardFooter className="text-xs text-muted-foreground pt-2 border-t">
                            Subido por {doc.uploadedBy} el {new Date(doc.uploadedAt).toLocaleDateString()}
                        </CardFooter>
                    </Card>
                ))}
            </div>
          )
        )}
      </div>
    </AppLayout>
  );
}

