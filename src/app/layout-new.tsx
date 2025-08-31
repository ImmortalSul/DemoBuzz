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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
