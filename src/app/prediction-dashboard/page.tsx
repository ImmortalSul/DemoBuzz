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
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Target,
  Trophy,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { FloatingNavbar } from "@/components/layout/floating-navbar";
import { useWallet } from "@solana/wallet-adapter-react";

// Mock prediction accuracy data
const generateMockPredictionData = () => {
  const now = new Date();
  const data = [];

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours().toString().padStart(2, "0") + ":00";

    const accuracy = 65 + Math.sin(i * 0.3) * 10 + Math.random() * 8;

    data.push({
      time: hour,
      accuracy: parseFloat(accuracy.toFixed(1)),
    });
  }

  return data;
};

// Mock active predictions
const generateActivePredictions = () => [
  {
    id: 1,
    token: "SOL",
    currentPrice: 201.45,
    predictedPrice: 215.5,
    direction: "up",
    confidence: 75,
    timeLeft: "2h 45m",
    stake: 5.2,
    potentialWin: 8.8,
    predictor: "CryptoWhale",
  },
  {
    id: 2,
    token: "BONK",
    currentPrice: 0.00003124,
    predictedPrice: 0.00002895,
    direction: "down",
    confidence: 68,
    timeLeft: "4h 12m",
    stake: 2.1,
    potentialWin: 3.7,
    predictor: "MemeKing",
  },
  {
    id: 3,
    token: "ETH",
    currentPrice: 2654.32,
    predictedPrice: 2789.5,
    direction: "up",
    confidence: 82,
    timeLeft: "1h 33m",
    stake: 12.5,
    potentialWin: 22.4,
    predictor: "EthMaxi",
  },
];

export default function PredictionDashboardPage() {
  const { connected } = useWallet();
  const [predictionData] = useState(generateMockPredictionData());
  const [activePredictions] = useState(generateActivePredictions());

  return (
    <div className="min-h-screen selection:bg-purple-500/30 selection:text-white">
      <FloatingNavbar />

      {/* Background gradient effect - same as dashboard page */}
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
                Please connect your wallet to access the prediction dashboard
                and make price predictions.
              </p>
              <div className="text-sm text-white/40">
                Use the "Connect Wallet" button in the navigation bar above
              </div>
            </div>
          </motion.div>
        ) : (
          // Wallet connected - show prediction dashboard content
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-white mb-4">
                Prediction Dashboard
              </h1>
              <p className="text-white/60 mb-8">
                Make predictions on token prices and compete with other traders
              </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Active Predictions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Target className="h-6 w-6 text-violet-400" />
                        <span>Active Predictions</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-white mb-2">
                      {activePredictions.length}
                    </div>
                    <div className="text-sm text-white/60">
                      Currently tracking
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Total Staked */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-orange-400" />
                        <span>Total Staked</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-white mb-2">
                      {activePredictions
                        .reduce((sum, pred) => sum + pred.stake, 0)
                        .toFixed(1)}{" "}
                      SOL
                    </div>
                    <div className="text-sm text-white/60">
                      Across all predictions
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Potential Winnings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-green-400" />
                        <span>Potential Win</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-3xl font-bold text-white mb-2">
                      {activePredictions
                        .reduce((sum, pred) => sum + pred.potentialWin, 0)
                        .toFixed(1)}{" "}
                      SOL
                    </div>
                    <div className="text-sm text-white/60">
                      If all predictions hit
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Predictions List */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="backdrop-blur-md bg-white/[0.01] border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="h-5 w-5 text-violet-400" />
                        Active Predictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activePredictions.map((prediction) => (
                          <div
                            key={prediction.id}
                            className="bg-white/[0.02] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className="border-white/20 text-white"
                                >
                                  {prediction.token}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  {prediction.direction === "up" ? (
                                    <TrendingUp className="h-4 w-4 text-green-400" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-400" />
                                  )}
                                  <span
                                    className={`text-sm font-medium ${
                                      prediction.direction === "up"
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }`}
                                  >
                                    {prediction.direction === "up" ? "+" : "-"}
                                    {(
                                      (Math.abs(
                                        prediction.predictedPrice -
                                          prediction.currentPrice
                                      ) /
                                        prediction.currentPrice) *
                                      100
                                    ).toFixed(1)}
                                    %
                                  </span>
                                </div>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-white/10 text-white"
                              >
                                {prediction.confidence}% confidence
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-white/60">Current</p>
                                <p className="text-white font-medium">
                                  $
                                  {prediction.token === "BONK"
                                    ? prediction.currentPrice.toFixed(8)
                                    : prediction.currentPrice.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60">Target</p>
                                <p className="text-white font-medium">
                                  $
                                  {prediction.token === "BONK"
                                    ? prediction.predictedPrice.toFixed(8)
                                    : prediction.predictedPrice.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60">Stake</p>
                                <p className="text-white font-medium">
                                  {prediction.stake} SOL
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60">Potential</p>
                                <p className="text-green-400 font-medium">
                                  {prediction.potentialWin} SOL
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-white/70">
                                  {prediction.predictor}
                                </span>
                              </div>
                              <span className="text-sm text-orange-400">
                                {prediction.timeLeft}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Prediction Accuracy Chart */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="backdrop-blur-md bg-white/[0.01] border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">
                        Prediction Accuracy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={predictionData}>
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
                            domain={[50, 90]}
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
                            formatter={(value) => [`${value}%`, "Accuracy"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="accuracy"
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
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Make New Prediction */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Card className="backdrop-blur-md bg-white/[0.01] border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-center">
                        Make New Prediction
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["SOL", "BONK", "ETH", "BTC"].map((token) => (
                          <Button
                            key={token}
                            variant="outline"
                            className="w-full bg-white/[0.02] border-white/20 text-white hover:bg-white/[0.05] hover:border-white/30"
                          >
                            Predict {token}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
