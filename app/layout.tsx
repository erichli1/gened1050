"use client";

import type { Metadata } from "next";
import "./globals.css";
import { createTheme, ThemeProvider } from "@mui/material";

const metadata: Metadata = {
  title: "GENED1050 Group Generator",
  description: "Upload a CSV of matches and get a group.",
};

const theme = createTheme({
  typography: {
    fontFamily: "Inter Tight",
    button: {
      textTransform: "none",
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ThemeProvider theme={theme}>
        <body>{children}</body>
      </ThemeProvider>
    </html>
  );
}
