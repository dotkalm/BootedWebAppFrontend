import type { Metadata } from "next";
import { ThemeProvider } from "@/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "edge detector",
  description: "lets detect edges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          height: '100vh',
          overflow: 'hidden',
          overscrollBehaviorY: 'none',
          overscrollBehavior: 'none',
        }}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
