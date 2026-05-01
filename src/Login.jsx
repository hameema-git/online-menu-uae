import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function Login() {
  const params = new URLSearchParams(window.location.search);
  const shopId = (params.get("shop") || "").toLowerCase();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const snap = await getDoc(doc(db, "menu", shopId));
      if (!snap.exists()) {
        setError("Shop not found");
        setLoading(false);
        return;
      }

      const data = snap.data();

      if (password === data.adminPassword) {
        sessionStorage.setItem(`admin_${shopId}`, "true");
        window.location.href = `/admin?shop=${shopId}`;
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={login}>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.shop}>{shopId}</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="password"
          placeholder="Enter admin password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button style={styles.button} disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f3f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    background: "#fff",
    padding: 26,
    borderRadius: 14,
    width: "100%",
    maxWidth: 340,
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
  },
  title: { fontWeight: 800, marginBottom: 4 },
  shop: { opacity: 0.6, marginBottom: 16 },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginBottom: 14
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 700
  },
  error: {
    color: "#d32f2f",
    fontWeight: 600,
    marginBottom: 10
  }
};
