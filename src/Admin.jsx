import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function Admin() {
  /* 🔑 Read shop id from URL */
  const params = new URLSearchParams(window.location.search);
  const shopId = (params.get("shop") || "").toLowerCase();

  /* 🔒 ADMIN PROTECTION */
  useEffect(() => {
    const loggedIn = sessionStorage.getItem(`admin_${shopId}`);
    if (!loggedIn) {
      window.location.href = `/login?shop=${shopId}`;
    }
  }, [shopId]);

  const [menu, setMenu] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openAdminCats, setOpenAdminCats] = useState({});
  const [showTheme, setShowTheme] = useState(true);

  useEffect(() => {
    if (!shopId) {
      setError("❌ Shop ID missing in URL");
      return;
    }

    getDoc(doc(db, "menu", shopId)).then(snap => {
      if (snap.exists()) setMenu(snap.data());
      else setError(`❌ Shop "${shopId}" not found`);
    });
  }, [shopId]);

  if (error) return <p style={{ padding: 20 }}>{error}</p>;
  if (!menu) return <p style={{ padding: 20 }}>Loading admin panel…</p>;

  /* SAVE */
  const save = async () => {
    setSaving(true);
    await updateDoc(doc(db, "menu", shopId), menu);
    setSaving(false);
    alert("✅ Menu saved successfully");
  };

  /* CATEGORY ACTIONS */
  const addCategory = () => {
    setMenu({
      ...menu,
      categories: [
        ...menu.categories,
        {
          name: "New Category",
          image: "",          // ✅ CATEGORY IMAGE URL
          available: true,
          comment: "",
          items: []
        }
      ]
    });
  };

  const removeCategory = (i) => {
    const c = [...menu.categories];
    c.splice(i, 1);
    setMenu({ ...menu, categories: c });
  };

  /* ITEM ACTIONS */
  const addItem = (i) => {
    const c = [...menu.categories];
    c[i].items.push({
      name: "New Item",
      price: 0,
      quantity: "",
      description: "",
      image: "",            // ✅ ITEM IMAGE URL (kept)
      available: true
    });
    setMenu({ ...menu, categories: c });
  };

  const removeItem = (i, j) => {
    const c = [...menu.categories];
    c[i].items.splice(j, 1);
    setMenu({ ...menu, categories: c });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>🛠 Menu Editor — {shopId}</h2>
          <button style={styles.saveBtn} onClick={save}>
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>

        {/* SEARCH */}
        <div style={styles.card}>
          <input
            style={styles.input}
            placeholder="🔍 Search category or item..."
            value={search}
            onChange={e => setSearch(e.target.value.toLowerCase())}
          />
        </div>

        {/* SHOP DETAILS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🏪 Shop Details</h3>

          <label style={styles.label}>Shop Name</label>
          <input
            style={styles.input}
            value={menu.shopName}
            onChange={e => setMenu({ ...menu, shopName: e.target.value })}
          />

          <label style={styles.label}>Tagline</label>
          <input
            style={styles.input}
            value={menu.tagline}
            onChange={e => setMenu({ ...menu, tagline: e.target.value })}
          />

          <label style={styles.label}>Shop Logo (Image URL)</label>
          <input
            style={styles.input}
            value={menu.logo || ""}
            onChange={e => setMenu({ ...menu, logo: e.target.value })}
          />

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              checked={menu.isOpen}
              onChange={e => setMenu({ ...menu, isOpen: e.target.checked })}
            />
            {menu.isOpen ? "🟢 Shop Open" : "🔴 Shop Closed"}
          </label>
          <label style={styles.label}>Shop Closed Message</label>
<input
  style={styles.input}
  value={menu.theme.closedMessage || ""}
  onChange={e =>
    setMenu({
      ...menu,
      theme: {
        ...menu.theme,
        closedMessage: e.target.value
      }
    })
  }
/>
        </div>

        {/* THEME */}
        <div style={styles.card}>
          <h3
            style={{ ...styles.cardTitle, cursor: "pointer" }}
            onClick={() => setShowTheme(!showTheme)}
          >
            🎨 Menu Colors {showTheme ? "−" : "+"}
          </h3>

          {/* {showTheme &&
            Object.entries(menu.theme).map(([key, val]) => (
              <div key={key} style={styles.colorRow}>
                <span>{prettyColorName(key)}</span>
                <input
                  type="color"
                  value={val}
                  onChange={e =>
                    setMenu({
                      ...menu,
                      theme: { ...menu.theme, [key]: e.target.value }
                    })
                  }
                />
              </div>
            ))} */}
{showTheme &&
  Object.entries(menu.theme).map(([key, val]) => {
    const isHexOpen = openAdminCats[`hex_${key}`];

    return (
      <div key={key} style={{ marginBottom: 18 }}>

        {/* Label */}
        <label style={{ fontWeight: 700 }}>
          {prettyColorName(key)}
        </label>

        {/* Right-aligned controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 10,
            marginTop: 6
          }}
        >
          {/* 🎨 Color Picker */}
          <input
            type="color"
            value={val}
            onChange={e =>
              setMenu({
                ...menu,
                theme: { ...menu.theme, [key]: e.target.value }
              })
            }
            style={{
              width: 42,
              height: 32,
              border: "none",
              padding: 0
            }}
          />

          {/* 🔽 Toggle HEX input */}
          <button
            type="button"
            onClick={() =>
              setOpenAdminCats(p => ({
                ...p,
                [`hex_${key}`]: !p[`hex_${key}`]
              }))
            }
            style={{
              background: "#eee",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            {isHexOpen ? "Hide code" : "Edit code"}
          </button>
        </div>

        {/* 🔢 HEX INPUT (hidden by default) */}
        {isHexOpen && (
          <input
            type="text"
            placeholder="#ff9800"
            value={val}
            onChange={e =>
              setMenu({
                ...menu,
                theme: { ...menu.theme, [key]: e.target.value }
              })
            }
            style={{
              width: "100%",
              padding: 10,
              marginTop: 8,
              borderRadius: 8,
              border: "1px solid #ddd"
            }}
          />
        )}
      </div>
    );
  })}


        </div>

        {/* CATEGORIES */}
        {menu.categories
          .filter(cat =>
            cat.name.toLowerCase().includes(search) ||
            cat.items.some(item =>
              item.name.toLowerCase().includes(search)
            )
          )
          .map((cat, i) => (
            <div key={i} style={styles.categoryCard}>

              <h3
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setOpenAdminCats(p => ({ ...p, [i]: !p[i] }))
                }
              >
                {cat.name} {openAdminCats[i] ? "−" : "+"}
              </h3>

              {openAdminCats[i] && (
                <>
                  <label style={styles.label}>Category Name</label>
                  <input
                    style={styles.input}
                    value={cat.name}
                    onChange={e => {
                      const c = [...menu.categories];
                      c[i].name = e.target.value;
                      setMenu({ ...menu, categories: c });
                    }}
                  />

                  {/* ✅ CATEGORY IMAGE URL */}
                  <label style={styles.label}>Category Image (URL)</label>
                  <input
                    style={styles.input}
                    value={cat.image || ""}
                    onChange={e => {
                      const c = [...menu.categories];
                      c[i].image = e.target.value;
                      setMenu({ ...menu, categories: c });
                    }}
                  />

                  <label style={styles.label}>Category Notes (optional)</label>
                  <input
                    style={styles.input}
                    value={cat.comment || ""}
                    onChange={e => {
                      const c = [...menu.categories];
                      c[i].comment = e.target.value;
                      setMenu({ ...menu, categories: c });
                    }}
                  />

                  <label style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={cat.available}
                      onChange={e => {
                        const c = [...menu.categories];
                        c[i].available = e.target.checked;
                        setMenu({ ...menu, categories: c });
                      }}
                    />
                    {cat.available ? "👁 Visible" : "🚫 Hidden"}
                  </label>

                  <button style={styles.deleteBtn} onClick={() => removeCategory(i)}>
                    Delete Category
                  </button>

                  {/* ITEMS */}
                  {cat.items
                    .filter(item =>
                      item.name.toLowerCase().includes(search)
                    )
                    .map((item, j) => (
                      <div key={j} style={styles.itemCard}>

                        <label style={styles.label}>Item Name</label>
                        <input
                          style={styles.input}
                          value={item.name}
                          onChange={e => {
                            const c = [...menu.categories];
                            c[i].items[j].name = e.target.value;
                            setMenu({ ...menu, categories: c });
                          }}
                        />

                        <label style={styles.label}>Price</label>
                        <input
                          style={styles.input}
                          type="number"
                          value={item.price}
                          onChange={e => {
                            const c = [...menu.categories];
                            c[i].items[j].price = Number(e.target.value);
                            setMenu({ ...menu, categories: c });
                          }}
                        />

                        <label style={styles.label}>Quantity / Weight</label>
                        <input
                          style={styles.input}
                          value={item.quantity || ""}
                          onChange={e => {
                            const c = [...menu.categories];
                            c[i].items[j].quantity = e.target.value;
                            setMenu({ ...menu, categories: c });
                          }}
                        />

                        <label style={styles.label}>Description</label>
                        <input
                          style={styles.input}
                          value={item.description}
                          onChange={e => {
                            const c = [...menu.categories];
                            c[i].items[j].description = e.target.value;
                            setMenu({ ...menu, categories: c });
                          }}
                        />

                        {/* ✅ ITEM IMAGE URL */}
                        <label style={styles.label}>Item Image (URL)</label>
                        <input
                          style={styles.input}
                          value={item.image || ""}
                          onChange={e => {
                            const c = [...menu.categories];
                            c[i].items[j].image = e.target.value;
                            setMenu({ ...menu, categories: c });
                          }}
                        />

                        <label style={styles.checkbox}>
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={e => {
                              const c = [...menu.categories];
                              c[i].items[j].available = e.target.checked;
                              setMenu({ ...menu, categories: c });
                            }}
                          />
                          {item.available ? "👁 Show Item" : "🚫 Hide Item"}
                        </label>

                        <button
                          style={styles.deleteBtn}
                          onClick={() => removeItem(i, j)}
                        >
                          Remove Item
                        </button>
                      </div>
                    ))}

                  <button style={styles.addBtn} onClick={() => addItem(i)}>
                    ➕ Add Item
                  </button>
                </>
              )}
            </div>
          ))}

        <button style={styles.addBtn} onClick={addCategory}>
          ➕ Add Category
        </button>
      </div>
    </div>
  );
}

