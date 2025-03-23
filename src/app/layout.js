import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image"; // ⬅️ nový import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Oliver Provazník",
  description: "Popis mojej stránky",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
        <main className="w-full max-w-3xl p-6">{children}</main>

        <div className="fixed bottom-4 left-4">
          <a href="mailto:oliver.provaznik@gmail.com" className="inline-block">
            <Image
              src="/myphoto.png"
              alt="Moja fotka"
              width={40}
              height={40}
              className="rounded-full"
            />
          </a>
        </div>
      </body>
    </html>
  );
}


