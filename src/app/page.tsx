

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ImageSlideshow from '@/components/ui/image-slideshow'; // Import the new component

export default function HomePage() {
  const gradientCut = "bg-[linear-gradient(to_right,theme(colors.green.500)_0%,theme(colors.blue.500)_33%,theme(colors.green.500)_66%,theme(colors.blue.500)_100%)] bg-clip-text text-transparent";

  // Ensure these paths correctly reference images within the `public/assets/img` directory.
  // Next.js serves the `public` directory at the root, so paths start with `/`.
  const slideshowImages = [
    { src: "/assets/img/dashboard.png", alt: "Vista del Dashboard", hint: "dashboard interface" },
    { src: "/assets/img/projects.png", alt: "Vista de Lista de Proyectos", hint: "project list" },
    { src: "/assets/img/tasks.png", alt: "Vista del Tablero de Tareas", hint: "task board" },
    { src: "/assets/img/chat.png", alt: "Vista de la Interfaz de Chat", hint: "chat communication" },
    { src: "/assets/img/documents.png", alt: "Vista de Documentos", hint: "document management" },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <span className="text-2xl font-bold">
            <span className="text-foreground">Collab</span>
            <span className={gradientCut}>CUT</span>
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            prefetch={false}
          >
            Iniciar Sesión
          </Link>
          <Link href="/register" passHref legacyBehavior>
            <Button variant="default" size="sm">
              Regístrate
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 flex justify-center">
          <div className="container px-4 md:px-6 max-w-7xl"> {/* Container to center content */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center"> {/* Use lg:grid-cols-2 and items-center */}
              {/* Left Column: Text Content */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-3">
                  {/* Updated h1 styling: removed gradient classes, added text-primary */}
                  <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl xl:text-7xl/none">
                    Impulsa tu equipo, transforma tus proyectos.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl lg:text-lg xl:text-xl">
                    Collab<span className={gradientCut}>CUT</span> es la plataforma integral que conecta personas, tareas e ideas. Gestiona proyectos con agilidad, comunica en tiempo real y toma decisiones con claridad. Eleva la colaboración, acelera los resultados.Impulsa tu equipo, transforma tus proyectos.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/register" passHref legacyBehavior>
                    <Button size="lg" className="shadow-lg hover:shadow-primary/50 transition-shadow">
                      Comienza Gratis
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#features" passHref legacyBehavior>
                     <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-shadow">
                      Saber Más
                    </Button>
                  </Link>
                </div>
              </div>
              {/* Right Column: Slideshow */}
              {/* Adjusted container for slideshow */}
              <div className="w-full h-[350px] md:h-[450px] lg:h-[500px] overflow-hidden relative"> {/* Allow slideshow to take full column width, adjusted height */}
                 <ImageSlideshow images={slideshowImages} interval={3000} />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 flex justify-center"> {/* Added flex justify-center */}
          <div className="container px-4 md:px-6"> {/* Centered container */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm font-medium text-accent-foreground">Características Clave</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">
                Todo sobre CollabCUT
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Desde la configuración inicial hasta la entrega final, Collab<span className={gradientCut}>CUT</span> proporciona las herramientas para mantener tus proyectos en curso y a tu equipo alineado.
              </p>
            </div>
            {/* mx-auto centers this grid within the container. Changed items-start to items-stretch */}
            <div className="mx-auto grid max-w-5xl items-stretch gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              {[
                { title: "Configuración de Proyecto", description: "Define proyectos, selecciona metodologías y personaliza paneles.", icon: "🚀" },
                { title: "Gestión de Tareas", description: "Asigna tareas, sigue el progreso y cumple plazos.", icon: "✅" },
                { title: "Centro de Documentos", description: "Centraliza todos los archivos y recursos del proyecto de forma segura.", icon: "📄" },
                { title: "Chat de Equipo", description: "Comunícate en tiempo real con canales públicos y privados.", icon: "💬" },
                { title: "Línea de Tiempo de Decisiones", description: "Registra decisiones clave para claridad y responsabilidad.", icon: "🗺️" },
                { title: "Acceso Basado en Roles", description: "Perfiles de usuario seguros para clientes, inversores y miembros del equipo.", icon: "🔒" },
              ].map(feature => (
                <div key={feature.title} className="grid gap-2 p-6 rounded-lg shadow-lg bg-card hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Collab<span className={gradientCut}>CUT</span>. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
            Términos de Servicio
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  );
}
