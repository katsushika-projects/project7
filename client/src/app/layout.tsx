"use client";

import { BrowserRouter } from "react-router-dom";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <BrowserRouter>
        <body style={{ margin: "0" }}>{children}</body>
      </BrowserRouter>
    </html>
  );
}
