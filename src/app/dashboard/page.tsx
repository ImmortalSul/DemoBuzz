"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import { FloatingNavbar } from "@/components/layout/floating-navbar";
import { useWallet } from "@solana/wallet-adapter-react";

// Token addresses for different APIs
const TOKENS = {
  SOL: "So11111111111111111111111111111111111111112", // Wrapped SOL
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK token
};

// Alternative token identifiers
const COINGECKO_IDS = {
  SOL: "solana",
  BONK: "bonk",
};

// Mock historical price data for demonstration
const generateMockPriceData = () => {
  const now = new Date();
  const data = [];

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours().toString().padStart(2, "0") + ":00";

    // Mock SOL price around $195-205 (staying near $200)
    const solBasePrice = 200;
    const solPrice =
      solBasePrice + Math.sin(i * 0.2) * 3 + Math.random() * 4 - 2;

    // Mock BONK price around $0.000025-0.000035
    const bonkBasePrice = 0.00003;
    const bonkPrice =
      bonkBasePrice +
      Math.sin(i * 0.3) * 0.000005 +
      Math.random() * 0.000002 -
      0.000001;

    data.push({
      time: hour,
      SOL: parseFloat(solPrice.toFixed(2)),
      BONK: parseFloat(bonkPrice.toFixed(8)),
    });
  }

  return data;
};

// Mock transaction data
const generateMockTransactions = () => {
  const successfulTransactions = [
    {
      blockTime: "14:32:15",
      blockId: "9f72ec..4a3e",
      txId: "7Ba921..8F12",
      amount: "1.45 SOL",
    },
    {
      blockTime: "14:31:42",
      blockId: "8a51df..2c6f",
      txId: "3Fa558..1C24",
      amount: "0.89 SOL",
    },
    {
      blockTime: "14:30:18",
      blockId: "6c49ab..7f5e",
      txId: "9Db736..2A67",
      amount: "2.12 SOL",
    },
    {
      blockTime: "14:29:55",
      blockId: "4e27cd..9a9d",
      txId: "5Gc341..6B98",
      amount: "0.67 SOL",
    },
    {
      blockTime: "14:28:33",
      blockId: "2d35fe..3b4c",
      txId: "1Hd847..7C43",
      amount: "3.21 SOL",
    },
    {
      blockTime: "14:27:09",
      blockId: "7b43de..5c8f",
      txId: "4Ie539..9D56",
      amount: "0.95 SOL",
    },
  ];

  const failedTransactions = [
    {
      blockTime: "14:31:17",
      blockId: "5d83ef..1b3c",
      txId: "8La528..2G39",
      error: "Insufficient funds",
    },
    {
      blockTime: "14:29:42",
      blockId: "3f65cd..4a4e",
      txId: "2Mb634..5H45",
      error: "Network timeout",
    },
    {
      blockTime: "14:28:19",
      blockId: "1e47ab..6d3f",
      txId: "7Nc445..3I87",
      error: "Slippage exceeded",
    },
    {
      blockTime: "14:26:55",
      blockId: "9g29de..8c2b",
      txId: "4Od326..1J23",
      error: "Insufficient funds",
    },
    {
      blockTime: "14:25:33",
      blockId: "6h01fg..2e9a",
      txId: "6Pe752..4K69",
      error: "Network timeout",
    },
  ];

  return { successfulTransactions, failedTransactions };
};

