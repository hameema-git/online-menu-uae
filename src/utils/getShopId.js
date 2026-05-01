export function getShopId() {
  if (typeof window === "undefined") return "shop";
  const params = new URLSearchParams(window.location.search);
  return params.get("shop") || "shop";
}
