import { useQuery } from "@tanstack/react-query";
import { Shield, Coins, Check, TrendingUp, Eye } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock user address for demo
const MOCK_USER_ADDRESS = "4x7k9mN2pL8qR1sT3uV6wX9yZ0aB2cD4eF5gH6iJ7kL8";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/users", MOCK_USER_ADDRESS, "stats"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${MOCK_USER_ADDRESS}/stats`);
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: activeEscrows = [], isLoading: escrowsLoading, error: escrowsError } = useQuery({
    queryKey: ["/api/users", MOCK_USER_ADDRESS, "escrows", "active"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${MOCK_USER_ADDRESS}/escrows/active`);
      if (!response.ok) throw new Error("Failed to fetch active escrows");
      return response.json();
    },
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const getTypeBadge = (type: string) => {
    const config = {
      sports: { icon: "🏆", label: "Sports Bet", color: "bg-green-100 text-green-800" },
      marketplace: { icon: "🛒", label: "Marketplace", color: "bg-blue-100 text-blue-800" },
      freelance: { icon: "💻", label: "Freelance", color: "bg-purple-100 text-purple-800" },
    };
    const typeConfig = config[type as keyof typeof config] || { icon: "📄", label: "Custom", color: "bg-gray-100 text-gray-800" };
    return typeConfig;
  };

  const formatAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Monitor your active escrows and transaction performance
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Wallet Connected</p>
                  <p className="text-sm font-medium text-gray-900">4x7k...kL8</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Escrows"
          value={stats?.activeEscrows || 0}
          icon={Shield}
          iconColor="text-purple-primary"
          iconBgColor="bg-purple-primary bg-opacity-10"
        />
        <StatCard
          title="Total Volume"
          value={`${stats?.totalVolume || 0} SOL`}
          icon={Coins}
          iconColor="text-gold"
          iconBgColor="bg-gold bg-opacity-10"
        />
        <StatCard
          title="Completed"
          value={stats?.completed || 0}
          icon={Check}
          iconColor="text-green-500"
          iconBgColor="bg-green-500 bg-opacity-10"
        />
        <StatCard
          title="Success Rate"
          value={`${stats?.successRate || 0}%`}
          icon={TrendingUp}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-500 bg-opacity-10"
        />
      </div>

      {/* Active Escrows Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Escrows</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escrow ID</TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counterparty</TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {activeEscrows.map((escrow: any) => {
                const typeConfig = getTypeBadge(escrow.type);
                return (
                  <TableRow 
                    key={escrow.escrowId}
                    className="hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => setLocation(`/escrow/${escrow.escrowId}`)}
                  >
                    <TableCell className="font-medium text-purple-600">#{escrow.escrowId}</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                        <span className="mr-1">{typeConfig.icon}</span>
                        {typeConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 font-medium">{escrow.amount} SOL</TableCell>
                    <TableCell>
                      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(escrow.status)}`}>
                        {escrow.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">{formatAddress(escrow.counterpartyAddress)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        className="text-purple-primary hover:text-purple-secondary font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/escrow/${escrow.escrowId}`);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
    </div>
  );
}
