import { useState } from "react";
import { yearsData } from "@/data/years";
import PhotoGallery from "@/components/gallery/PhotoGallery";

const YearSection = () => {
  const [activeYear, setActiveYear] = useState(yearsData[0].year);
  const current = yearsData.find((y) => y.year === activeYear)!;

  return (
    <section className="py-12 px-4 sm:px-6">
      {/* Year selector */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
        {yearsData.map((y) => (
          <button
            key={y.year}
            onClick={() => setActiveYear(y.year)}
            className={`px-5 py-2.5 rounded-full font-heading text-sm sm:text-base font-medium transition-all duration-300 ${
              activeYear === y.year
                ? "bg-primary text-primary-foreground shadow-romantic"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {y.year}
          </button>
        ))}
      </div>

      {/* Year content */}
      <PhotoGallery
        key={activeYear}
        photos={current.photos}
        title={current.title}
        subtitle={current.description}
      />
    </section>
  );
};

export default YearSection;
