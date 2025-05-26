import React from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SmartAlertsSystem from "@/components/alerts/smart-alerts-system";

export default function SmartAlertsPage() {
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
        <h1 className="text-3xl font-bold mb-4">{getText("accessDenied")}</h1>
        <p className="mb-8">{getText("pleaseLoginToAccessAlerts")}</p>
        <Button asChild>
          <Link href="/auth">{getText("login")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <SmartAlertsSystem />
    </div>
  );
}