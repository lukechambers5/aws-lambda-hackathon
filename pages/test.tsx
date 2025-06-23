// pages/test.tsx
"use client";
import { useState } from "react";

export default function TestPage() {
  const [setNum, setSetNum] = useState("");
  const [condition, setCondition] = useState("new");
  const [result, setResult] = useState("");

  async function fetchPrice() {
    const res = await fetch("/api/check-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ set_num: setNum, condition, sell_method: "auction" }),
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🧱 LEGO Price Checker</h1>
      <input placeholder="Set Number" value={setNum} onChange={e => setSetNum(e.target.value)} />
      <select value={condition} onChange={e => setCondition(e.target.value)}>
        <option value="new">New</option>
        <option value="used">Used</option>
      </select>
      <button onClick={fetchPrice}>Check Price</button>
      <pre>{result}</pre>
    </main>
  );
}
