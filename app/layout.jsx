import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Shop App",
  description: "A simple storefront built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#f8f9fb] text-slate-900 antialiased">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
