"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-44 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-foreground/80 shadow-lg transition-colors hover:border-brand/40 hover:text-foreground md:bottom-24 md:right-6"
      aria-label="Quay về đầu trang"
    >
      <ArrowUp size={18} />
    </button>
  );
}
