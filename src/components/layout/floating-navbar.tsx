"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, BarChart3, Trophy, Gamepad2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { AuthButton } from "../auth/auth-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Predictions",
    href: "/prediction-dashboard",
    icon: Gamepad2,
  },
];

export function FloatingNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { connected, publicKey, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWalletClick = () => {
    setVisible(true);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav
          className={cn(
            "flex items-center justify-between w-full max-w-4xl mx-auto px-6 py-3 rounded-2xl transition-all duration-300",
            "backdrop-blur-2xl bg-white/[0.02] border border-white/[0.05] shadow-2xl",
            "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/[0.03] before:via-white/[0.01] before:to-white/[0.03] before:opacity-30",
            "relative overflow-hidden",
            scrolled && "bg-white/[0.04] border-white/[0.08] shadow-3xl"
          )}
          style={{
            boxShadow: scrolled
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
              : "0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.03)",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-xl font-semibold bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg"
            >
              CoinBuzz
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                    isActive
                      ? "bg-white/[0.08] text-white border border-white/[0.12] backdrop-blur-sm shadow-lg"
                      : "text-white/90 hover:text-white hover:bg-white/[0.05] hover:backdrop-blur-sm"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Auth & Wallet */}
          <div className="flex items-center gap-3">
            {/* Auth Button */}
            <div className="scale-90">
              <AuthButton />
            </div>

            {/* Wallet Button */}
            <Button
              onClick={handleWalletClick}
              disabled={connecting}
              size="sm"
              className={cn(
                "h-9 px-4 text-sm font-medium rounded-lg transition-all duration-200 backdrop-blur-sm relative",
                connected
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-500/15"
                  : "bg-white/[0.08] text-white border border-white/[0.12] hover:bg-white/[0.12]"
              )}
            >
              {connecting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-violet-300 border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : connected && publicKey ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  {formatAddress(publicKey.toString())}
                </div>
              ) : (
                "Connect Wallet"
              )}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden"
          >
            <div
              className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 shadow-2xl relative overflow-hidden"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-white/[0.01] to-white/[0.03] opacity-30 rounded-2xl"></div>
              <div className="flex flex-col gap-2">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative z-10",
                        isActive
                          ? "bg-white/[0.08] text-white border border-white/[0.12] backdrop-blur-sm shadow-lg"
                          : "text-white/90 hover:text-white hover:bg-white/[0.05] hover:backdrop-blur-sm"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
