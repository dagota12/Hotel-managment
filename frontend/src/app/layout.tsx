import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Employee Management",
  description: "Hotel employee management dashboard, attendance, and reports.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("dark h-full antialiased", inter.variable, geist.variable)}>
      <body className="min-h-full">
        <Providers>
          <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
            <AppSidebar />
            <main className="min-w-0 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
