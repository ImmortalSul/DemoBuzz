"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Star,
  Wallet,
  TrendingUp,
  TrendingDown,
  User,
  Search,
  Filter,
  Calendar,
  Award,
  Target,
  Activity,
  DollarSign,
  Zap,
  Users,
  ChevronUp,
  ChevronDown,
  Eye,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { FloatingNavbar } from "@/components/layout/floating-navbar";

// Mock leaderboard data
const MOCK_PLAYERS = [
  {
    id: "1",
    rank: 1,
    username: "CryptoPunker",
    displayName: "Alex Chen",
    avatar: "https://github.com/shadcn.png",
    walletAddress: "7Ba921...8F12A3",
    fullWalletAddress: "7Ba921mKjH8nF3Lp2xR4vT6qZ9sA1wE5dY3uC8F12A3",
    totalPredictions: 247,
    correctPredictions: 189,
    accuracy: 76.5,
    totalEarnings: 12450.75,
    streak: 12,
    joinedDate: "2024-02-15",
    badges: ["legendary", "streak-master", "top-earner"],
    recentActivity: "2 hours ago",
    tier: "Diamond",
    winRate: 76.5,
    avgReturn: 24.3,
    riskScore: 3.2,
  },
  {
    id: "2",
    rank: 2,
    username: "TokenTrader",
    displayName: "Sarah Kim",
    avatar: "https://github.com/vercel.png",
    walletAddress: "3Fa558...1C24B7",
    fullWalletAddress: "3Fa558mKjH8nF3Lp2xR4vT6qZ9sA1wE5dY3uC1C24B7",
    totalPredictions: 198,
    correctPredictions: 145,
    accuracy: 73.2,
    totalEarnings: 9876.32,
    streak: 8,
    joinedDate: "2024-01-20",
    badges: ["platinum", "consistent"],
    recentActivity: "5 hours ago",
    tier: "Platinum",
    winRate: 73.2,
    avgReturn: 21.7,
    riskScore: 2.8,
  },
  {
    id: "3",
    rank: 3,
    username: "SolanaSniper",
    displayName: "Mike Johnson",
    avatar: "https://github.com/github.png",
    walletAddress: "9Db736...2A67C9",
    fullWalletAddress: "9Db736mKjH8nF3Lp2xR4vT6qZ9sA1wE5dY3uC2A67C9",
    totalPredictions: 156,
    correctPredictions: 112,
    accuracy: 71.8,
    totalEarnings: 7234.56,
    streak: 15,
    joinedDate: "2024-03-10",
    badges: ["gold", "streak-king"],
    recentActivity: "1 day ago",
    tier: "Gold",
    winRate: 71.8,
    avgReturn: 19.4,
    riskScore: 3.7,
  },
  {
    id: "4",
    rank: 4,
    username: "DeFiDegen",
    displayName: "Emma Wilson",
    avatar: "https://github.com/microsoft.png",
    walletAddress: "5Gc341...6B98D1",
    fullWalletAddress: "5Gc341mKjH8nF3Lp2xR4vT6qZ9sA1wE5dY3uC6B98D1",
    totalPredictions: 134,
    correctPredictions: 89,
    accuracy: 66.4,
    totalEarnings: 5678.91,
    streak: 3,
    joinedDate: "2024-04-05",
    badges: ["silver", "newcomer"],
    recentActivity: "3 hours ago",
    tier: "Silver",
    winRate: 66.4,
    avgReturn: 17.2,
    riskScore: 4.1,
  },
  {
    id: "5",
    rank: 5,
    username: "BonkBeast",
    displayName: "David Lee",
    avatar: "https://github.com/apple.png",
    walletAddress: "1Hd847...7C43E5",
    fullWalletAddress: "1Hd847mKjH8nF3Lp2xR4vT6qZ9sA1wE5dY3uC7C43E5",
    totalPredictions: 89,
    correctPredictions: 58,
    accuracy: 65.2,
    totalEarnings: 3456.78,
    streak: 6,
    joinedDate: "2024-05-01",
    badges: ["bronze", "rising-star"],
    recentActivity: "6 hours ago",
    tier: "Bronze",
    winRate: 65.2,
    avgReturn: 15.8,
    riskScore: 3.9,
  },
];

