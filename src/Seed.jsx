import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { menuSeed } from "./menuSeed";

export default function Seed() {
  const seed = async () => {
    await setDoc(doc(db, "menu", "shop"), menuSeed);
    alert("Menu seeded successfully!");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Seed Menu</h2>
      <button onClick={seed}>Seed Firestore Menu</button>
    </div>
  );
}
