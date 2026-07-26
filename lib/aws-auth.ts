/**
 * AWS Cognito Auth Client — Artispreneur EPK Builder
 * Uses the artispreneur-agent Cognito pool
 * Pool: us-east-1_VyKGNlV9r | Client: 6dfqmemi0kvha7u3vbu2rq8n4h
 */
"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ── Cognito config (safe to expose — public pool) ─────────────────────────────
export const COGNITO_CONFIG = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL_ID || "us-east-1_VyKGNlV9r",
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "6dfqmemi0kvha7u3vbu2rq8n4h",
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CognitoUser {
  sub: string;
  email: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  username?: string;
  accessToken?: string;
  idToken?: string;
}

export interface AuthState {
  user: CognitoUser | null;
  loading: boolean;
  error: string | null;
}

// ── Amplify lazy loader (avoids SSR issues) ───────────────────────────────────
let amplifyConfigured = false;

async function getAmplify() {
  if (typeof window === "undefined") return null;
  const { Amplify } = await import("aws-amplify");
  const { signIn, signOut, signUp, confirmSignUp, getCurrentUser, fetchAuthSession, resetPassword, confirmResetPassword } = await import("aws-amplify/auth");

  if (!amplifyConfigured) {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: COGNITO_CONFIG.userPoolId,
          userPoolClientId: COGNITO_CONFIG.clientId,
          loginWith: { email: true },
        },
      },
    });
    amplifyConfigured = true;
  }

  return { signIn, signOut, signUp, confirmSignUp, getCurrentUser, fetchAuthSession, resetPassword, confirmResetPassword };
}

// ── Auth helpers ──────────────────────────────────────────────────────────────
export async function authSignIn(email: string, password: string) {
  const amp = await getAmplify();
  if (!amp) throw new Error("Auth not available");
  const result = await amp.signIn({ username: email, password });
  return result;
}

export async function authSignUp(email: string, password: string, name?: string) {
  const amp = await getAmplify();
  if (!amp) throw new Error("Auth not available");
  return amp.signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        ...(name ? { name } : {}),
      },
    },
  });
}

export async function authConfirmSignUp(email: string, code: string) {
  const amp = await getAmplify();
  if (!amp) throw new Error("Auth not available");
  return amp.confirmSignUp({ username: email, confirmationCode: code });
}

export async function authSignOut() {
  const amp = await getAmplify();
  if (!amp) return;
  return amp.signOut();
}

export async function authGetCurrentUser(): Promise<CognitoUser | null> {
  try {
    const amp = await getAmplify();
    if (!amp) return null;
    const user = await amp.getCurrentUser();
    const session = await amp.fetchAuthSession();
    const idToken = session.tokens?.idToken;
    const accessToken = session.tokens?.accessToken;

    const payload = idToken?.payload as Record<string, unknown> | undefined;

    return {
      sub: user.userId,
      email: (payload?.email as string) || user.username,
      email_verified: (payload?.email_verified as boolean) || false,
      given_name: payload?.given_name as string,
      family_name: payload?.family_name as string,
      name: (payload?.name as string) || user.username,
      username: user.username,
      accessToken: accessToken?.toString(),
      idToken: idToken?.toString(),
    };
  } catch {
    return null;
  }
}

export async function authResetPassword(email: string) {
  const amp = await getAmplify();
  if (!amp) throw new Error("Auth not available");
  return amp.resetPassword({ username: email });
}

export async function authConfirmResetPassword(email: string, code: string, newPassword: string) {
  const amp = await getAmplify();
  if (!amp) throw new Error("Auth not available");
  return amp.confirmResetPassword({ username: email, confirmationCode: code, newPassword });
}

// ── React Context ─────────────────────────────────────────────────────────────
import React from "react";

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<{ nextStep: { signUpStep: string } }>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  const refresh = useCallback(async () => {
    const user = await authGetCurrentUser();
    setState({ user, loading: false, error: null });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const signIn = async (email: string, password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      await authSignIn(email, password);
      await refresh();
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e instanceof Error ? e.message : "Sign in failed" }));
      throw e;
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const result = await authSignUp(email, password, name);
      setState(s => ({ ...s, loading: false }));
      return result as { nextStep: { signUpStep: string } };
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e instanceof Error ? e.message : "Sign up failed" }));
      throw e;
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      await authConfirmSignUp(email, code);
      setState(s => ({ ...s, loading: false }));
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e instanceof Error ? e.message : "Confirmation failed" }));
      throw e;
    }
  };

  const signOut = async () => {
    await authSignOut();
    setState({ user: null, loading: false, error: null });
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { ...state, signIn, signUp, confirmSignUp, signOut, refresh } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
