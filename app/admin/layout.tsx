import Navbar from "@/components/layout/navbar";
import "@/app/globals.css";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/ui/scroll-to-top";
import NavbarAdmin from "@/components/layout/navbar-admin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      <NavbarAdmin />
      <main>{children}</main>
      <ScrollToTop />
    </div>
  );
}
