import Navbar from "@/components/layout/navbar";
import "./globals.css";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tes Title</title>
      </head>
      <body className="bg-gray-50 font-sans text-gray-800 flex flex-col min-h-screen">
        <Navbar />
        <main>{children}</main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
