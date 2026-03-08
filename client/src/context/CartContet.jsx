import { createContext, useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState([])

    // Removed localStorage persistence as it cannot store File objects correctly.

    const addToCart = (item) => {
        const cartEntry = {
            ...item, cartItemId: Date.now() + Math.random().toString(36).substring(2, 9)
        };
        setCartItems((prev) => [...prev, cartEntry]);
        toast.success(`Added ${item.serviceName} to cart`)
    }

    const removeFromCart = (cartItemId) => {
        setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
        toast.success('Removed from cart');
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}