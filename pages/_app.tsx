import "../styles/globals.css";
import "../styles/signin.css";
import type { AppProps } from "next/app";
import supabase from "../lib/supabaseClient";
import { Auth } from "@supabase/ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<any>();

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <Component {...pageProps} session={session} />;
}
