import "../styles/globals.css";
import "../styles/signin.css";
import type { AppProps } from "next/app";
import supabase from "../lib/supabaseClient";
import { useEffect, useState } from "react";

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
