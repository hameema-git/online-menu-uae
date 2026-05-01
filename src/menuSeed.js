export const menuSeed = {
  shopName: "WAFFLES",
  tagline: "Fresh • Hot • Delicious",
  isOpen: true,
  logo: "",
  adminPassword: "menu@123",
  theme: {
    bg: "#0f0f0f",
    primary: "#ff9800",
    text: "#ffffff"
  },
  categories: [
    {
      name: "Waffles",
      available: true,
      items: [
        {
          name: "Classic Waffle",
          price: 80,
          available: true,
          description: "Crispy outside, soft inside",
          image: ""
        },
        {
          name: "Chocolate Waffle",
          price: 100,
          available: true,
          description: "Rich chocolate drizzle",
          image: ""
        }
      ]
    },
    {
      name: "Drinks",
      available: true,
      items: [
        {
          name: "Cold Coffee",
          price: 70,
          available: true,
          description: "Chilled & creamy",
          image: ""
        }
      ]
    }
  ]
};
