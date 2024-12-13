import Footer from "@/components/Utilities/Footer";
import "./globals.css";
import Header from "@/components/Utilities/Header";
import ScrollUp from "@/components/Buttons/ScrollUp";
export const metadata = {
  title: "WNN - Waste Not Network",
  description: "Web pendeteksi sampah yang bisa didaur ulang dan chatbot",
  generator: "Next.js",
  applicationName: "WNN",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <ScrollUp />
      </body>
    </html>
  );
}
