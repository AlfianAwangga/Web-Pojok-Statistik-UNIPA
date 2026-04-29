import Navbar from "@/components/layout/navbar";
import "@/app/globals.css";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Navbar />
      <main>{children}</main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
