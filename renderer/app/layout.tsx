import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "cnfast";
import { Geist } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

const GeistFont = Geist();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode[];
}) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(GeistFont.className)}
      >
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
