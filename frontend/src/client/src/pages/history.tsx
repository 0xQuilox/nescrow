import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";

// Mock user address for demo
const MOCK_USER_ADDRESS = "4x7k9mN2pL8qR1sT3uV6wX9yZ0aB2cD4eF5gH6iJ7kL8";

export default function TransactionHistory() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/users", MOCK_USER_ADDRESS, "transactions"],
    queryFn: async () => {
      const response = await fetch(`/api/users/${MOCK_USER_ADDRESS}/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
  });

  // Mock additional transaction data for demo
  const mockTransactions = [
    {
      id: 1,
      createdAt: "2024-01-15T20:00:00Z",
      escrowId: "ESC042",
      type: "release",
      amount: "25.0",
      status: "completed",
      transactionHash: "5KJhG9mN2pL8qR1sT3uV6wX9yZ0aB2cD4eF5gH6iJ7kL8",
      escrow: {
        type: "sports",
        title: "Lakers vs Warriors",
        counterpartyAddress: "8xN3...4kL9",
      },
      result: "Won",
    },
    {
      id: 2,
      createdAt: "2024-01-12T16:45:00Z",
      escrowId: "ESC041",
      type: "release",
      amount: "150.0",
      status: "completed",
      transactionHash: "7yZ0aB2cD4eF5gH6iJ7kL8nM1pQ3rS4tU5vW6xY9zA8b",
      escrow: {
        type: "marketplace",
        title: "Rare NFT Purchase",
        counterpartyAddress: "2mR7...8xK1",
      },
      result: "Released",
    },
    {
      id: 3,
      createdAt: "2024-01-08T12:30:00Z",
      escrowId: "ESC040",
      type: "release",
      amount: "40.0",
      status: "completed",
      transactionHash: "3mN4pQ5rS6tU7vW8xY9zA0bC1dE2fG3hI4jK5lM6nN7p",
      escrow: {
        type: "sports",
        title: "NFL Championship",
        counterpartyAddress: "4x7k...9mN2",
      },
      result: "Lost",
    },
    {
      id: 4,
      createdAt: "2024-01-05T09:15:00Z",
      escrowId: "ESC039",
      type: "release",
      amount: "200.0",
      status: "completed",
      transactionHash: "9kL2mN3pQ4rS1tU2vW5xY8zA0bC1dE2fG3hI4jK5lM6n",
      escrow: {
        type: "freelance",
        title: "Website Development",
        counterpartyAddress: "9kL2...3xN8",
      },
      result: "Released",
    },
  ];

  const getStatusBadge = (result: string) => {
    const variants = {
      Won: "bg-green-100 text-green-800",
      Released: "bg-green-100 text-green-800",
      Lost: "bg-red-100 text-red-800",
      Cancelled: "bg-gray-100 text-gray-800",
      Disputed: "bg-yellow-100 text-yellow-800",
    };
    return variants[result as keyof typeof variants] || "bg-gray-100 text-gray-800";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter transactions based on search and filter criteria  
  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = searchTerm === "" || 
      transaction.escrow.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.escrowId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.escrow.counterpartyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toString().includes(searchTerm);

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.escrow.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Transaction History
          </h1>
          <p className="text-xl text-gray-600">
            View all your completed and cancelled escrow transactions with detailed insights
          </p>
        </div>

      {/* Filters */}
      <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex flex-wrap gap-6">
            <div className="min-w-48">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sports">Sports Betting</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-48">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-48">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Filter by Date</Label>
              <Input
                type="date"
                className="h-12 border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
              />
            </div>

            <div className="flex-1 min-w-64">
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">Search Transactions</Label>
              <Input
                placeholder="Search by ID, address, or counterparty..."
                className="h-12 border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-100">
                <TableHead className="text-sm font-bold text-gray-700 uppercase tracking-wider py-6 px-6">Date</TableHead>
                <TableHead className="text-sm font-bold text-gray-700 uppercase tracking-wider py-6 px-6">Escrow ID</TableHead>
                <TableHead className="text-sm font-bold text-gray-700 uppercase tracking-wider py-6 px-6">Type</TableHead>
                <TableHead className="text-sm font-bold text-gray-700 uppercase tracking-wider py-6 px-6">Amount</TableHead>
                <TableHead className="text-sm font-bold text-gray-700 uppercase tracking-wider py-6 px-6">Counterparty</TableHead>
                <TableHead className="text-sm font-bold text-gray-700 uppercase tracking-wider py-6 px-6">Status</TableHead>
                <TableHead className="text-sm font-bold text-gray-700 uppercase tracking-wider py-6 px-6">Transaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {paginatedTransactions.map((transaction) => {
                const typeConfig = getTypeBadge(transaction.escrow.type);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-900">
                      #{transaction.escrowId}
                    </TableCell>
                    <TableCell>
                      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                        <span className="mr-1">{typeConfig.icon}</span>
                        {typeConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {transaction.amount} SOL
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {transaction.escrow.counterpartyAddress}
                    </TableCell>
                    <TableCell>
                      <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(transaction.result)}`}>
                        {transaction.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-primary hover:text-purple-secondary font-medium"
                        onClick={() => window.open(`https://explorer.solana.com/tx/${transaction.transactionHash}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Tx
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredTransactions.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of{" "}
                  <span className="font-medium">{filteredTransactions.length}</span> transactions
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex items-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
