import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { defaultMenu } from "./defaultMenu";

export default function CreateShop() {
  const [shopId, setShopId] = useState("");
  const [shopName, setShopName] = useState("");
  const [creating, setCreating] = useState(false);

  const createShop = async () => {
    if (!shopId || !shopName) {
      alert("Enter shop ID and name");
      return;
    }

    setCreating(true);

    await setDoc(
      doc(db, "menu", shopId),
      defaultMenu(shopName)
    );

    setCreating(false);

    alert(
      `Shop created!\n\nMenu:\n/?shop=${shopId}\n\nAdmin:\n/admin?shop=${shopId}`
    );
  };

  return (
    <div style={styles.page}>
      <h2>🚀 Create New Shop</h2>

      <input
        style={styles.input}
        placeholder="Shop ID (eg: waffles)"
        value={shopId}
        onChange={e => setShopId(e.target.value.toLowerCase())}
      />

      <input
        style={styles.input}
        placeholder="Shop Name"
        value={shopName}
        onChange={e => setShopName(e.target.value)}
      />

      <button style={styles.btn} onClick={createShop}>
        {creating ? "Creating..." : "Create Shop"}
      </button>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 400,
    margin: "100px auto",
    padding: 20,
    fontFamily: "system-ui"
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #ccc"
  },
  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    background: "#1976d2",
    color: "#fff",
    fontWeight: 800,
    border: "none",
    cursor: "pointer"
  }
};
