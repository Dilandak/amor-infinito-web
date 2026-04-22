import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Onboarding from "@/components/onboarding/Onboarding";
import FloatingHearts from "@/components/layout/FloatingHearts";
import MusicPlayer from "@/components/music/MusicPlayer";
import PhotoGallery from "@/components/gallery/PhotoGallery";
import YearSection from "@/components/year-section/YearSection";
import { herPhotos } from "@/data/photos";
import { couplePhotos } from "@/data/couple-photos";

type Section = "home" | "Cristal" | "nosotros" | "años";

const navItems: { id: Section; label: string }[] = [
  { id: "home", label: "Inicio" },
  { id: "Cristal", label: "Cristal" },
  { id: "nosotros", label: "Nosotros" },
  { id: "años", label: "Años" },
];

const Index = () => {
  const [startMusic, setStartMusic] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [section, setSection] = useState<Section>("home");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [section]);

  return (
    <div className="min-h-screen bg-background relative">
      {showOnboarding && (
        <Onboarding
          onHeartClick={() => {
            setStartMusic(true);
          }}
          onComplete={() => {
            setShowOnboarding(false);
          }}
        />
      )}
      <FloatingHearts />

      <nav className="sticky top-0 z-30 glass-card border-b border-border/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              setShowOnboarding(false);
              setSection("home");
            }}
            className="flex items-center gap-2 text-primary cursor-pointer transition-opacity hover:opacity-80 appearance-none bg-transparent border-none"
          >
            <Heart className="w-5 h-5 fill-primary" />
            <span className="font-heading font-semibold text-foreground text-lg">
              Nuestro Amor
            </span>
          </button>

          <div className="flex gap-1 sm:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-body transition-all duration-300 ${
                  section === item.id
                    ? "bg-primary text-primary-foreground shadow-romantic"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 pb-24">
        {section === "home" && (
          <section className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            <Heart className="w-12 h-12 text-primary fill-primary mb-6 animate-scale-in" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gradient-romantic mb-4">
              Para ti, mi niña
            </h1>

            <p className="text-muted-foreground font-body text-lg max-w-lg mb-8">
              Todo esto lo hice para ti, mi princesa. <br />
              Sé que amas los recuerdos y las fotos… aquí está un pedacito de lo
              nuestro, con canciones para nuestra boda. Te amo ❤️.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => setSection("Cristal")}
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-medium shadow-romantic hover:opacity-90 transition-opacity"
              >
                Ver fotos
              </button>
              <button
                onClick={() => setSection("años")}
                className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-body font-medium hover:bg-secondary/80 transition-colors"
              >
                Nuestra historia
              </button>
            </div>
          </section>
        )}

        {section === "Cristal" && (
          <PhotoGallery
            photos={herPhotos}
            title="Para ti"
            subtitle="Un espacio solo para ti, para recordarte lo Hermosa y increible que eres."
          />
        )}

        {section === "nosotros" && (
          <PhotoGallery
            photos={couplePhotos}
            title="Nosotros"
            subtitle="Todos los momentos que hemos construido juntos."
          />
        )}

        {section === "años" && <YearSection />}
      </main>

     {startMusic && <MusicPlayer startOnSignal={startMusic} />}
    </div>
  );
};

export default Index;
