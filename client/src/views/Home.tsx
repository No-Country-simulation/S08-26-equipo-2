import { ComponentShowcase } from "@/components/doc/ComponentShowcase"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Contenido principal con la documentación de componentes */}
      <main className="flex-1 py-8">
        <ComponentShowcase />
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-muted-foreground bg-background">
        <p>MeetFlow © 2026 — S08-26-equipo-2 · Shadcn UI + Tailwind v4 + LiveKit</p>
      </footer>
    </div>
  )
}