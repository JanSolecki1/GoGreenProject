// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        nav("/login");
        return;
      }
      setAllowed(true);
      setLoading(false);
    }
    check();
  }, [nav]);

  if (loading) return <div style={{ padding: 20 }}>Checking session...</div>;

  return allowed ? children : null;
}
