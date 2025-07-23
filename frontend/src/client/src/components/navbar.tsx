import { Link, useLocation } from "wouter";
import { Shield, Wallet, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { WalletModal } from "@/components/wallet-modal";

export function Navbar() {
  const [location] = useLocation();
  const [showWalletModal, setShowWalletModal] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/create", label: "Create Escrow" },
    { path: "/history", label: "History" },
  ];

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex-shrink-0 flex items-center group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-200 transition-all duration-300 group-hover:scale-105">
                  <Shield className="text-white w-5 h-5" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  Nescrow
                </span>
              </Link>
              <div className="hidden md:flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`font-semibold transition-all duration-200 relative ${
                      location === link.path
                        ? "text-purple-600"
                        : "text-gray-600 hover:text-purple-600"
                    }`}
                  >
                    {link.label}
                    {location === link.path && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowWalletModal(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-purple-200 transition-all duration-300 transform hover:scale-105"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-purple-50 hover:to-purple-100 border border-gray-200 hover:border-purple-200 transition-all duration-300">
                    <User className="w-5 h-5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 border border-purple-100 shadow-xl">
                  <DropdownMenuItem className="hover:bg-purple-50">Profile</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-purple-50">Settings</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-purple-50">Disconnect</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      <WalletModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </>
  );
}
