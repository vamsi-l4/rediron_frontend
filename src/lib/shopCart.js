import API from "../components/Api";

const CART_ID_KEY = "cartId";

export const getStoredCartId = () => localStorage.getItem(CART_ID_KEY);

export const setStoredCartId = (cartId) => {
  if (!cartId) return;
  localStorage.setItem(CART_ID_KEY, String(cartId));
};

export const clearStoredCartId = () => {
  localStorage.removeItem(CART_ID_KEY);
};

export const fetchStoredCart = async () => {
  const cartId = getStoredCartId();
  if (!cartId) return null;

  try {
    const response = await API.get(`/api/shop-carts/${cartId}/`);
    return response.data;
  } catch (error) {
    if ([400, 401, 403, 404].includes(error.response?.status)) {
      clearStoredCartId();
      window.dispatchEvent(new Event("cartUpdated"));
    }
    throw error;
  }
};

export const getOrCreateCart = async () => {
  const existingCart = await fetchStoredCart().catch(() => null);
  if (existingCart?.id) return existingCart;

  const response = await API.post("/api/shop-carts/", {});
  setStoredCartId(response.data.id);
  return response.data;
};

export const getCartItemProductId = (item) => (
  item?.product?.id || item?.product_variant?.product?.id || null
);

export const getCartItemVariantId = (item) => (
  item?.product_variant?.id || null
);

export const addProductToCart = async ({ productId, productVariantId, quantity = 1 }) => {
  const payload = {
    product_id: productId,
    quantity,
  };
  if (productVariantId) {
    payload.product_variant_id = productVariantId;
  }

  const storedCartId = getStoredCartId();
  if (storedCartId) {
    payload.cart_id = Number(storedCartId);
  }

  const response = await API.post("/api/shop-cartitems/add/", payload);
  if (response.data?.cart?.id) {
    setStoredCartId(response.data.cart.id);
  }
  return response.data;
};
