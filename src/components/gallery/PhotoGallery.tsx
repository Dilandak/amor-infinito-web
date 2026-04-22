import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Photo } from "@/data/photos";
import { Card, CardContent } from "@/components/ui/card";

interface PhotoGalleryProps {
  photos: Photo[];
  title: string;
  subtitle?: string;
}

const PhotoGallery = ({ photos, title, subtitle }: PhotoGalleryProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      gsap.fromTo(
        ref.current.querySelectorAll(".gallery-card"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    },
    { scope: ref, dependencies: [photos] },
  );

  const isOpen = selectedIndex !== null;
  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
    document.body.style.overflow = "hidden";
    window.dispatchEvent(
      new CustomEvent("photo-modal", { detail: { open: true } }),
    );
  };

  const handleClose = () => {
  setSelectedIndex(null);
  document.body.style.overflow = "";
  window.dispatchEvent(new CustomEvent("photo-modal", { detail: { open: false } }));
};

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => {
      if (prev === null) return 0;
      return prev === 0 ? photos.length - 1 : prev - 1;
    });
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => {
      if (prev === null) return 0;
      return prev === photos.length - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, selectedIndex, photos.length]);

  return (
    <>
      <section ref={ref} className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gradient-romantic mb-3">
            {title}
          </h2>

          {subtitle && (
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <Card
              key={photo.id}
              onClick={() => handleOpen(index)}
              className="gallery-card opacity-0 glass-card overflow-hidden group hover:shadow-romantic transition-all duration-300 hover:-translate-y-1 border-border/30 cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden bg-secondary/40">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="font-heading font-semibold text-foreground leading-snug">
                    {photo.title}
                  </h3>

                  {photo.year && (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                      {photo.year}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3">
                  {photo.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {isOpen && selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-6xl rounded-[28px] overflow-hidden border border-white/10 bg-[#120d10]/95 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              aria-label="Siguiente foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[auto]">
              <div className="relative bg-gradient-to-br from-[#1b1418] via-[#21171c] to-[#140f13] flex items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="w-full h-full flex items-center justify-center rounded-[24px] overflow-hidden bg-white/5">
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    className="w-full h-full max-h-[40vh] md:max-h-[55vh] object-contain"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center p-5 sm:p-6 md:p-8 bg-gradient-to-br from-[#1a1216] to-[#120d10]">
                <div className="mb-4 flex items-center gap-2 flex-wrap">
                  <span className="text-xs uppercase tracking-[0.25em] text-primary/80">
                    Recuerdo
                  </span>

                  {selectedPhoto.year && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/75">
                      {selectedPhoto.year}
                    </span>
                  )}
                </div>

                <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-heading font-semibold leading-tight mb-3">
                  {selectedPhoto.title}
                </h3>

                <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed mb-8">
                  {selectedPhoto.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div className="text-white/50 text-sm">
                    Foto {selectedIndex + 1} de {photos.length}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="px-4 py-2 rounded-full bg-white/8 text-white hover:bg-white/15 transition"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
