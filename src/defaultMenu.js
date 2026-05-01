export const defaultMenu = (shopName) => ({
  shopName: shopName,
  tagline: "Fresh • Hot • Delicious",
  logo: "",
  isOpen: true,

  theme: {
    bg: "#0f0f0f",
    text: "#ffffff",
    primary: "#ff9800",
    cardBg: "#181818",
    cardText: "#ffffff",
    divider: "#333333"
  },

  categories: [
    {
      name: "Main Items",
      available: true,
      items: [
        {
          name: "Sample Item",
          price: 100,
          description: "Edit this item",
          image: "",
          available: true
        }
      ]
    }
  ]
});
