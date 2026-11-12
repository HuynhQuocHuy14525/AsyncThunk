import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, fetchPosts, updatePost } from "../../slices/postsSlice";

// Bài 2: CRUD bài viết bằng createAsyncThunk (GET, POST, PUT, DELETE)
export default function PostsScreen() {
  const dispatch = useDispatch<any>();
  const { items, status, error, saving, deletingId } = useSelector((state: any) => state.posts);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchPosts());
  }, [status, dispatch]);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề");
      return;
    }
    if (editingId === null) {
      await dispatch(addPost({ title, body }));
    } else {
      await dispatch(updatePost({ id: editingId, title, body, userId: 1 }));
    }
    resetForm();
  };

  const startEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setBody(post.body);
  };

  const confirmDelete = (id: number) =>
    Alert.alert("Xóa bài viết", "Bạn chắc chắn muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => dispatch(deletePost(id)) },
    ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 CRUD Posts</Text>

      {/* Form thêm / sửa */}
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Tiêu đề" value={title} onChangeText={setTitle} />
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Nội dung"
          value={body}
          onChangeText={setBody}
          multiline
        />
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, saving && { opacity: 0.5 }]} disabled={saving} onPress={handleSubmit}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>{editingId === null ? "➕ Thêm" : "💾 Lưu"}</Text>
            )}
          </TouchableOpacity>
          {editingId !== null && (
            <TouchableOpacity style={[styles.btn, styles.gray]} onPress={resetForm}>
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {status === "loading" && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {status === "failed" && <Text style={{ color: "red" }}>Lỗi: {error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(p: any) => String(p.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
        renderItem={({ item }: { item: any }) => (
          <View style={[styles.card, editingId === item.id && styles.cardEditing]}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postBody} numberOfLines={2}>
              {item.body}
            </Text>
            <View style={styles.row}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={styles.edit}>Sửa</Text>
              </TouchableOpacity>
              {deletingId === item.id ? (
                <ActivityIndicator size="small" />
              ) : (
                <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                  <Text style={styles.delete}>Xóa</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  form: { gap: 8, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 10 },
  row: { flexDirection: "row", gap: 16, alignItems: "center" },
  btn: { backgroundColor: "#4f46e5", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  gray: { backgroundColor: "#64748b" },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: { padding: 12, borderRadius: 10, backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#e2e8f0", gap: 6 },
  cardEditing: { borderColor: "#4f46e5" },
  postTitle: { fontWeight: "700" },
  postBody: { color: "#475569" },
  edit: { color: "#2563eb", fontWeight: "600" },
  delete: { color: "#dc2626", fontWeight: "600" },
});
