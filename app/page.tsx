"use client";
 
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
 
// ── Supabase client ──────────────────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
 
// ── Types ────────────────────────────────────────────────────────────────────
interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  size: string;
  link: string;
  image: string;
  category: string;
}
 
interface TravelPack {
  id: string;
  name: string;
  destination: string;
  date: string;
  item_ids: string[];
}
 
// ── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["Tops", "Sweaters", "Bottoms", "Outerwear", "Footwear", "Accessories", "Other"];
const BOTTOMS_SUBCATEGORIES = ["Shorts", "Skirts", "Pants"];
const ALL_LEAF_CATEGORIES = ["Tops", "Sweaters", "Shorts", "Skirts", "Pants", "Outerwear", "Footwear", "Accessories", "Other"];
 
const CATEGORY_EMOJI: Record<string, string> = {
  Tops: "👕", Sweaters: "🧶", Bottoms: "👖",
  Pants: "👖", Shorts: "🩳", Skirts: "👗",
  Outerwear: "🧥", Footwear: "👟", Accessories: "🕶️", Other: "📦",
};
 
// ── Styles (defined outside component so they don't re-create each render) ───
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", backgroundColor: "#f9f8f6", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: "#1a1a1a" },
  header: { backgroundColor: "#ffffff", borderBottom: "1px solid #e8e5e0", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" },
  container: { maxWidth: "1280px", margin: "0 auto", padding: "40px 40px" },
  section: { marginBottom: "60px" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" },
  sectionTitle: { fontSize: "22px", fontWeight: 700 },
  pill: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#1a1a1a", color: "#ffffff", border: "none", borderRadius: "100px", padding: "10px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer" },
  pillOutline: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", color: "#1a1a1a", border: "1.5px solid #d4d0ca", borderRadius: "100px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" },
  filterBar: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
  cardImage: { width: "100%", aspectRatio: "1", objectFit: "cover", backgroundColor: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" },
  cardBody: { padding: "14px 16px 16px" },
  cardName: { fontSize: "14px", fontWeight: 600, marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardMeta: { fontSize: "12px", color: "#777", marginBottom: "2px" },
  cardActions: { display: "flex", gap: "8px", marginTop: "12px" },
  overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modal: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { fontSize: "20px", fontWeight: 700, marginBottom: "24px" },
  field: { marginBottom: "16px" },
  label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#444", marginBottom: "6px" },
  input: { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e0ddd8", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#fafaf9" },
  select: { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e0ddd8", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#fafaf9", cursor: "pointer" },
  modalActions: { display: "flex", gap: "10px", marginTop: "24px" },
  packCard: { backgroundColor: "#ffffff", borderRadius: "16px", border: "1.5px solid #e8e5e0", overflow: "hidden", marginBottom: "16px" },
  packHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", cursor: "pointer" },
  packTitle: { fontSize: "16px", fontWeight: 700 },
  packMeta: { fontSize: "13px", color: "#888", marginTop: "2px" },
  packItemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", padding: "0 20px 20px" },
  selectBanner: { position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "100px", padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", fontWeight: 600, zIndex: 300, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" },
  // Login screen
  loginPage: { minHeight: "100vh", backgroundColor: "#f9f8f6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  loginCard: { backgroundColor: "#ffffff", borderRadius: "24px", padding: "48px 40px", width: "100%", maxWidth: "400px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
};
 
function filterChip(active: boolean): React.CSSProperties {
  return { backgroundColor: active ? "#1a1a1a" : "#ffffff", color: active ? "#ffffff" : "#555", border: `1.5px solid ${active ? "#1a1a1a" : "#e0ddd8"}`, borderRadius: "100px", padding: "7px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" };
}
function card(selectable: boolean, selected: boolean): React.CSSProperties {
  return { backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden", border: `2px solid ${selected ? "#1a1a1a" : selectable ? "#d4d0ca" : "transparent"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: selectable ? "pointer" : "default", transition: "transform 0.15s, box-shadow 0.15s", position: "relative" };
}
function smallBtn(variant: "primary" | "ghost" | "danger"): React.CSSProperties {
  return { flex: variant === "primary" ? 1 : undefined, fontSize: "12px", fontWeight: 600, padding: "6px 10px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: variant === "primary" ? "#1a1a1a" : variant === "danger" ? "#fee2e2" : "#f0ede8", color: variant === "primary" ? "#fff" : variant === "danger" ? "#dc2626" : "#555" };
}
function checkBadge(checked: boolean): React.CSSProperties {
  return { position: "absolute", top: "10px", right: "10px", width: "26px", height: "26px", borderRadius: "50%", backgroundColor: checked ? "#1a1a1a" : "rgba(255,255,255,0.85)", border: `2px solid ${checked ? "#1a1a1a" : "#bbb"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" };
}
 
// ── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) { setError(error.message); setLoading(false); }
  };
 
  return (
    <div style={S.loginPage}>
      <div style={S.loginCard}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧳</div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>MyWardrobe</h1>
        <p style={{ fontSize: "15px", color: "#888", marginBottom: "36px", lineHeight: 1.5 }}>
          Your personal clothing inventory.<br />Log in to access your wardrobe from any device.
        </p>
        {error && (
          <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}
        <button
          style={{ ...S.pill, width: "100%", justifyContent: "center", fontSize: "15px", padding: "14px 20px", gap: "10px", opacity: loading ? 0.7 : 1 }}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {loading ? "Redirecting…" : "Continue with Google"}
        </button>
        <p style={{ fontSize: "12px", color: "#bbb", marginTop: "24px" }}>
          Your data is private to your account only.
        </p>
      </div>
    </div>
  );
}
 
// ── Main app ─────────────────────────────────────────────────────────────────
export default function WardrobePage() {
  // Auth
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
 
  // Data
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [packs, setPacks] = useState<TravelPack[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
 
  // UI
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddPack, setShowAddPack] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [showBottomsSub, setShowBottomsSub] = useState(false);
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [packSelectMode, setPackSelectMode] = useState<string | null>(null);
  const [selectedForPack, setSelectedForPack] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
 
  const fileInputRef = useRef<HTMLInputElement>(null);
 
  const [form, setForm] = useState({ name: "", brand: "", size: "", link: "", image: "", category: "Tops" });
  const [packForm, setPackForm] = useState({ name: "", destination: "", date: "" });
 
  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? "");
      setUserAvatar(session?.user?.user_metadata?.avatar_url ?? "");
      setAuthLoading(false);
    });
 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? "");
      setUserAvatar(session?.user?.user_metadata?.avatar_url ?? "");
    });
 
    return () => subscription.unsubscribe();
  }, []);
 
  // ── Load data when logged in ───────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!userId) return;
    setDataLoading(true);
 
    const [{ data: itemsData }, { data: packsData }] = await Promise.all([
      supabase.from("clothing_items").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("travel_packs").select("*").eq("user_id", userId).order("created_at"),
    ]);
 
    setItems(
      (itemsData ?? []).map((r) => ({
        id: r.id, name: r.name, brand: r.brand, size: r.size,
        category: r.category, link: r.link ?? "", image: r.image ?? "",
      }))
    );
    setPacks(
      (packsData ?? []).map((r) => ({
        id: r.id, name: r.name, destination: r.destination ?? "",
        date: r.date ?? "", item_ids: r.item_ids ?? [],
      }))
    );
    setDataLoading(false);
  }, [userId]);
 
  useEffect(() => { loadData(); }, [loadData]);
 
  // ── CRUD: items ────────────────────────────────────────────────────────────
  const resetForm = () => setForm({ name: "", brand: "", size: "", link: "", image: "", category: "Tops" });
 
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  };
 
  const saveItem = async () => {
    if (!form.name || !form.brand || !form.size || !userId) return;
    setSaving(true);
 
    if (editingItem) {
      const { error } = await supabase
        .from("clothing_items")
        .update({ name: form.name, brand: form.brand, size: form.size, category: form.category, link: form.link, image: form.image })
        .eq("id", editingItem.id);
      if (!error) setItems((prev) => prev.map((i) => i.id === editingItem.id ? { ...form, id: editingItem.id } : i));
      setEditingItem(null);
    } else {
      const { data, error } = await supabase
        .from("clothing_items")
        .insert({ user_id: userId, name: form.name, brand: form.brand, size: form.size, category: form.category, link: form.link, image: form.image })
        .select()
        .single();
      if (!error && data) setItems((prev) => [...prev, { id: data.id, name: data.name, brand: data.brand, size: data.size, category: data.category, link: data.link ?? "", image: data.image ?? "" }]);
    }
 
    resetForm();
    setShowAddItem(false);
    setSaving(false);
  };
 
  const deleteItem = async (id: string) => {
    await supabase.from("clothing_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    // Remove from all packs
    for (const pack of packs) {
      if (pack.item_ids.includes(id)) {
        const newIds = pack.item_ids.filter((iid) => iid !== id);
        await supabase.from("travel_packs").update({ item_ids: newIds }).eq("id", pack.id);
      }
    }
    setPacks((prev) => prev.map((p) => ({ ...p, item_ids: p.item_ids.filter((iid) => iid !== id) })));
  };
 
  const startEdit = (item: ClothingItem) => {
    setForm({ name: item.name, brand: item.brand, size: item.size, link: item.link, image: item.image, category: item.category });
    setEditingItem(item);
    setShowAddItem(true);
  };
 
  // ── CRUD: packs ────────────────────────────────────────────────────────────
  const savePack = async () => {
    if (!packForm.name || !userId) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("travel_packs")
      .insert({ user_id: userId, name: packForm.name, destination: packForm.destination, date: packForm.date, item_ids: [] })
      .select()
      .single();
 
    if (!error && data) {
      const newPack: TravelPack = { id: data.id, name: data.name, destination: data.destination ?? "", date: data.date ?? "", item_ids: [] };
      setPacks((prev) => [...prev, newPack]);
      setPackForm({ name: "", destination: "", date: "" });
      setShowAddPack(false);
      setPackSelectMode(newPack.id);
      setSelectedForPack([]);
    }
    setSaving(false);
  };
 
  const finishPackSelection = async () => {
    if (!packSelectMode) return;
    setSaving(true);
    await supabase.from("travel_packs").update({ item_ids: selectedForPack }).eq("id", packSelectMode);
    setPacks((prev) => prev.map((p) => (p.id === packSelectMode ? { ...p, item_ids: selectedForPack } : p)));
    setPackSelectMode(null);
    setSelectedForPack([]);
    setSaving(false);
  };
 
  const deletePack = async (id: string) => {
    await supabase.from("travel_packs").delete().eq("id", id);
    setPacks((prev) => prev.filter((p) => p.id !== id));
  };
 
  const signOut = () => supabase.auth.signOut();
 
  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredItems =
    filterCategory === "All" ? items
    : filterCategory === "Bottoms" ? items.filter((i) => BOTTOMS_SUBCATEGORIES.includes(i.category))
    : items.filter((i) => i.category === filterCategory);
 
  // ── Loading / auth gates ───────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div style={{ ...S.loginPage }}>
        <div style={{ fontSize: "32px" }}>🧳</div>
      </div>
    );
  }
 
  if (!userId) return <LoginScreen onLogin={() => {}} />;
 
  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* ── Header ── */}
      <header style={S.header}>
        <span style={S.logo}>🧳 MyWardrobe</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {!packSelectMode && (
            <>
              <button style={S.pillOutline} onClick={() => { resetForm(); setEditingItem(null); setShowAddItem(true); }}>
                + Add Item
              </button>
              <button style={S.pill} onClick={() => setShowAddPack(true)}>
                ✈️ New Trip
              </button>
              {/* Avatar / sign out */}
              <button
                onClick={signOut}
                title={`Sign out (${userEmail})`}
                style={{ background: "none", border: "none", cursor: "pointer", borderRadius: "50%", overflow: "hidden", width: "36px", height: "36px", padding: 0 }}
              >
                {userAvatar
                  ? <img src={userAvatar} alt="avatar" style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
                  : <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#e0ddd8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700 }}>
                      {userEmail[0]?.toUpperCase()}
                    </div>
                }
              </button>
            </>
          )}
        </div>
      </header>
 
      <div style={S.container}>
        {dataLoading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#aaa", fontSize: "15px" }}>
            Loading your wardrobe…
          </div>
        ) : (
          <>
            {/* ── Wardrobe Section ── */}
            <section style={S.section}>
              <div style={S.sectionHeader}>
                <h2 style={S.sectionTitle}>
                  Wardrobe{" "}
                  <span style={{ fontWeight: 400, color: "#aaa", fontSize: "16px" }}>({items.length})</span>
                </h2>
              </div>
 
              {/* Filter bar */}
              <div style={S.filterBar}>
                {["All", ...CATEGORIES].map((cat) => {
                  if (cat === "Bottoms") {
                    const isBottomsActive = filterCategory === "Bottoms" || BOTTOMS_SUBCATEGORIES.includes(filterCategory);
                    return (
                      <div key="bottoms-group" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <button
                          style={filterChip(isBottomsActive)}
                          onClick={() => { setShowBottomsSub((v) => !v); setFilterCategory("Bottoms"); }}
                        >
                          Bottoms {showBottomsSub ? "▲" : "▼"}
                        </button>
                        {showBottomsSub && BOTTOMS_SUBCATEGORIES.map((sub) => (
                          <button
                            key={sub}
                            style={{ ...filterChip(filterCategory === sub), fontSize: "12px", padding: "5px 13px", border: `1.5px solid ${filterCategory === sub ? "#1a1a1a" : "#c8c4be"}`, backgroundColor: filterCategory === sub ? "#1a1a1a" : "#f5f3ef", color: filterCategory === sub ? "#fff" : "#666" }}
                            onClick={() => { setFilterCategory(sub); setShowBottomsSub(false); }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <button
                      key={cat}
                      style={filterChip(filterCategory === cat)}
                      onClick={() => { setFilterCategory(cat); setShowBottomsSub(false); }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
 
              {/* Grid */}
              <div style={S.grid}>
                {filteredItems.length === 0 && (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: "#aaa", fontSize: "15px" }}>
                    No items yet. Add your first piece above.
                  </div>
                )}
                {filteredItems.map((item) => {
                  const inSelectMode = !!packSelectMode;
                  const isSelected = selectedForPack.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      style={card(inSelectMode, isSelected)}
                      onClick={inSelectMode ? () => setSelectedForPack((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]) : undefined}
                    >
                      <div style={S.cardImage}>
                        {item.image
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span>{CATEGORY_EMOJI[item.category] ?? "👔"}</span>
                        }
                      </div>
                      {inSelectMode && <div style={checkBadge(isSelected)}>{isSelected ? "✓" : ""}</div>}
                      <div style={S.cardBody}>
                        <div style={S.cardName}>{item.name}</div>
                        <div style={S.cardMeta}>{item.brand}</div>
                        <div style={S.cardMeta}>Size: {item.size}</div>
                        <div style={S.cardMeta}>{item.category}</div>
                        {!inSelectMode && (
                          <div style={S.cardActions}>
                            {item.link && (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ ...smallBtn("primary"), textDecoration: "none", textAlign: "center", display: "inline-block", flex: 1 }}>
                                Buy
                              </a>
                            )}
                            <button style={smallBtn("ghost")} onClick={() => startEdit(item)}>Edit</button>
                            <button style={smallBtn("danger")} onClick={() => deleteItem(item.id)}>✕</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
 
            {/* ── Travel Packs Section ── */}
            <section style={S.section}>
              <div style={S.sectionHeader}>
                <h2 style={S.sectionTitle}>
                  Travel Packs{" "}
                  <span style={{ fontWeight: 400, color: "#aaa", fontSize: "16px" }}>({packs.length})</span>
                </h2>
                <button style={S.pill} onClick={() => setShowAddPack(true)}>+ New Trip</button>
              </div>
 
              {packs.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 20px", color: "#aaa", fontSize: "15px", backgroundColor: "#fff", borderRadius: "16px", border: "1.5px dashed #e0ddd8" }}>
                  No trips yet. Create one and select your pieces.
                </div>
              )}
 
              {packs.map((pack) => {
                const packItems = items.filter((i) => pack.item_ids.includes(i.id));
                const isOpen = expandedPack === pack.id;
                return (
                  <div key={pack.id} style={S.packCard}>
                    <div style={S.packHeader} onClick={() => setExpandedPack(isOpen ? null : pack.id)}>
                      <div>
                        <div style={S.packTitle}>✈️ {pack.name}</div>
                        <div style={S.packMeta}>
                          {pack.destination && `${pack.destination} · `}
                          {pack.date && `${pack.date} · `}
                          {packItems.length} item{packItems.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button style={smallBtn("ghost")} onClick={(e) => { e.stopPropagation(); setPackSelectMode(pack.id); setSelectedForPack([...pack.item_ids]); }}>
                          Edit items
                        </button>
                        <button style={smallBtn("danger")} onClick={(e) => { e.stopPropagation(); deletePack(pack.id); }}>✕</button>
                        <span style={{ color: "#aaa", fontSize: "18px" }}>{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>
 
                    {isOpen && (
                      <div style={S.packItemGrid}>
                        {packItems.length === 0 && (
                          <div style={{ gridColumn: "1 / -1", color: "#aaa", fontSize: "13px", paddingBottom: "8px" }}>
                            No items in this pack yet.
                          </div>
                        )}
                        {packItems.map((item) => (
                          <div key={item.id} style={{ backgroundColor: "#fafaf9", borderRadius: "12px", overflow: "hidden", border: "1px solid #e8e5e0" }}>
                            <div style={{ ...S.cardImage, fontSize: "28px" }}>
                              {item.image
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <span>{CATEGORY_EMOJI[item.category] ?? "👔"}</span>
                              }
                            </div>
                            <div style={{ padding: "10px 12px" }}>
                              <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                              <div style={{ fontSize: "11px", color: "#888" }}>{item.brand} · {item.size}</div>
                              {item.link && (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: "6px", fontSize: "11px", fontWeight: 700, color: "#1a1a1a", textDecoration: "none" }}>
                                  Buy →
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          </>
        )}
      </div>
 
      {/* ── Add / Edit Item Modal ── */}
      {showAddItem && (
        <div style={S.overlay} onClick={() => { setShowAddItem(false); setEditingItem(null); resetForm(); }}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalTitle}>{editingItem ? "Edit Item" : "Add Clothing Item"}</div>
            <div style={S.field}>
              <label style={S.label}>Name *</label>
              <input style={S.input} placeholder="e.g. Classic White Oxford" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Brand / Store *</label>
              <input style={S.input} placeholder="e.g. J.Crew" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={S.label}>Size *</label>
                <input style={S.input} placeholder="M / 32x30 / 10" value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} />
              </div>
              <div>
                <label style={S.label}>Category</label>
                <select style={S.select} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  {ALL_LEAF_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={S.field}>
              <label style={S.label}>Purchase Link</label>
              <input style={S.input} placeholder="https://..." value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Photo</label>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              <button style={{ ...S.pillOutline, width: "100%", justifyContent: "center" }} onClick={() => fileInputRef.current?.click()}>
                {form.image ? "✓ Photo selected — click to change" : "📷 Upload photo"}
              </button>
            </div>
            <div style={S.modalActions}>
              <button style={{ ...S.pillOutline, flex: 1 }} onClick={() => { setShowAddItem(false); setEditingItem(null); resetForm(); }}>Cancel</button>
              <button style={{ ...S.pill, flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }} onClick={saveItem} disabled={saving}>
                {saving ? "Saving…" : editingItem ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* ── New Trip Modal ── */}
      {showAddPack && (
        <div style={S.overlay} onClick={() => setShowAddPack(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalTitle}>New Travel Pack</div>
            <div style={S.field}>
              <label style={S.label}>Trip Name *</label>
              <input style={S.input} placeholder="e.g. Paris Weekend" value={packForm.name} onChange={(e) => setPackForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Destination</label>
              <input style={S.input} placeholder="e.g. Paris, France" value={packForm.destination} onChange={(e) => setPackForm((f) => ({ ...f, destination: e.target.value }))} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Date</label>
              <input style={S.input} type="date" value={packForm.date} onChange={(e) => setPackForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div style={S.modalActions}>
              <button style={{ ...S.pillOutline, flex: 1 }} onClick={() => setShowAddPack(false)}>Cancel</button>
              <button style={{ ...S.pill, flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }} onClick={savePack} disabled={saving}>
                {saving ? "Creating…" : "Create & Select Items"}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* ── Pack selection banner ── */}
      {packSelectMode && (
        <div style={S.selectBanner}>
          <span>Select items for this trip · {selectedForPack.length} selected</span>
          <button style={{ backgroundColor: "#fff", color: "#1a1a1a", border: "none", borderRadius: "100px", padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: "13px", opacity: saving ? 0.7 : 1 }} onClick={finishPackSelection} disabled={saving}>
            {saving ? "Saving…" : "Done ✓"}
          </button>
          <button style={{ backgroundColor: "transparent", color: "#aaa", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600 }} onClick={() => { setPackSelectMode(null); setSelectedForPack([]); }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}


// "use client";
 
// import { useState, useRef } from "react";
 
// interface ClothingItem {
//   id: string;
//   name: string;
//   brand: string;
//   size: string;
//   link: string;
//   image: string; // base64 or URL
//   category: string;
// }
 
// interface TravelPack {
//   id: string;
//   name: string;
//   destination: string;
//   date: string;
//   itemIds: string[];
// }
 
// const CATEGORIES = ["Tops", "Sweaters", "Bottoms", "Outerwear", "Footwear", "Accessories", "Other"];
// const BOTTOMS_SUBCATEGORIES = ["Shorts", "Skirts", "Pants"];
// // All leaf categories (used in dropdowns and emoji map)
// const ALL_LEAF_CATEGORIES = ["Tops", "Sweaters", "Shorts", "Skirts", "Pants", "Outerwear", "Footwear", "Accessories", "Other"];
 
// const SAMPLE_ITEMS: ClothingItem[] = [
//   {
//     id: "1",
//     name: "Classic White Oxford",
//     brand: "J.Crew",
//     size: "M",
//     link: "https://www.jcrew.com",
//     image: "",
//     category: "Tops",
//   },
//   {
//     id: "2",
//     name: "Slim Chinos",
//     brand: "Banana Republic",
//     size: "32x30",
//     link: "https://www.bananarepublic.com",
//     image: "",
//     category: "Pants",
//   },
//   {
//     id: "3",
//     name: "White Leather Sneakers",
//     brand: "Common Projects",
//     size: "10",
//     link: "https://www.commonprojects.com",
//     image: "",
//     category: "Footwear",
//   },
// ];
 
// export default function WardrobePage() {
//   const [items, setItems] = useState<ClothingItem[]>(SAMPLE_ITEMS);
//   const [packs, setPacks] = useState<TravelPack[]>([]);
//   const [showAddItem, setShowAddItem] = useState(false);
//   const [showAddPack, setShowAddPack] = useState(false);
//   const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [showBottomsSub, setShowBottomsSub] = useState(false);
//   const [expandedPack, setExpandedPack] = useState<string | null>(null);
//   const [packSelectMode, setPackSelectMode] = useState<string | null>(null); // pack id being built
//   const [selectedForPack, setSelectedForPack] = useState<string[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);
 
//   const [form, setForm] = useState({
//     name: "",
//     brand: "",
//     size: "",
//     link: "",
//     image: "",
//     category: "Tops",
//   });
 
//   const [packForm, setPackForm] = useState({
//     name: "",
//     destination: "",
//     date: "",
//   });
 
//   const resetForm = () =>
//     setForm({ name: "", brand: "", size: "", link: "", image: "", category: "Tops" });
 
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
//     reader.readAsDataURL(file);
//   };
 
//   const saveItem = () => {
//     if (!form.name || !form.brand || !form.size) return;
//     if (editingItem) {
//       setItems((prev) =>
//         prev.map((i) => (i.id === editingItem.id ? { ...form, id: editingItem.id } : i))
//       );
//       setEditingItem(null);
//     } else {
//       setItems((prev) => [...prev, { ...form, id: Date.now().toString() }]);
//     }
//     resetForm();
//     setShowAddItem(false);
//   };
 
//   const deleteItem = (id: string) => {
//     setItems((prev) => prev.filter((i) => i.id !== id));
//     setPacks((prev) =>
//       prev.map((p) => ({ ...p, itemIds: p.itemIds.filter((iid) => iid !== id) }))
//     );
//   };
 
//   const startEdit = (item: ClothingItem) => {
//     setForm({ name: item.name, brand: item.brand, size: item.size, link: item.link, image: item.image, category: item.category });
//     setEditingItem(item);
//     setShowAddItem(true);
//   };
 
//   const savePack = () => {
//     if (!packForm.name) return;
//     const newPack: TravelPack = {
//       id: Date.now().toString(),
//       ...packForm,
//       itemIds: [],
//     };
//     setPacks((prev) => [...prev, newPack]);
//     setPackForm({ name: "", destination: "", date: "" });
//     setShowAddPack(false);
//     setPackSelectMode(newPack.id);
//     setSelectedForPack([]);
//   };
 
//   const finishPackSelection = () => {
//     if (!packSelectMode) return;
//     setPacks((prev) =>
//       prev.map((p) => (p.id === packSelectMode ? { ...p, itemIds: selectedForPack } : p))
//     );
//     setPackSelectMode(null);
//     setSelectedForPack([]);
//   };
 
//   const deletePack = (id: string) => setPacks((prev) => prev.filter((p) => p.id !== id));
 
//   const filteredItems =
//     filterCategory === "All"
//       ? items
//       : filterCategory === "Bottoms"
//       ? items.filter((i) => BOTTOMS_SUBCATEGORIES.includes(i.category))
//       : items.filter((i) => i.category === filterCategory);
 
//   // ── Styles ────────────────────────────────────────────────────────────────
 
//   const s = {
//     page: {
//       minHeight: "100vh",
//       backgroundColor: "#f9f8f6",
//       fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//       color: "#1a1a1a",
//     } as React.CSSProperties,
 
//     header: {
//       backgroundColor: "#ffffff",
//       borderBottom: "1px solid #e8e5e0",
//       padding: "20px 40px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       position: "sticky" as const,
//       top: 0,
//       zIndex: 100,
//     } as React.CSSProperties,
 
//     logo: {
//       fontSize: "20px",
//       fontWeight: 700,
//       letterSpacing: "-0.5px",
//       color: "#1a1a1a",
//     } as React.CSSProperties,
 
//     container: {
//       maxWidth: "1280px",
//       margin: "0 auto",
//       padding: "40px 40px",
//     } as React.CSSProperties,
 
//     section: {
//       marginBottom: "60px",
//     } as React.CSSProperties,
 
//     sectionHeader: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: "24px",
//     } as React.CSSProperties,
 
//     sectionTitle: {
//       fontSize: "22px",
//       fontWeight: 700,
//       color: "#1a1a1a",
//     } as React.CSSProperties,
 
//     pill: {
//       display: "inline-flex",
//       alignItems: "center",
//       gap: "6px",
//       backgroundColor: "#1a1a1a",
//       color: "#ffffff",
//       border: "none",
//       borderRadius: "100px",
//       padding: "10px 18px",
//       fontSize: "14px",
//       fontWeight: 600,
//       cursor: "pointer",
//     } as React.CSSProperties,
 
//     pillOutline: {
//       display: "inline-flex",
//       alignItems: "center",
//       gap: "6px",
//       backgroundColor: "transparent",
//       color: "#1a1a1a",
//       border: "1.5px solid #d4d0ca",
//       borderRadius: "100px",
//       padding: "9px 16px",
//       fontSize: "13px",
//       fontWeight: 500,
//       cursor: "pointer",
//     } as React.CSSProperties,
 
//     filterBar: {
//       display: "flex",
//       gap: "8px",
//       flexWrap: "wrap" as const,
//       marginBottom: "28px",
//     } as React.CSSProperties,
 
//     filterChip: (active: boolean) => ({
//       backgroundColor: active ? "#1a1a1a" : "#ffffff",
//       color: active ? "#ffffff" : "#555",
//       border: `1.5px solid ${active ? "#1a1a1a" : "#e0ddd8"}`,
//       borderRadius: "100px",
//       padding: "7px 16px",
//       fontSize: "13px",
//       fontWeight: 500,
//       cursor: "pointer",
//     }) as React.CSSProperties,
 
//     grid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
//       gap: "20px",
//     } as React.CSSProperties,
 
//     card: (selectable: boolean, selected: boolean) => ({
//       backgroundColor: "#ffffff",
//       borderRadius: "16px",
//       overflow: "hidden",
//       border: `2px solid ${selected ? "#1a1a1a" : selectable ? "#d4d0ca" : "transparent"}`,
//       boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
//       cursor: selectable ? "pointer" : "default",
//       transition: "transform 0.15s, box-shadow 0.15s",
//       position: "relative" as const,
//     }) as React.CSSProperties,
 
//     cardImage: {
//       width: "100%",
//       aspectRatio: "1",
//       objectFit: "cover" as const,
//       backgroundColor: "#f0ede8",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontSize: "40px",
//     } as React.CSSProperties,
 
//     cardBody: {
//       padding: "14px 16px 16px",
//     } as React.CSSProperties,
 
//     cardName: {
//       fontSize: "14px",
//       fontWeight: 600,
//       marginBottom: "4px",
//       whiteSpace: "nowrap" as const,
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//     } as React.CSSProperties,
 
//     cardMeta: {
//       fontSize: "12px",
//       color: "#777",
//       marginBottom: "2px",
//     } as React.CSSProperties,
 
//     cardActions: {
//       display: "flex",
//       gap: "8px",
//       marginTop: "12px",
//     } as React.CSSProperties,
 
//     smallBtn: (variant: "primary" | "ghost" | "danger") => ({
//       flex: variant === "primary" ? 1 : undefined,
//       fontSize: "12px",
//       fontWeight: 600,
//       padding: "6px 10px",
//       borderRadius: "8px",
//       border: "none",
//       cursor: "pointer",
//       backgroundColor:
//         variant === "primary" ? "#1a1a1a" : variant === "danger" ? "#fee2e2" : "#f0ede8",
//       color: variant === "primary" ? "#fff" : variant === "danger" ? "#dc2626" : "#555",
//     }) as React.CSSProperties,
 
//     overlay: {
//       position: "fixed" as const,
//       inset: 0,
//       backgroundColor: "rgba(0,0,0,0.4)",
//       zIndex: 200,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "20px",
//     } as React.CSSProperties,
 
//     modal: {
//       backgroundColor: "#ffffff",
//       borderRadius: "20px",
//       padding: "32px",
//       width: "100%",
//       maxWidth: "480px",
//       maxHeight: "90vh",
//       overflowY: "auto" as const,
//     } as React.CSSProperties,
 
//     modalTitle: {
//       fontSize: "20px",
//       fontWeight: 700,
//       marginBottom: "24px",
//     } as React.CSSProperties,
 
//     field: {
//       marginBottom: "16px",
//     } as React.CSSProperties,
 
//     label: {
//       display: "block",
//       fontSize: "13px",
//       fontWeight: 600,
//       color: "#444",
//       marginBottom: "6px",
//     } as React.CSSProperties,
 
//     input: {
//       width: "100%",
//       padding: "10px 14px",
//       borderRadius: "10px",
//       border: "1.5px solid #e0ddd8",
//       fontSize: "14px",
//       outline: "none",
//       boxSizing: "border-box" as const,
//       backgroundColor: "#fafaf9",
//     } as React.CSSProperties,
 
//     select: {
//       width: "100%",
//       padding: "10px 14px",
//       borderRadius: "10px",
//       border: "1.5px solid #e0ddd8",
//       fontSize: "14px",
//       outline: "none",
//       boxSizing: "border-box" as const,
//       backgroundColor: "#fafaf9",
//       cursor: "pointer",
//     } as React.CSSProperties,
 
//     modalActions: {
//       display: "flex",
//       gap: "10px",
//       marginTop: "24px",
//     } as React.CSSProperties,
 
//     packCard: {
//       backgroundColor: "#ffffff",
//       borderRadius: "16px",
//       border: "1.5px solid #e8e5e0",
//       overflow: "hidden",
//       marginBottom: "16px",
//     } as React.CSSProperties,
 
//     packHeader: {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       padding: "18px 20px",
//       cursor: "pointer",
//     } as React.CSSProperties,
 
//     packTitle: {
//       fontSize: "16px",
//       fontWeight: 700,
//     } as React.CSSProperties,
 
//     packMeta: {
//       fontSize: "13px",
//       color: "#888",
//       marginTop: "2px",
//     } as React.CSSProperties,
 
//     packItemGrid: {
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
//       gap: "12px",
//       padding: "0 20px 20px",
//     } as React.CSSProperties,
 
//     selectBanner: {
//       position: "fixed" as const,
//       bottom: "24px",
//       left: "50%",
//       transform: "translateX(-50%)",
//       backgroundColor: "#1a1a1a",
//       color: "#fff",
//       borderRadius: "100px",
//       padding: "14px 24px",
//       display: "flex",
//       alignItems: "center",
//       gap: "16px",
//       fontSize: "14px",
//       fontWeight: 600,
//       zIndex: 300,
//       boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
//     } as React.CSSProperties,
 
//     checkBadge: (checked: boolean) => ({
//       position: "absolute" as const,
//       top: "10px",
//       right: "10px",
//       width: "26px",
//       height: "26px",
//       borderRadius: "50%",
//       backgroundColor: checked ? "#1a1a1a" : "rgba(255,255,255,0.85)",
//       border: `2px solid ${checked ? "#1a1a1a" : "#bbb"}`,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       fontSize: "14px",
//     }) as React.CSSProperties,
 
//     categoryEmoji: (cat: string) => {
//       const map: Record<string, string> = {
//         Tops: "👕",
//         Sweaters: "🧶",
//         Bottoms: "👖",
//         Pants: "👖",
//         Shorts: "🩳",
//         Skirts: "👗",
//         Outerwear: "🧥",
//         Footwear: "👟",
//         Accessories: "🕶️",
//         Other: "📦",
//       };
//       return map[cat] ?? "👔";
//     },
//   };
 
//   const emptyState = (
//     <div
//       style={{
//         gridColumn: "1 / -1",
//         textAlign: "center",
//         padding: "60px 20px",
//         color: "#aaa",
//         fontSize: "15px",
//       }}
//     >
//       No items yet. Add your first piece above.
//     </div>
//   );
 
//   return (
//     <div style={s.page}>
//       {/* ── Header ── */}
//       <header style={s.header}>
//         <span style={s.logo}>🧳 MyWardrobe</span>
//         <div style={{ display: "flex", gap: "10px" }}>
//           {packSelectMode ? null : (
//             <>
//               <button style={s.pillOutline} onClick={() => { resetForm(); setEditingItem(null); setShowAddItem(true); }}>
//                 + Add Item
//               </button>
//               <button style={s.pill} onClick={() => setShowAddPack(true)}>
//                 ✈️ New Trip
//               </button>
//             </>
//           )}
//         </div>
//       </header>
 
//       <div style={s.container}>
//         {/* ── Wardrobe Section ── */}
//         <section style={s.section}>
//           <div style={s.sectionHeader}>
//             <h2 style={s.sectionTitle}>
//               Wardrobe{" "}
//               <span style={{ fontWeight: 400, color: "#aaa", fontSize: "16px" }}>
//                 ({items.length})
//               </span>
//             </h2>
//           </div>
 
//           {/* Filter bar */}
//           <div style={s.filterBar}>
//             {["All", ...CATEGORIES].map((cat) => {
//               if (cat === "Bottoms") {
//                 const isBottomsActive = filterCategory === "Bottoms" || BOTTOMS_SUBCATEGORIES.includes(filterCategory);
//                 return (
//                   <div key="bottoms-group" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" as const }}>
//                     {/* Bottoms parent chip */}
//                     <button
//                       style={{
//                         ...s.filterChip(isBottomsActive),
//                         borderRadius: showBottomsSub ? "100px 100px 100px 100px" : "100px",
//                       }}
//                       onClick={() => {
//                         setShowBottomsSub((v) => !v);
//                         setFilterCategory("Bottoms");
//                       }}
//                     >
//                       Bottoms {showBottomsSub ? "▲" : "▼"}
//                     </button>
//                     {/* Subcategory chips */}
//                     {showBottomsSub && BOTTOMS_SUBCATEGORIES.map((sub) => (
//                       <button
//                         key={sub}
//                         style={{
//                           ...s.filterChip(filterCategory === sub),
//                           fontSize: "12px",
//                           padding: "5px 13px",
//                           border: `1.5px solid ${filterCategory === sub ? "#1a1a1a" : "#c8c4be"}`,
//                           backgroundColor: filterCategory === sub ? "#1a1a1a" : "#f5f3ef",
//                           color: filterCategory === sub ? "#fff" : "#666",
//                         }}
//                         onClick={() => {
//                           setFilterCategory(sub);
//                           setShowBottomsSub(false);
//                         }}
//                       >
//                         {sub}
//                       </button>
//                     ))}
//                   </div>
//                 );
//               }
//               return (
//                 <button
//                   key={cat}
//                   style={s.filterChip(filterCategory === cat)}
//                   onClick={() => { setFilterCategory(cat); setShowBottomsSub(false); }}
//                 >
//                   {cat}
//                 </button>
//               );
//             })}
//           </div>
 
//           {/* Grid */}
//           <div style={s.grid}>
//             {filteredItems.length === 0 && emptyState}
//             {filteredItems.map((item) => {
//               const inSelectMode = !!packSelectMode;
//               const isSelected = selectedForPack.includes(item.id);
//               return (
//                 <div
//                   key={item.id}
//                   style={s.card(inSelectMode, isSelected)}
//                   onClick={
//                     inSelectMode
//                       ? () =>
//                           setSelectedForPack((prev) =>
//                             prev.includes(item.id)
//                               ? prev.filter((id) => id !== item.id)
//                               : [...prev, item.id]
//                           )
//                       : undefined
//                   }
//                 >
//                   {/* Image */}
//                   <div style={s.cardImage}>
//                     {item.image ? (
//                       // eslint-disable-next-line @next/next/no-img-element
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                       />
//                     ) : (
//                       <span>{s.categoryEmoji(item.category)}</span>
//                     )}
//                   </div>
 
//                   {inSelectMode && (
//                     <div style={s.checkBadge(isSelected)}>
//                       {isSelected ? "✓" : ""}
//                     </div>
//                   )}
 
//                   <div style={s.cardBody}>
//                     <div style={s.cardName}>{item.name}</div>
//                     <div style={s.cardMeta}>{item.brand}</div>
//                     <div style={s.cardMeta}>Size: {item.size}</div>
 
//                     {!inSelectMode && (
//                       <div style={s.cardActions}>
//                         {item.link && (
//                           <a
//                             href={item.link}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             style={{ ...s.smallBtn("primary"), textDecoration: "none", textAlign: "center" as const, display: "inline-block", flex: 1 }}
//                           >
//                             Buy
//                           </a>
//                         )}
//                         <button style={s.smallBtn("ghost")} onClick={() => startEdit(item)}>
//                           Edit
//                         </button>
//                         <button style={s.smallBtn("danger")} onClick={() => deleteItem(item.id)}>
//                           ✕
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
 
//         {/* ── Travel Packs Section ── */}
//         <section style={s.section}>
//           <div style={s.sectionHeader}>
//             <h2 style={s.sectionTitle}>
//               Travel Packs{" "}
//               <span style={{ fontWeight: 400, color: "#aaa", fontSize: "16px" }}>
//                 ({packs.length})
//               </span>
//             </h2>
//             <button style={s.pill} onClick={() => setShowAddPack(true)}>
//               + New Trip
//             </button>
//           </div>
 
//           {packs.length === 0 && (
//             <div style={{ textAlign: "center", padding: "48px 20px", color: "#aaa", fontSize: "15px", backgroundColor: "#fff", borderRadius: "16px", border: "1.5px dashed #e0ddd8" }}>
//               No trips yet. Create one and select your pieces.
//             </div>
//           )}
 
//           {packs.map((pack) => {
//             const packItems = items.filter((i) => pack.itemIds.includes(i.id));
//             const isOpen = expandedPack === pack.id;
//             return (
//               <div key={pack.id} style={s.packCard}>
//                 <div style={s.packHeader} onClick={() => setExpandedPack(isOpen ? null : pack.id)}>
//                   <div>
//                     <div style={s.packTitle}>✈️ {pack.name}</div>
//                     <div style={s.packMeta}>
//                       {pack.destination && `${pack.destination} · `}
//                       {pack.date && `${pack.date} · `}
//                       {packItems.length} item{packItems.length !== 1 ? "s" : ""}
//                     </div>
//                   </div>
//                   <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                     <button
//                       style={s.smallBtn("ghost")}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setPackSelectMode(pack.id);
//                         setSelectedForPack([...pack.itemIds]);
//                       }}
//                     >
//                       Edit items
//                     </button>
//                     <button
//                       style={s.smallBtn("danger")}
//                       onClick={(e) => { e.stopPropagation(); deletePack(pack.id); }}
//                     >
//                       ✕
//                     </button>
//                     <span style={{ color: "#aaa", fontSize: "18px" }}>{isOpen ? "▲" : "▼"}</span>
//                   </div>
//                 </div>
 
//                 {isOpen && (
//                   <div style={s.packItemGrid}>
//                     {packItems.length === 0 && (
//                       <div style={{ gridColumn: "1 / -1", color: "#aaa", fontSize: "13px", paddingBottom: "8px" }}>
//                         No items in this pack yet.
//                       </div>
//                     )}
//                     {packItems.map((item) => (
//                       <div key={item.id} style={{ backgroundColor: "#fafaf9", borderRadius: "12px", overflow: "hidden", border: "1px solid #e8e5e0" }}>
//                         <div style={{ ...s.cardImage, fontSize: "28px" }}>
//                           {item.image ? (
//                             // eslint-disable-next-line @next/next/no-img-element
//                             <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                           ) : (
//                             <span>{s.categoryEmoji(item.category)}</span>
//                           )}
//                         </div>
//                         <div style={{ padding: "10px 12px" }}>
//                           <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{item.name}</div>
//                           <div style={{ fontSize: "11px", color: "#888" }}>{item.brand} · {item.size}</div>
//                           {item.link && (
//                             <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: "6px", fontSize: "11px", fontWeight: 700, color: "#1a1a1a", textDecoration: "none" }}>
//                               Buy →
//                             </a>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </section>
//       </div>
 
//       {/* ── Add / Edit Item Modal ── */}
//       {showAddItem && (
//         <div style={s.overlay} onClick={() => { setShowAddItem(false); setEditingItem(null); resetForm(); }}>
//           <div style={s.modal} onClick={(e) => e.stopPropagation()}>
//             <div style={s.modalTitle}>{editingItem ? "Edit Item" : "Add Clothing Item"}</div>
 
//             <div style={s.field}>
//               <label style={s.label}>Name *</label>
//               <input style={s.input} placeholder="e.g. Classic White Oxford" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
//             </div>
//             <div style={s.field}>
//               <label style={s.label}>Brand / Store *</label>
//               <input style={s.input} placeholder="e.g. J.Crew" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
//               <div>
//                 <label style={s.label}>Size *</label>
//                 <input style={s.input} placeholder="M / 32x30 / 10" value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} />
//               </div>
//               <div>
//                 <label style={s.label}>Category</label>
//                 <select style={s.select} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
//                   {ALL_LEAF_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//                 </select>
//               </div>
//             </div>
//             <div style={s.field}>
//               <label style={s.label}>Purchase Link</label>
//               <input style={s.input} placeholder="https://..." value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
//             </div>
//             <div style={s.field}>
//               <label style={s.label}>Photo</label>
//               <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
//               <button style={{ ...s.pillOutline, width: "100%", justifyContent: "center" }} onClick={() => fileInputRef.current?.click()}>
//                 {form.image ? "✓ Photo selected — click to change" : "📷 Upload photo"}
//               </button>
//             </div>
 
//             <div style={s.modalActions}>
//               <button style={{ ...s.pillOutline, flex: 1 }} onClick={() => { setShowAddItem(false); setEditingItem(null); resetForm(); }}>
//                 Cancel
//               </button>
//               <button style={{ ...s.pill, flex: 1, justifyContent: "center" }} onClick={saveItem}>
//                 {editingItem ? "Save Changes" : "Add Item"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
 
//       {/* ── New Trip Modal ── */}
//       {showAddPack && (
//         <div style={s.overlay} onClick={() => setShowAddPack(false)}>
//           <div style={s.modal} onClick={(e) => e.stopPropagation()}>
//             <div style={s.modalTitle}>New Travel Pack</div>
 
//             <div style={s.field}>
//               <label style={s.label}>Trip Name *</label>
//               <input style={s.input} placeholder="e.g. Paris Weekend" value={packForm.name} onChange={(e) => setPackForm((f) => ({ ...f, name: e.target.value }))} />
//             </div>
//             <div style={s.field}>
//               <label style={s.label}>Destination</label>
//               <input style={s.input} placeholder="e.g. Paris, France" value={packForm.destination} onChange={(e) => setPackForm((f) => ({ ...f, destination: e.target.value }))} />
//             </div>
//             <div style={s.field}>
//               <label style={s.label}>Date</label>
//               <input style={s.input} type="date" value={packForm.date} onChange={(e) => setPackForm((f) => ({ ...f, date: e.target.value }))} />
//             </div>
 
//             <div style={s.modalActions}>
//               <button style={{ ...s.pillOutline, flex: 1 }} onClick={() => setShowAddPack(false)}>
//                 Cancel
//               </button>
//               <button style={{ ...s.pill, flex: 1, justifyContent: "center" }} onClick={savePack}>
//                 Create & Select Items
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
 
//       {/* ── Pack item-selection floating banner ── */}
//       {packSelectMode && (
//         <div style={s.selectBanner}>
//           <span>
//             Select items for this trip · {selectedForPack.length} selected
//           </span>
//           <button
//             style={{ backgroundColor: "#fff", color: "#1a1a1a", border: "none", borderRadius: "100px", padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}
//             onClick={finishPackSelection}
//           >
//             Done ✓
//           </button>
//           <button
//             style={{ backgroundColor: "transparent", color: "#aaa", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
//             onClick={() => { setPackSelectMode(null); setSelectedForPack([]); }}
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }