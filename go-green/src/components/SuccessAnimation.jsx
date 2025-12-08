// src/components/SuccessAnimation.jsx
import React, { useEffect, useState } from "react";

export default function SuccessAnimation({ onDone, wordsCount = 0 }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      if (onDone) onDone();
    }, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", color: "white", zIndex: 9999
    }}>
      <div style={{ textAlign: "center", transform: "scale(1)", transition: "transform 0.3s" }}>
        <div style={{ fontSize: 36, fontWeight: "bold" }}>+{wordsCount} words</div>
        <div style={{ marginTop: 8 }}>Great! They are now in Known Words.</div>
      </div>
    </div>
  );
}
