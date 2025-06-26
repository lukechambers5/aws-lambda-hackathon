"use client";
import { useState } from "react";

export default function TestPage() {
  const [setNum, setSetNum] = useState("");
  const [condition, setCondition] = useState("new");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  async function fetchPrice() {
    setError("");
    setData(null);

    const res = await fetch("/api/check-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ set_num: setNum, condition }),
    });

    const result = await res.json();
    if (!res.ok) {
      setError(result.error || "Something went wrong");
    } else {
      setData(result.data || result);
    }
  }

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAFAFA",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", textAlign: "center" }}>
        LEGO Price Checker
      </h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          background: "#ffffff",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "600px"
        }}
      >
        <input
          placeholder="Set Number"
          value={setNum}
          onChange={e => setSetNum(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #D1D5DB",
            flex: "1"
          }}
        />
        <select
          value={condition}
          onChange={e => setCondition(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #D1D5DB"
          }}
        >
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
        <button
          onClick={fetchPrice}
          style={{
            background: "#4F46E5",
            color: "#fff",
            padding: "0.75rem 1.25rem",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          🔍 Check Price
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div
          style={{
            background: "#F3F4F6",
            border: "1px solid #D1D5DB",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            maxWidth: "600px",
            width: "100%"
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            {data.name} ({data.set_num})
          </h2>
          <p>Year: <strong>{data.year}</strong></p>
          <p>Condition: <strong>{data.condition}</strong></p>
          <p>Latest Price: <strong>${data.price_samples?.[0]?.value}</strong></p>
          <p>As of: <strong>{data.price_samples?.[0]?.date}</strong></p>
        </div>
      )}
    </main>
  );
}
