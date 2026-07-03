
export const AddToCartLogic = (prevCart, product) => {
  const qtyToAdd = product.qty && product.qty > 0 ? product.qty : 1;

  const matchIndex = prevCart.findIndex((item) =>
    product.id != null ? item.id === product.id : item.name === product.name
  );

  if (matchIndex !== -1) {
    // Already in cart — just bump the quantity, don't duplicate the row
    return prevCart.map((item, index) =>
      index === matchIndex ? { ...item, qty: item.qty + qtyToAdd } : item
    );
  }

  // Not in cart yet — add it as a new row with the given (or default) qty
  return [...prevCart, { ...product, qty: qtyToAdd }];
};

// Decreases a product's quantity by 1; removes it from the cart entirely
// once it would drop to 0.
export const DecreaseCartQtyLogic = (prevCart, product) => {
  const matchIndex = prevCart.findIndex((item) =>
    product.id != null ? item.id === product.id : item.name === product.name
  );

  if (matchIndex === -1) return prevCart;

  const currentQty = prevCart[matchIndex].qty;
  if (currentQty <= 1) {
    // Remove the item completely
    return prevCart.filter((_, index) => index !== matchIndex);
  }

  return prevCart.map((item, index) =>
    index === matchIndex ? { ...item, qty: item.qty - 1 } : item
  );
};

// Removes a product from the cart entirely, regardless of its quantity.
export const RemoveFromCartLogic = (prevCart, product) => {
  return prevCart.filter((item) =>
    product.id != null ? item.id !== product.id : item.name !== product.name
  );
};