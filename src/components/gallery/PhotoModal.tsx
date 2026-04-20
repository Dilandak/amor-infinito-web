import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Photo } from "@/data/photos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface PhotoModalProps {
  photo: Photo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PhotoModal = ({ photo, open, onOpenChange }: PhotoModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (open && contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll(".modal-anim"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }
      );
    }
  }, { dependencies: [open, photo?.id] });

  if (!photo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-card border-border/40 p-0 overflow-hidden">
        <div ref={contentRef}>
          <div className="modal-anim aspect-[4/3] overflow-hidden bg-secondary">
            <img
              src={photo.src}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 space-y-3">
            <DialogHeader className="modal-anim space-y-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <DialogTitle className="text-2xl font-heading font-semibold text-gradient-romantic">
                  {photo.title}
                </DialogTitle>
                {photo.year && (
                  <Badge variant="secondary" className="gap-1.5 font-body">
                    <Calendar className="w-3 h-3" />
                    {photo.year}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-base text-muted-foreground font-body leading-relaxed">
                {photo.description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoModal;
