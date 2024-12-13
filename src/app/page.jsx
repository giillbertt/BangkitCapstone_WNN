"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import ScrollReveal from "scrollreveal";

export default function Home() {
  useEffect(() => {
    // Pastikan kode hanya dijalankan di sisi klien (browser)
    if (typeof window !== "undefined") {
      const sr = ScrollReveal({
        distance: "60px",
        duration: 2500,
        origin: "top",
        delay: 300,
      });

      // Konfigurasi untuk teks
      sr.reveal(".text-reveal");

      // Konfigurasi untuk gambar
      sr.reveal(".image-reveal", {
        delay: 500,
        scale: 0.5,
      });

      // Konfigurasi untuk card
      sr.reveal(".card-reveal", {
        interval: 300,
      });

      // Konfigurasi untuk elemen yang masuk dari kiri
      sr.reveal(".left-reveal", {
        origin: "left",
      });

      // Konfigurasi untuk elemen yang masuk dari kanan
      sr.reveal(".right-reveal", {
        origin: "right",
      });
    }
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative">
        <div className="w-5/6 md:w-4/6 lg:w-1/2">
          <h1 className="leading-snug text-secondary text-4xl sm:text-5xl font-extrabold text-shadow text-reveal">Connecting Communities for Sustainable Waste Reduction</h1>

          <p className="mt-4 mb-14 text-lg text-shadow font-medium card-reveal">
            Empower your community with actionable resources to reduce waste, recycle efficiently, and make a positive environmental impact.
          </p>

          <div className="card-reveal">
            <Link
              href={"/scanner"}
              aria-label="Get Started"
              className="w-fit bg-white text-primary font-bold py-3 px-8 rounded-full transition-all duration-300 ease-in-out shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:bg-secondary group flex items-center space-x-2"
            >
              <span className="transition-all duration-300 group-hover:mr-1">Start Scanning Now</span>
              <MdKeyboardArrowRight size={30} />
            </Link>
          </div>
        </div>

        <Image
          src={"/images/hero-section.png"}
          alt="image hero section"
          width={602}
          height={289}
          className="absolute w-auto h-screen max-h-[450px] top-0 -right-60 sm:-right-96 opacity-80 md:opacity-100 image-reveal"
        />
      </section>

      <section className="mt-36">
        <h2 className="text-3xl sm:text-4xl text-secondary font-black text-shadow left-reveal">
          <span className="mr-6">~</span> OUR FEATURES
        </h2>

        <p className="mt-4 mb-14 text-lg text-shadow font-medium text-reveal">We bring the power of AI to waste management with these cutting-edge tools:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/scanner" className="block card-reveal">
            <div
              className="bg-white/10 backdrop-blur-md rounded-lg p-8 hover:transform hover:scale-105 transition duration-300 text-center h-full flex flex-col justify-between group hover:bg-white/15"
            >
              <div className="flex justify-center mb-8">
                <Image
                  src="/images/rb_156.png"
                  alt="AI-powered waste identification system illustration"
                  className="w-auto h-48 object-contain group-hover:-translate-y-2 transition-transform duration-300"
                  loading="lazy"
                  width="192"
                  height="192"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4">Smart Waste Identification</h3>
                <p className="text-gray-300">Advanced AI technology to help you identify and categorize different types of waste materials accurately</p>
              </div>
            </div>
          </Link>

          <Link href="/chatbot" className="block card-reveal">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 hover:transform hover:scale-105 transition duration-300 text-center h-full flex flex-col justify-between group hover:bg-white/15">
              <div className="flex justify-center mb-8">
                <Image
                  src="/images/Chat bot-pana.png"
                  alt="Interactive AI chatbot assistant illustration"
                  className="w-auto h-48 object-contain group-hover:-translate-y-2 transition-transform duration-300"
                  loading="lazy"
                  width="192"
                  height="192"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-4">Intelligent Assistant</h3>
                <p className="text-gray-300">24/7 AI-powered chatbot providing instant guidance on waste management and recycling practices</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="300">
          <div className="text-center p-4 card-reveal">
            <div className="text-3xl font-bold text-secondary mb-2">500+</div>
            <p className="text-gray-200">Waste Materials Identified</p>
          </div>
          <div className="text-center p-4 card-reveal">
            <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
            <p className="text-gray-200">AI Support Available</p>
          </div>
          <div className="text-center p-4 card-reveal">
            <div className="text-3xl font-bold text-secondary mb-2">100+</div>
            <p className="text-gray-200">Community Partners</p>
          </div>
          <div className="text-center p-4 card-reveal">
            <div className="text-3xl font-bold text-secondary mb-2">50k+</div>
            <p className="text-gray-200">Active Users</p>
          </div>
        </div>
      </section>

      <section className="mt-28">
        <h2 className="text-3xl sm:text-4xl text-secondary font-black text-shadow text-reveal">
          <span className="mr-6">~</span> WHO WE ARE
        </h2>
        <div className="flex flex-col lg:flex-row items-center gap-14">
          <div className="lg:w-2/3 left-reveal">
            <h2 className="text-3xl sm:text-4xl text-secondary font-bold text-shadow mt-4 mb-10">Empowering Communities to Manage Waste Smarter</h2>
            <p className="text-shadow font-medium">
              Waste Not Network (WNN) is a technology-based platform designed to simplify the waste management process in society. We believe that by utilizing artificial intelligence (AI), every
              individual can play an important role in maintaining a clean environment and creating a greener future.
            </p>
            <p className="text-shadow font-medium mt-4">
              Founded with the spirit of innovation and concern for the environment, WNN is here to address the main challenge in waste management: sorting recyclable and non-recyclable waste. We
              provide tools such as the Recycle Scanner, which allows users to check the type of waste simply by taking a photo, as well as an interactive chatbot to provide guidance and education
              about waste management.
            </p>
          </div>

          <Image src={"/images/picture4.png"} alt="About Image" width={602} height={661} className="w-1/2 lg:w-1/3 right-reveal" />
        </div>
        <div className="flex flex-col lg:flex-row-reverse items-center gap-14 mt-8">
          <div className="lg:w-7/12 right-reveal">
            <p className="text-shadow font-medium">
              We understand that waste is not only an individual problem, but also a collective responsibility. Therefore, we prioritize a community approach by providing tools that are easily
              accessible and user-friendly. With the technology we develop, WNN aims to empower the community to make a real contribution to reducing the amount of waste that ends up in landfills.
            </p>
            <p className="text-shadow font-medium mt-4">
              Through continuous innovation, we hope to build an ecosystem that supports recycling as a whole, from households to industries. By working with various parties, we want to ensure that
              small steps such as sorting waste can have a big impact on our earth.
            </p>
          </div>

          <Image src={"/images/picture5.png"} alt="About Image" width={602} height={402} className="w-2/3 lg:w-5/12 left-reveal" />
        </div>
      </section>
    </main>
  );
}
