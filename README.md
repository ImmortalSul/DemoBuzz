# 🚀 CoinBuzz - Web3 Business Management Platform

A comprehensive Web3 business management platform built with Next.js, featuring live cryptocurrency price tracking, prediction markets, leaderboards, and Solana wallet integration.

## ✨ Features

### 🏠 **Landing Page**

- Modern glassmorphic design with animated backgrounds
- Floating navigation bar
- Hero section with gradient text effects
- Direct navigation to dashboard

### 📊 **Live Price Dashboard**

- Real-time SOL and BONK price tracking
- Multiple API integrations (Birdeye API + CoinGecko fallback)
- Interactive price charts with Recharts
- Mock data generation keeping SOL near $200
- Transaction history (successful & failed)
- Automatic price updates every 5 seconds
- Wallet connection required

### 🎯 **Prediction Dashboard**

- Make price predictions on SOL, BONK, ETH, BTC
- Track active predictions with confidence levels
- Prediction accuracy charts
- Stake tracking and potential winnings
- Recent prediction results
- Glassmorphic design matching main dashboard

### 🏆 **Leaderboard**

- Top 3 podium display
- Full rankings table with player profiles
- Player detail modals (40% viewport width)
- Search and filter functionality
- Badge system and performance metrics
- Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Wallet**: Solana Wallet Adapter
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd mono
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

```env
# Optional: Birdeye API Key for live price data
NEXT_PUBLIC_BIRDEYE_API_KEY=your_birdeye_api_key_here

# If no API key is provided, the app will use CoinGecko API (free) or mock data
```

4. **Run the development server**

```bash
pnpm dev
# or
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### ESLint & TypeScript

The project is configured to ignore all linting and TypeScript errors during development:

- **ESLint**: All rules disabled in `eslint.config.mjs`
- **TypeScript**: Build errors ignored in `next.config.ts`
- **Hydration**: React Strict Mode disabled

### API Configuration

The dashboard supports multiple API sources with automatic fallbacks:

1. **Birdeye API** (Primary) - Requires API key
2. **CoinGecko API** (Fallback) - Free, no API key needed
3. **Mock Data** (Final fallback) - Always available

## 📁 Important Code Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── dashboard/
│   │   └── page.tsx            # Live price dashboard
│   ├── prediction-dashboard/
│   │   └── page.tsx            # Prediction markets
│   └── leaderboard/
│       └── page.tsx            # Player leaderboard
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── layout/
│   │   └── floating-navbar.tsx  # Navigation component
│   ├── landing/
│   │   ├── landing-feature.tsx  # Main landing component
│   │   └── components/
│   │       ├── Hero.tsx         # Hero section with CTA
│   │       ├── Background.tsx   # Animated backgrounds
│   │       └── VideoModal.tsx   # Modal component
│   └── solana/
│       └── custom-wallet-button.tsx # Wallet connection
│
├── lib/                         # Utility functions
└── schemas/                     # Type definitions
```

## 🚀 Usage

### 1. **Landing Page**

- Visit the homepage to see the modern landing interface
- Click "Go to Dashboard" to navigate to the price dashboard
- Use "Connect Wallet" in the navbar for Solana wallet integration

### 2. **Price Dashboard**

- **Wallet Required**: Connect your Solana wallet to access
- **Live Prices**: View real-time SOL and BONK prices
- **Charts**: Interactive 24-hour price charts
- **Transactions**: Mock transaction history display
- **Auto-Updates**: Prices refresh every 5 seconds

### 3. **Prediction Dashboard**

- **Active Predictions**: View current price predictions
- **Make Predictions**: Click buttons to predict SOL, BONK, ETH, BTC prices
- **Analytics**: Track prediction accuracy over time
- **Stats**: Monitor total staked, potential winnings, win rate

### 4. **Leaderboard**

- **Rankings**: View top players and full leaderboard
- **Player Details**: Click any player to view detailed profile modal
- **Search**: Filter players by name or performance metrics

## 🔗 API Integration

### Price Data Sources

```typescript
// Primary: Birdeye API
const TOKENS = {
  SOL: "So11111111111111111111111111111111111111112",
  BONK: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
};

// Fallback: CoinGecko API
const COINGECKO_IDS = {
  SOL: "solana",
  BONK: "bonk",
};
```

### API Call Strategy

1. Try Birdeye API endpoints with API key
2. Fallback to CoinGecko API (free, no key required)
3. Use mock data if all APIs fail
4. Alternating calls every 5 seconds to avoid rate limiting

## 🎨 Design Features

### Glassmorphic Design

- Backdrop blur effects on all cards
- Transparent backgrounds with subtle borders
- Consistent `bg-white/[0.01] border-white/10` styling

### Animations

- Framer Motion for smooth transitions
- Animated gradient backgrounds
- Hover effects and micro-interactions
- Staggered component animations

### Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Adaptive typography and spacing

## 🔧 Development Notes

### Mock Data

- SOL prices kept near $200 for realistic testing
- BONK prices around $0.00003
- Transaction history with realistic timestamps
- Prediction data with varying confidence levels

### Performance Optimizations

- Efficient API polling with cleanup
- Optimized chart rendering
- Lazy loading where appropriate
- Minimal bundle size with tree shaking

## 🚨 Troubleshooting

### Common Issues

1. **Wallet Connection Issues**

   - Ensure you have a Solana wallet installed (Phantom, Solflare, etc.)
   - Check browser wallet permissions

2. **API Rate Limiting**

   - App automatically handles rate limits with fallbacks
   - CoinGecko API is used if Birdeye fails

3. **Build Errors**
   - ESLint and TypeScript errors are suppressed
   - Check `next.config.ts` for build configuration

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.
