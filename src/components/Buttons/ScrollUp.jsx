"use client"
import { MdKeyboardArrowUp } from "react-icons/md"
import { useState, useEffect } from "react";

const ScrollUp = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Memantau scroll untuk menampilkan tombol
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll ke atas saat tombol diklik
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed ${isVisible ? "bottom-6" : "-bottom-1/2"} right-4 shadow-lg bg-base active:bg-base/70 text-primary rounded-full hover:translate-y-2 duration-300 z-50`}
      >
        <MdKeyboardArrowUp size={50} />
      </button>
    </div>
  );
}

export default ScrollUp;