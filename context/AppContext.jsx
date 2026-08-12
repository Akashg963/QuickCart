'use client'

import { productsDummyData } from "@/assets/assets";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();

    const { user } = useUser();
    console.log("USER:", user);

    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [cartItems, setCartItems] = useState({});

    const fetchProductData = async () => {
  try {
    const { data } = await axios.get("/api/product/list");

    console.log("API Response:", data);

    if (data.success) {
      setProducts(data.data || data.products || []);
    } else {
      toast.error(data.message);
      setProducts([]);
    }
  } catch (error) {
    console.error(error);
    setProducts([]);
    toast.error(error.message);
  }
};

    const fetchUserData = async () => {
        try {

            console.log("USER:", user);

            const token = await getToken();

            console.log("TOKEN:", token);
            console.log("TOKEN LENGTH:", token?.length);

            if (user?.publicMetadata?.role === "seller") {
                setIsSeller(true);
            }

            const { data } = await axios.get("/api/user/data", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                setUserData(data.user);
                setCartItems(data.user.cartItems);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const addToCart = async (itemId) => {
        const cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        
        if (user) {
            try {
                const token = await getToken();
                await axios.post("/api/cart/update", { cartData }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Item added to cart!");
            } catch (error) {
                // console.error(error);
                // toast.error("Failed to add item to cart");
                console.log("Status:", error.response?.status);
                console.log("Response:", error.response?.data);
                console.error(error);

                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    const updateCartQuantity =  async (itemId, quantity) => {
        const cartData = structuredClone(cartItems);

        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);
        if (user) {
            try {
                const token = await getToken();
                await axios.post("/api/cart/update", { cartData }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Cart updated successfully!");
            } catch (error) {
                console.error(error);
                toast.error("Failed to update cart");
            }
        }
    };

    const getCartCount = () => {
        let total = 0;

        for (const id in cartItems) {
            total += cartItems[id];
        }

        return total;
    };

    const getCartAmount = () => {
        let total = 0;

        for (const id in cartItems) {
            const item = products.find((p) => p._id === id);

            if (item) {
                total += item.offerPrice * cartItems[id];
            }
        }

        return Math.floor(total * 100) / 100;
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const value = {
        user,
        getToken,
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        fetchUserData,
        products,
        fetchProductData,
        cartItems,
        setCartItems,
        addToCart,
        updateCartQuantity,
        getCartCount,
        getCartAmount,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};