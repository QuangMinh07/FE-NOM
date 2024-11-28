import { useState, useEffect, useContext } from "react";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

export const useOrder = (foodId, storeId) => {
  // Accept storeId as an argument
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0); // Giá gốc
  const [discountedPrice, setDiscountedPrice] = useState(null); // Giá giảm  const [foodData, setFoodData] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { globalData, globalHandler } = useContext(globalContext);
  const [comboFoods, setComboFoods] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);

  useEffect(() => {
    const fetchFoodComBoData = async () => {
      try {
        const response = await api({
          method: typeHTTP.GET,
          url: `/food/get-foodcombo/${foodId}`,
          sendToken: true,
        });

        const { food, combos } = response;

        // Cập nhật dữ liệu món chính
        setFoodData(food);
        setPrice(food.price); // Giá gốc
        setDiscountedPrice(food.isDiscounted ? food.discountedPrice : null); // Giá giảm nếu có

        // Cập nhật nhóm combo
        const formattedCombos = combos.map((combo) => ({
          groupName: combo.groupName, // Tên nhóm combo
          foods: combo.foods.map((food) => ({
            ...food,
            price: food.price, // Giá gốc
            discountedPrice: food.isDiscounted ? food.discountedPrice : null, // Giá giảm nếu có
          })),
        }));
        setComboFoods(formattedCombos);

        setQuantity(1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food and combo data:", error);
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
        setPrice(food.price); // Lấy giá gốc
        setDiscountedPrice(food.isDiscounted ? food.discountedPrice : null); // Lấy giá giảm nếu có        setQuantity(1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food data:", error);
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [foodId]);

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;

      // Đồng bộ hóa số lượng trong `selectedCombos`
      setSelectedCombos((prevSelectedCombos) =>
        prevSelectedCombos.map((combo) => ({
          ...combo,
          quantity: newQuantity, // Đồng bộ số lượng món combo với số lượng chính
        }))
      );

      return newQuantity;
    });

    setPrice((prevPrice) => prevPrice + foodData.price);

    if (foodData.discountedPrice) {
      setDiscountedPrice((prevDiscountedPrice) => prevDiscountedPrice + foodData.discountedPrice);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity - 1;

        setSelectedCombos((prevSelectedCombos) => {
          if (prevSelectedCombos.length === 0) {
            console.log("No combos to decrement.");
            return prevSelectedCombos;
          }

          const updatedCombos = prevSelectedCombos.map((combo) => ({
            ...combo,
            quantity: newQuantity,
          }));

          console.log("Decrementing quantity:");
          console.log("Main quantity:", newQuantity);
          console.log("Updated Combos:", updatedCombos);

          return updatedCombos;
        });

        return newQuantity;
      });

      setPrice((prevPrice) => prevPrice - foodData.price);

      if (foodData.discountedPrice) {
        setDiscountedPrice((prevDiscountedPrice) => prevDiscountedPrice - foodData.discountedPrice);
      }
    }
  };

  const addToCart = async (userId, storeId, selectedCombos) => {
    try {
      // Đồng bộ hóa số lượng trong combos trước khi gửi đi
      const syncedCombos = selectedCombos.map((combo) => ({
        ...combo,
        quantity: quantity, // Đồng bộ với số lượng món chính
      }));

      // Định dạng combos
      const formattedCombos = syncedCombos.map((combo) => ({
        foodId: combo.foodId,
        quantity: combo.quantity, // Số lượng món trong combo
      }));

      // Log từng combo và so sánh với số lượng món chính
      console.log("Formatted Combos with Quantities2:");
      formattedCombos.forEach((combo) => {
        console.log(`Combo Food ID: ${combo.foodId}, Quantity: ${combo.quantity}, Matches Main Quantity: ${combo.quantity === quantity}`);
      });

      console.log("Adding to cart:", {
        foodId: foodData._id,
        quantity,
        storeId,
        combos: formattedCombos,
      });

      // Gọi API để thêm vào giỏ hàng
      const response = await api({
        method: typeHTTP.POST,
        url: `/cart/add-to-cart/${userId}`,
        body: {
          foodId: foodData._id,
          quantity,
          storeId,
          combos: formattedCombos,
        },
        sendToken: true,
      });

      console.log("Added to cart:", response.message); // Log phản hồi sau khi thêm vào giỏ hàng

      // Kiểm tra giá giảm nếu có
      const mainFoodPrice = foodData.discountedPrice || foodData.price;

      // Cập nhật giá cho từng combo
      const updatedCombos = formattedCombos.map((combo) => {
        const comboFood = comboFoods.flatMap((group) => group.foods).find((food) => food._id === combo.foodId);

        if (!comboFood) {
          console.warn("Combo food not found:", combo.foodId); // Cảnh báo nếu combo không tồn tại
          return {
            ...combo,
            price: 0,
            foodName: "Unknown",
            discountedPrice: null,
            isDiscounted: false,
          };
        }

        const comboPrice = comboFood.discountedPrice || comboFood.price || 0;
        return {
          ...combo,
          price: comboPrice,
          foodName: comboFood.foodName || "Unknown",
          discountedPrice: comboFood.discountedPrice || null,
          isDiscounted: comboFood.isDiscounted || false,
        };
      });

      const updatedCartItem = {
        foodName: foodData.foodName,
        ...foodData,
        quantity,
        price: mainFoodPrice * quantity,
        originalPrice: foodData.price, // Lưu giá gốc
        discountedPrice: foodData.discountedPrice || null, // Lưu giá giảm
        combos: {
          foods: updatedCombos,
          totalPrice: updatedCombos.reduce((acc, combo) => acc + combo.price, 0),
        },
      };

      // Cập nhật giỏ hàng vào globalData
      const updatedCart = Array.isArray(globalData.cart) ? [...globalData.cart, updatedCartItem] : [updatedCartItem];
      await globalHandler.setCart(updatedCart);
      console.log("Cart saved to globalData:", updatedCart); // Log cart sau khi cập nhật
    } catch (error) {
      console.error("Error adding to cart:", error); // Log lỗi
    }
  };

  return {
    quantity,
    price,
    discountedPrice,
    foodData,
    comboFoods, // Add combo foods
    loading,
    incrementQuantity,
    decrementQuantity,
    addToCart,
  };
};
