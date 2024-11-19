import { useState, useEffect, useContext } from "react";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

export const useOrder = (foodId, storeId) => {
  // Accept storeId as an argument
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { globalData, globalHandler } = useContext(globalContext);
  const [comboFoods, setComboFoods] = useState([]);

  useEffect(() => {
    const fetchFoodComBoData = async () => {
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: `/food/get-foodcombo/${foodId}`,
          sendToken: true,
        });

        const food = response.food;
        setFoodData(food);
        setPrice(food.price);
        setQuantity(1);
        setComboFoods(response.comboFoods || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food data:", error);
        setLoading(false);
      }
    };

    fetchFoodComBoData();
  }, [foodId]);

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

  const addToCart = async (userId, storeId, selectedCombos) => {
    try {
      const formattedCombos = selectedCombos.map((comboId) => ({ foodId: comboId })); // Định dạng combos

      console.log("Adding to cart:", {
        foodId: foodData._id,
        quantity,
        storeId,
        combos: formattedCombos,
      });

      const response = await api({
        method: typeHTTP.POST,
        url: `/cart/add-to-cart/${userId}`,
        body: {
          foodId: foodData._id,
          quantity,
          storeId,
          combos: formattedCombos, // Gửi combos đã định dạng
        },
        sendToken: true,
      });

      console.log("Added to cart:", response.message); // Log phản hồi sau khi thêm vào giỏ hàng

      const updatedCart = Array.isArray(globalData.cart) ? [...globalData.cart, { foodName: foodData.foodName, ...foodData, quantity, combos: formattedCombos }] : [{ foodName: foodData.foodName, ...foodData, quantity, combos: formattedCombos }];
      await globalHandler.setCart(updatedCart);
      console.log("Cart saved to globalData:", updatedCart); // Log cart sau khi cập nhật
    } catch (error) {
      console.error("Error adding to cart:", error); // Log lỗi
    }
  };

  return {
    quantity,
    price,
    foodData,
    comboFoods, // Add combo foods
    loading,
    incrementQuantity,
    decrementQuantity,
    addToCart,
  };
};
