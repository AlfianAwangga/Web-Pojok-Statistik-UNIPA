import "@/app/globals.css";
import ScrollToTop from "@/components/ui/scroll-to-top";
import NavbarAdmin from "@/components/layout/navbar-admin";
import TopBarAdmin from "@/components/layout/topbar-admin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      <NavbarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBarAdmin />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <ScrollToTop />
    </div>
  );
}