export default function DashboardPage() {
  const { connected } = useWallet();
  const [priceData, setPriceData] = useState(generateMockPriceData());
  const [currentPrices, setCurrentPrices] = useState({ SOL: 0, BONK: 0 });
  const [priceChanges, setPriceChanges] = useState({ SOL: 0, BONK: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [apiSource, setApiSource] = useState<string>("Mock Data");

  const { successfulTransactions, failedTransactions } =
    generateMockTransactions();

  // Function to fetch price data from multiple APIs with fallbacks
  const fetchPriceData = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;

      if (!apiKey) {
        console.log("No Birdeye API key found, trying CoinGecko API...");
        await fetchFromCoinGecko();
        return;
      }

      console.log("Fetching real-time data from Birdeye API...");

      // Try Birdeye API first with different endpoints
      try {
        await fetchFromBirdeye(apiKey);
      } catch (birdeyeError) {
        console.log("Birdeye API failed, trying CoinGecko as fallback...");
        await fetchFromCoinGecko();
      }
    } catch (error) {
      console.error("All APIs failed, using mock data:", error);
      // Fallback to mock data on error
      const latestData = priceData[priceData.length - 1];
      setCurrentPrices({
        SOL: latestData.SOL,
        BONK: latestData.BONK,
      });

      // Update chart with latest mock data
      setPriceData((prevData) => {
        const newData = [...prevData];
        newData.shift(); // Remove first item

        const now = new Date();
        const time =
          now.getHours().toString().padStart(2, "0") +
          ":" +
          now.getMinutes().toString().padStart(2, "0");

        newData.push({
          time: time,
          SOL: latestData.SOL,
          BONK: latestData.BONK,
        });

        return newData;
      });

      setApiSource("Mock Data");
      setLastUpdated(new Date());
      console.log("⚠️ Using mock data due to API errors");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch from Birdeye API
  const fetchFromBirdeye = async (apiKey: string) => {
    const endpoints = [
      "https://public-api.birdeye.so/defi/price",
      "https://public-api.birdeye.so/public/price",
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying Birdeye endpoint: ${endpoint}`);

        const [solResponse, bonkResponse] = await Promise.all([
          fetch(`${endpoint}?address=${TOKENS.SOL}`, {
            headers: {
              "X-API-KEY": apiKey,
              Accept: "application/json",
              ...(endpoint.includes("public") && { "x-chain": "solana" }),
            },
          }),
          fetch(`${endpoint}?address=${TOKENS.BONK}`, {
            headers: {
              "X-API-KEY": apiKey,
              Accept: "application/json",
              ...(endpoint.includes("public") && { "x-chain": "solana" }),
            },
          }),
        ]);

        console.log(
          `Response status - SOL: ${solResponse.status}, BONK: ${bonkResponse.status}`
        );

        if (solResponse.ok && bonkResponse.ok) {
          const solData = await solResponse.json();
          const bonkData = await bonkResponse.json();

          console.log("Birdeye SOL data:", solData);
          console.log("Birdeye BONK data:", bonkData);

          if (
            solData.success &&
            bonkData.success &&
            solData.data &&
            bonkData.data
          ) {
            const newSOLPrice = parseFloat(solData.data.value);
            const newBONKPrice = parseFloat(bonkData.data.value);

            if (newSOLPrice > 0 && newBONKPrice > 0) {
              setCurrentPrices({
                SOL: newSOLPrice,
                BONK: newBONKPrice,
              });

              setPriceChanges({
                SOL: solData.data.priceChange24hPercent || 0,
                BONK: bonkData.data.priceChange24hPercent || 0,
              });

              // Update chart data with real prices
              setPriceData((prevData) => {
                const newData = [...prevData];
                newData.shift(); // Remove first item

                const now = new Date();
                const time =
                  now.getHours().toString().padStart(2, "0") +
                  ":" +
                  now.getMinutes().toString().padStart(2, "0");

                newData.push({
                  time: time,
                  SOL: newSOLPrice,
                  BONK: newBONKPrice,
                });

                return newData;
              });

              setLastUpdated(new Date());
              console.log("✅ Birdeye API successful:", {
                SOL: newSOLPrice,
                BONK: newBONKPrice,
              });
              setApiSource("Birdeye API");
              return;
            }
          }
        }
      } catch (error) {
        console.log(`Birdeye endpoint ${endpoint} failed:`, error);
        continue;
      }
    }

    throw new Error("All Birdeye endpoints failed");
  };

  // Fetch from CoinGecko API (free, no API key needed)
  const fetchFromCoinGecko = async () => {
    try {
      console.log("Fetching from CoinGecko API...");

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${COINGECKO_IDS.SOL},${COINGECKO_IDS.BONK}&vs_currencies=usd&include_24hr_change=true`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("CoinGecko API response:", data);

      if (data[COINGECKO_IDS.SOL] && data[COINGECKO_IDS.BONK]) {
        const solPrice = data[COINGECKO_IDS.SOL].usd;
        const bonkPrice = data[COINGECKO_IDS.BONK].usd;

        if (solPrice > 0 && bonkPrice > 0) {
          setCurrentPrices({
            SOL: solPrice,
            BONK: bonkPrice,
          });

          setPriceChanges({
            SOL: data[COINGECKO_IDS.SOL].usd_24h_change || 0,
            BONK: data[COINGECKO_IDS.BONK].usd_24h_change || 0,
          });

          // Update chart data with real prices
          setPriceData((prevData) => {
            const newData = [...prevData];
            newData.shift(); // Remove first item

            const now = new Date();
            const time =
              now.getHours().toString().padStart(2, "0") +
              ":" +
              now.getMinutes().toString().padStart(2, "0");

            newData.push({
              time: time,
              SOL: solPrice,
              BONK: bonkPrice,
            });

            return newData;
          });

          setLastUpdated(new Date());
          console.log("✅ CoinGecko API successful:", {
            SOL: solPrice,
            BONK: bonkPrice,
          });
          setApiSource("CoinGecko API");
          return;
        }
      }

      throw new Error("Invalid CoinGecko response data");
    } catch (error) {
      console.error("CoinGecko API failed:", error);
      throw error;
    }
  };

  // Auto-refresh prices every 10 seconds and load initial data
  useEffect(() => {
    if (connected) {
      fetchPriceData(); // Initial load
      const interval = setInterval(fetchPriceData, 10000); // Every 10 seconds for more frequent updates
      return () => clearInterval(interval);
    }
  }, [connected]);

  // Auto-update mock price data every 5 seconds for chart animation (when using mock data)
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BIRDEYE_API_KEY) {
      const interval = setInterval(() => {
        setPriceData((prevData) => {
          const newData = [...prevData];
          newData.shift(); // Remove first item

          const now = new Date();
          const time =
            now.getHours().toString().padStart(2, "0") +
            ":" +
            now.getMinutes().toString().padStart(2, "0");

          const lastSOL = newData[newData.length - 1].SOL;
          const lastBONK = newData[newData.length - 1].BONK;

          // Keep SOL price near $200 with small variations
          let newSOLPrice = lastSOL + (Math.random() - 0.5) * 3; // Max ±1.5 change
          if (newSOLPrice < 195) newSOLPrice = 195 + Math.random() * 3; // Keep above $195
          if (newSOLPrice > 205) newSOLPrice = 202 + Math.random() * 3; // Keep below $205

          // Add new data point with slight variation for mock data only
          newData.push({
            time: time,
            SOL: parseFloat(newSOLPrice.toFixed(2)),
            BONK: parseFloat(
              (lastBONK + (Math.random() - 0.5) * 0.000002).toFixed(8)
            ),
          });

          // Update current prices to match latest chart data
          setCurrentPrices({
            SOL: parseFloat(newSOLPrice.toFixed(2)),
            BONK: parseFloat(
              (lastBONK + (Math.random() - 0.5) * 0.000002).toFixed(8)
            ),
          });

          setLastUpdated(new Date());

          return newData;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="min-h-screen selection:bg-purple-500/30 selection:text-white">
      <FloatingNavbar />

      {/* Background gradient effect - same as smart contract page */}
      <div className="fixed inset-0 z-[-2]">
        <div className="absolute top-0 left-[10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[150px] animate-pulse-slower" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-violet-500/15 rounded-full blur-[130px] animate-pulse-medium" />
        <div className="absolute top-[60%] left-[30%] w-[350px] h-[350px] bg-indigo-400/10 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      {/* Subtle grid overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-[length:50px_50px] opacity-[0.015] z-[-1]" />

      {/* Top spacer to avoid navbar overlap */}
      <div className="h-32"></div>

      {/* Main content container */}
      <div className="container max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {!connected ? (
          // Wallet not connected state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="backdrop-blur-md bg-white/[0.01] border-white/10 rounded-2xl p-12 max-w-md mx-auto">
              <Wallet className="h-16 w-16 text-white/40 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-white/60 mb-6">
                Please connect your wallet to access the live price dashboard
                and view your trading data.
              </p>
              <div className="text-sm text-white/40">
                Use the "Connect Wallet" button in the navigation bar above
              </div>
            </div>
          </motion.div>
        ) : (
          // Wallet connected - show dashboard content
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-white mb-4">
                Live Price Dashboard
              </h1>
              <div className="text-sm text-white/60 mb-4">
                Data source: {apiSource} • Last updated:{" "}
                {lastUpdated.toLocaleTimeString()}
              </div>
            </motion.div>

            {/* Current Prices Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* SOL Price Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center text-sm font-bold">
                          SOL
                        </div>
                        <span>Solana</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {priceChanges.SOL >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-400" />
                        )}
                        <Badge
                          variant={
                            priceChanges.SOL >= 0 ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {priceChanges.SOL >= 0 ? "+" : ""}
                          {priceChanges.SOL.toFixed(2)}%
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${currentPrices.SOL.toFixed(2)}
                    </div>
                    <div className="text-sm text-white/60">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* BONK Price Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-600 flex items-center justify-center text-sm font-bold">
                          BONK
                        </div>
                        <span>Bonk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {priceChanges.BONK >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-400" />
                        )}
                        <Badge
                          variant={
                            priceChanges.BONK >= 0 ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {priceChanges.BONK >= 0 ? "+" : ""}
                          {priceChanges.BONK.toFixed(2)}%
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-white mb-2">
                      ${currentPrices.BONK.toFixed(8)}
                    </div>
                    <div className="text-sm text-white/60">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Price Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* SOL Price Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex justify-between items-center">
                      <span>SOL Price (24H)</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 bg-white/5 border-white/10 hover:bg-white/10"
                      >
                        <Download className="h-4 w-4 text-white/70" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={priceData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorSOL"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            style={{
                              fontSize: "0.75rem",
                              fill: "rgba(255,255,255,0.6)",
                            }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            style={{
                              fontSize: "0.75rem",
                              fill: "rgba(255,255,255,0.6)",
                            }}
                            domain={["dataMin - 2", "dataMax + 2"]}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(15, 15, 15, 0.95)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "6px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            itemStyle={{ color: "rgba(255,255,255,0.9)" }}
                            labelStyle={{
                              color: "rgba(255,255,255,0.7)",
                              marginBottom: "4px",
                            }}
                            formatter={(value) => [`$${value}`, "SOL Price"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="SOL"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{
                              r: 3,
                              strokeWidth: 1,
                              stroke: "#8b5cf6",
                              fill: "#1e1e1e",
                            }}
                            activeDot={{
                              r: 5,
                              strokeWidth: 2,
                              stroke: "#121212",
                              fill: "#8b5cf6",
                            }}
                            fillOpacity={1}
                            fill="url(#colorSOL)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* BONK Price Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex justify-between items-center">
                      <span>BONK Price (24H)</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 bg-white/5 border-white/10 hover:bg-white/10"
                      >
                        <Download className="h-4 w-4 text-white/70" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={priceData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorBONK"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f59e0b"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f59e0b"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            style={{
                              fontSize: "0.75rem",
                              fill: "rgba(255,255,255,0.6)",
                            }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            style={{
                              fontSize: "0.75rem",
                              fill: "rgba(255,255,255,0.6)",
                            }}
                            tickFormatter={(value) => value.toFixed(6)}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(15, 15, 15, 0.95)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "6px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            itemStyle={{ color: "rgba(255,255,255,0.9)" }}
                            labelStyle={{
                              color: "rgba(255,255,255,0.7)",
                              marginBottom: "4px",
                            }}
                            formatter={(value) => [
                              `$${Number(value).toFixed(8)}`,
                              "BONK Price",
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="BONK"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            dot={{
                              r: 3,
                              strokeWidth: 1,
                              stroke: "#f59e0b",
                              fill: "#1e1e1e",
                            }}
                            activeDot={{
                              r: 5,
                              strokeWidth: 2,
                              stroke: "#121212",
                              fill: "#f59e0b",
                            }}
                            fillOpacity={1}
                            fill="url(#colorBONK)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Transaction Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Successful Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      Recent Successful Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {successfulTransactions.map((tx, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-white">
                              {tx.amount}
                            </div>
                            <div className="text-xs text-white/60">
                              {tx.blockTime}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-xs text-white/70 font-mono">
                              {tx.txId}
                            </div>
                            <div className="text-xs text-white/50">
                              {tx.blockId}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Failed Transactions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-400" />
                      Recent Failed Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {failedTransactions.map((tx, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-red-400">
                              {tx.error}
                            </div>
                            <div className="text-xs text-white/60">
                              {tx.blockTime}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-xs text-white/70 font-mono">
                              {tx.txId}
                            </div>
                            <div className="text-xs text-white/50">
                              {tx.blockId}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
