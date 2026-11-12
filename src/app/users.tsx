import { useEffect } from "react";
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, selectUsers, selectUsersError, selectUsersStatus } from "../../slices/usersSlice";

// Bài 1: Lấy danh sách người dùng từ API bằng createAsyncThunk (pending / fulfilled / rejected)
export default function UsersScreen() {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);

  useEffect(() => {
    if (status === "idle") dispatch(fetchUsers() as any);
  }, [status, dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Người dùng ({users.length})</Text>

      {status === "loading" && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Đang tải người dùng...</Text>
        </View>
      )}

      {status === "failed" && (
        <View style={styles.center}>
          <Text style={{ color: "red" }}>Lỗi: {error}</Text>
          <Button title="Thử lại" onPress={() => dispatch(fetchUsers() as any)} />
        </View>
      )}

      {status === "succeeded" && (
        <FlatList
          data={users}
          keyExtractor={(u: any) => String(u.id)}
          refreshing={false}
          onRefresh={() => dispatch(fetchUsers() as any)}
          contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
          renderItem={({ item }: { item: any }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.info}>@{item.username} · {item.email}</Text>
              <Text style={styles.info}>📞 {item.phone}</Text>
              <Text style={styles.info}>🏢 {item.company?.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  center: { alignItems: "center", gap: 8, marginTop: 20 },
  card: { padding: 12, borderRadius: 10, backgroundColor: "#f1f5f9" },
  name: { fontSize: 16, fontWeight: "700" },
  info: { color: "#475569", marginTop: 2 },
});
