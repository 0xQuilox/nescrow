import { Link } from "wouter";
import { Shield, Bolt, Users, Trophy, ShoppingCart, Laptop, Handshake, Home, Cog, Star, TrendingUp, Lock, Zap, DollarSign, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "Trustless Security",
      description: "Smart contracts eliminate the need for trusted intermediaries. Your funds are secured by cryptographic proofs.",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      icon: Bolt,
      title: "Lightning Fast",
      description: "Built on Solana for sub-second transaction finality and minimal fees. No waiting for confirmations.",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Users,
      title: "Multi-Purpose",
      description: "Sports betting, marketplace sales, freelance payments, and more. One platform for all escrow needs.",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  const stats = [
    { icon: DollarSign, value: "$2.5M+", label: "Total Volume" },
    { icon: TrendingUp, value: "10K+", label: "Active Users" },
    { icon: CheckCircle, value: "99.9%", label: "Success Rate" },
    { icon: Zap, value: "<1s", label: "Settlement Time" },
  ];

  const useCases = [
    {
      icon: Trophy,
      title: "Sports Betting",
      description: "Peer-to-peer sports wagers with automated payouts based on verified results.",
      color: "bg-green-500",
    },
    {
      icon: ShoppingCart,
      title: "Marketplace",
      description: "Secure transactions between buyers and sellers with dispute resolution.",
      color: "bg-blue-500",
    },
    {
      icon: Laptop,
      title: "Freelance",
      description: "Milestone-based payments for freelance work with automatic release.",
      color: "bg-purple-primary",
    },
    {
      icon: Handshake,
      title: "P2P Trading",
      description: "Safe peer-to-peer trading of digital assets and NFTs.",
      color: "bg-red-500",
    },
    {
      icon: Home,
      title: "Real Estate",
      description: "Property transactions with conditional releases based on inspections.",
      color: "bg-yellow-500",
    },
    {
      icon: Cog,
      title: "Custom",
      description: "Create custom escrow contracts with your own conditions and terms.",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-300"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 opacity-10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-gold bg-opacity-20 text-gold border-gold border-opacity-30 px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Built on Solana Blockchain
            </Badge>

            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Secure <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Escrow</span>
              <br />
              <span className="text-3xl md:text-6xl">Made Simple</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Trust-minimized escrow contracts for sports betting, marketplace transactions, and freelance payments. Lightning-fast settlements with minimal fees.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/create">
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-4 text-lg font-bold transition-all transform hover:scale-105 shadow-2xl">
                  <Shield className="w-5 h-5 mr-2" />
                  Create Escrow
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="glass-effect text-white border-white border-opacity-30 px-8 py-4 text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all transform hover:scale-105">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="glass-effect rounded-2xl p-6 text-center">
                  <stat.icon className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-purple-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-blue-50 opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 10,000+ Users
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Why Choose Nescrow?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of secure, transparent, and lightning-fast escrow transactions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover bg-white border-2 border-gray-100 hover:border-purple-200 shadow-lg hover:shadow-2xl overflow-hidden">
                <CardContent className="p-8 relative">
                  {/* Background gradient */}
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="text-white w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                  
                  {/* Decorative element */}
                  <div className="absolute bottom-4 right-4 opacity-10">
                    <feature.icon className="w-12 h-12 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="py-24 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold opacity-5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 opacity-5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gold bg-opacity-20 text-gold border-gold border-opacity-30 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Multiple Use Cases
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Escrow for <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Everything</span>
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              From sports betting to freelance payments, secure any transaction with our flexible escrow system
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="card-hover bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
                <CardContent className="p-8 relative overflow-hidden">
                  {/* Gradient overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold to-transparent opacity-10 rounded-full -mr-16 -mt-16"></div>
                  
                  <div className={`w-14 h-14 ${useCase.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <useCase.icon className="text-white w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{useCase.title}</h3>
                  <p className="text-purple-100 leading-relaxed">{useCase.description}</p>
                  
                  {/* Learn more link */}
                  <div className="mt-4 flex items-center text-gold hover:text-yellow-300 transition-colors cursor-pointer">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-xl text-purple-100 mb-8">
                Join thousands of users already using Nescrow for secure transactions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-4 text-lg font-bold transition-all transform hover:scale-105">
                    <Shield className="w-5 h-5 mr-2" />
                    Start Your First Escrow
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="glass-effect text-white border-white border-opacity-30 px-8 py-4 text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Explore Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
