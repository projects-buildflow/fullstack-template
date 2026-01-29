import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskMaster",
  description: "A Kanban board application for managing tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
