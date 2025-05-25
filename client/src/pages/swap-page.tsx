import React from "react";
import { useLanguage } from "@/contexts/language-context";
import TokenSwap from "@/components/swap/token-swap";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SwapPage() {
  const { getText } = useLanguage();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">{getText("walletAccessDenied")}</h1>
        <p className="mb-8">{getText("pleaseLoginToAccessWallet")}</p>
        <Button asChild>
          <Link href="/auth">{getText("login")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{getText("swapTokens")}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1">
          <TokenSwap />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-muted rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold">{getText("swapGuide")}</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li>{getText("swapGuideStep1")}</li>
              <li>{getText("swapGuideStep2")}</li>
              <li>{getText("swapGuideStep3")}</li>
              <li>{getText("swapGuideStep4")}</li>
            </ul>
            
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg mt-6">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-100">{getText("swapWarningTitle")}</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-200">{getText("swapWarningText")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}