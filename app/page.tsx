"use client";
 
import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
 
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
const CATEGORIES = ["Tops", "Sweaters", "Bottoms", "Dresses", "Outerwear", "Footwear", "Accessories", "Other"];
const BOTTOMS_SUBCATEGORIES = ["Shorts", "Skirts", "Pants"];
const ALL_LEAF_CATEGORIES = ["Tops", "Sweaters", "Shorts", "Skirts", "Pants", "Dresses", "Outerwear", "Footwear", "Accessories", "Other"];
 
// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#fdf8f6",
  surface: "#ffffff",
  rose: "#c28b8b",
  roseDark: "#a86f6f",
  roseLight: "#f5e8e8",
  roseMid: "#e8d0d0",
  mauve: "#9b7b7b",
  text: "#2c2020",
  textMid: "#7a5f5f",
  textLight: "#b89898",
  border: "#eedcdc",
  borderLight: "#f5ecec",
  cream: "#fdf3f0",
};
 
// ── Responsive hook ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}
 
// ── Style helpers ─────────────────────────────────────────────────────────────
function chip(active: boolean): React.CSSProperties {
  return {
    backgroundColor: active ? C.rose : C.surface,
    color: active ? "#fff" : C.mauve,
    border: `1.5px solid ${active ? C.rose : C.border}`,
    borderRadius: "100px",
    padding: "7px 18px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
  };
}
 
function cardStyle(selectable: boolean, selected: boolean): React.CSSProperties {
  return {
    backgroundColor: C.surface,
    borderRadius: "20px",
    overflow: "hidden",
    border: `1.5px solid ${selected ? C.rose : selectable ? C.roseMid : C.borderLight}`,
    boxShadow: selected ? `0 0 0 3px ${C.roseLight}` : "0 2px 12px rgba(194,139,139,0.08)",
    cursor: selectable ? "pointer" : "default",
    transition: "transform 0.15s, box-shadow 0.15s",
    position: "relative",
  };
}
 
function btnPrimary(disabled?: boolean): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px",
    background: disabled ? C.roseMid : `linear-gradient(135deg, ${C.rose}, ${C.roseDark})`,
    color: "#fff", border: "none", borderRadius: "100px",
    padding: "11px 22px", fontSize: "14px", fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    letterSpacing: "0.02em", opacity: disabled ? 0.65 : 1,
  };
}
 
function btnOutline(): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px",
    backgroundColor: "transparent", color: C.rose,
    border: `1.5px solid ${C.roseMid}`, borderRadius: "100px",
    padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
  };
}
 
function smallAction(variant: "primary" | "ghost" | "danger"): React.CSSProperties {
  return {
    flex: variant === "primary" ? 1 : undefined,
    fontSize: "12px", fontWeight: 700, padding: "6px 12px",
    borderRadius: "100px", border: "none", cursor: "pointer",
    backgroundColor: variant === "primary" ? C.rose : variant === "danger" ? "#fde8e8" : C.roseLight,
    color: variant === "primary" ? "#fff" : variant === "danger" ? "#c0392b" : C.mauve,
  };
}
 
