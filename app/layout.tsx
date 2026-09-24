import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QuestionnaireProvider } from "@/lib/questionnaire-context";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FindMovie",
  description:
    "Discover movies perfectly matched to your mood, genres, and streaming services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <LocaleProvider>
          <QuestionnaireProvider>{children}</QuestionnaireProvider>
        </LocaleProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
