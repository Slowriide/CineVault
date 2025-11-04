import { supabase } from "@/integrations/supabase/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Define the shape of the authentication context.
// It includes the session and user data, as well as methods for authentication actions.
type AuthContextType = {
  session: Session | null; // Current Supabase session (null if logged out)
  user: User | null; // Current authenticated user (null if none)
  loading: boolean; // Indicates whether authentication state is still being resolved
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

// Create the authentication context.
// It will be provided at the top level (usually in App.tsx or a layout).
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the currently active session on initial load.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Subscribe to authentication state changes (login, logout, refresh, etc.)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Cleanup: unsubscribe from session listener when component unmounts.
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Register a new user with email and password.
  // If Supabase indicates that the user already exists, return a custom error.
  const signUp = async (email: string, password: string) => {
    email = email.trim();
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error };
    }

    if (!data.user) {
      // This can happen if the email is already registered.
      return { error: new Error("This email is already registered") };
    }

    return { error: null };
  };

  // Sign in an existing user using email and password.
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // Log out the current user.
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    // Provide authentication state and methods to the rest of the app.
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        signUp,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily access the authentication context.
// Throws an error if used outside of an AuthProvider.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