/* HELPERS */
function prettyColorName(key) {
  const map = {
    bg: "Background Color",
    // primary: "Highlight Color",
    text: "Text Color",
    cardBg: "Card Background",
    cardText: "Card Text",
    divider: "Divider Line",
    categoryDesc: "Category Description Color" ,// ✅ ADD THIS
    closedBg: "Shop Closed Background",
    closedText: "Shop Closed Text Color"
  };
  return map[key] || key;
}

/* STYLES */
const styles = {
  page: { background: "#f1f3f6", minHeight: "100vh", padding: 16 },
  container: { maxWidth: 1100, margin: "auto" },
  header: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  title: { fontSize: 26, fontWeight: 900 },
  saveBtn: { background: "#4caf50", color: "#fff", padding: "14px 22px", borderRadius: 12, border: "none", fontWeight: 800 },
  card: { background: "#fff", padding: 18, borderRadius: 16, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 800 },
  label: { fontWeight: 700, marginTop: 10, display: "block" },
  input: { width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginTop: 6 },
  checkbox: { display: "flex", gap: 10, alignItems: "center", marginTop: 12, fontWeight: 600 },
  categoryCard: { background: "#f8f9fb", padding: 16, borderRadius: 14, marginBottom: 20 },
  itemCard: { background: "#fff", padding: 14, borderRadius: 12, marginTop: 12 },
  addBtn: { background: "#1976d2", color: "#fff", padding: 12, width: "100%", borderRadius: 10, border: "none", fontWeight: 700, marginTop: 10 },
  deleteBtn: { background: "#ff5252", color: "#fff", padding: "8px 14px", borderRadius: 8, border: "none", fontWeight: 700, marginTop: 10 },
  colorRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, fontWeight: 600 }
};