const BADGE_CONFIG = {
  legendary: {
    color: "from-yellow-400 to-orange-500",
    icon: Crown,
    label: "Legendary",
  },
  "streak-master": {
    color: "from-purple-400 to-pink-500",
    icon: Zap,
    label: "Streak Master",
  },
  "top-earner": {
    color: "from-green-400 to-emerald-500",
    icon: DollarSign,
    label: "Top Earner",
  },
  platinum: {
    color: "from-slate-300 to-slate-500",
    icon: Medal,
    label: "Platinum",
  },
  consistent: {
    color: "from-blue-400 to-indigo-500",
    icon: Target,
    label: "Consistent",
  },
  gold: { color: "from-yellow-300 to-yellow-600", icon: Trophy, label: "Gold" },
  "streak-king": {
    color: "from-orange-400 to-red-500",
    icon: Activity,
    label: "Streak King",
  },
  silver: { color: "from-gray-300 to-gray-500", icon: Award, label: "Silver" },
  newcomer: {
    color: "from-cyan-400 to-blue-500",
    icon: Star,
    label: "Newcomer",
  },
  bronze: {
    color: "from-orange-400 to-yellow-600",
    icon: Medal,
    label: "Bronze",
  },
  "rising-star": {
    color: "from-pink-400 to-purple-500",
    icon: TrendingUp,
    label: "Rising Star",
  },
};

const TIER_COLORS = {
  Diamond: "from-cyan-400 to-blue-500",
  Platinum: "from-slate-300 to-slate-500",
  Gold: "from-yellow-300 to-yellow-600",
  Silver: "from-gray-300 to-gray-500",
  Bronze: "from-orange-400 to-yellow-600",
};

