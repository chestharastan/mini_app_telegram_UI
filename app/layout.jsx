import "./globals.css";

export const metadata = {
  title: "Shop App",
  description: "A simple storefront built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f8f9fb] text-slate-900 antialiased">{children}</body>
    </html>
  );
}
