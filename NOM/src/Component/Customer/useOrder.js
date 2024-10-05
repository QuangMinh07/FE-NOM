import { useState, useEffect, useContext } from "react";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

export const useOrder = (foodId) => {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { globalData, globalHandler } = useContext(globalContext);

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: `/food/get-food/${foodId}`,
          sendToken: true,
        });

        const food = response.food;
        setFoodData(food);
        setPrice(food.price);
        setQuantity(1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food data:", error);
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [foodId]);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    setPrice((prevPrice) => prevPrice + foodData.price);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      setPrice((prevPrice) => prevPrice - foodData.price);
    }
  };

  const addToCart = async () => {
    try {
      const userId = globalData.user?.id;
      const response = await api({
        method: typeHTTP.POST,
        url: `/cart/add-to-cart/${userId}`,
        body: { foodId: foodData._id, quantity },
        sendToken: true,
      });
      console.log("Added to cart:", response.message);

      // Cập nhật giỏ hàng với foodId và đảm bảo foodId được thêm vào từng món ăn
      const updatedCart = [...globalData.cart, { foodName: foodData._id, ...foodData, quantity }];
      await globalHandler.setCart(updatedCart);
      console.log("Cart saved to globalData:", updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return {
    quantity,
    price,
    foodData,
    loading,
    incrementQuantity,
    decrementQuantity,
    addToCart,
  };
};
