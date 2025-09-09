// components/Carousel.jsx
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../card";

interface CarouselProps {
  items?: any[];
  renderItem?: (item: any, index: number) => React.ReactNode;
}

export default function Carousel({ items = [], renderItem }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir = 1) => {
    const el = scrollRef.current;
    if (!el || el.children.length === 0) return;

    const cardWidth = (el.children[0] as HTMLElement).offsetWidth || 300;
    el.scrollBy({ left: dir * (cardWidth + 24), behavior: "smooth" });

    // Optional loop: wrap around if reaching edges
    const maxScroll = el.scrollWidth - el.clientWidth;
    setTimeout(() => {
      if (dir > 0 && el.scrollLeft >= maxScroll - 5) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else if (dir < 0 && el.scrollLeft <= 5) {
        el.scrollTo({ left: maxScroll, behavior: "smooth" });
      }
    }, 350);
  };

  return (
    <section className="w-full relative">
      {/* Track */}
      <div
        ref={scrollRef}
        className="
          flex overflow-x-auto space-x-6 snap-x snap-mandatory
          px-4 mt-6 mb-4 scrollbar-hide
        "
      >
        {items.map((item, i) =>
          renderItem ? renderItem(item, i) : <Card key={i} {...item} showTags={false} />
        )}
      </div>

      {/* Arrows */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => scrollBy(-1)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          <ChevronLeft className="w-5 h-5 text-blue-500" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          <ChevronRight className="w-5 h-5 text-blue-500" />
        </button>
      </div>
    </section>
  );
}