function checkCircle(checked: boolean): React.CSSProperties {
  return {
    position: "absolute", top: "10px", right: "10px",
    width: "26px", height: "26px", borderRadius: "50%",
    backgroundColor: checked ? C.rose : "rgba(255,255,255,0.9)",
    border: `2px solid ${checked ? C.rose : C.border}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", color: "#fff",
    boxShadow: checked ? `0 2px 8px rgba(194,139,139,0.4)` : "none",
  };
}
 
// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) { setError(error.message); setLoading(false); }
  };
 
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, #fdf3f0 0%, #fdf8f6 50%, #f5ecec 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif", padding: "20px" }}>
      <div style={{ backgroundColor: C.surface, borderRadius: "28px", padding: "52px 44px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 8px 48px rgba(194,139,139,0.12)", border: `1px solid ${C.borderLight}` }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: `linear-gradient(135deg, ${C.roseLight}, ${C.roseMid})`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: C.text, marginBottom: "8px", letterSpacing: "-0.5px" }}>My Wardrobe</h1>
        <p style={{ fontSize: "15px", color: C.textMid, marginBottom: "36px", lineHeight: 1.6 }}>
          Your personal closet, always with you.
        </p>
        {error && (
          <div style={{ backgroundColor: "#fde8e8", color: "#c0392b", borderRadius: "12px", padding: "10px 14px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}
        <button style={{ ...btnPrimary(loading), width: "100%", padding: "14px 20px", fontSize: "15px" }} onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#fff" fillOpacity=".9"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#fff" fillOpacity=".75"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#fff" fillOpacity=".6"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#fff" fillOpacity=".85"/>
          </svg>
          {loading ? "Redirecting…" : "Continue with Google"}
        </button>
        <p style={{ fontSize: "12px", color: C.textLight, marginTop: "24px" }}>
          Your wardrobe is private to your account only.
        </p>
      </div>
    </div>
  );
}
 
// ── Bottoms dropdown ──────────────────────────────────────────────────────────
function BottomsDropdown({ filterCategory, setFilterCategory }: { filterCategory: string; setFilterCategory: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const isActive = filterCategory === "Bottoms" || BOTTOMS_SUBCATEGORIES.includes(filterCategory);
  const label = BOTTOMS_SUBCATEGORIES.includes(filterCategory) ? filterCategory : "Bottoms";
 
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen((v) => !v);
    if (!isActive) setFilterCategory("Bottoms");
  };
 
  return (
    <>
      <button
        ref={btnRef}
        style={{ ...chip(isActive), paddingRight: "14px", display: "flex", alignItems: "center", gap: "6px" }}
        onClick={handleOpen}
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ position: "fixed", top: coords.top, left: coords.left, backgroundColor: C.surface, border: `1.5px solid ${C.border}`, borderRadius: "14px", padding: "6px", zIndex: 500, minWidth: "140px", boxShadow: "0 8px 24px rgba(194,139,139,0.18)" }}>
          {["All Bottoms", ...BOTTOMS_SUBCATEGORIES].map((sub) => {
            const val = sub === "All Bottoms" ? "Bottoms" : sub;
            const active = filterCategory === val;
            return (
              <button
                key={sub}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", fontSize: "13px", fontWeight: 600, color: active ? C.rose : C.textMid, backgroundColor: active ? C.roseLight : "transparent", border: "none", borderRadius: "10px", cursor: "pointer" }}
                onClick={() => { setFilterCategory(val); setOpen(false); }}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
 
// ── Main ──────────────────────────────────────────────────────────────────────
export default function WardrobePage() {
  const isMobile = useIsMobile();
 
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userName, setUserName] = useState("");
 
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [packs, setPacks] = useState<TravelPack[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
 
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddPack, setShowAddPack] = useState(false);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [packSelectMode, setPackSelectMode] = useState<string | null>(null);
  const [selectedForPack, setSelectedForPack] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
 
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", brand: "", size: "", link: "", image: "", category: "Tops" });
  const [packForm, setPackForm] = useState({ name: "", destination: "", date: "" });
 
  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? "");
      setUserAvatar(session?.user?.user_metadata?.avatar_url ?? "");
      setUserName(session?.user?.user_metadata?.full_name ?? "");
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
      setUserEmail(session?.user?.email ?? "");
      setUserAvatar(session?.user?.user_metadata?.avatar_url ?? "");
      setUserName(session?.user?.user_metadata?.full_name ?? "");
    });
    return () => subscription.unsubscribe();
  }, []);
 
  // Load data
  const loadData = useCallback(async () => {
    if (!userId) return;
    setDataLoading(true);
    const [{ data: itemsData }, { data: packsData }] = await Promise.all([
      supabase.from("clothing_items").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("travel_packs").select("*").eq("user_id", userId).order("created_at"),
    ]);
    setItems((itemsData ?? []).map((r) => ({ id: r.id, name: r.name, brand: r.brand, size: r.size, category: r.category, link: r.link ?? "", image: r.image ?? "" })));
    setPacks((packsData ?? []).map((r) => ({ id: r.id, name: r.name, destination: r.destination ?? "", date: r.date ?? "", item_ids: r.item_ids ?? [] })));
    setDataLoading(false);
  }, [userId]);
 
  useEffect(() => { loadData(); }, [loadData]);
 
  // Item CRUD
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
      const { error } = await supabase.from("clothing_items").update({ name: form.name, brand: form.brand, size: form.size, category: form.category, link: form.link, image: form.image }).eq("id", editingItem.id);
      if (!error) setItems((prev) => prev.map((i) => i.id === editingItem.id ? { ...form, id: editingItem.id } : i));
      setEditingItem(null);
    } else {
      const { data, error } = await supabase.from("clothing_items").insert({ user_id: userId, ...form }).select().single();
      if (!error && data) setItems((prev) => [...prev, { id: data.id, name: data.name, brand: data.brand, size: data.size, category: data.category, link: data.link ?? "", image: data.image ?? "" }]);
    }
    resetForm(); setShowAddItem(false); setSaving(false);
  };
 
  const deleteItem = async (id: string) => {
    await supabase.from("clothing_items").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
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
 
  // Pack CRUD
  const savePack = async () => {
    if (!packForm.name || !userId) return;
    setSaving(true);
    const { data, error } = await supabase.from("travel_packs").insert({ user_id: userId, ...packForm, item_ids: [] }).select().single();
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
    setPacks((prev) => prev.map((p) => p.id === packSelectMode ? { ...p, item_ids: selectedForPack } : p));
    setPackSelectMode(null); setSelectedForPack([]); setSaving(false);
  };
 
  const deletePack = async (id: string) => {
    await supabase.from("travel_packs").delete().eq("id", id);
    setPacks((prev) => prev.filter((p) => p.id !== id));
  };
 
  const filteredItems =
    filterCategory === "All" ? items
    : filterCategory === "Bottoms" ? items.filter((i) => BOTTOMS_SUBCATEGORIES.includes(i.category))
    : items.filter((i) => i.category === filterCategory);
 
  // Responsive values
  const px = isMobile ? "16px" : "40px";
  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 16px", borderRadius: "12px", border: `1.5px solid ${C.border}`, fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: C.cream, color: C.text, fontFamily: "inherit" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 700, color: C.mauve, marginBottom: "6px", letterSpacing: "0.06em", textTransform: "uppercase" };
 
  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `linear-gradient(135deg, ${C.roseLight}, ${C.roseMid})` }} />
    </div>
  );
 
  if (!userId) return <LoginScreen />;
 
  const firstName = userName.split(" ")[0] || "there";
 
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: C.text }}>
 
      {/* ── Header ── */}
      <header style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.borderLight}`, padding: `0 ${px}`, height: isMobile ? "56px" : "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(194,139,139,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: `linear-gradient(135deg, ${C.roseLight}, ${C.roseMid})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <span style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: 800, color: C.text, letterSpacing: "-0.4px" }}>My Wardrobe</span>
        </div>
 
        {!packSelectMode && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {!isMobile && (
              <button style={btnOutline()} onClick={() => { resetForm(); setEditingItem(null); setShowAddItem(true); }}>
                + Add Item
              </button>
            )}
            {isMobile ? (
              <button style={{ ...btnPrimary(), padding: "8px 16px", fontSize: "13px" }} onClick={() => { resetForm(); setEditingItem(null); setShowAddItem(true); }}>
                + Add
              </button>
            ) : (
              <button style={btnPrimary()} onClick={() => setShowAddPack(true)}>
                New Trip
              </button>
            )}
            <button onClick={() => supabase.auth.signOut()} title={`Sign out (${userEmail})`} style={{ background: "none", border: `1.5px solid ${C.border}`, cursor: "pointer", borderRadius: "50%", overflow: "hidden", width: isMobile ? "32px" : "36px", height: isMobile ? "32px" : "36px", padding: 0, flexShrink: 0 }}>
              {userAvatar
                ? <img src={userAvatar} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", display: "block" }} />
                : <div style={{ width: "100%", height: "100%", backgroundColor: C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: C.rose }}>{userEmail[0]?.toUpperCase()}</div>
              }
            </button>
          </div>
        )}
      </header>
 
      {/* ── Hero ── */}
      {!packSelectMode && (
        <div style={{ background: `linear-gradient(135deg, ${C.roseLight} 0%, #fdf3f0 60%, ${C.cream} 100%)`, padding: isMobile ? "24px 16px 20px" : "36px 40px 32px", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: C.rose, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>Welcome back</p>
            <h1 style={{ fontSize: isMobile ? "24px" : "30px", fontWeight: 800, color: C.text, letterSpacing: "-0.5px", marginBottom: "4px" }}>
              Hi, {firstName}
            </h1>
            <p style={{ fontSize: "14px", color: C.textMid }}>
              {items.length === 0 ? "Start building your wardrobe below." : `${items.length} piece${items.length !== 1 ? "s" : ""} in your closet.`}
            </p>
            {isMobile && (
              <button style={{ ...btnPrimary(), marginTop: "16px", width: "100%", padding: "13px" }} onClick={() => setShowAddPack(true)}>
                New Trip
              </button>
            )}
          </div>
        </div>
      )}
 
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: isMobile ? "24px 16px 100px" : "40px 40px" }}>
        {dataLoading ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: C.textLight, fontSize: "15px" }}>
            Loading your wardrobe…
          </div>
        ) : (
          <>
            {/* ── Wardrobe ── */}
            <section style={{ marginBottom: "56px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: C.text, letterSpacing: "-0.3px" }}>Wardrobe</h2>
                  <p style={{ fontSize: "13px", color: C.textLight, marginTop: "2px" }}>{items.length} piece{items.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
 
              {/* Filter chips — horizontally scrollable on mobile */}
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "24px", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                {["All", ...CATEGORIES].map((cat) => {
                  if (cat === "Bottoms") {
                    return (
                      <BottomsDropdown
                        key="bottoms"
                        filterCategory={filterCategory}
                        setFilterCategory={setFilterCategory}
                      />
                    );
                  }
                  return (
                    <button key={cat} style={chip(filterCategory === cat)} onClick={() => setFilterCategory(cat)}>
                      {cat}
                    </button>
                  );
                })}
              </div>
 
              {/* Grid */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))", gap: isMobile ? "12px" : "20px" }}>
                {filteredItems.length === 0 && (
                  <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "56px 20px", color: C.textLight, fontSize: "15px" }}>
                    No items here yet.
                  </div>
                )}
                {filteredItems.map((item) => {
                  const inSelect = !!packSelectMode;
                  const isSelected = selectedForPack.includes(item.id);
                  return (
                    <div key={item.id} style={cardStyle(inSelect, isSelected)} onClick={inSelect ? () => setSelectedForPack((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]) : undefined}>
                      <div style={{ width: "100%", aspectRatio: "1", backgroundColor: C.roseLight, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                        {item.image
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.roseMid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                              </svg>
                              <span style={{ fontSize: "11px", color: C.textLight, fontWeight: 600 }}>No photo</span>
                            </div>
                          )
                        }
                        <div style={{ position: "absolute", bottom: "8px", left: "8px", backgroundColor: "rgba(255,255,255,0.88)", backdropFilter: "blur(4px)", borderRadius: "100px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: C.mauve }}>
                          {item.category}
                        </div>
                      </div>
                      {inSelect && <div style={checkCircle(isSelected)}>{isSelected ? "✓" : ""}</div>}
                      <div style={{ padding: isMobile ? "10px 12px 12px" : "14px 16px 16px" }}>
                        <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: 700, marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: C.text }}>{item.name}</div>
                        <div style={{ fontSize: "12px", color: C.textMid, marginBottom: "1px" }}>{item.brand}</div>
                        <div style={{ fontSize: "12px", color: C.textLight }}>Size {item.size}</div>
                        {!inSelect && (
                          <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                            {item.link && (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ ...smallAction("primary"), textDecoration: "none", textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
                                Buy
                              </a>
                            )}
                            <button style={smallAction("ghost")} onClick={() => startEdit(item)}>Edit</button>
                            <button style={smallAction("danger")} onClick={() => deleteItem(item.id)}>✕</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
 
            {/* ── Travel Packs ── */}
            <section>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <h2 style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: C.text, letterSpacing: "-0.3px" }}>Travel Packs</h2>
                  <p style={{ fontSize: "13px", color: C.textLight, marginTop: "2px" }}>{packs.length} trip{packs.length !== 1 ? "s" : ""}</p>
                </div>
                {!isMobile && <button style={btnPrimary()} onClick={() => setShowAddPack(true)}>+ New Trip</button>}
              </div>
 
              {packs.length === 0 && (
                <div style={{ textAlign: "center", padding: "48px 20px", backgroundColor: C.surface, borderRadius: "20px", border: `1.5px dashed ${C.border}` }}>
                  <p style={{ color: C.textLight, fontSize: "15px" }}>No trips yet. Create one and pack your pieces.</p>
                </div>
              )}
 
              {packs.map((pack) => {
                const packItems = items.filter((i) => pack.item_ids.includes(i.id));
                const isOpen = expandedPack === pack.id;
                return (
                  <div key={pack.id} style={{ backgroundColor: C.surface, borderRadius: "20px", border: `1.5px solid ${C.borderLight}`, overflow: "hidden", marginBottom: "12px", boxShadow: "0 2px 12px rgba(194,139,139,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "16px" : "20px 24px", cursor: "pointer" }} onClick={() => setExpandedPack(isOpen ? null : pack.id)}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `linear-gradient(135deg, ${C.roseLight}, ${C.roseMid})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                          </svg>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: isMobile ? "14px" : "16px", fontWeight: 800, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pack.name}</div>
                          <div style={{ fontSize: "12px", color: C.textMid, marginTop: "2px" }}>
                            {pack.destination && `${pack.destination}${pack.date ? " · " : ""}`}
                            {pack.date && `${pack.date} · `}
                            <span style={{ color: C.rose, fontWeight: 600 }}>{packItems.length} piece{packItems.length !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0, marginLeft: "8px" }}>
                        <button style={{ ...smallAction("ghost"), fontSize: isMobile ? "11px" : "12px", padding: isMobile ? "5px 8px" : "6px 12px", whiteSpace: "nowrap" }} onClick={(e) => { e.stopPropagation(); setPackSelectMode(pack.id); setSelectedForPack([...pack.item_ids]); }}>
                          {isMobile ? "Edit" : "Edit items"}
                        </button>
                        <button style={smallAction("danger")} onClick={(e) => { e.stopPropagation(); deletePack(pack.id); }}>✕</button>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", color: C.textLight }}>
                          <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
 
                    {isOpen && (
                      <div style={{ borderTop: `1px solid ${C.borderLight}`, padding: isMobile ? "16px" : "20px 24px" }}>
                        {packItems.length === 0 ? (
                          <p style={{ color: C.textLight, fontSize: "13px" }}>No items in this pack yet.</p>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
                            {packItems.map((item) => (
                              <div key={item.id} style={{ backgroundColor: C.cream, borderRadius: "14px", overflow: "hidden", border: `1px solid ${C.borderLight}` }}>
                                <div style={{ width: "100%", aspectRatio: "1", backgroundColor: C.roseLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  {item.image
                                    // eslint-disable-next-line @next/next/no-img-element
                                    ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.roseMid} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                                  }
                                </div>
                                <div style={{ padding: "8px 10px" }}>
                                  <div style={{ fontSize: "12px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: C.text }}>{item.name}</div>
                                  <div style={{ fontSize: "11px", color: C.textMid }}>{item.brand} · {item.size}</div>
                                  {item.link && (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "5px", fontSize: "11px", fontWeight: 700, color: C.rose, textDecoration: "none" }}>
                                      Buy →
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
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
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(44,32,32,0.35)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? "0" : "20px" }} onClick={() => { setShowAddItem(false); setEditingItem(null); resetForm(); }}>
          <div style={{ backgroundColor: C.surface, borderRadius: isMobile ? "24px 24px 0 0" : "24px", padding: isMobile ? "28px 20px 36px" : "36px", width: "100%", maxWidth: isMobile ? "100%" : "480px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 -8px 40px rgba(194,139,139,0.14)" }} onClick={(e) => e.stopPropagation()}>
            {/* Drag handle on mobile */}
            {isMobile && <div style={{ width: "40px", height: "4px", borderRadius: "2px", backgroundColor: C.border, margin: "0 auto 20px" }} />}
            <div style={{ fontSize: "18px", fontWeight: 800, color: C.text, marginBottom: "24px" }}>{editingItem ? "Edit Item" : "Add to Wardrobe"}</div>
 
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Item Name *</label>
              <input style={inputStyle} placeholder="e.g. Silk Slip Dress" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Brand / Store *</label>
              <input style={inputStyle} placeholder="e.g. Reformation" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Size *</label>
                <input style={inputStyle} placeholder="XS / M / 6" value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  {ALL_LEAF_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Purchase Link</label>
              <input style={inputStyle} placeholder="https://..." value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Photo</label>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              <button style={{ ...btnOutline(), width: "100%", padding: "11px 16px", borderStyle: form.image ? "solid" : "dashed" }} onClick={() => fileInputRef.current?.click()}>
                {form.image ? "Photo selected — tap to change" : "Upload a photo"}
              </button>
            </div>
 
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button style={{ ...btnOutline(), flex: 1 }} onClick={() => { setShowAddItem(false); setEditingItem(null); resetForm(); }}>Cancel</button>
              <button style={{ ...btnPrimary(saving), flex: 1 }} onClick={saveItem} disabled={saving}>
                {saving ? "Saving…" : editingItem ? "Save Changes" : "Add to Wardrobe"}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* ── New Trip Modal ── */}
      {showAddPack && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(44,32,32,0.35)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? "0" : "20px" }} onClick={() => setShowAddPack(false)}>
          <div style={{ backgroundColor: C.surface, borderRadius: isMobile ? "24px 24px 0 0" : "24px", padding: isMobile ? "28px 20px 36px" : "36px", width: "100%", maxWidth: isMobile ? "100%" : "440px", boxShadow: "0 -8px 40px rgba(194,139,139,0.14)" }} onClick={(e) => e.stopPropagation()}>
            {isMobile && <div style={{ width: "40px", height: "4px", borderRadius: "2px", backgroundColor: C.border, margin: "0 auto 20px" }} />}
            <div style={{ fontSize: "18px", fontWeight: 800, color: C.text, marginBottom: "24px" }}>New Travel Pack</div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Trip Name *</label>
              <input style={inputStyle} placeholder="e.g. Paris Weekend" value={packForm.name} onChange={(e) => setPackForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Destination</label>
              <input style={inputStyle} placeholder="e.g. Paris, France" value={packForm.destination} onChange={(e) => setPackForm((f) => ({ ...f, destination: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "8px" }}>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={packForm.date} onChange={(e) => setPackForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button style={{ ...btnOutline(), flex: 1 }} onClick={() => setShowAddPack(false)}>Cancel</button>
              <button style={{ ...btnPrimary(saving), flex: 1 }} onClick={savePack} disabled={saving}>
                {saving ? "Creating…" : "Create & Select Items"}
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* ── Pack selection banner ── */}
      {packSelectMode && (
        <div style={{ position: "fixed", bottom: isMobile ? "16px" : "28px", left: "50%", transform: "translateX(-50%)", backgroundColor: C.text, color: "#fff", borderRadius: "100px", padding: isMobile ? "12px 18px" : "16px 28px", display: "flex", alignItems: "center", gap: isMobile ? "10px" : "18px", fontSize: isMobile ? "13px" : "14px", fontWeight: 600, zIndex: 300, boxShadow: "0 8px 32px rgba(44,32,32,0.25)", whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)" }}>
          <span style={{ color: C.roseMid }}>{selectedForPack.length} selected</span>
          <button style={{ backgroundColor: C.rose, color: "#fff", border: "none", borderRadius: "100px", padding: isMobile ? "7px 16px" : "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: isMobile ? "12px" : "13px", opacity: saving ? 0.7 : 1 }} onClick={finishPackSelection} disabled={saving}>
            {saving ? "Saving…" : "Done"}
          </button>
          <button style={{ backgroundColor: "transparent", color: C.textLight, border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600 }} onClick={() => { setPackSelectMode(null); setSelectedForPack([]); }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}


// "use client";
 
// import { useState, useRef, useEffect, useCallback } from "react";
// import { createClient } from "@supabase/supabase-js";

// console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
 
// // ── Supabase client ──────────────────────────────────────────────────────────
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);
 
// // ── Types ────────────────────────────────────────────────────────────────────
// interface ClothingItem {
//   id: string;
//   name: string;
//   brand: string;
//   size: string;
//   link: string;
//   image: string;
//   category: string;
// }
 
// interface TravelPack {
//   id: string;
//   name: string;
//   destination: string;
//   date: string;
//   item_ids: string[];
// }
 
// // ── Constants ────────────────────────────────────────────────────────────────
// const CATEGORIES = ["Tops", "Sweaters", "Bottoms", "Outerwear", "Footwear", "Accessories", "Other"];
// const BOTTOMS_SUBCATEGORIES = ["Shorts", "Skirts", "Pants"];
// const ALL_LEAF_CATEGORIES = ["Tops", "Sweaters", "Shorts", "Skirts", "Pants", "Outerwear", "Footwear", "Accessories", "Other"];
 
// const CATEGORY_EMOJI: Record<string, string> = {
//   Tops: "👕", Sweaters: "🧶", Bottoms: "👖",
//   Pants: "👖", Shorts: "🩳", Skirts: "👗",
//   Outerwear: "🧥", Footwear: "👟", Accessories: "🕶️", Other: "📦",
// };
 
// // ── Styles (defined outside component so they don't re-create each render) ───
// const S: Record<string, React.CSSProperties> = {
//   page: { minHeight: "100vh", backgroundColor: "#f9f8f6", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: "#1a1a1a" },
//   header: { backgroundColor: "#ffffff", borderBottom: "1px solid #e8e5e0", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
//   logo: { fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" },
//   container: { maxWidth: "1280px", margin: "0 auto", padding: "40px 40px" },
//   section: { marginBottom: "60px" },
//   sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" },
//   sectionTitle: { fontSize: "22px", fontWeight: 700 },
//   pill: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#1a1a1a", color: "#ffffff", border: "none", borderRadius: "100px", padding: "10px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer" },
//   pillOutline: { display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", color: "#1a1a1a", border: "1.5px solid #d4d0ca", borderRadius: "100px", padding: "9px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" },
//   filterBar: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" },
//   grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" },
//   cardImage: { width: "100%", aspectRatio: "1", objectFit: "cover", backgroundColor: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" },
//   cardBody: { padding: "14px 16px 16px" },
//   cardName: { fontSize: "14px", fontWeight: 600, marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
//   cardMeta: { fontSize: "12px", color: "#777", marginBottom: "2px" },
//   cardActions: { display: "flex", gap: "8px", marginTop: "12px" },
//   overlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
//   modal: { backgroundColor: "#ffffff", borderRadius: "20px", padding: "32px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" },
//   modalTitle: { fontSize: "20px", fontWeight: 700, marginBottom: "24px" },
//   field: { marginBottom: "16px" },
//   label: { display: "block", fontSize: "13px", fontWeight: 600, color: "#444", marginBottom: "6px" },
//   input: { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e0ddd8", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#fafaf9" },
//   select: { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e0ddd8", fontSize: "14px", outline: "none", boxSizing: "border-box", backgroundColor: "#fafaf9", cursor: "pointer" },
//   modalActions: { display: "flex", gap: "10px", marginTop: "24px" },
//   packCard: { backgroundColor: "#ffffff", borderRadius: "16px", border: "1.5px solid #e8e5e0", overflow: "hidden", marginBottom: "16px" },
//   packHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", cursor: "pointer" },
//   packTitle: { fontSize: "16px", fontWeight: 700 },
//   packMeta: { fontSize: "13px", color: "#888", marginTop: "2px" },
//   packItemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px", padding: "0 20px 20px" },
//   selectBanner: { position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#1a1a1a", color: "#fff", borderRadius: "100px", padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", fontWeight: 600, zIndex: 300, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" },
//   // Login screen
//   loginPage: { minHeight: "100vh", backgroundColor: "#f9f8f6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
//   loginCard: { backgroundColor: "#ffffff", borderRadius: "24px", padding: "48px 40px", width: "100%", maxWidth: "400px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
// };
 
// function filterChip(active: boolean): React.CSSProperties {
//   return { backgroundColor: active ? "#1a1a1a" : "#ffffff", color: active ? "#ffffff" : "#555", border: `1.5px solid ${active ? "#1a1a1a" : "#e0ddd8"}`, borderRadius: "100px", padding: "7px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer" };
// }
// function card(selectable: boolean, selected: boolean): React.CSSProperties {
//   return { backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden", border: `2px solid ${selected ? "#1a1a1a" : selectable ? "#d4d0ca" : "transparent"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: selectable ? "pointer" : "default", transition: "transform 0.15s, box-shadow 0.15s", position: "relative" };
// }
// function smallBtn(variant: "primary" | "ghost" | "danger"): React.CSSProperties {
//   return { flex: variant === "primary" ? 1 : undefined, fontSize: "12px", fontWeight: 600, padding: "6px 10px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: variant === "primary" ? "#1a1a1a" : variant === "danger" ? "#fee2e2" : "#f0ede8", color: variant === "primary" ? "#fff" : variant === "danger" ? "#dc2626" : "#555" };
// }
// function checkBadge(checked: boolean): React.CSSProperties {
//   return { position: "absolute", top: "10px", right: "10px", width: "26px", height: "26px", borderRadius: "50%", backgroundColor: checked ? "#1a1a1a" : "rgba(255,255,255,0.85)", border: `2px solid ${checked ? "#1a1a1a" : "#bbb"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" };
// }
 
// // ── Login screen ─────────────────────────────────────────────────────────────
// function LoginScreen({ onLogin }: { onLogin: () => void }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
 
//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     setError("");
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: { redirectTo: window.location.origin },
//     });
//     if (error) { setError(error.message); setLoading(false); }
//   };
 
//   return (
//     <div style={S.loginPage}>
//       <div style={S.loginCard}>
//         <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧳</div>
//         <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "8px", color: "#1a1a1a" }}>MyWardrobe</h1>
//         <p style={{ fontSize: "15px", color: "#888", marginBottom: "36px", lineHeight: 1.5 }}>
//           Your personal clothing inventory.<br />Log in to access your wardrobe from any device.
//         </p>
//         {error && (
//           <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", marginBottom: "16px" }}>
//             {error}
//           </div>
//         )}
//         <button
//           style={{ ...S.pill, width: "100%", justifyContent: "center", fontSize: "15px", padding: "14px 20px", gap: "10px", opacity: loading ? 0.7 : 1 }}
//           onClick={handleGoogleLogin}
//           disabled={loading}
//         >
//           <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//             <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
//             <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
//             <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
//             <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
//           </svg>
//           {loading ? "Redirecting…" : "Continue with Google"}
//         </button>
//         <p style={{ fontSize: "12px", color: "#bbb", marginTop: "24px" }}>
//           Your data is private to your account only.
//         </p>
//       </div>
//     </div>
//   );
// }
 
// // ── Main app ─────────────────────────────────────────────────────────────────
// export default function WardrobePage() {
//   // Auth
//   const [userId, setUserId] = useState<string | null>(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [userEmail, setUserEmail] = useState("");
//   const [userAvatar, setUserAvatar] = useState("");
 
//   // Data
//   const [items, setItems] = useState<ClothingItem[]>([]);
//   const [packs, setPacks] = useState<TravelPack[]>([]);
//   const [dataLoading, setDataLoading] = useState(false);
 
//   // UI
//   const [showAddItem, setShowAddItem] = useState(false);
//   const [showAddPack, setShowAddPack] = useState(false);
//   const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [showBottomsSub, setShowBottomsSub] = useState(false);
//   const [expandedPack, setExpandedPack] = useState<string | null>(null);
//   const [packSelectMode, setPackSelectMode] = useState<string | null>(null);
//   const [selectedForPack, setSelectedForPack] = useState<string[]>([]);
//   const [saving, setSaving] = useState(false);
 
//   const fileInputRef = useRef<HTMLInputElement>(null);
 
//   const [form, setForm] = useState({ name: "", brand: "", size: "", link: "", image: "", category: "Tops" });
//   const [packForm, setPackForm] = useState({ name: "", destination: "", date: "" });
 
//   // ── Auth listener ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUserId(session?.user?.id ?? null);
//       setUserEmail(session?.user?.email ?? "");
//       setUserAvatar(session?.user?.user_metadata?.avatar_url ?? "");
//       setAuthLoading(false);
//     });
 
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUserId(session?.user?.id ?? null);
//       setUserEmail(session?.user?.email ?? "");
//       setUserAvatar(session?.user?.user_metadata?.avatar_url ?? "");
//     });
 
//     return () => subscription.unsubscribe();
//   }, []);
 
//   // ── Load data when logged in ───────────────────────────────────────────────
//   const loadData = useCallback(async () => {
//     if (!userId) return;
//     setDataLoading(true);
 
//     const [{ data: itemsData }, { data: packsData }] = await Promise.all([
//       supabase.from("clothing_items").select("*").eq("user_id", userId).order("created_at"),
//       supabase.from("travel_packs").select("*").eq("user_id", userId).order("created_at"),
//     ]);
 
//     setItems(
//       (itemsData ?? []).map((r) => ({
//         id: r.id, name: r.name, brand: r.brand, size: r.size,
//         category: r.category, link: r.link ?? "", image: r.image ?? "",
//       }))
//     );
//     setPacks(
//       (packsData ?? []).map((r) => ({
//         id: r.id, name: r.name, destination: r.destination ?? "",
//         date: r.date ?? "", item_ids: r.item_ids ?? [],
//       }))
//     );
//     setDataLoading(false);
//   }, [userId]);
 
//   useEffect(() => { loadData(); }, [loadData]);
 
//   // ── CRUD: items ────────────────────────────────────────────────────────────
//   const resetForm = () => setForm({ name: "", brand: "", size: "", link: "", image: "", category: "Tops" });
 
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => setForm((f) => ({ ...f, image: reader.result as string }));
//     reader.readAsDataURL(file);
//   };
 
//   const saveItem = async () => {
//     if (!form.name || !form.brand || !form.size || !userId) return;
//     setSaving(true);
 
//     if (editingItem) {
//       const { error } = await supabase
//         .from("clothing_items")
//         .update({ name: form.name, brand: form.brand, size: form.size, category: form.category, link: form.link, image: form.image })
//         .eq("id", editingItem.id);
//       if (!error) setItems((prev) => prev.map((i) => i.id === editingItem.id ? { ...form, id: editingItem.id } : i));
//       setEditingItem(null);
//     } else {
//       const { data, error } = await supabase
//         .from("clothing_items")
//         .insert({ user_id: userId, name: form.name, brand: form.brand, size: form.size, category: form.category, link: form.link, image: form.image })
//         .select()
//         .single();
//       if (!error && data) setItems((prev) => [...prev, { id: data.id, name: data.name, brand: data.brand, size: data.size, category: data.category, link: data.link ?? "", image: data.image ?? "" }]);
//     }
 
//     resetForm();
//     setShowAddItem(false);
//     setSaving(false);
//   };
 
//   const deleteItem = async (id: string) => {
//     await supabase.from("clothing_items").delete().eq("id", id);
//     setItems((prev) => prev.filter((i) => i.id !== id));
//     // Remove from all packs
//     for (const pack of packs) {
//       if (pack.item_ids.includes(id)) {
//         const newIds = pack.item_ids.filter((iid) => iid !== id);
//         await supabase.from("travel_packs").update({ item_ids: newIds }).eq("id", pack.id);
//       }
//     }
//     setPacks((prev) => prev.map((p) => ({ ...p, item_ids: p.item_ids.filter((iid) => iid !== id) })));
//   };
 
//   const startEdit = (item: ClothingItem) => {
//     setForm({ name: item.name, brand: item.brand, size: item.size, link: item.link, image: item.image, category: item.category });
//     setEditingItem(item);
//     setShowAddItem(true);
//   };
 
//   // ── CRUD: packs ────────────────────────────────────────────────────────────
//   const savePack = async () => {
//     if (!packForm.name || !userId) return;
//     setSaving(true);
//     const { data, error } = await supabase
//       .from("travel_packs")
//       .insert({ user_id: userId, name: packForm.name, destination: packForm.destination, date: packForm.date, item_ids: [] })
//       .select()
//       .single();
 
//     if (!error && data) {
//       const newPack: TravelPack = { id: data.id, name: data.name, destination: data.destination ?? "", date: data.date ?? "", item_ids: [] };
//       setPacks((prev) => [...prev, newPack]);
//       setPackForm({ name: "", destination: "", date: "" });
//       setShowAddPack(false);
//       setPackSelectMode(newPack.id);
//       setSelectedForPack([]);
//     }
//     setSaving(false);
//   };
 
//   const finishPackSelection = async () => {
//     if (!packSelectMode) return;
//     setSaving(true);
//     await supabase.from("travel_packs").update({ item_ids: selectedForPack }).eq("id", packSelectMode);
//     setPacks((prev) => prev.map((p) => (p.id === packSelectMode ? { ...p, item_ids: selectedForPack } : p)));
//     setPackSelectMode(null);
//     setSelectedForPack([]);
//     setSaving(false);
//   };
 
//   const deletePack = async (id: string) => {
//     await supabase.from("travel_packs").delete().eq("id", id);
//     setPacks((prev) => prev.filter((p) => p.id !== id));
//   };
 
//   const signOut = () => supabase.auth.signOut();
 
//   // ── Filtering ──────────────────────────────────────────────────────────────
//   const filteredItems =
//     filterCategory === "All" ? items
//     : filterCategory === "Bottoms" ? items.filter((i) => BOTTOMS_SUBCATEGORIES.includes(i.category))
//     : items.filter((i) => i.category === filterCategory);
 
//   // ── Loading / auth gates ───────────────────────────────────────────────────
//   if (authLoading) {
//     return (
//       <div style={{ ...S.loginPage }}>
//         <div style={{ fontSize: "32px" }}>🧳</div>
//       </div>
//     );
//   }
 
//   if (!userId) return <LoginScreen onLogin={() => {}} />;
 
//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <div style={S.page}>
//       {/* ── Header ── */}
//       <header style={S.header}>
//         <span style={S.logo}>🧳 MyWardrobe</span>
//         <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//           {!packSelectMode && (
//             <>
//               <button style={S.pillOutline} onClick={() => { resetForm(); setEditingItem(null); setShowAddItem(true); }}>
//                 + Add Item
//               </button>
//               <button style={S.pill} onClick={() => setShowAddPack(true)}>
//                 ✈️ New Trip
//               </button>
//               {/* Avatar / sign out */}
//               <button
//                 onClick={signOut}
//                 title={`Sign out (${userEmail})`}
//                 style={{ background: "none", border: "none", cursor: "pointer", borderRadius: "50%", overflow: "hidden", width: "36px", height: "36px", padding: 0 }}
//               >
//                 {userAvatar
//                   ? <img src={userAvatar} alt="avatar" style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
//                   : <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#e0ddd8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700 }}>
//                       {userEmail[0]?.toUpperCase()}
//                     </div>
//                 }
//               </button>
//             </>
//           )}
//         </div>
//       </header>
 
//       <div style={S.container}>
//         {dataLoading ? (
//           <div style={{ textAlign: "center", padding: "80px 20px", color: "#aaa", fontSize: "15px" }}>
//             Loading your wardrobe…
//           </div>
//         ) : (
//           <>
//             {/* ── Wardrobe Section ── */}
//             <section style={S.section}>
//               <div style={S.sectionHeader}>
//                 <h2 style={S.sectionTitle}>
//                   Wardrobe{" "}
//                   <span style={{ fontWeight: 400, color: "#aaa", fontSize: "16px" }}>({items.length})</span>
//                 </h2>
//               </div>
 
//               {/* Filter bar */}
//               <div style={S.filterBar}>
//                 {["All", ...CATEGORIES].map((cat) => {
//                   if (cat === "Bottoms") {
//                     const isBottomsActive = filterCategory === "Bottoms" || BOTTOMS_SUBCATEGORIES.includes(filterCategory);
//                     return (
//                       <div key="bottoms-group" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
//                         <button
//                           style={filterChip(isBottomsActive)}
//                           onClick={() => { setShowBottomsSub((v) => !v); setFilterCategory("Bottoms"); }}
//                         >
//                           Bottoms {showBottomsSub ? "▲" : "▼"}
//                         </button>
//                         {showBottomsSub && BOTTOMS_SUBCATEGORIES.map((sub) => (
//                           <button
//                             key={sub}
//                             style={{ ...filterChip(filterCategory === sub), fontSize: "12px", padding: "5px 13px", border: `1.5px solid ${filterCategory === sub ? "#1a1a1a" : "#c8c4be"}`, backgroundColor: filterCategory === sub ? "#1a1a1a" : "#f5f3ef", color: filterCategory === sub ? "#fff" : "#666" }}
//                             onClick={() => { setFilterCategory(sub); setShowBottomsSub(false); }}
//                           >
//                             {sub}
//                           </button>
//                         ))}
//                       </div>
//                     );
//                   }
//                   return (
//                     <button
//                       key={cat}
//                       style={filterChip(filterCategory === cat)}
//                       onClick={() => { setFilterCategory(cat); setShowBottomsSub(false); }}
//                     >
//                       {cat}
//                     </button>
//                   );
//                 })}
//               </div>
 
//               {/* Grid */}
//               <div style={S.grid}>
//                 {filteredItems.length === 0 && (
//                   <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: "#aaa", fontSize: "15px" }}>
//                     No items yet. Add your first piece above.
//                   </div>
//                 )}
//                 {filteredItems.map((item) => {
//                   const inSelectMode = !!packSelectMode;
//                   const isSelected = selectedForPack.includes(item.id);
//                   return (
//                     <div
//                       key={item.id}
//                       style={card(inSelectMode, isSelected)}
//                       onClick={inSelectMode ? () => setSelectedForPack((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]) : undefined}
//                     >
//                       <div style={S.cardImage}>
//                         {item.image
//                           // eslint-disable-next-line @next/next/no-img-element
//                           ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                           : <span>{CATEGORY_EMOJI[item.category] ?? "👔"}</span>
//                         }
//                       </div>
//                       {inSelectMode && <div style={checkBadge(isSelected)}>{isSelected ? "✓" : ""}</div>}
//                       <div style={S.cardBody}>
//                         <div style={S.cardName}>{item.name}</div>
//                         <div style={S.cardMeta}>{item.brand}</div>
//                         <div style={S.cardMeta}>Size: {item.size}</div>
//                         <div style={S.cardMeta}>{item.category}</div>
//                         {!inSelectMode && (
//                           <div style={S.cardActions}>
//                             {item.link && (
//                               <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ ...smallBtn("primary"), textDecoration: "none", textAlign: "center", display: "inline-block", flex: 1 }}>
//                                 Buy
//                               </a>
//                             )}
//                             <button style={smallBtn("ghost")} onClick={() => startEdit(item)}>Edit</button>
//                             <button style={smallBtn("danger")} onClick={() => deleteItem(item.id)}>✕</button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>
 
//             {/* ── Travel Packs Section ── */}
//             <section style={S.section}>
//               <div style={S.sectionHeader}>
//                 <h2 style={S.sectionTitle}>
//                   Travel Packs{" "}
//                   <span style={{ fontWeight: 400, color: "#aaa", fontSize: "16px" }}>({packs.length})</span>
//                 </h2>
//                 <button style={S.pill} onClick={() => setShowAddPack(true)}>+ New Trip</button>
//               </div>
 
//               {packs.length === 0 && (
//                 <div style={{ textAlign: "center", padding: "48px 20px", color: "#aaa", fontSize: "15px", backgroundColor: "#fff", borderRadius: "16px", border: "1.5px dashed #e0ddd8" }}>
//                   No trips yet. Create one and select your pieces.
//                 </div>
//               )}
 
//               {packs.map((pack) => {
//                 const packItems = items.filter((i) => pack.item_ids.includes(i.id));
//                 const isOpen = expandedPack === pack.id;
//                 return (
//                   <div key={pack.id} style={S.packCard}>
//                     <div style={S.packHeader} onClick={() => setExpandedPack(isOpen ? null : pack.id)}>
//                       <div>
//                         <div style={S.packTitle}>✈️ {pack.name}</div>
//                         <div style={S.packMeta}>
//                           {pack.destination && `${pack.destination} · `}
//                           {pack.date && `${pack.date} · `}
//                           {packItems.length} item{packItems.length !== 1 ? "s" : ""}
//                         </div>
//                       </div>
//                       <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//                         <button style={smallBtn("ghost")} onClick={(e) => { e.stopPropagation(); setPackSelectMode(pack.id); setSelectedForPack([...pack.item_ids]); }}>
//                           Edit items
//                         </button>
//                         <button style={smallBtn("danger")} onClick={(e) => { e.stopPropagation(); deletePack(pack.id); }}>✕</button>
//                         <span style={{ color: "#aaa", fontSize: "18px" }}>{isOpen ? "▲" : "▼"}</span>
//                       </div>
//                     </div>
 
//                     {isOpen && (
//                       <div style={S.packItemGrid}>
//                         {packItems.length === 0 && (
//                           <div style={{ gridColumn: "1 / -1", color: "#aaa", fontSize: "13px", paddingBottom: "8px" }}>
//                             No items in this pack yet.
//                           </div>
//                         )}
//                         {packItems.map((item) => (
//                           <div key={item.id} style={{ backgroundColor: "#fafaf9", borderRadius: "12px", overflow: "hidden", border: "1px solid #e8e5e0" }}>
//                             <div style={{ ...S.cardImage, fontSize: "28px" }}>
//                               {item.image
//                                 // eslint-disable-next-line @next/next/no-img-element
//                                 ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                                 : <span>{CATEGORY_EMOJI[item.category] ?? "👔"}</span>
//                               }
//                             </div>
//                             <div style={{ padding: "10px 12px" }}>
//                               <div style={{ fontSize: "12px", fontWeight: 600, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
//                               <div style={{ fontSize: "11px", color: "#888" }}>{item.brand} · {item.size}</div>
//                               {item.link && (
//                                 <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: "6px", fontSize: "11px", fontWeight: 700, color: "#1a1a1a", textDecoration: "none" }}>
//                                   Buy →
//                                 </a>
//                               )}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </section>
//           </>
//         )}
//       </div>
 
//       {/* ── Add / Edit Item Modal ── */}
//       {showAddItem && (
//         <div style={S.overlay} onClick={() => { setShowAddItem(false); setEditingItem(null); resetForm(); }}>
//           <div style={S.modal} onClick={(e) => e.stopPropagation()}>
//             <div style={S.modalTitle}>{editingItem ? "Edit Item" : "Add Clothing Item"}</div>
//             <div style={S.field}>
//               <label style={S.label}>Name *</label>
//               <input style={S.input} placeholder="e.g. Classic White Oxford" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
//             </div>
//             <div style={S.field}>
//               <label style={S.label}>Brand / Store *</label>
//               <input style={S.input} placeholder="e.g. J.Crew" value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} />
//             </div>
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
//               <div>
//                 <label style={S.label}>Size *</label>
//                 <input style={S.input} placeholder="M / 32x30 / 10" value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} />
//               </div>
//               <div>
//                 <label style={S.label}>Category</label>
//                 <select style={S.select} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
//                   {ALL_LEAF_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//                 </select>
//               </div>
//             </div>
//             <div style={S.field}>
//               <label style={S.label}>Purchase Link</label>
//               <input style={S.input} placeholder="https://..." value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
//             </div>
//             <div style={S.field}>
//               <label style={S.label}>Photo</label>
//               <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
//               <button style={{ ...S.pillOutline, width: "100%", justifyContent: "center" }} onClick={() => fileInputRef.current?.click()}>
//                 {form.image ? "✓ Photo selected — click to change" : "📷 Upload photo"}
//               </button>
//             </div>
//             <div style={S.modalActions}>
//               <button style={{ ...S.pillOutline, flex: 1 }} onClick={() => { setShowAddItem(false); setEditingItem(null); resetForm(); }}>Cancel</button>
//               <button style={{ ...S.pill, flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }} onClick={saveItem} disabled={saving}>
//                 {saving ? "Saving…" : editingItem ? "Save Changes" : "Add Item"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
 
//       {/* ── New Trip Modal ── */}
//       {showAddPack && (
//         <div style={S.overlay} onClick={() => setShowAddPack(false)}>
//           <div style={S.modal} onClick={(e) => e.stopPropagation()}>
//             <div style={S.modalTitle}>New Travel Pack</div>
//             <div style={S.field}>
//               <label style={S.label}>Trip Name *</label>
//               <input style={S.input} placeholder="e.g. Paris Weekend" value={packForm.name} onChange={(e) => setPackForm((f) => ({ ...f, name: e.target.value }))} />
//             </div>
//             <div style={S.field}>
//               <label style={S.label}>Destination</label>
//               <input style={S.input} placeholder="e.g. Paris, France" value={packForm.destination} onChange={(e) => setPackForm((f) => ({ ...f, destination: e.target.value }))} />
//             </div>
//             <div style={S.field}>
//               <label style={S.label}>Date</label>
//               <input style={S.input} type="date" value={packForm.date} onChange={(e) => setPackForm((f) => ({ ...f, date: e.target.value }))} />
//             </div>
//             <div style={S.modalActions}>
//               <button style={{ ...S.pillOutline, flex: 1 }} onClick={() => setShowAddPack(false)}>Cancel</button>
//               <button style={{ ...S.pill, flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }} onClick={savePack} disabled={saving}>
//                 {saving ? "Creating…" : "Create & Select Items"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
 
//       {/* ── Pack selection banner ── */}
//       {packSelectMode && (
//         <div style={S.selectBanner}>
//           <span>Select items for this trip · {selectedForPack.length} selected</span>
//           <button style={{ backgroundColor: "#fff", color: "#1a1a1a", border: "none", borderRadius: "100px", padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: "13px", opacity: saving ? 0.7 : 1 }} onClick={finishPackSelection} disabled={saving}>
//             {saving ? "Saving…" : "Done ✓"}
//           </button>
//           <button style={{ backgroundColor: "transparent", color: "#aaa", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600 }} onClick={() => { setPackSelectMode(null); setSelectedForPack([]); }}>
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
