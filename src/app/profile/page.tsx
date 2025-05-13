
"use client";

import AppLayout from "@/components/layout/app-layout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROFILE_TYPES } from "@/lib/constants";
import type { User, ProfileType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { UploadCloud, Save, UserCircle2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Dirección de correo electrónico inválida."),
  profileType: z.enum(PROFILE_TYPES.map(pt => pt.id) as [ProfileType, ...ProfileType[]]),
  bio: z.string().max(200, "La biografía no puede exceder los 200 caracteres.").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres.").optional(),
  confirmNewPassword: z.string().optional(),
}).refine(data => {
    if (data.newPassword && !data.confirmNewPassword) return false;
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) return false;
    return true;
  }, {
    message: "Las nuevas contraseñas no coinciden o falta la confirmación.",
    path: ["confirmNewPassword"],
  });


type ProfileFormValues = z.infer<typeof profileSchema>;

const mockUser: User = {
  id: "currentUser",
  name: "Dev", // Changed name
  email: "dev@collabcut.com", // Changed email
  profileType: "developer",
  avatarUrl: `https://picsum.photos/seed/dev-profile/200/200`, // Updated avatar seed
  initials: "DE", // Updated initials
  bio: "", // User starts with no bio
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setUser(mockUser);
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      profileType: "developer",
      bio: "", // Default bio is empty
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        profileType: user.profileType,
        bio: user.bio || "", // Use user's bio or default to empty string
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user, form]);


  function onSubmit(values: ProfileFormValues) {
    console.log("Datos de actualización de perfil:", values);
    if(user) {
        setUser(prev => prev ? {...prev, name: values.name, email: values.email, profileType: values.profileType, bio: values.bio} : null);
    }
    toast({
        title: "Perfil Actualizado",
        description: "Tu información de perfil ha sido guardada exitosamente.",
        variant: "default",
    });
    form.reset({ ...values, currentPassword: "", newPassword: "", confirmNewPassword: ""});
  }

  if (!isMounted || !user) {
    return <AppLayout><div className="text-center p-10">Cargando perfil...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Mi Perfil</h1>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Información Personal</CardTitle>
            <CardDescription>Actualiza tus datos personales y foto de perfil.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary shadow-md">
                <UserCircle2 className="h-full w-full text-primary" />
              </Avatar>
              <Button variant="outline" type="button">
                <UploadCloud className="mr-2 h-4 w-4" /> Cambiar Foto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl><Input {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Dirección de Correo</FormLabel>
                        <FormControl><Input type="email" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
             <FormField
                control={form.control}
                name="profileType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Perfil</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROFILE_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
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
                name="bio"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Biografía</FormLabel>
                    <FormControl><Textarea placeholder="Cuéntanos un poco sobre ti..." className="min-h-[100px]" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Cambiar Contraseña</CardTitle>
            <CardDescription>Actualiza tu contraseña para mayor seguridad. Deja en blanco si no quieres cambiarla.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contraseña Actual</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="shadow-md hover:shadow-primary/40">
              <Save className="mr-2 h-5 w-5" /> Guardar Cambios
            </Button>
          </div>
        </form>
        </Form>
      </div>
    </AppLayout>
  );
}
