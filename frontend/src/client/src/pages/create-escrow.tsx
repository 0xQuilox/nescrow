import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trophy, ShoppingCart, Laptop, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/ui/loading-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EscrowTypeCard } from "@/components/escrow-type-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const createEscrowSchema = z.object({
  escrowId: z.string()
    .min(5, "Escrow ID must be at least 5 characters")
    .max(20, "Escrow ID must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Escrow ID can only contain letters, numbers, hyphens, and underscores"),
  type: z.enum(["sports", "marketplace", "freelance"], {
    required_error: "Please select an escrow type"
  }),
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, "Amount must be a positive number")
    .refine((val) => {
      const num = parseFloat(val);
      return num <= 1000000;
    }, "Amount cannot exceed 1,000,000 SOL"),
  creatorAddress: z.string()
    .min(32, "Creator address must be a valid Solana address")
    .max(44, "Creator address must be a valid Solana address"),
  counterpartyAddress: z.string()
    .min(32, "Counterparty address must be a valid Solana address")
    .max(44, "Counterparty address must be a valid Solana address"),
  releaseConditions: z.string()
    .max(1000, "Release conditions must be less than 1000 characters")
    .optional(),
  eventDate: z.string().optional(),
});

type CreateEscrowForm = z.infer<typeof createEscrowSchema>;

export default function CreateEscrow() {
  const [selectedType, setSelectedType] = useState<"sports" | "marketplace" | "freelance">("sports");
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateEscrowForm>({
    resolver: zodResolver(createEscrowSchema),
    defaultValues: {
      type: "sports",
      creatorAddress: "4x7k9mN2pL8qR1sT3uV6wX9yZ0aB2cD4eF5gH6iJ7kL8",
    },
  });

  const createEscrowMutation = useMutation({
    mutationFn: async (data: CreateEscrowForm) => {
      const response = await apiRequest("POST", "/api/escrows", {
        ...data,
        releaseConditions: data.releaseConditions ? JSON.stringify({ conditions: data.releaseConditions }) : undefined,
        eventDate: data.eventDate ? new Date(data.eventDate).toISOString() : null,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Escrow Created Successfully! 🎉",
        description: `Escrow #${data.escrowId} has been created and is pending blockchain confirmation.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      
      // Redirect to the newly created escrow detail page
      setTimeout(() => {
        setLocation(`/escrow/${data.escrowId}`);
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create escrow",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateEscrowForm) => {
    createEscrowMutation.mutate(data);
  };

  const escrowTypes = [
    {
      id: "sports",
      title: "Sports Betting",
      description: "Peer-to-peer sports wagers with automated payouts",
      icon: Trophy,
      iconColor: "bg-purple-primary",
    },
    {
      id: "marketplace",
      title: "Marketplace",
      description: "Secure buyer-seller transactions with protection",
      icon: ShoppingCart,
      iconColor: "bg-blue-500",
    },
    {
      id: "freelance",
      title: "Freelance",
      description: "Milestone-based payments for freelance work",
      icon: Laptop,
      iconColor: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Create New Escrow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Set up a secure, trustless escrow contract for your transaction in just a few simple steps
          </p>
        </div>

      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${step >= 1 ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200' : 'bg-gray-200 text-gray-600'} rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300`}>1</div>
                <span className={`ml-3 text-lg font-semibold ${step >= 1 ? 'text-purple-600' : 'text-gray-500'}`}>Choose Type</span>
              </div>
              <div className={`w-20 h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <div className={`w-12 h-12 ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200' : 'bg-gray-200 text-gray-600'} rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300`}>2</div>
                <span className={`ml-3 text-lg font-semibold ${step >= 2 ? 'text-purple-600' : 'text-gray-500'}`}>Set Terms</span>
              </div>
              <div className={`w-20 h-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <div className={`w-12 h-12 ${step >= 3 ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200' : 'bg-gray-200 text-gray-600'} rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-300`}>3</div>
                <span className={`ml-3 text-lg font-semibold ${step >= 3 ? 'text-purple-600' : 'text-gray-500'}`}>Review</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <>
              <CardTitle className="text-xl font-semibold text-gray-900 mb-4">Select Escrow Type</CardTitle>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {escrowTypes.map((type) => (
                  <EscrowTypeCard
                    key={type.id}
                    title={type.title}
                    description={type.description}
                    icon={type.icon}
                    iconColor={type.iconColor}
                    isSelected={selectedType === type.id}
                    onClick={() => {
                      setSelectedType(type.id as any);
                      form.setValue("type", type.id as any);
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  className="gradient-purple text-white"
                  disabled={!selectedType}
                >
                  Next Step
                </Button>
              </div>
            </>
          )}

          {step === 2 && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {selectedType === "sports" && "Sports Betting Details"}
                {selectedType === "marketplace" && "Marketplace Transaction Details"}
                {selectedType === "freelance" && "Freelance Project Details"}
              </CardTitle>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="escrowId">Escrow ID</Label>
                  <Input
                    id="escrowId"
                    {...form.register("escrowId")}
                    placeholder="ESC004"
                  />
                  {form.formState.errors.escrowId && (
                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.escrowId.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder={
                      selectedType === "sports"
                        ? "Lakers vs Warriors - Game 5"
                        : selectedType === "marketplace"
                        ? "Rare NFT Purchase"
                        : "Website Development Project"
                    }
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="amount">Amount (SOL)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.1"
                    {...form.register("amount")}
                    placeholder="10"
                  />
                  {form.formState.errors.amount && (
                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="counterpartyAddress">Counterparty Address</Label>
                  <Input
                    id="counterpartyAddress"
                    {...form.register("counterpartyAddress")}
                    placeholder="Enter Solana wallet address"
                  />
                  {form.formState.errors.counterpartyAddress && (
                    <p className="text-red-600 text-sm mt-1">{form.formState.errors.counterpartyAddress.message}</p>
                  )}
                </div>

                {selectedType === "sports" && (
                  <div>
                    <Label htmlFor="eventDate">Event Date</Label>
                    <Input
                      id="eventDate"
                      type="datetime-local"
                      {...form.register("eventDate")}
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Additional details about the escrow..."
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="releaseConditions">Release Conditions</Label>
                  <Textarea
                    id="releaseConditions"
                    {...form.register("releaseConditions")}
                    placeholder="Describe the conditions for releasing funds..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <div className="space-x-4">
                  <Button type="button" variant="outline">
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-purple text-white"
                    disabled={createEscrowMutation.isPending}
                  >
                    {createEscrowMutation.isPending ? "Creating..." : "Create Escrow"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
