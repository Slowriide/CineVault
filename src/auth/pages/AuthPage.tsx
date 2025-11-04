import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// Define the validation schema using Zod.
// Ensures that email has a valid format and password is at least 6 characters long.
const authSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer the TypeScript type from the Zod schema for better type safety in the form.
type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  // Extract authentication functions from context.
  const { signIn, signUp } = useAuth();

  // Local UI states:
  // - isLogin: toggles between login and signup mode
  // - isLoading: disables inputs and buttons while an async operation is running
  // - showPassword: toggles password visibility in the input field
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Initialize React Hook Form with Zod resolver for validation.
  const {
    register, // Registers input fields
    handleSubmit, // Handles form submission
    formState: { errors }, // Contains validation error messages
    reset, // Resets form fields when switching modes
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  // Handles both login and signup submissions.
  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    const email = data.email.trim();

    try {
      if (isLogin) {
        // Attempt to log in the user
        const { error } = await signIn(email, data.password);
        if (error) {
          toast.error(error.message || "Login failed");
        } else {
          toast.success("You have successfully logged in.");
          navigate("/"); // Redirect to home page after successful login
        }
      } else {
        // Attempt to register a new account
        const { error } = await signUp(email, data.password);
        if (error) {
          toast.error(error.message || "Registration failed");
        } else {
          toast.success("Please check your email to verify your account.");
        }
      }
    } catch (error) {
      // Catch any unexpected runtime or network errors
      toast.error("Something went wrong");
    } finally {
      // Always stop loading spinner after the process ends
      setIsLoading(false);
    }
  };

  // Switch between login and registration modes and reset form data
  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    // Full-screen centered layout with a subtle gradient background
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      {/* Card container for the authentication form */}
      <Card className="w-full max-w-md p-6">
        <CardHeader className="space-y-1">
          {/* Dynamic heading and description based on mode */}
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Welcome back" : "Create account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Sign in to your CinemaVault account"
              : "Join CinemaVault to discover amazing movies"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Main authentication form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email input field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={isLoading}
              />
              {/* Validation error message for email */}
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password input field with toggle visibility */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  disabled={isLoading}
                />
                {/* Button to show/hide password text */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {/* Validation error message for password */}
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button with spinner while loading */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle link between login and signup modes */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="link"
              onClick={toggleMode}
              disabled={isLoading}
              className="p-0 h-auto font-semibold"
            >
              {isLogin ? "Create one here" : "Sign in instead"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
