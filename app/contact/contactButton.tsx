"use client";

import { useState } from "react";

export default function ContactButton() {
  const [label, setLabel] = useState("Get Phone Number");
  const phone = "+8801420696969"; // replace with your number

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setLabel("Copied!");
      setTimeout(() => setLabel("Get Phone Number"), 1400);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = phone;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setLabel("Copied!"); } catch {}
      document.body.removeChild(ta);
      setTimeout(() => setLabel("Get Phone Number"), 1400);
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
}
