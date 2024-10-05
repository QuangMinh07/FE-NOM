import { useState, useEffect, useContext } from "react";
import { api, typeHTTP } from "../../utils/api";
import { globalContext } from "../../context/globalContext";

export const useShopping = () => {
  const { globalData } = useContext(globalContext);
  const userId = globalData?.user?.id;

  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await api({
        method: typeHTTP.GET,
        url: `/cart/get-cart/${userId}`, // Lấy giỏ hàng của người dùng
        sendToken: true,
      });

      console.log("Dữ liệu trả về từ API:", data); // Log dữ liệu trả về từ API

      // Kiểm tra xem có giỏ hàng không
      if (data.cart && data.cart.items) {
        // Cập nhật orderItems với thông tin từ giỏ hàng
        const updatedOrderItems = data.cart.items.map((item) => {
          const food = item.food || {}; // Nếu không có food, sẽ gán là object rỗng

          return {
            quantity: item.quantity,
            price: item.price,
            foodName: food.foodName || "Tên món ăn không có", // Thay thế bằng tên mặc định nếu không có
            foodPrice: food.price || 0, // Thay thế bằng 0 nếu không có
          };
        }).filter(item => item.foodName !== "Tên món ăn không có"); // Lọc ra các item mà không có tên món ăn

        console.log("Thông tin giỏ hàng đã cập nhật:", updatedOrderItems); // Log thông tin giỏ hàng đã cập nhật

        setOrderItems(updatedOrderItems);
      } else {
        console.log("Không có giỏ hàng hoặc giỏ hàng rỗng."); // Log khi không có giỏ hàng
        setOrderItems([]); // Nếu không có giỏ hàng, set về mảng rỗng
      }

      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setLoading(false);
    }
  };

  const increaseQuantity = (itemId) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.food._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setOrderItems((prevItems) =>
      prevItems
        .map((item) =>
          item.food._id === itemId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.foodPrice * item.quantity, 0);
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  return {
    orderItems,
    loading,
    increaseQuantity,
    decreaseQuantity,
    calculateTotal,
  };
};
