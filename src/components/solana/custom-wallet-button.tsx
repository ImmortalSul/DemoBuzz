"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";

export function CustomWalletButton() {
  const { connected, publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      // If connected, show wallet options (disconnect, copy address, etc.)
      setVisible(true);
    } else {
      // If not connected, open wallet selection modal
      setVisible(true);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const buttonText = connecting
    ? "Connecting..."
    : connected && publicKey
    ? formatAddress(publicKey.toString())
    : "Connect Wallet";

  return (
    <Button
      size="lg"
      className="group relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white px-10 py-7 text-lg md:text-xl font-bold rounded-2xl border border-white/20 min-w-[220px] transition-all duration-500 overflow-hidden shadow-[0_20px_60px_-12px_rgba(131,88,255,0.5)]"
      onClick={handleClick}
      disabled={connecting}
    >
      <span className="relative z-10 flex items-center justify-center gap-3">
        {connecting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Wallet className="h-6 w-6" />
            </motion.div>
            {buttonText}
          </>
        ) : connected ? (
          <>
            <Wallet className="h-5 w-5" />
            {buttonText}
          </>
        ) : (
          <>
            {buttonText}
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="h-6 w-6" />
            </motion.span>
          </>
        )}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
      <span className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></span>
    </Button>
  );
}
