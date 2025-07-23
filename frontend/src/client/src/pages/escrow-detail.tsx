import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Clock, 
  User, 
  DollarSign, 
  FileText, 
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EscrowDetail() {
  const { escrowId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: escrow, isLoading } = useQuery({
    queryKey: ["/api/escrows", escrowId],
    queryFn: async () => {
      const response = await fetch(`/api/escrows/${escrowId}`);
      if (!response.ok) throw new Error("Failed to fetch escrow details");
      return response.json();
    },
    enabled: !!escrowId,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/escrows", escrowId, "transactions"],
    queryFn: async () => {
      const response = await fetch(`/api/escrows/${escrowId}/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
    enabled: !!escrowId,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied successfully.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "disputed":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      active: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      disputed: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getTypeBadge = (type: string) => {
    const config = {
      sports_betting: { icon: "🏆", label: "Sports Betting", color: "bg-blue-100 text-blue-800" },
      marketplace: { icon: "🛒", label: "Marketplace", color: "bg-green-100 text-green-800" },
      freelance: { icon: "💻", label: "Freelance", color: "bg-purple-100 text-purple-800" },
      custom: { icon: "📄", label: "Custom", color: "bg-gray-100 text-gray-800" },
    };
    return config[type as keyof typeof config] || config.custom;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Escrow Not Found</h1>
            <p className="text-gray-600 mb-6">The escrow you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const typeConfig = getTypeBadge(escrow.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Escrow #{escrow.id}
              </h1>
              <p className="text-gray-600 mt-2">Created on {new Date(escrow.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(escrow.status)}
              <Badge className={`${getStatusBadge(escrow.status)} font-medium`}>
                {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Escrow Details */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span>Escrow Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Type</h4>
                    <Badge className={`${typeConfig.color} font-medium`}>
                      <span className="mr-2">{typeConfig.icon}</span>
                      {typeConfig.label}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Amount</h4>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-lg font-bold text-gray-900">{escrow.amount} SOL</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Participants</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Creator</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          {escrow.creatorAddress.slice(0, 8)}...{escrow.creatorAddress.slice(-6)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(escrow.creatorAddress)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Counterparty</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          {escrow.counterpartyAddress.slice(0, 8)}...{escrow.counterpartyAddress.slice(-6)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(escrow.counterpartyAddress)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {escrow.description && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Description</span>
                      </h4>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                        {escrow.description}
                      </p>
                    </div>
                  </>
                )}

                {escrow.releaseConditions && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Release Conditions</h4>
                      <p className="text-gray-700 leading-relaxed bg-amber-50 p-4 rounded-lg border border-amber-200">
                        {escrow.releaseConditions}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{transaction.type}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusBadge(transaction.status)}>
                            {transaction.status}
                          </Badge>
                          {transaction.txHash && (
                            <Button size="sm" variant="outline" asChild>
                              <a 
                                href={`https://explorer.solana.com/tx/${transaction.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {escrow.status === "pending" && (
                  <>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Release Funds
                    </Button>
                    <Button variant="destructive" className="w-full">
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Escrow
                    </Button>
                  </>
                )}
                
                {escrow.status === "active" && (
                  <>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Raise Dispute
                    </Button>
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Contact Counterparty
                    </Button>
                  </>
                )}

                <Button variant="outline" className="w-full" onClick={() => setLocation("/dashboard")}>
                  Back to Dashboard
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">{new Date(escrow.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <Badge className={getStatusBadge(escrow.status)}>
                    {escrow.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-green-600">{escrow.amount} SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{typeConfig.label}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}