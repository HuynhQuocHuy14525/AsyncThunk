import { useEffect } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from "../../slices/cartSlice";
import { fetchProducts } from "../../slices/productsSlice";

export default function HomeScreen() {
  const dispatch = useDispatch();

  // Giỏ hàng
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);

  // Sản phẩm (từ thunk)
  const products = useSelector((state: any) => state.products.items);
  const status = useSelector((state: any) => state.products.status);
  const error = useSelector((state: any) => state.products.error);

  // Gọi "API" 1 lần khi mở màn hình
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts() as any);
    }
  }, [status, dispatch]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ hàng ({cartCount})</Text>

      {/* ===== DANH SÁCH SẢN PHẨM ===== */}
      <Text style={styles.heading}>Sản phẩm</Text>

      {/* pending */}
      {status === "loading" && (
        <View>
          <ActivityIndicator size="large" />
          <Text>Đang tải sản phẩm...</Text>
        </View>
      )}

      {/* rejected */}
      {status === "failed" && (
        <View>
          <Text style={{ color: "red" }}>Lỗi: {error}</Text>
          <Button title="Thử lại" onPress={() => dispatch(fetchProducts() as any)} />
        </View>
      )}

      {/* fulfilled */}
      {status === "succeeded" &&
        products.map((p: any) => (
          <View key={p.id} style={styles.row}>
            <Text>{p.name}: ${p.price}</Text>
            <Button title="Thêm" onPress={() => dispatch(addToCart(p))} />
          </View>
        ))}

      {/* ===== GIỎ HÀNG ===== */}
      <Text style={styles.heading}>Trong giỏ</Text>
      {cartItems.length === 0 ? (
        <Text>Giỏ hàng trống</Text>
      ) : (
        <View>
          {cartItems.map((item: any) => (
            <View key={item.id} style={styles.row}>
              <Text>{item.name}</Text>
              <Button title="-" onPress={() => dispatch(decreaseQuantity(item.id))} />
              <Text>{item.quantity}</Text>
              <Button title="+" onPress={() => dispatch(increaseQuantity(item.id))} />
              <Text>${item.price * item.quantity}</Text>
              <Button
                title="Xóa"
                color="red"
                onPress={() => dispatch(removeFromCart(item.id))}
              />
            </View>
          ))}
          <Text style={styles.total}>Tổng tiền: ${total}</Text>
          <Button title="Xóa tất cả" onPress={() => dispatch(clearCart())} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 50, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold" },
  heading: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  total: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
});