import React, { useEffect, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

const CORRECT_PASSWORD = "Qzmp12345";
const STORAGE_KEY = "site_authenticated";

export const PasswordProtection = ({ onAuthenticated }: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = sessionStorage.getItem(STORAGE_KEY);
    if (isAuthenticated === "true") {
      onAuthenticated();
    }
  }, [onAuthenticated]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate loading for better UX
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        sessionStorage.setItem(STORAGE_KEY, "true");
        onAuthenticated();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-background">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline" size="sm" className="glass border-border/30 hover:border-primary/50 hover:bg-primary/10 backdrop-blur-sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
        <Card className="glass-card border border-border/20 p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-primary/20 blur-xl rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
              Welcome
            </h1>
            <p className="text-muted-foreground">
              This area is only for members. Enter your password to access the Internal Automation Market.
            </p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative group">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-12 bg-background/50 border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
              </div>
              {error && (
                <p className="text-destructive text-sm animate-fade-in">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-medium py-3 rounded-xl transition-all duration-300 shadow-glow hover:shadow-glow/80"
              disabled={isLoading || !password.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                "Access Market"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Secure member access to internal automation workflows
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};