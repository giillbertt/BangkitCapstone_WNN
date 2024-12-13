"use client";

import { navData } from "@/data/navData";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isNavbarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavbarOpen]);

  return (
    <header className="bg-primary-800 lg:bg-transparent fixed top-0 left-0 z-50 w-full lg:static">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16 md:h-20 px-4 lg:px-5">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/images/wnnlogo.png" width={60} height={60} alt="WNN Logo" className="w-16 md:w-20 h-auto" priority />
          <h3 className="text-2xl md:text-3xl font-bold">Waste Not Network</h3>
        </Link>

        {/* Navbar */}
        <div
          className={`absolute top-16 md:top-20 ${
            isNavbarOpen ? "left-0" : "left-[-100%]"
          } min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] w-full bg-primary/80 backdrop-blur-sm flex items-center justify-center duration-300 lg:static lg:min-h-fit lg:bg-transparent lg:w-auto`}
        >
          <nav className="flex flex-col items-center gap-8 pb-16 md:pb-20 lg:flex-row lg:pb-0 lg:me-5">
            {navData.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className={`duration-300 hover:text-secondary text-lg ${
                  pathname === item.url || pathname.startsWith(`${item.url}/`) ? "font-extrabold text-xl text-secondary" : "font-bold lg:font-normal"
                }`}
                onClick={() => setIsNavbarOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <Image src="/images/help.png" alt="Help Image" width={612} height={131} className="absolute bottom-0 opacity-90 w-full lg:hidden" />
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          className="block lg:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 p-1"
          onClick={() => setIsNavbarOpen(!isNavbarOpen)}
          title={isNavbarOpen ? "Close Navbar" : "Open Navbar"}
          aria-expanded={isNavbarOpen}
          aria-controls="navbar"
        >
          {isNavbarOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