export default function LeaderboardPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rank");
  const [timeFilter, setTimeFilter] = useState("all-time");
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const filteredPlayers = MOCK_PLAYERS.filter(
    (player) =>
      player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string, playerId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWallet(playerId);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Trophy className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-white/80">#{rank}</span>;
    }
  };

  const formatEarnings = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen text-white selection:bg-purple-500/30 selection:text-white">
      <FloatingNavbar />

      {/* Background gradient effect */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Leaderboard
            </h1>
            <p className="text-white/60 mt-2">
              Top performers in cryptocurrency predictions
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40 border-white/10 bg-white/5 hover:bg-white/10">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="today">Today</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 border-white/10 bg-white/5 hover:bg-white/10">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="earnings">Total Earnings</SelectItem>
              <SelectItem value="accuracy">Accuracy</SelectItem>
              <SelectItem value="streak">Current Streak</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {filteredPlayers.slice(0, 3).map((player, index) => (
              <Card
                key={player.id}
                className={cn(
                  "backdrop-blur-md border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105",
                  index === 0
                    ? "bg-gradient-to-br from-yellow-400/15 to-yellow-600/15 border-yellow-400/20"
                    : index === 1
                    ? "bg-gradient-to-br from-slate-400/10 to-slate-600/10 border-slate-400/10"
                    : "bg-gradient-to-br from-orange-400/10 to-yellow-500/10 border-orange-400/10"
                )}
                onClick={() => setSelectedPlayer(player)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    {getRankIcon(player.rank)}
                  </div>

                  <div className="mb-4">
                    <Avatar className="h-16 w-16 mx-auto mb-3 ring-2 ring-white/20">
                      <AvatarImage src={player.avatar} />
                      <AvatarFallback>
                        {player.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg text-white">
                      {player.username}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {player.displayName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Accuracy:</span>
                      <span className="text-white font-medium">
                        {player.accuracy}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Earnings:</span>
                      <span className="text-green-400 font-medium">
                        {formatEarnings(player.totalEarnings)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Streak:</span>
                      <span className="text-orange-400 font-medium">
                        {player.streak}
                      </span>
                    </div>
                  </div>

                  <Badge
                    className={cn(
                      "mt-4 bg-gradient-to-r text-white border-0",
                      TIER_COLORS[player.tier as keyof typeof TIER_COLORS]
                    )}
                  >
                    {player.tier}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Full Leaderboard Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="backdrop-blur-md bg-white/[0.01] border-white/10 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Full Rankings
              </CardTitle>
              <CardDescription>
                Complete leaderboard with detailed statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr className="text-left">
                      <th className="p-4 text-white/60 font-medium">Rank</th>
                      <th className="p-4 text-white/60 font-medium">Player</th>
                      <th className="p-4 text-white/60 font-medium">Tier</th>
                      <th className="p-4 text-white/60 font-medium">
                        Accuracy
                      </th>
                      <th className="p-4 text-white/60 font-medium">
                        Earnings
                      </th>
                      <th className="p-4 text-white/60 font-medium">Streak</th>
                      <th className="p-4 text-white/60 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr
                        key={player.id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => setSelectedPlayer(player)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(player.rank)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-1 ring-white/20">
                              <AvatarImage src={player.avatar} />
                              <AvatarFallback>
                                {player.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-white">
                                {player.username}
                              </div>
                              <div className="text-sm text-white/60">
                                {player.displayName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={cn(
                              "bg-gradient-to-r text-white border-0",
                              TIER_COLORS[
                                player.tier as keyof typeof TIER_COLORS
                              ]
                            )}
                          >
                            {player.tier}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                              {player.accuracy}%
                            </span>
                            <div className="w-16 bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                                style={{ width: `${player.accuracy}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-green-400 font-medium">
                            {formatEarnings(player.totalEarnings)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-orange-400" />
                            <span className="text-orange-400 font-medium">
                              {player.streak}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 bg-white/5 hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlayer(player);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Player Detail Modal */}
        <Dialog
          open={selectedPlayer !== null}
          onOpenChange={() => setSelectedPlayer(null)}
        >
          <DialogContent
            className="backdrop-blur-md bg-black/80 border-white/10 overflow-auto"
            style={{ width: "40vw", maxWidth: "40vw", maxHeight: "65vh" }}
          >
            {selectedPlayer && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-white/20">
                      <AvatarImage src={selectedPlayer.avatar} />
                      <AvatarFallback>
                        {selectedPlayer.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        {getRankIcon(selectedPlayer.rank)}
                        <span className="text-xl font-bold">
                          {selectedPlayer.username}
                        </span>
                      </div>
                      <div className="text-white/60 text-sm">
                        {selectedPlayer.displayName}
                      </div>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Wallet Info */}
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Wallet Information
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Address:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-white/5 px-2 py-1 rounded font-mono">
                          {selectedPlayer.fullWalletAddress}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              selectedPlayer.fullWalletAddress,
                              selectedPlayer.id
                            )
                          }
                          className="h-8 w-8 p-0"
                        >
                          {copiedWallet === selectedPlayer.id ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-white/60 text-sm">
                        Total Predictions
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {selectedPlayer.totalPredictions}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-white/60 text-sm">Accuracy</div>
                      <div className="text-2xl font-bold text-green-400">
                        {selectedPlayer.accuracy}%
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-white/60 text-sm">
                        Total Earnings
                      </div>
                      <div className="text-2xl font-bold text-green-400">
                        {formatEarnings(selectedPlayer.totalEarnings)}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-white/60 text-sm">
                        Current Streak
                      </div>
                      <div className="text-2xl font-bold text-orange-400">
                        {selectedPlayer.streak}
                      </div>
                    </div>
                  </div>

                  {/* Advanced Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-white/60 text-sm">Avg. Return</div>
                      <div className="text-xl font-bold text-blue-400">
                        {selectedPlayer.avgReturn}%
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-white/60 text-sm">Risk Score</div>
                      <div className="text-xl font-bold text-yellow-400">
                        {selectedPlayer.riskScore}/5
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-white/60 text-sm">Member Since</div>
                      <div className="text-xl font-bold text-purple-400">
                        {formatDate(selectedPlayer.joinedDate)}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div>
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Achievements
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayer.badges.map((badge: string) => {
                        const config =
                          BADGE_CONFIG[badge as keyof typeof BADGE_CONFIG];
                        const IconComponent = config.icon;
                        return (
                          <TooltipProvider key={badge}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  className={cn(
                                    "bg-gradient-to-r text-white border-0 flex items-center gap-1",
                                    config.color
                                  )}
                                >
                                  <IconComponent className="h-3 w-3" />
                                  {config.label}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Earned for exceptional performance</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                    <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Recent Activity
                    </h3>
                    <div className="text-white/60 text-sm">
                      Last active: {selectedPlayer.recentActivity}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
