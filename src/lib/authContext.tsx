import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { getFirebaseAuth, isCloudSyncConfigured } from "./firebase";
import { startAutoSync, stopAutoSync } from "./sync";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  cloudSyncConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isCloudSyncConfigured);

  useEffect(() => {
    if (!isCloudSyncConfigured) {
      setLoading(false);
      return;
    }
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ onAuthStateChanged }, auth] = await Promise.all([import("firebase/auth"), getFirebaseAuth()]);
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);
        if (nextUser) {
          startAutoSync(nextUser.uid);
        } else {
          stopAutoSync();
        }
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  async function signInWithGoogle() {
    const [{ signInWithPopup, GoogleAuthProvider }, auth] = await Promise.all([
      import("firebase/auth"),
      getFirebaseAuth(),
    ]);
    await signInWithPopup(auth, new GoogleAuthProvider());
  }

  async function signOutUser() {
    const [{ signOut }, auth] = await Promise.all([import("firebase/auth"), getFirebaseAuth()]);
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, cloudSyncConfigured: isCloudSyncConfigured, signInWithGoogle, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
