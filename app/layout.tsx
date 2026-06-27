import type { Metadata } from "next";
import { CompanionProvider } from "@/components/providers/CompanionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cabbits",
  description: "An adaptive learning companion web app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CompanionProvider>{children}</CompanionProvider>
      </body>
    </html>
  );
}
