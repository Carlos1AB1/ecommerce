import { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <Navbar />
      
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <main className="flex-1">
          {children}
          <Footer />
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
