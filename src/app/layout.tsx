import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata = {
  title: "CoinBuzz",
  description:
    "A decentralized prediction platform for crypto trading and analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <Providers>
          <div className="min-h-screen w-full">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
