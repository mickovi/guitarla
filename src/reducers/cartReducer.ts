import { db } from "../data/db";
import { CartItem, Guitar, Sign } from "../types";

const MAX_STOCK = 5;

function initialCart() : CartItem[] {
  const localStorageCart = localStorage.getItem('cart');
  return localStorageCart ? JSON.parse(localStorageCart) : [];
}

export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitar } }
  | { type: "remove-from-cart"; payload: { id: Guitar["id"] } }
  | { type: "modify-quantity"; payload: { id: Guitar["id"], sign: Sign  } }
  | { type: "clear-cart" };

export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  let cart: CartItem[] = [];
  if (action.type === "add-to-cart") {
    const itemId = state.cart.findIndex(
      (item) => item.id === action.payload.item.id
    );
    if (itemId == -1) {
      const guitarItem: CartItem = { ...action.payload.item, quantity: 1 };
      cart = [...state.cart, guitarItem];
    }
    return {
      ...state,
      cart,
    };
  }
  if (action.type === "remove-from-cart") {
    const cart = state.cart.filter((item) => item.id !== action.payload.id);
    return {
      ...state,
      cart,
    };
  }
  if (action.type === "modify-quantity") {
    const updatedCart = state.cart.map((item) => {
      if (item.id === action.payload.id) {
        if (item.quantity < MAX_STOCK && action.payload.sign === Sign["+"]) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        if (item.quantity > 1 && action.payload.sign === Sign["-"]) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
      }
      return item;
    });
    return {
      ...state,
      cart: updatedCart
    };
  }
  if (action.type === "clear-cart") {
    return {
      ...state,
      cart: [],
    };
  }
  return state;
};
