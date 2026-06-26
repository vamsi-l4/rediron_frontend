import API from "../components/Api";

export const extractList = (data) => data?.results || data || [];

export const getCurrentWishlist = async () => {
  const response = await API.get("/api/shop-wishlists/");
  return extractList(response.data)[0] || null;
};

export const getOrCreateWishlist = async () => {
  const existing = await getCurrentWishlist().catch(() => null);
  if (existing?.id) return existing;
  const response = await API.post("/api/shop-wishlists/", {});
  return response.data;
};

export const fetchWishlistItems = async (wishlistId, productId) => {
  if (!wishlistId) return [];
  const params = productId ? `?wishlist=${wishlistId}&product=${productId}` : `?wishlist=${wishlistId}`;
  const response = await API.get(`/api/shop-wishlistitems/${params}`);
  return extractList(response.data);
};

export const addProductToWishlist = async (productId) => {
  const response = await API.post("/api/shop-wishlistitems/add/", { product_id: productId });
  return response.data;
};
