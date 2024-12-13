"use client";
import { navData, moreLink } from "@/data/navData";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

const Footer = () => {
  useEffect(() => {
    // Pastikan kode hanya dijalankan di sisi klien (browser)
    if (typeof window !== "undefined") {
      const sr = ScrollReveal();
      sr.reveal(".footer-content", { origin: "left", distance: "50px", duration: 2000 });
      sr.reveal(".footer-links", { origin: "right", distance: "50px", duration: 2000, delay: 300, interval: 200 });
    }
  }, []);

  return (
    <footer className="mt-12 pt-12 bg-primary-800/50">
      <div className="md:flex container-custom">
        {/* Logo dan Deskripsi */}
        <div className="md:w-2/4 md:me-20 footer-content">
          <Link href="/" className="flex items-center">
            <Image src="/images/wnnlogo.png" width={60} height={60} alt="WNN Logo" className="w-16 h-auto" priority />
            <h4 className="text-2xl font-bold">Waste Not Network</h4>
          </Link>
          <p className="mt-5 text-justify ms-3 md:ms-5">
            We invite you to join us in this global movement. Let&rsquo;s make waste an opportunity, not a problem. Together, we can create a cleaner, healthier, and more sustainable world for future
            generations.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:w-1/4 flex flex-col gap-5 mt-7 md:mt-0 footer-links">
          <h4 className="text-xl font-semibold">Quick Links</h4>
          {navData.map((item, index) => (
            <Link key={index} href={item.url} className={`block py-2 px-3 rounded hover:text-secondary`}>
              {item.name}
            </Link>
          ))}
        </div>

        {/* More Links */}
        <div className="md:w-1/4 flex flex-col gap-5 mt-7 md:mt-0 footer-links">
          <h4 className="text-xl font-semibold">More</h4>
          {moreLink.map((item, index) => (
            <Link key={index} href={item.url} className="block py-2 px-3 rounded hover:text-secondary">
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <p className="bg-primary-800 text-center mt-12 py-4 lg:py-2">&copy; 2024 Waste Not Network, All rights reserved.</p>
    </footer>
  );
};

export default Footer;
