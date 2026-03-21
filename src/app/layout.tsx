import type { Metadata } from "next";
import { ThemeProvider } from "@/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Booted",
  description: "#1 AI prank app for booting cars.",
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
        }}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
