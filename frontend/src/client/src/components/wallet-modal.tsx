import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronRight, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const wallets = [
    {
      name: "Phantom",
      description: "Most popular Solana wallet",
      color: "bg-gradient-to-r from-purple-600 to-purple-700",
      popular: true,
    },
    {
      name: "Solflare",
      description: "Secure web-based wallet",
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
      popular: false,
    },
    {
      name: "Slope",
      description: "Mobile-first wallet",
      color: "bg-gradient-to-r from-green-600 to-green-700",
      popular: false,
    },
  ];

  const handleWalletConnect = (walletName: string) => {
    console.log(`Connecting to ${walletName}...`);
    // Mock wallet connection
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border-0">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600 mt-2">
            Choose your preferred Solana wallet to start creating secure escrows
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-6">
          {wallets.map((wallet) => (
            <div key={wallet.name} className="relative">
              {wallet.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-gold-400 to-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  Popular
                </div>
              )}
              <Button
                variant="outline"
                className="w-full flex items-center justify-between p-5 h-auto border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group rounded-2xl"
                onClick={() => handleWalletConnect(wallet.name)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 ${wallet.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <Wallet className="text-white w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-lg text-gray-900">{wallet.name}</p>
                    <p className="text-sm text-gray-600">{wallet.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors duration-300" />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex justify-center pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            New to Solana wallets?{" "}
            <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
              Learn more about wallet security
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
