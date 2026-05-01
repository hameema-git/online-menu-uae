import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import Footer from "./Footer";

export default function Menu() {
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState("");
  const [openCats, setOpenCats] = useState({});

  // 🔹 Read shop id from URL
  const params = new URLSearchParams(window.location.search);
  const shopId = (params.get("shop") || "shop").toLowerCase();

  useEffect(() => {
    const ref = doc(db, "menu", shopId);

    const unsub = onSnapshot(
      ref,
      snap => {
        if (snap.exists()) {
          setMenu(snap.data());
          setError("");
        } else {
          setMenu(null);
          setError("Shop not found");
        }
      },
      err => setError(err.message)
    );

    return () => unsub();
  }, [shopId]);

  if (error) {
    return (
      <div style={styles.center}>
        <h2>❌ {error}</h2>
      </div>
    );
  }

  if (!menu) {
    return <p style={{ padding: 20 }}>Loading menu…</p>;
  }

  const {
    shopName,
    tagline,
    logo,
    isOpen,
    theme = {},
    categories = []
  } = menu;

  /* THEME FALLBACKS */
  const colors = {
    bg: theme.bg || "#0f0f0f",
    text: theme.text || "#ffffff",
    primary: theme.primary || "#ff9800",
    cardBg: theme.cardBg || "#1a1a1a",
    cardText: theme.cardText || "#ffffff",
    divider: theme.divider || "rgba(255,255,255,0.2)",
    categoryDesc: theme.categoryDesc || "rgba(255,255,255,0.75)" ,// ✅ NEW
    closedBg: theme.closedBg || "#c59a9a",
    closedText: theme.closedText || "#D73535",
   closedMessage: theme.closedMessage || "Shop Closed" // ✅ NEW
  };

  const toggleCategory = (i) => {
    setOpenCats(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.text }}>

      {/* HEADER */}
      <header style={styles.header}>
        {logo && <img src={logo} alt="logo" style={styles.logo} />}

        <h1 style={{ color: colors.primary }}>{shopName}</h1>
        <p style={{ opacity: 0.85 }}>{tagline}</p>

        {/* {!isOpen && (
          <div style={styles.closed}>
            🚫 Shop Closed
          </div>
        )} */}

        {!isOpen && (
  <div
    style={{
      ...styles.closed,
      background: colors.closedBg,
      color: colors.closedText
    }}
  >
    🚫 {colors.closedMessage}
  </div>
)}

      </header>

      {/* MENU */}
      <main style={styles.main}>
        {categories
          .filter(cat => cat.available)
          .map((cat, i) => {
            const isOpenCat = openCats[i] ?? false;

            return (
              <section key={i} style={styles.category}>

                {/* CATEGORY HEADER */}
                {/* <button
                  onClick={() => toggleCategory(i)}
                  style={{
                    ...styles.categoryHeader,
                    borderBottom: `1px solid ${colors.divider}`
                  }}
                >
                  <span>{cat.name}</span>
                  <span>{isOpenCat ? "−" : "+"}</span>
                </button> */}

                <button
  onClick={() => toggleCategory(i)}
  style={{
    ...styles.categoryHeader,
    borderBottom: `1px solid ${colors.divider}`
  }}
>
  <div style={styles.categoryTitle}>
    {cat.image && (
      <img
        src={cat.image}
        alt={cat.name}
        style={styles.categoryIcon}
      />
    )}
    <span>{cat.name}</span>
  </div>

  <span>{isOpenCat ? "−" : "+"}</span>
</button>


                {/* CATEGORY IMAGE (optional, stand-alone) */}
                {/* {isOpenCat && cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={styles.categoryImg}
                  />
                )} */}

                {/* CATEGORY DESCRIPTION (stand-alone) */}
                {isOpenCat && cat.comment && (
                //   <div style={styles.categoryDesc}>
                //     {cat.comment}
                //   </div>
                <div
  style={{
    ...styles.categoryDesc,
    color: colors.categoryDesc
  }}
>
  {cat.comment}
</div>

                )}

                {/* ITEMS */}
                {isOpenCat && (
                  <div style={styles.grid}>
                    {cat.items
                      .filter(item => item.available)
                      .map((item, j) => (
                        <div
                          key={j}
                          style={{
                            ...styles.card,
                            background: colors.cardBg,
                            color: colors.cardText
                          }}
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={styles.itemImg}
                            />
                          )}

                          <div style={{ flex: 1 }}>
                            <div style={styles.row}>
                              <strong>{item.name}</strong>
                              <strong>₹{item.price}</strong>
                            </div>

                            {item.quantity && (
                              <div style={styles.qty}>
                                {item.quantity}
                              </div>
                            )}

                            {item.description && (
                              <p style={styles.desc}>
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            );
          })}
      </main>

      <Footer />
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  center: {
    padding: 40,
    textAlign: "center"
  },
  header: {
    textAlign: "center",
    padding: "28px 16px"
  },
  logo: {
    width: 120,
    height: 120,
    objectFit: "contain",
    marginBottom: 10
  },
  closed: {
    marginTop: 10,
    padding: "8px 14px",
    background: "#c59a9aff",
    borderRadius: 8,
    color: "#D73535",
    display: "inline-block",
    fontWeight: 700
  },
  main: {
    maxWidth: 1400,
    margin: "auto",
    padding: "20px 16px"
  },
  category: {
    marginBottom: 40
  },
  categoryHeader: {
    width: "100%",
    background: "transparent",
    color: "inherit",
    border: "none",
    padding: "10px 0",
    fontSize: 22,
    fontWeight: 800,
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer"
  },
  categoryImg: {
    width: "100%",
    maxHeight: 220,
    objectFit: "cover",
    borderRadius: 16,
    marginTop: 14
  },
  categoryDesc: {
    marginTop: 12,
    marginBottom: 16,
    fontSize: 15,
    opacity: 0.85,
    lineHeight: 1.6,
    maxWidth: 900
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
    marginTop: 20
  },
  card: {
    padding: 18,
    borderRadius: 18,
    display: "flex",
    gap: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
  },
  itemImg: {
    width: 96,
    height: 96,
    borderRadius: 14,
    objectFit: "cover",
    flexShrink: 0
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 16,
    fontWeight: 700
  },
  qty: {
    fontSize: 13,
    opacity: 0.85,
    marginTop: 4
  },
  desc: {
    fontSize: 14,
    opacity: 0.85,
    marginTop: 6,
    lineHeight: 1.4
  },
  categoryTitle: {
  display: "flex",
  alignItems: "center",
  gap: 12
},
categoryIcon: {
  width: 36,
  height: 36,
  borderRadius: 8,
  objectFit: "cover",
  flexShrink: 0
},

};
