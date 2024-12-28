import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { Guitar, CartItem } from "../types";

export const useCart = () => {

  function initialCart() : CartItem[] {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_STOCK = 5;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(guitar : Guitar) {
    const itemId = cart.findIndex((item) => item.id === guitar.id);
    if (itemId == -1) {
      const guitarItem : CartItem = {...guitar, quantity: 1}
      setCart([...cart, guitarItem]);
    }/*  else {
      const updateCart = [...cart];
      updateCart[itemId].quantity++;
      setCart(updateCart);
    } */
  }

  function removeFromCart(id : Guitar['id']) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  function modifyQuantity(id : Guitar['id'], sign : string) {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        if (item.quantity < MAX_STOCK && sign === "+") {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        if (item.quantity > 1 && sign === "-") {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
      }
      return item;
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  // Derivated state (cart)
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    modifyQuantity,
    clearCart,
    isEmpty,
    cartTotal
  }
}