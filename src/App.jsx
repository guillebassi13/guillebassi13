import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

/* ======================= ESTILOS / TOKENS ======================= */
const COLORS = {
  ink: "#1B1229",
  surface: "#251A34",
  surfaceLight: "#312242",
  border: "#443257",
  text: "#F3EDF7",
  textDim: "#B4A3C4",
  primary: "#E599D6",
  economia: "#C98CE0",
  salud: "#F0729C",
  trabajos: "#9B7FE8",
  tareas: "#F2A6C9",
  datos: "#B98CE0",
};

const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
    .pp-root * { box-sizing: border-box; }
    .pp-root { font-family: 'Inter', sans-serif; color: ${COLORS.text}; position: relative; }
    .pp-heading { font-family: 'Manrope', sans-serif; }
    .pp-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
    .pp-scroll::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
    .pp-input, .pp-textarea, .pp-select {
      background: ${COLORS.ink};
      border: 1px solid ${COLORS.border};
      color: ${COLORS.text};
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      width: 100%;
      outline: none;
    }
    .pp-input:focus, .pp-textarea:focus, .pp-select:focus { border-color: ${COLORS.primary}; }
    .pp-card { background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 14px; position: relative; z-index: 1; }
    .pp-btn {
      border: none; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600;
      cursor: pointer; font-family: 'Inter', sans-serif; transition: opacity .15s ease;
    }
    .pp-btn:hover { opacity: .85; }
    .pp-btn:active { opacity: .7; }
    .pp-tab { cursor: pointer; transition: all .15s ease; }
    .pp-checkbox { width: 20px; height: 20px; accent-color: ${COLORS.primary}; cursor: pointer; }
    .pp-blob {
      position: fixed; border-radius: 50%; filter: blur(60px); z-index: 0; pointer-events: none;
    }
    @keyframes pp-petal-fall {
      0%   { transform: translateY(-8vh) translateX(0px) rotate(-10deg); opacity: 0; }
      10%  { opacity: 0.55; }
      50%  { transform: translateY(50vh) translateX(var(--drift, 14px)) rotate(70deg); }
      90%  { opacity: 0.5; }
      100% { transform: translateY(108vh) translateX(calc(var(--drift, 14px) * -1)) rotate(150deg); opacity: 0; }
    }
    @keyframes pp-petal-sway {
      0%   { transform: translateY(-8vh) translateX(0px) rotate(-15deg); opacity: 0; }
      8%   { opacity: 0.6; }
      20%  { transform: translateY(14vh) translateX(calc(var(--drift, 30px) * -1)) rotate(10deg); }
      40%  { transform: translateY(38vh) translateX(var(--drift, 30px)) rotate(-20deg); }
      60%  { transform: translateY(62vh) translateX(calc(var(--drift, 30px) * -1)) rotate(15deg); }
      80%  { transform: translateY(86vh) translateX(var(--drift, 30px)) rotate(-10deg); }
      92%  { opacity: 0.55; }
      100% { transform: translateY(108vh) translateX(0px) rotate(20deg); opacity: 0; }
    }
    .pp-petal {
      position: fixed; top: 0; z-index: 0; pointer-events: none;
      animation-name: pp-petal-fall; animation-timing-function: ease-in-out; animation-iteration-count: infinite;
      border-radius: 0 100% 0 100%;
      background: linear-gradient(135deg, #F6C9DE, #E599D6 60%, #F0729C);
      box-shadow: inset -2px -2px 3px rgba(180,90,140,.25);
    }
    .pp-petal-sway {
      animation-name: pp-petal-sway;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
    }
    .pp-flower {
      position: fixed; top: 0; z-index: 0; pointer-events: none;
      animation-timing-function: ease-in-out; animation-iteration-count: infinite;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,.12));
    }
    @media (prefers-reduced-motion: reduce) {
      .pp-petal, .pp-flower { animation: none; opacity: 0.2; }
    }
  `}</style>
);

function BackgroundBlobs() {
  return (
    <>
      <div className="pp-blob" style={{ width: 320, height: 320, top: -80, left: -100, background: "radial-gradient(circle, #C98CE0, transparent 70%)", opacity: 0.35 }} />
      <div className="pp-blob" style={{ width: 260, height: 260, top: 260, right: -90, background: "radial-gradient(circle, #F0729C, transparent 70%)", opacity: 0.3 }} />
      <div className="pp-blob" style={{ width: 300, height: 300, bottom: -100, left: "30%", background: "radial-gradient(circle, #9B7FE8, transparent 70%)", opacity: 0.28 }} />
    </>
  );
}

const PETALS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  left: Math.round((i / 12) * 100 + (i % 3 === 0 ? 3 : -4)),
  size: 8 + (i % 4) * 3,
  duration: 26 + (i % 5) * 6,
  delay: -(i * 4.5),
  drift: (i % 2 === 0 ? 1 : -1) * (12 + (i % 3) * 8),
  sway: i % 3 === 0,
}));

const FLOWERS = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  left: Math.round((i / 4) * 100 + (i % 2 === 0 ? 6 : -6)),
  size: 22 + (i % 2) * 8,
  duration: 32 + i * 7,
  delay: -(i * 9),
  drift: (i % 2 === 0 ? 1 : -1) * (34 + i * 6),
}));

function FloatingPetals() {
  return (
    <>
      {PETALS.map((p) => (
        <div
          key={p.id}
          className={`pp-petal ${p.sway ? "pp-petal-sway" : ""}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.7,
            "--drift": `${p.drift}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {FLOWERS.map((f) => (
        <div
          key={f.id}
          className="pp-flower pp-petal-sway"
          style={{
            left: `${f.left}%`,
            fontSize: f.size,
            "--drift": `${f.drift}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          🌺
        </div>
      ))}
    </>
  );
}

/* ======================= STORAGE HELPERS (Supabase) ======================= */
import { supabase } from "./supabaseClient";

async function storageGet(key) {
  try {
    const { data, error } = await supabase.from("kv_store").select("value").eq("key", key).maybeSingle();
    if (error) throw error;
    return data ? data.value : null;
  } catch (e) {
    console.error("storageGet", key, e);
    return null;
  }
}
async function storageSet(key, value) {
  try {
    const { error } = await supabase.from("kv_store").upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
    return true;
  } catch (e) {
    console.error("storageSet", key, e);
    return false;
  }
}
async function storageDelete(key) {
  try {
    const { error } = await supabase.from("kv_store").delete().eq("key", key);
    if (error) throw error;
    return true;
  } catch (e) {
    console.error("storageDelete", key, e);
    return false;
  }
}
async function storageListKeys(prefix) {
  try {
    const { data, error } = await supabase.from("kv_store").select("key").like("key", `${prefix}%`);
    if (error) throw error;
    return data ? data.map((r) => r.key) : [];
  } catch (e) {
    console.error("storageListKeys", prefix, e);
    return [];
  }
}

function newId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

/* ======================= LIGHTBOX CONTEXT ======================= */
const LightboxContext = createContext(() => {});
function useLightbox() {
  return useContext(LightboxContext);
}

/* ======================= GENERIC COLLECTION HOOK ======================= */
function useCollection(prefix) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const keys = await storageListKeys(prefix);
    const loaded = [];
    for (const k of keys) {
      const raw = await storageGet(k);
      if (raw) {
        try {
          loaded.push(JSON.parse(raw));
        } catch (e) {}
      }
    }
    loaded.sort((a, b) => (a._order || 0) - (b._order || 0));
    setItems(loaded);
    setLoading(false);
  }, [prefix]);

  useEffect(() => {
    load();
  }, [load]);

  const addItem = async (data) => {
    const id = newId();
    const item = { id, _order: Date.now(), ...data };
    await storageSet(prefix + id, JSON.stringify(item));
    setItems((prev) => [...prev, item]);
    return item;
  };

  const updateItem = async (id, data) => {
    const updated = { ...data, id };
    await storageSet(prefix + id, JSON.stringify(updated));
    setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
  };

  const deleteItem = async (id) => {
    await storageDelete(prefix + id);
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return { items, loading, addItem, updateItem, deleteItem, reload: load };
}

/* ======================= IMAGE FIELD ======================= */
function ImageField({ value, onChange, label }) {
  const inputRef = useRef(null);
  const openLightbox = useLightbox();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 4 }}>{label}</div>}
      {value ? (
        <div style={{ position: "relative", width: 90, height: 90 }}>
          <img
            src={value}
            alt={label || "imagen"}
            onClick={() => openLightbox(value)}
            style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 8, cursor: "zoom-in", border: `1px solid ${COLORS.border}` }}
          />
          <button
            onClick={() => onChange("")}
            className="pp-btn"
            style={{ position: "absolute", top: -6, right: -6, background: "#C24B7C", color: "#fff", padding: "1px 6px", fontSize: 11, borderRadius: 999 }}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          className="pp-btn"
          onClick={() => inputRef.current && inputRef.current.click()}
          style={{ background: COLORS.surfaceLight, color: COLORS.textDim, width: 90, height: 90, border: `1px dashed ${COLORS.border}` }}
        >
          + Foto
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

/* ======================= FIELD RENDERER ======================= */
function FieldInput({ field, value, onChange }) {
  if (field.type === "textarea") {
    return (
      <textarea
        className="pp-textarea"
        rows={field.rows || 2}
        placeholder={field.label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select className="pp-select" value={value || field.options[0]} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "image") {
    return <ImageField value={value} onChange={onChange} />;
  }
  if (field.type === "checkbox") {
    return <input type="checkbox" className="pp-checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
  }
  return (
    <input
      className="pp-input"
      type={field.type || "text"}
      placeholder={field.label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* ======================= ENTITY LIST (CRUD genérico) ======================= */
function EntityList({ prefix, fields, accent, emptyText, cardTitle, cardSubtitle, layout = "grid", extraSummary }) {
  const { items, loading, addItem, updateItem, deleteItem } = useCollection(prefix);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  const startAdd = () => {
    setDraft({});
    setShowForm(true);
  };

  const submitAdd = async () => {
    await addItem(draft);
    setDraft({});
    setShowForm(false);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditDraft(item);
  };

  const saveEdit = async () => {
    await updateItem(editingId, editDraft);
    setEditingId(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: COLORS.textDim }}>{items.length} {items.length === 1 ? "elemento" : "elementos"}</div>
        <button className="pp-btn" style={{ background: accent, color: "#1B1229" }} onClick={startAdd}>
          + Agregar
        </button>
      </div>

      {showForm && (
        <div className="pp-card" style={{ padding: 14, marginBottom: 14, borderColor: accent }}>
          <div style={{ display: "grid", gridTemplateColumns: layout === "grid" ? "repeat(auto-fit, minmax(140px,1fr))" : "1fr", gap: 10 }}>
            {fields.map((f) => (
              <div key={f.key}>
                <FieldInput field={f} value={draft[f.key]} onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="pp-btn" style={{ background: accent, color: "#1B1229" }} onClick={submitAdd}>
              Guardar
            </button>
            <button className="pp-btn" style={{ background: COLORS.surfaceLight, color: COLORS.text }} onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: COLORS.textDim, fontSize: 13 }}>Cargando…</div>
      ) : items.length === 0 && !showForm ? (
        <div style={{ color: COLORS.textDim, fontSize: 13, padding: "20px 0", textAlign: "center" }}>{emptyText || "Todavía no hay nada acá. Tocá + Agregar."}</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px,1fr))", gap: 10 }}>
          {items.map((item) => (
            <div key={item.id} className="pp-card" style={{ padding: 12, borderLeft: `3px solid ${accent}` }}>
              {editingId === item.id ? (
                <div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {fields.map((f) => (
                      <FieldInput key={f.key} field={f} value={editDraft[f.key]} onChange={(v) => setEditDraft((d) => ({ ...d, [f.key]: v }))} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button className="pp-btn" style={{ background: accent, color: "#1B1229" }} onClick={saveEdit}>
                      Guardar
                    </button>
                    <button className="pp-btn" style={{ background: COLORS.surfaceLight }} onClick={() => setEditingId(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {cardTitle ? (
                    <div style={{ fontWeight: 700, marginBottom: 2 }} className="pp-heading">
                      {cardTitle(item)}
                    </div>
                  ) : null}
                  {cardSubtitle ? <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 6 }}>{cardSubtitle(item)}</div> : null}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {fields.map((f) => {
                      if (f.hideInCard) return null;
                      const val = item[f.key];
                      if (f.type === "image") {
                        return val ? <ImageFieldStatic key={f.key} value={val} /> : null;
                      }
                      if (!val) return null;
                      return (
                        <div key={f.key} style={{ fontSize: 13, color: COLORS.text, maxWidth: "100%" }}>
                          {f.showLabel && <span style={{ color: COLORS.textDim }}>{f.label}: </span>}
                          {String(val)}
                        </div>
                      );
                    })}
                  </div>
                  {extraSummary && <div style={{ marginTop: 6 }}>{extraSummary(item)}</div>}
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button className="pp-btn" style={{ background: COLORS.surfaceLight, fontSize: 12 }} onClick={() => startEdit(item)}>
                      Editar
                    </button>
                    <button
                      className="pp-btn"
                      style={{ background: "transparent", color: "#E08AB0", fontSize: 12, border: "1px solid #E08AB0" }}
                      onClick={() => deleteItem(item.id)}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageFieldStatic({ value }) {
  const openLightbox = useLightbox();
  return (
    <img
      src={value}
      onClick={() => openLightbox(value)}
      alt=""
      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6, cursor: "zoom-in", border: `1px solid ${COLORS.border}` }}
    />
  );
}

/* ======================= SECTION WRAPPER ======================= */
function Section({ title, subtitle, accent, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <div className="pp-heading" style={{ fontSize: 18, fontWeight: 800, color: accent }}>
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 13, color: COLORS.textDim, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function SubNav({ tabs, active, onChange, accent }) {
  return (
    <div className="pp-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
      {tabs.map((t) => (
        <div
          key={t.key}
          className="pp-tab"
          onClick={() => onChange(t.key)}
          style={{
            padding: "7px 14px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            background: active === t.key ? accent : COLORS.surfaceLight,
            color: active === t.key ? "#1B1229" : COLORS.textDim,
          }}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}

/* ======================= ECONOMÍA ======================= */
const GASTOS_FIJOS_DEFAULT = ["Alquiler", "Agua", "Luz", "Gas", "Internet", "Expensas", "Impuesto cochera", "Impuesto casa"];

function EconomiaGastosFijos() {
  const prefix = "economia-gastofijo-";
  const { items, loading, addItem, updateItem, deleteItem } = useCollection(prefix);
  const seeded = useRef(false);

  useEffect(() => {
    if (!loading && items.length === 0 && !seeded.current) {
      seeded.current = true;
      GASTOS_FIJOS_DEFAULT.forEach((name) => addItem({ nombre: name, monto: "" }));
    }
  }, [loading, items.length]);

  const total = items.reduce((s, it) => s + (parseFloat(it.monto) || 0), 0);

  return (
    <div>
      <div className="pp-card" style={{ padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: COLORS.textDim, fontSize: 13 }}>Total gastos fijos</span>
        <span style={{ fontWeight: 800 }} className="pp-heading">
          ${total.toLocaleString("es-AR")}
        </span>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((it) => (
          <GastoFijoRow key={it.id} item={it} onSave={(data) => updateItem(it.id, data)} onDelete={() => deleteItem(it.id)} />
        ))}
      </div>
      <button
        className="pp-btn"
        style={{ background: COLORS.economia, color: "#1B1229", marginTop: 12 }}
        onClick={() => addItem({ nombre: "Nuevo gasto", monto: "" })}
      >
        + Agregar gasto fijo
      </button>
    </div>
  );
}

function GastoFijoRow({ item, onSave, onDelete }) {
  const [nombre, setNombre] = useState(item.nombre);
  const [monto, setMonto] = useState(item.monto);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setNombre(item.nombre);
    setMonto(item.monto);
  }, [item.id]);

  const mes = mesActual();
  const pagado = !!(item.pagos && item.pagos[mes]);

  const handleSave = async () => {
    await onSave({ ...item, nombre, monto });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const togglePagado = async () => {
    const pagos = { ...(item.pagos || {}) };
    pagos[mes] = !pagos[mes];
    await onSave({ ...item, nombre, monto, pagos });
  };

  return (
    <div
      className="pp-card"
      style={{ padding: 10, display: "flex", gap: 8, alignItems: "center", borderLeft: `3px solid ${pagado ? "#7FD9A0" : "#E36E88"}`, flexWrap: "wrap" }}
    >
      <input className="pp-input" style={{ flex: 2, minWidth: 100 }} value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input
        className="pp-input"
        style={{ flex: 1, minWidth: 80 }}
        type="number"
        placeholder="$"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />
      <button
        className="pp-btn"
        style={{ background: pagado ? "#7FD9A0" : "#E36E88", color: "#1B1229", fontSize: 12 }}
        onClick={togglePagado}
        title={`Este mes (${mes})`}
      >
        {pagado ? "✓ Pagado este mes" : "Falta pagar"}
      </button>
      <button className="pp-btn" style={{ background: saved ? "#7FD9A0" : COLORS.economia, color: "#1B1229" }} onClick={handleSave}>
        {saved ? "✓ Guardado" : "Guardar"}
      </button>
      <button className="pp-btn" style={{ background: "transparent", color: "#E08AB0", border: "1px solid #E08AB0" }} onClick={onDelete}>
        ✕
      </button>
    </div>
  );
}

function mesActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function GastosFijosCalendario() {
  const prefix = "economia-gastofijo-";
  const { items, loading, updateItem } = useCollection(prefix);
  const [mes, setMes] = useState(mesActual());

  const shiftMes = (n) => {
    const [y, m] = mes.split("-").map(Number);
    const d = new Date(y, m - 1 + n, 1);
    setMes(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const togglePago = async (item) => {
    const pagos = { ...(item.pagos || {}) };
    pagos[mes] = !pagos[mes];
    await updateItem(item.id, { ...item, pagos });
  };

  const [y, m] = mes.split("-");
  const nombreMes = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  if (loading) return <div style={{ color: COLORS.textDim }}>Cargando…</div>;

  const pagados = items.filter((it) => it.pagos && it.pagos[mes]).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <button className="pp-btn" style={{ background: COLORS.surfaceLight }} onClick={() => shiftMes(-1)}>
          ← Mes anterior
        </button>
        <div style={{ textAlign: "center" }}>
          <div className="pp-heading" style={{ fontWeight: 800, textTransform: "capitalize" }}>
            {nombreMes}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textDim }}>
            {pagados} / {items.length} pagados
          </div>
        </div>
        <button className="pp-btn" style={{ background: COLORS.surfaceLight }} onClick={() => shiftMes(1)}>
          Mes siguiente →
        </button>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((it) => {
          const pagado = !!(it.pagos && it.pagos[mes]);
          return (
            <div
              key={it.id}
              className="pp-card"
              style={{
                padding: "10px 14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderLeft: `3px solid ${pagado ? "#7FD9A0" : COLORS.economia}`,
              }}
            >
              <div>
                <div style={{ fontSize: 14 }}>{it.nombre}</div>
                {it.monto && <div style={{ fontSize: 12, color: COLORS.textDim }}>${parseFloat(it.monto).toLocaleString("es-AR")}</div>}
              </div>
              <button
                className="pp-btn"
                style={{ background: pagado ? "#7FD9A0" : COLORS.surfaceLight, color: pagado ? "#1B1229" : COLORS.textDim }}
                onClick={() => togglePago(it)}
              >
                {pagado ? "✓ Pagado" : "Marcar pagado"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EconomiaGastosVariables() {
  return (
    <EntityList
      prefix="economia-gastovariable-"
      accent={COLORS.economia}
      emptyText="Agregá tus categorías de gastos variables (ej: comida, gastos personales, salidas)."
      fields={[
        { key: "nombre", label: "Categoría (ej: gastos personales, comida)", type: "text" },
        { key: "monto", label: "Monto estimado ($)", type: "number" },
        { key: "nota", label: "Nota", type: "text" },
      ]}
      cardTitle={(it) => it.nombre}
      layout="list"
    />
  );
}

function EconomiaMovimientos() {
  const prefix = "economia-mov-";
  const { items, loading, addItem, deleteItem } = useCollection(prefix);
  const [tipo, setTipo] = useState("gasto");
  const [desc, setDesc] = useState("");
  const [monto, setMonto] = useState("");

  const submit = async () => {
    if (!desc || !monto) return;
    await addItem({ tipo, desc, monto, fecha: new Date().toISOString().slice(0, 10) });
    setDesc("");
    setMonto("");
  };

  const ingresos = items.filter((i) => i.tipo === "ingreso").reduce((s, i) => s + (parseFloat(i.monto) || 0), 0);
  const gastos = items.filter((i) => i.tipo === "gasto").reduce((s, i) => s + (parseFloat(i.monto) || 0), 0);
  const sorted = [...items].sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        <div className="pp-card" style={{ padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Ingresos</div>
          <div className="pp-heading" style={{ fontWeight: 800, color: "#7FD9A0" }}>
            ${ingresos.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="pp-card" style={{ padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Gastos</div>
          <div className="pp-heading" style={{ fontWeight: 800, color: "#F0729C" }}>
            ${gastos.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="pp-card" style={{ padding: 10, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Balance</div>
          <div className="pp-heading" style={{ fontWeight: 800, color: COLORS.primary }}>
            ${(ingresos - gastos).toLocaleString("es-AR")}
          </div>
        </div>
      </div>

      <div className="pp-card" style={{ padding: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select className="pp-select" style={{ width: 110 }} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
          <input className="pp-input" style={{ flex: 1, minWidth: 120 }} placeholder="¿Qué fue?" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <input className="pp-input" style={{ width: 100 }} type="number" placeholder="$" value={monto} onChange={(e) => setMonto(e.target.value)} />
          <button className="pp-btn" style={{ background: COLORS.economia, color: "#1B1229" }} onClick={submit}>
            Anotar
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: COLORS.textDim }}>Cargando…</div>
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          {sorted.map((it) => (
            <div key={it.id} className="pp-card" style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13 }}>{it.desc}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>{it.fecha}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 700, color: it.tipo === "ingreso" ? "#7FD9A0" : "#F0729C" }}>
                  {it.tipo === "ingreso" ? "+" : "-"}${parseFloat(it.monto).toLocaleString("es-AR")}
                </div>
                <button className="pp-btn" style={{ background: "transparent", color: COLORS.textDim, fontSize: 11 }} onClick={() => deleteItem(it.id)}>
                  ✕
                </button>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <div style={{ color: COLORS.textDim, fontSize: 13, textAlign: "center", padding: 20 }}>Todavía no cargaste movimientos. Empezá anotando el primero.</div>}
        </div>
      )}
    </div>
  );
}

function EconomiaTab() {
  const [sub, setSub] = useState("fijos");
  return (
    <div>
      <SubNav
        tabs={[
          { key: "fijos", label: "Gastos fijos" },
          { key: "calendario", label: "Calendario" },
          { key: "variables", label: "Gastos variables" },
          { key: "mov", label: "Ingresos y gastos" },
        ]}
        active={sub}
        onChange={setSub}
        accent={COLORS.economia}
      />
      {sub === "fijos" && <EconomiaGastosFijos />}
      {sub === "calendario" && <GastosFijosCalendario />}
      {sub === "variables" && <EconomiaGastosVariables />}
      {sub === "mov" && <EconomiaMovimientos />}
    </div>
  );
}

/* ======================= SALUD ======================= */
function EntrenamientoDias() {
  const prefix = "salud-diaentreno-";
  const { items, loading, addItem, updateItem } = useCollection(prefix);
  const seeded = useRef(false);

  useEffect(() => {
    if (!loading && items.length === 0 && !seeded.current) {
      seeded.current = true;
      DIAS_ENTRENO_DEFAULT.forEach((d) => addItem({ nombre: d.nombre, notas: d.notas, foto: "" }));
    }
  }, [loading, items.length]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 12 }}>
      {items
        .sort((a, b) => a._order - b._order)
        .map((it) => (
          <DiaEntrenoCard key={it.id} item={it} onSave={(data) => updateItem(it.id, data)} />
        ))}
    </div>
  );
}

const DIAS_ENTRENO_DEFAULT = [
  {
    nombre: "Día 1 — Cuádriceps / Glúteos",
    notas:
      "ENTRADA EN CALOR: activación (5-10min, ver guía de activación). Sillón de cuádriceps 2x20 liviano, 3seg subida + 1seg retención.\n\n" +
      "1. Sillón de cuádriceps: 4x20/15/15/12 — descanso 1:10min\n" +
      "2. Sentadilla libre en multipower: 3x15/12/10 — descanso 1:10min\n" +
      "3. Abductor en máquina: 4x20/15/15/12, subir peso cada serie, 10seg isometría final\n" +
      "4. Estocadas búlgaras: 3x10/10/10 — descanso 1min\n" +
      "5. Hip thrust c/ barra libre o multipower: 3x15/15/12 + descanso 20seg y último fallo — descanso 1:20min\n" +
      "6. Patada de glúteo pierna recta en polea baja: 3x12/12/12 — descanso 1min\n" +
      "7. Aducción en máquina: 3x20/18/15 — descanso 1min\n" +
      "8. Planchas isométricas: 3x30seg a 1min\n" +
      "9. Abdominales cortos sin peso: 3x15\n" +
      "10. Cardio: 30min cinta (5min caminando + 2min trotando, repetir) o 15min escalera + 15min bici rápida",
  },
  {
    nombre: "Día 2 — Torso (Espalda/Hombros/Bíceps/Tríceps)",
    notas:
      "ENTRADA EN CALOR: dorsalera agarre prono y neutro 2x15, 3seg negativa + 1seg isométrica.\n\n" +
      "1. Dorsalera agarre abierto: 3x12/12/12 — descanso 1min, subir peso última serie\n" +
      "2. Remo en máquina agarre neutro triángulo: 3x15/15/15 + descanso 10seg y 15 rep más — descanso 1min\n" +
      "3. Press c/ mancuernas: 3x10/10/12 — descanso 1min\n" +
      "4. Vuelos laterales c/ mancuernas: 3x15/12/12, subir peso cada serie — descanso 1min\n" +
      "5. Curl bíceps c/ mancuernas: 3x12/12/12, tempo 2seg subida + 1seg contracción + 2seg bajada — descanso 1min\n" +
      "6. Tríceps en polea alta c/ barra recta: 3x12/12/12, tempo 2seg bajada + 1seg contracción + 2seg subida — descanso 1min\n" +
      "7. Elevación de piernas sobre colchoneta: 3x18/18/18\n" +
      "8. Abdominales cortitos con peso: 3x12 bien lentos\n" +
      "9. Cardio: 30min cinta (5min caminando + 2min trotando, repetir)",
  },
  {
    nombre: "Día 3 — Isquiotibiales / Glúteos",
    notas:
      "ENTRADA EN CALOR: activación (5-10min, ver guía de activación). Camilla de isquio 2x15, 3seg subida + 3seg bajada, sin soltar.\n\n" +
      "1. Abducción en máquina: 3x20/15/12, subiendo peso cada serie — descanso 1min\n" +
      "2. Hip thrust en barra Smith: 4x15/15/12 + descanso 10seg y último fallo, pausa 1seg arriba — descanso 1:10min\n" +
      "3. Peso muerto c/ barra o manc. piernas rígidas: 3x12/12/12, cuidar lumbar — descanso 1:10min\n" +
      "4. Curl femoral sentado o parado a 1 pierna (si no hay máquina): 3x15/15/15 bien lento — descanso 1min\n" +
      "5. Patada de glúteo en máquina o polea baja pierna recta: 4x20/15/15/12, subir peso cada serie — descanso 1min\n" +
      "6. Abdominales cortos sin peso: 3x18/18/18\n" +
      "7. Planchas isométricas: 3x1min\n" +
      "8. Cardio: 30min cinta (5min caminando + 2min trotando, repetir) o 15min escalera + 15min bici rápida",
  },
  {
    nombre: "Día 4 — Brazos / Glúteos / Abdominales",
    notas:
      "ENTRADA EN CALOR: dorsalera agarre triángulo 2x10 + hip thrust 2x20.\n\n" +
      "1. Remo en máquina agarre neutro/triángulo: 3x12/12/12, subir peso últimas 2 series — descanso 1min\n" +
      "2. Press c/ máquina: 3x15/15/15, subir peso última serie — descanso 1min\n" +
      "3. Extensión de tríceps polea alta c/ barra recta + curl martillo polea baja y soga (biserie): 3x12/15/15 + 3x15/15/15 — descanso 1:10min\n" +
      "4. Vuelos laterales c/ mancuernas: 4x10/10/12/8 — descanso 1min\n" +
      "5. Hip thrust en máquina o barra libre: 3x15/12/12 + descanso 10seg y último fallo, pausa 1seg arriba — descanso 1:10min\n" +
      "6. Patada de glúteos pierna recta + estocada en el lugar con step (biserie): 3x12/12/12 + 3x12/12/23 — descanso 1:30min\n" +
      "7. Elevaciones de piernas uniforme: 3x12/12/12\n" +
      "8. Abdominales en polea alta (encogimientos): 2x15/15\n" +
      "9. Cardio: 30min cinta (5min caminando + 2min trotando, repetir)",
  },
];

function DiaEntrenoCard({ item, onSave }) {
  const [nombre, setNombre] = useState(item.nombre);
  const [notas, setNotas] = useState(item.notas);
  const [foto, setFoto] = useState(item.foto);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setNombre(item.nombre);
    setNotas(item.notas);
    setFoto(item.foto);
  }, [item.id]);

  const handleSave = async (overrideFoto) => {
    await onSave({ nombre, notas, foto: overrideFoto !== undefined ? overrideFoto : foto });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="pp-card" style={{ padding: 12, borderLeft: `3px solid ${COLORS.salud}` }}>
      <input
        className="pp-input pp-heading"
        style={{ fontWeight: 700, marginBottom: 8, border: "none", background: "transparent", padding: 0 }}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <ImageField value={foto} onChange={(v) => { setFoto(v); handleSave(v); }} />
        <textarea
          className="pp-textarea"
          rows={5}
          placeholder="Ejercicios, series, repeticiones…"
          style={{ flex: 1 }}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
        />
      </div>
      <button className="pp-btn" style={{ background: saved ? "#7FD9A0" : COLORS.salud, color: "#1B1229", marginTop: 8 }} onClick={() => handleSave()}>
        {saved ? "✓ Guardado" : "Guardar cambios"}
      </button>
    </div>
  );
}

function GuiaBox({ storageKey, label, accent, defaultTexto }) {
  const [texto, setTexto] = useState("");
  const [foto, setFoto] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await storageGet(storageKey);
      if (raw) {
        try {
          const d = JSON.parse(raw);
          setTexto(d.texto || "");
          setFoto(d.foto || "");
        } catch (e) {}
      } else if (defaultTexto) {
        setTexto(defaultTexto);
        await storageSet(storageKey, JSON.stringify({ texto: defaultTexto, foto: "" }));
      }
      setLoaded(true);
    })();
  }, [storageKey]);

  const save = async (t, f) => {
    await storageSet(storageKey, JSON.stringify({ texto: t, foto: f }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  if (!loaded) return null;

  return (
    <div className="pp-card" style={{ padding: 12, borderLeft: `3px solid ${accent}` }}>
      <div className="pp-heading" style={{ fontWeight: 700, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <ImageField value={foto} onChange={(v) => { setFoto(v); save(texto, v); }} />
        <textarea
          className="pp-textarea"
          rows={4}
          style={{ flex: 1 }}
          placeholder="Notas, indicaciones…"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
      </div>
      <button className="pp-btn" style={{ background: saved ? "#7FD9A0" : accent, color: "#1B1229", marginTop: 8 }} onClick={() => save(texto, foto)}>
        {saved ? "✓ Guardado" : "Guardar cambios"}
      </button>
    </div>
  );
}

function EntrenamientoTab() {
  return (
    <div>
      <Section title="Mis 4 días de entrenamiento" accent={COLORS.salud}>
        <EntrenamientoDias />
      </Section>
      <Section title="Guías" accent={COLORS.salud}>
        <div style={{ display: "grid", gap: 10 }}>
          <GuiaBox storageKey="salud-guia-suplementacion" label="Guía de suplementación" accent={COLORS.salud} />
          <GuiaBox storageKey="salud-guia-estiramiento" label="Guía de estiramiento" accent={COLORS.salud} />
          <GuiaBox storageKey="salud-guia-activacion" label="Rutina de activación / elongación" accent={COLORS.salud} />
          <GuiaBox
            storageKey="salud-guia-conceptos"
            label="Guía de conceptos básicos de entrenamiento"
            accent={COLORS.salud}
            defaultTexto={
              "INDICACIONES GENERALES:\n\n" +
              "→ Descansos entre series a modo perceptivo: 50seg a 2:30. Grupos grandes (piernas, espalda, pectoral) 1:30 a 2:30. Grupos chicos (brazos, hombros, abdomen) 45seg a 1min.\n\n" +
              "→ Tomar entre 500 y 750ml de agua durante el entreno.\n\n" +
              "→ No tocar el celular excepto para ver la rutina: estar focalizada para rendir al máximo.\n\n" +
              "→ Prioridad a la última serie de cada ejercicio: anteúltima cerca del fallo, última la más intensa.\n\n" +
              "CARDIO:\n" +
              "Días de pesas: 30min post entreno (5min caminando + 2min trotando, repetir).\n" +
              "Días sin pesas: 20min de caminata al sol, pasos activos sin pausas, ideal en ayunas."
            }
          />
          <GuiaBox
            storageKey="salud-guia-teambf"
            label="Indicaciones Team BF"
            accent={COLORS.salud}
            defaultTexto={
              "Asesoría TeamBF® — Juan Beretta, Entrenador IFBB\n" +
              "Aumento de masa muscular y descenso de porcentaje graso — Worldwide Online Coaching\n\n" +
              "Alumna: María Guillermina Bassi Chacón\n" +
              "Objetivo: resistencia cardiovascular, mejorar movilidad, desarrollo muscular tren inferior\n" +
              "Periodo de vigencia del plan: VIP\n\n" +
              "División semanal: Día 1 Cuádriceps/Glúteos · Día 2 Torso (Espalda/Hombros/Bíceps/Tríceps) · Día 3 Isquiotibiales/Glúteos · Día 4 Brazos/Glúteos/Abdominales.\n\n" +
              "Antes de empezar: ver la biblioteca de videos #TeamBF para las ejecuciones de los ejercicios y los métodos de intensidad (dropsets, superseries, forzadas, rest pause, etc.)."
            }
          />
          <GuiaBox storageKey="salud-guia-ficha" label="Ficha de reporte" accent={COLORS.salud} />
        </div>
      </Section>
      <Section title="Fotos antes / después" accent={COLORS.salud}>
        <EntityList
          prefix="salud-fotoprogreso-"
          accent={COLORS.salud}
          emptyText="Subí tu primera foto de progreso."
          fields={[
            { key: "fecha", label: "Fecha", type: "date" },
            { key: "foto", label: "Foto", type: "image" },
            { key: "nota", label: "Nota", type: "textarea" },
          ]}
          cardTitle={(it) => it.fecha}
        />
      </Section>
      <Section title="Medidas y peso" accent={COLORS.salud}>
        <EntityList
          prefix="salud-medidas-"
          accent={COLORS.salud}
          emptyText="Cargá tu primer registro de peso y medidas."
          fields={[
            { key: "fecha", label: "Fecha", type: "date" },
            { key: "peso", label: "Peso (kg)", type: "number" },
            { key: "medidas", label: "Medidas (cintura, cadera, brazo…)", type: "textarea" },
          ]}
          cardTitle={(it) => `${it.fecha || ""} — ${it.peso ? it.peso + " kg" : ""}`}
        />
      </Section>
    </div>
  );
}

function AlimentacionObjetivo() {
  const key = "salud-objetivo-nutricional";
  const [obj, setObj] = useState({ calorias: "", proteinas: "", carbos: "", grasas: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await storageGet(key);
      if (raw) {
        try {
          setObj(JSON.parse(raw));
        } catch (e) {}
      }
      setLoaded(true);
    })();
  }, []);

  const save = async (o) => {
    setObj(o);
    await storageSet(key, JSON.stringify(o));
  };

  if (!loaded) return null;

  return (
    <div className="pp-card" style={{ padding: 12, marginBottom: 14, borderLeft: `3px solid ${COLORS.salud}` }}>
      <div className="pp-heading" style={{ fontWeight: 700, marginBottom: 8 }}>
        Objetivo diario (según nutricionista)
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 8 }}>
        {[
          { k: "calorias", l: "Calorías" },
          { k: "proteinas", l: "Proteínas (g)" },
          { k: "carbos", l: "Carbohidratos (g)" },
          { k: "grasas", l: "Grasas (g)" },
        ].map((f) => (
          <div key={f.k}>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 3 }}>{f.l}</div>
            <input
              className="pp-input"
              type="number"
              value={obj[f.k] || ""}
              onChange={(e) => setObj((o) => ({ ...o, [f.k]: e.target.value }))}
              onBlur={() => save(obj)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AlimentacionLog() {
  const prefix = "salud-comida-";
  const { items, loading, addItem, deleteItem } = useCollection(prefix);
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [comida, setComida] = useState("");
  const [cal, setCal] = useState("");
  const [prot, setProt] = useState("");
  const [carb, setCarb] = useState("");
  const [gras, setGras] = useState("");
  const [objetivo, setObjetivo] = useState(null);

  useEffect(() => {
    (async () => {
      const raw = await storageGet("salud-objetivo-nutricional");
      if (raw) {
        try {
          setObjetivo(JSON.parse(raw));
        } catch (e) {}
      }
    })();
  }, []);

  const submit = async () => {
    if (!comida) return;
    await addItem({ fecha, comida, cal, prot, carb, gras });
    setComida("");
    setCal("");
    setProt("");
    setCarb("");
    setGras("");
  };

  const delDia = items.filter((i) => i.fecha === fecha);
  const sum = (k) => delDia.reduce((s, i) => s + (parseFloat(i[k]) || 0), 0);

  return (
    <div>
      <AlimentacionObjetivo />
      <div className="pp-card" style={{ padding: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          <input className="pp-input" style={{ width: 140 }} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <input className="pp-input" style={{ flex: 1, minWidth: 140 }} placeholder="¿Qué comiste?" value={comida} onChange={(e) => setComida(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input className="pp-input" style={{ width: 90 }} type="number" placeholder="Kcal" value={cal} onChange={(e) => setCal(e.target.value)} />
          <input className="pp-input" style={{ width: 90 }} type="number" placeholder="Prot g" value={prot} onChange={(e) => setProt(e.target.value)} />
          <input className="pp-input" style={{ width: 90 }} type="number" placeholder="Carb g" value={carb} onChange={(e) => setCarb(e.target.value)} />
          <input className="pp-input" style={{ width: 90 }} type="number" placeholder="Grasa g" value={gras} onChange={(e) => setGras(e.target.value)} />
          <button className="pp-btn" style={{ background: COLORS.salud, color: "#1B1229" }} onClick={submit}>
            Anotar
          </button>
        </div>
      </div>

      <div className="pp-card" style={{ padding: 12, marginBottom: 14 }}>
        <div className="pp-heading" style={{ fontWeight: 700, marginBottom: 8 }}>
          Resumen del {fecha}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 8 }}>
          {[
            { k: "cal", l: "Kcal" },
            { k: "prot", l: "Proteínas" },
            { k: "carb", l: "Carbos" },
            { k: "gras", l: "Grasas" },
          ].map((f) => {
            const total = sum(f.k);
            const target = objetivo ? objetivo[f.k === "cal" ? "calorias" : f.k === "prot" ? "proteinas" : f.k === "carb" ? "carbos" : "grasas"] : null;
            const pct = target ? Math.round((total / parseFloat(target)) * 100) : null;
            return (
              <div key={f.k} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: COLORS.textDim }}>{f.l}</div>
                <div className="pp-heading" style={{ fontWeight: 800 }}>
                  {total}
                  {target ? ` / ${target}` : ""}
                </div>
                {pct !== null && <div style={{ fontSize: 11, color: pct >= 100 ? "#7FD9A0" : COLORS.primary }}>{pct}%</div>}
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div style={{ color: COLORS.textDim }}>Cargando…</div>
      ) : (
        <div style={{ display: "grid", gap: 6 }}>
          {delDia.map((it) => (
            <div key={it.id} className="pp-card" style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13 }}>{it.comida}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.textDim }}>
                  {it.cal || 0} kcal · P{it.prot || 0} C{it.carb || 0} G{it.gras || 0}
                </span>
                <button className="pp-btn" style={{ background: "transparent", color: COLORS.textDim, fontSize: 11 }} onClick={() => deleteItem(it.id)}>
                  ✕
                </button>
              </div>
            </div>
          ))}
          {delDia.length === 0 && <div style={{ color: COLORS.textDim, fontSize: 13, textAlign: "center", padding: 16 }}>Nada cargado para este día todavía.</div>}
        </div>
      )}
    </div>
  );
}

function Recetario({ prefix, accent }) {
  return (
    <EntityList
      prefix={prefix}
      accent={accent}
      emptyText="Cargá tu primera receta."
      fields={[
        { key: "nombre", label: "Nombre de la receta", type: "text" },
        { key: "preparacion", label: "Ingredientes y preparación", type: "textarea", rows: 4 },
        { key: "foto", label: "Foto", type: "image" },
      ]}
      cardTitle={(it) => it.nombre}
      layout="list"
    />
  );
}

function AlimentacionTab() {
  const [sub, setSub] = useState("registro");
  return (
    <div>
      <SubNav
        tabs={[
          { key: "registro", label: "Registro diario" },
          { key: "salado", label: "Recetario salado" },
          { key: "dulce", label: "Recetario dulce" },
        ]}
        active={sub}
        onChange={setSub}
        accent={COLORS.salud}
      />
      {sub === "registro" && <AlimentacionLog />}
      {sub === "salado" && <Recetario prefix="salud-receta-salado-" accent={COLORS.salud} />}
      {sub === "dulce" && <Recetario prefix="salud-receta-dulce-" accent={COLORS.salud} />}
    </div>
  );
}

function ActividadesTab() {
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().slice(0, 10);
  });
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const key = "salud-actividades";

  useEffect(() => {
    (async () => {
      const raw = await storageGet(key);
      if (raw) {
        try {
          setData(JSON.parse(raw));
        } catch (e) {}
      }
      setLoaded(true);
    })();
  }, []);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const toggle = async (date, tipo) => {
    const next = { ...data, [date]: { ...(data[date] || {}), [tipo]: !((data[date] || {})[tipo]) } };
    setData(next);
    await storageSet(key, JSON.stringify(next));
  };

  const shiftWeek = (n) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + n * 7);
    setWeekStart(d.toISOString().slice(0, 10));
  };

  const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const tipos = [
    { key: "gym", label: "🏋️ Gimnasio" },
    { key: "yoga", label: "🧘 Yoga" },
    { key: "estiramiento", label: "🤸 Estiramiento" },
  ];

  if (!loaded) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button className="pp-btn" style={{ background: COLORS.surfaceLight }} onClick={() => shiftWeek(-1)}>
          ← Semana anterior
        </button>
        <div style={{ fontSize: 13, color: COLORS.textDim }}>{weekStart}</div>
        <button className="pp-btn" style={{ background: COLORS.surfaceLight }} onClick={() => shiftWeek(1)}>
          Semana siguiente →
        </button>
      </div>
      <div className="pp-scroll" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
          <thead>
            <tr>
              <th></th>
              {days.map((d, i) => (
                <th key={d} style={{ fontSize: 12, color: COLORS.textDim, fontWeight: 600, padding: 6 }}>
                  {dayLabels[i]}
                  <div style={{ fontSize: 10 }}>{d.slice(5)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tipos.map((t) => (
              <tr key={t.key}>
                <td style={{ fontSize: 13, padding: 6, whiteSpace: "nowrap" }}>{t.label}</td>
                {days.map((d) => (
                  <td key={d} style={{ textAlign: "center", padding: 6 }}>
                    <input type="checkbox" className="pp-checkbox" checked={!!(data[d] && data[d][t.key])} onChange={() => toggle(d, t.key)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 10 }}>Meta sugerida: 1 clase de yoga y 1 de estiramiento por semana.</div>
    </div>
  );
}

function TurnosMedicos() {
  return (
    <div>
      <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 10 }}>
        Tip: pedime "agendame un turno médico el [fecha] a las [hora]" y lo agrego directo a tu Google Calendar además de guardarlo acá.
      </div>
      <EntityList
        prefix="salud-turno-"
        accent={COLORS.salud}
        emptyText="No tenés turnos cargados."
        fields={[
          { key: "fecha", label: "Fecha", type: "date" },
          { key: "hora", label: "Hora", type: "time" },
          { key: "motivo", label: "Motivo / médico", type: "text" },
          { key: "notas", label: "Notas", type: "textarea" },
        ]}
        cardTitle={(it) => `${it.motivo || "Turno"}`}
      />
    </div>
  );
}

function SaludTab() {
  const [sub, setSub] = useState("entrenamiento");
  return (
    <div>
      <SubNav
        tabs={[
          { key: "entrenamiento", label: "Entrenamiento" },
          { key: "alimentacion", label: "Alimentación" },
          { key: "actividades", label: "Actividades" },
          { key: "turnos", label: "Turnos médicos" },
        ]}
        active={sub}
        onChange={setSub}
        accent={COLORS.salud}
      />
      {sub === "entrenamiento" && <EntrenamientoTab />}
      {sub === "alimentacion" && <AlimentacionTab />}
      {sub === "actividades" && <ActividadesTab />}
      {sub === "turnos" && <TurnosMedicos />}
    </div>
  );
}

/* ======================= DROPDEALER: PEDIDOS (armador de costos) ======================= */
const SERVICIO_OPTIONS = ["Serigrafía", "DTF", "Bordado", "Vinilo", "Sublimación", "Otro"];

function calcTotalesPedido(pedido) {
  const allRows = [...(pedido.articulos || []), ...(pedido.servicios || []), ...(pedido.extras || [])];
  let costo = 0;
  let precio = 0;
  allRows.forEach((r) => {
    const cantidad = parseFloat(r.cantidad) || 1;
    costo += (parseFloat(r.costo) || 0) * cantidad;
    precio += (parseFloat(r.precio) || 0) * cantidad;
  });
  const senaPct = parseFloat(pedido.sena) || 0;
  const senaMonto = precio * (senaPct / 100);
  return { costo, precio, ganancia: precio - costo, senaMonto };
}

function LineItemsEditor({ title, accent, rows, onChange, columns }) {
  const addRow = () => onChange([...rows, { id: newId() }]);
  const updateRow = (id, key, val) => onChange(rows.map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  const removeRow = (id) => onChange(rows.filter((r) => r.id !== id));

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div className="pp-heading" style={{ fontWeight: 700, fontSize: 14 }}>
          {title}
        </div>
        <button className="pp-btn" style={{ background: accent, color: "#1B1229", fontSize: 12 }} onClick={addRow}>
          + Agregar
        </button>
      </div>
      {rows.length === 0 && <div style={{ fontSize: 12, color: COLORS.textDim }}>Sin ítems todavía.</div>}
      <div style={{ display: "grid", gap: 6 }}>
        {rows.map((r) => {
          const cantidad = parseFloat(r.cantidad) || 1;
          const costo = parseFloat(r.costo) || 0;
          const precio = parseFloat(r.precio) || 0;
          const ganancia = (precio - costo) * cantidad;
          return (
            <div key={r.id} className="pp-card" style={{ padding: 8, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {columns.map((c) => (
                <div key={c.key} style={{ width: c.width || 90 }}>
                  <FieldInput field={c} value={r[c.key]} onChange={(v) => updateRow(r.id, c.key, v)} />
                </div>
              ))}
              <div style={{ fontSize: 12, color: ganancia >= 0 ? "#7FD9A0" : "#F0729C", minWidth: 70 }}>
                Gan: ${ganancia.toLocaleString("es-AR")}
              </div>
              <button
                className="pp-btn"
                style={{ background: "transparent", color: "#E08AB0", border: "1px solid #E08AB0", fontSize: 11 }}
                onClick={() => removeRow(r.id)}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PedidoEditor({ initial, onSubmit, onCancel, accent }) {
  const [nombreCliente, setNombreCliente] = useState(initial?.nombreCliente || "");
  const [contacto, setContacto] = useState(initial?.contacto || "");
  const [estado, setEstado] = useState(initial?.estado || "En curso");
  const [sena, setSena] = useState(initial?.sena || "");
  const [fechaEntrega, setFechaEntrega] = useState(initial?.fechaEntrega || "");
  const [articulos, setArticulos] = useState(initial?.articulos || []);
  const [servicios, setServicios] = useState(initial?.servicios || []);
  const [extras, setExtras] = useState(initial?.extras || []);

  const totals = calcTotalesPedido({ articulos, servicios, extras, sena });

  return (
    <div className="pp-card" style={{ padding: 14, marginBottom: 14, borderColor: accent }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 14 }}>
        <input className="pp-input" placeholder="Nombre del cliente" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} />
        <input className="pp-input" placeholder="Contacto (tel / mail)" value={contacto} onChange={(e) => setContacto(e.target.value)} />
        <select className="pp-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
          {["En curso", "Señado", "Entregado", "Pagado"].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <input className="pp-input" type="number" placeholder="Seña (%)" value={sena} onChange={(e) => setSena(e.target.value)} />
        <div>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 3 }}>Fecha límite de entrega</div>
          <input className="pp-input" type="date" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} />
        </div>
      </div>

      <LineItemsEditor
        title="Artículos"
        accent={accent}
        rows={articulos}
        onChange={setArticulos}
        columns={[
          { key: "articulo", label: "Artículo", type: "text", width: 100 },
          { key: "tipo", label: "Tipo", type: "text", width: 100 },
          { key: "color", label: "Color", type: "text", width: 80 },
          { key: "talle", label: "Talle", type: "text", width: 70 },
          { key: "cantidad", label: "Cant.", type: "number", width: 60 },
          { key: "costo", label: "Costo", type: "number", width: 80 },
          { key: "precio", label: "Precio", type: "number", width: 80 },
        ]}
      />

      <LineItemsEditor
        title="Servicios (serigrafía, DTF, bordado…)"
        accent={accent}
        rows={servicios}
        onChange={setServicios}
        columns={[
          { key: "servicio", label: "Servicio", type: "select", options: SERVICIO_OPTIONS, width: 120 },
          { key: "cantidad", label: "Cant.", type: "number", width: 60 },
          { key: "costo", label: "Costo", type: "number", width: 80 },
          { key: "precio", label: "Precio", type: "number", width: 80 },
          { key: "proveedor", label: "Proveedor", type: "text", width: 110 },
        ]}
      />

      <LineItemsEditor
        title="Extras"
        accent={accent}
        rows={extras}
        onChange={setExtras}
        columns={[
          { key: "descripcion", label: "Descripción", type: "text", width: 140 },
          { key: "costo", label: "Costo", type: "number", width: 80 },
          { key: "precio", label: "Precio", type: "number", width: 80 },
        ]}
      />

      <div className="pp-card" style={{ padding: 10, marginTop: 6, display: "flex", gap: 16, justifyContent: "space-around", flexWrap: "wrap", background: COLORS.surfaceLight }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Costo total</div>
          <div className="pp-heading" style={{ fontWeight: 800 }}>
            ${totals.costo.toLocaleString("es-AR")}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Precio total</div>
          <div className="pp-heading" style={{ fontWeight: 800 }}>
            ${totals.precio.toLocaleString("es-AR")}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Seña ({sena || 0}%)</div>
          <div className="pp-heading" style={{ fontWeight: 800, color: COLORS.primary }}>
            ${totals.senaMonto.toLocaleString("es-AR")}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Ganancia total</div>
          <div className="pp-heading" style={{ fontWeight: 800, color: totals.ganancia >= 0 ? "#7FD9A0" : "#F0729C" }}>
            ${totals.ganancia.toLocaleString("es-AR")}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          className="pp-btn"
          style={{ background: accent, color: "#1B1229" }}
          onClick={() => onSubmit({ nombreCliente, contacto, estado, sena, fechaEntrega, articulos, servicios, extras })}
        >
          Guardar pedido
        </button>
        <button className="pp-btn" style={{ background: COLORS.surfaceLight }} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function DropDealerPedidos() {
  const prefix = "dd-pedido-";
  const { items, loading, addItem, updateItem, deleteItem } = useCollection(prefix);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: COLORS.textDim }}>{items.length} pedidos</div>
        <button
          className="pp-btn"
          style={{ background: COLORS.trabajos, color: "#1B1229" }}
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
          }}
        >
          + Nuevo pedido
        </button>
      </div>

      {showForm && (
        <PedidoEditor
          accent={COLORS.trabajos}
          onCancel={() => setShowForm(false)}
          onSubmit={async (data) => {
            await addItem(data);
            setShowForm(false);
          }}
        />
      )}

      {loading ? (
        <div style={{ color: COLORS.textDim }}>Cargando…</div>
      ) : (
        <>
          {items.length > 0 && (
            <div className="pp-card pp-scroll" style={{ padding: 10, marginBottom: 14, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520, fontSize: 12 }}>
                <thead>
                  <tr style={{ color: COLORS.textDim, textAlign: "left" }}>
                    <th style={{ padding: "4px 8px" }}>Cliente</th>
                    <th style={{ padding: "4px 8px" }}>Estado</th>
                    <th style={{ padding: "4px 8px", textAlign: "right" }}>Seña</th>
                    <th style={{ padding: "4px 8px", textAlign: "right" }}>Total</th>
                    <th style={{ padding: "4px 8px", textAlign: "right" }}>Costo</th>
                    <th style={{ padding: "4px 8px", textAlign: "right" }}>Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                    const t = calcTotalesPedido(it);
                    return (
                      <tr key={it.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                        <td style={{ padding: "6px 8px" }}>{it.nombreCliente || "—"}</td>
                        <td style={{ padding: "6px 8px" }}>{it.estado || "En curso"}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>${t.senaMonto.toLocaleString("es-AR")}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>${t.precio.toLocaleString("es-AR")}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>${t.costo.toLocaleString("es-AR")}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right", color: t.ganancia >= 0 ? "#7FD9A0" : "#F0729C", fontWeight: 700 }}>
                          ${t.ganancia.toLocaleString("es-AR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ display: "grid", gap: 10 }}>
          {items.map((it) => {
            const totals = calcTotalesPedido(it);
            return editingId === it.id ? (
              <PedidoEditor
                key={it.id}
                initial={it}
                accent={COLORS.trabajos}
                onCancel={() => setEditingId(null)}
                onSubmit={async (data) => {
                  await updateItem(it.id, data);
                  setEditingId(null);
                }}
              />
            ) : (
              <div key={it.id} className="pp-card" style={{ padding: 12, borderLeft: `3px solid ${COLORS.trabajos}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div className="pp-heading" style={{ fontWeight: 700 }}>
                      {it.nombreCliente || "Sin nombre"}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textDim }}>{it.contacto}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: COLORS.surfaceLight,
                        color: COLORS.trabajos,
                      }}
                    >
                      {it.estado || "En curso"}
                    </span>
                    {it.fechaEntrega && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 3 }}>Entrega: {it.fechaEntrega}</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, flexWrap: "wrap", marginTop: 8 }}>
                  <span>Costo: ${totals.costo.toLocaleString("es-AR")}</span>
                  <span>Total: ${totals.precio.toLocaleString("es-AR")}</span>
                  <span>Seña: ${totals.senaMonto.toLocaleString("es-AR")}</span>
                  <span style={{ fontWeight: 700, color: totals.ganancia >= 0 ? "#7FD9A0" : "#F0729C" }}>
                    Ganancia: ${totals.ganancia.toLocaleString("es-AR")}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button
                    className="pp-btn"
                    style={{ background: COLORS.surfaceLight, fontSize: 12 }}
                    onClick={() => {
                      setEditingId(it.id);
                      setShowForm(false);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="pp-btn"
                    style={{ background: "transparent", color: "#E08AB0", border: "1px solid #E08AB0", fontSize: 12 }}
                    onClick={() => deleteItem(it.id)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && !showForm && (
            <div style={{ color: COLORS.textDim, fontSize: 13, textAlign: "center", padding: 20 }}>Todavía no cargaste pedidos.</div>
          )}
          </div>
        </>
      )}
    </div>
  );
}

/* ======================= DROPDEALER: GENERADOR DE DOCUMENTOS (canvas) ======================= */
const DD_CONTACTO_1 = "11 2666-7014  ·  dropdealer.ar@gmail.com  ·  @dropdealer.ar";
const DD_CONTACTO_2 = "CUIT 27-40163371-0  ·  Buenos Aires, Argentina";

function fmtMoney(n) {
  return "$" + (n || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function wrapTextCanvas(ctx, text, maxWidth) {
  const paragraphs = String(text || "").split("\n");
  const lines = [];
  paragraphs.forEach((p) => {
    const words = p.split(" ");
    let line = "";
    words.forEach((w) => {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    });
    lines.push(line);
  });
  return lines;
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function drawPresupuestoCanvas(data) {
  const W = 900;
  const PAD = 44;
  const contentW = W - PAD * 2;

  const tmp = document.createElement("canvas");
  const tctx = tmp.getContext("2d");
  tctx.font = "12px -apple-system,Arial,sans-serif";
  const notasLines = wrapTextCanvas(tctx, data.notas, contentW);

  const rowH = 38;
  const headerH = 150;
  const metaH = 90;
  const tableHeadH = 34;
  const items = data.items.length ? data.items : [{ descripcion: "—", cantidad: 0, precio: 0 }];
  const tableRowsH = rowH * items.length;
  const totalsH = 90 + (parseFloat(data.descuentoPct) > 0 ? 22 : 0) + (parseFloat(data.senaPct) > 0 ? 26 : 0);
  const pagoH = 100;
  const notesH = 40 + notasLines.length * 18;
  const footH = 60;
  const H = headerH + metaH + tableHeadH + tableRowsH + totalsH + pagoH + notesH + footH + 40;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d");

  c.fillStyle = "#ffffff";
  c.fillRect(0, 0, W, H);

  c.fillStyle = "#121212";
  c.fillRect(0, 0, W, headerH - 6);
  c.fillStyle = "#ffffff";
  c.font = "900 30px -apple-system,Arial,sans-serif";
  c.fillText("PRESUPUESTO", PAD, 60);
  c.fillStyle = "#bdbdb8";
  c.font = "600 13px -apple-system,Arial,sans-serif";
  c.fillText("Soluciones textiles y gráficas personalizadas", PAD, 84);
  c.font = "11px -apple-system,Arial,sans-serif";
  c.fillText(DD_CONTACTO_1, PAD, 108);
  c.fillText(DD_CONTACTO_2, PAD, 126);
  c.fillStyle = "#7a1f2b";
  c.fillRect(0, headerH - 6, W, 6);

  let y = headerH + 40;
  c.fillStyle = "#8a8a8a";
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("CLIENTE", PAD, y);
  c.fillStyle = "#111";
  c.font = "900 17px -apple-system,Arial,sans-serif";
  c.fillText(data.cliente || "—", PAD, y + 22);
  c.fillStyle = "#555";
  c.font = "12px -apple-system,Arial,sans-serif";
  c.fillText(data.contacto || "", PAD, y + 42);

  c.textAlign = "right";
  c.fillStyle = "#8a8a8a";
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("N° DE PRESUPUESTO", W - PAD, y);
  c.fillStyle = "#111";
  c.font = "900 17px -apple-system,Arial,sans-serif";
  c.fillText(data.numero || "—", W - PAD, y + 22);
  c.fillStyle = "#555";
  c.font = "12px -apple-system,Arial,sans-serif";
  c.fillText(data.fecha || "", W - PAD, y + 42);
  c.fillText("Válido por " + (data.validez || ""), W - PAD, y + 60);
  c.textAlign = "left";

  y += metaH;
  c.fillStyle = "#121212";
  c.fillRect(PAD, y, contentW, tableHeadH);
  c.fillStyle = "#fff";
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("DESCRIPCIÓN", PAD + 10, y + 21);
  c.textAlign = "right";
  c.fillText("CANT.", PAD + contentW - 340, y + 21);
  c.fillText("P. UNIT.", PAD + contentW - 200, y + 21);
  c.fillText("SUBTOTAL", PAD + contentW - 10, y + 21);
  c.textAlign = "left";
  y += tableHeadH;

  let subtotal = 0;
  items.forEach((it, i) => {
    const cant = parseFloat(it.cantidad) || 0;
    const precio = parseFloat(it.precio) || 0;
    const sub = cant * precio;
    subtotal += sub;
    if (i % 2 === 1) {
      c.fillStyle = "#f8f8f6";
      c.fillRect(PAD, y, contentW, rowH);
    }
    c.fillStyle = "#111";
    c.font = "12.5px -apple-system,Arial,sans-serif";
    c.fillText(String(it.descripcion || ""), PAD + 10, y + 24);
    c.textAlign = "right";
    c.fillText(String(cant), PAD + contentW - 340, y + 24);
    c.fillText(fmtMoney(precio), PAD + contentW - 200, y + 24);
    c.fillText(fmtMoney(sub), PAD + contentW - 10, y + 24);
    c.textAlign = "left";
    c.strokeStyle = "#ececea";
    c.beginPath();
    c.moveTo(PAD, y + rowH);
    c.lineTo(PAD + contentW, y + rowH);
    c.stroke();
    y += rowH;
  });

  y += 24;
  const descuentoPct = parseFloat(data.descuentoPct) || 0;
  const descuentoMonto = subtotal * (descuentoPct / 100);
  const total = subtotal - descuentoMonto;
  const senaPct = parseFloat(data.senaPct) || 0;
  const senaMonto = total * (senaPct / 100);

  const boxW = 300;
  const boxX = PAD + contentW - boxW;
  c.font = "12.5px -apple-system,Arial,sans-serif";
  c.fillStyle = "#666";
  c.fillText("Subtotal", boxX, y);
  c.textAlign = "right";
  c.fillStyle = "#111";
  c.fillText(fmtMoney(subtotal), PAD + contentW, y);
  c.textAlign = "left";
  y += 22;
  if (descuentoPct > 0) {
    c.fillStyle = "#7a1f2b";
    c.fillText("Descuento", boxX, y);
    c.textAlign = "right";
    c.fillText("- " + fmtMoney(descuentoMonto), PAD + contentW, y);
    c.textAlign = "left";
    y += 22;
  }
  c.fillStyle = "#121212";
  c.fillRect(boxX - 16, y - 20, boxW + 16, 46);
  c.fillStyle = "#fff";
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("TOTAL", boxX, y + 6);
  c.font = "900 20px -apple-system,Arial,sans-serif";
  c.textAlign = "right";
  c.fillText(fmtMoney(total), PAD + contentW, y + 8);
  c.textAlign = "left";
  y += 50;
  if (senaPct > 0) {
    c.fillStyle = "#7a1f2b";
    c.font = "700 12.5px -apple-system,Arial,sans-serif";
    c.textAlign = "right";
    c.fillText("Seña para iniciar (" + senaPct + "%): " + fmtMoney(senaMonto), PAD + contentW, y);
    c.textAlign = "left";
    y += 26;
  }

  y += 16;
  c.fillStyle = "#f4f4f1";
  c.fillRect(PAD, y, contentW, pagoH - 20);
  c.fillStyle = "#7a1f2b";
  c.fillRect(PAD, y, 4, pagoH - 20);
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("DATOS PARA ABONAR", PAD + 20, y + 22);
  c.fillStyle = "#111";
  c.font = "900 16px -apple-system,Arial,sans-serif";
  c.fillText("Alias: " + (data.alias || ""), PAD + 20, y + 46);
  c.font = "12px -apple-system,Arial,sans-serif";
  c.fillStyle = "#333";
  c.fillText("Banco: " + (data.banco || "") + "   ·   Titular: " + (data.titular || ""), PAD + 20, y + 68);
  y += pagoH;

  c.fillStyle = "#8a8a8a";
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("CONDICIONES", PAD, y);
  c.fillStyle = "#555";
  c.font = "11.5px -apple-system,Arial,sans-serif";
  notasLines.forEach((line, i) => c.fillText(line, PAD, y + 20 + i * 18));
  y += notesH;

  c.fillStyle = "#121212";
  c.fillRect(0, H - footH, W, footH);
  c.fillStyle = "#fff";
  c.font = "900 13px -apple-system,Arial,sans-serif";
  c.fillText("DROPDEALER", PAD, H - footH / 2 + 5);
  c.textAlign = "right";
  c.fillStyle = "#bdbdb8";
  c.font = "10px -apple-system,Arial,sans-serif";
  c.fillText("@dropdealer.ar · 11 2666-7014 · dropdealer.ar@gmail.com", W - PAD, H - footH / 2 + 4);
  c.textAlign = "left";

  return canvas;
}

function drawCotizacionCanvas(data) {
  const W = 900;
  const PAD = 44;
  const contentW = W - PAD * 2;

  const tmp = document.createElement("canvas");
  const tctx = tmp.getContext("2d");
  tctx.font = "12px -apple-system,Arial,sans-serif";
  const notasLines = wrapTextCanvas(tctx, data.notas, contentW);
  const productoLines = wrapTextCanvas(tctx, data.producto, contentW - 40);

  const headerH = 150;
  const metaH = 90;
  const prodH = 50 + productoLines.length * 20;
  const tierH = 76;
  const tiers = data.tiers.length ? data.tiers : [{ etiqueta: "—", cantidad: 0, precioUnit: 0 }];
  const tiersH = tierH * tiers.length + 20;
  const notesH = 40 + notasLines.length * 18;
  const footH = 60;
  const H = headerH + metaH + prodH + tiersH + notesH + footH + 40;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const c = canvas.getContext("2d");

  c.fillStyle = "#ffffff";
  c.fillRect(0, 0, W, H);

  c.fillStyle = "#121212";
  c.fillRect(0, 0, W, headerH - 6);
  c.fillStyle = "#ffffff";
  c.font = "900 26px -apple-system,Arial,sans-serif";
  c.fillText("COTIZACIÓN POR CANTIDADES", PAD, 58);
  c.fillStyle = "#bdbdb8";
  c.font = "600 13px -apple-system,Arial,sans-serif";
  c.fillText("Soluciones textiles y gráficas personalizadas", PAD, 84);
  c.font = "11px -apple-system,Arial,sans-serif";
  c.fillText(DD_CONTACTO_1, PAD, 108);
  c.fillText(DD_CONTACTO_2, PAD, 126);
  c.fillStyle = "#7a1f2b";
  c.fillRect(0, headerH - 6, W, 6);

  let y = headerH + 40;
  c.fillStyle = "#8a8a8a";
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("CLIENTE", PAD, y);
  c.fillStyle = "#111";
  c.font = "900 17px -apple-system,Arial,sans-serif";
  c.fillText(data.cliente || "—", PAD, y + 22);
  c.fillStyle = "#555";
  c.font = "12px -apple-system,Arial,sans-serif";
  c.fillText(data.contacto || "", PAD, y + 42);

  c.textAlign = "right";
  c.fillStyle = "#8a8a8a";
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("COTIZACIÓN", W - PAD, y);
  c.fillStyle = "#555";
  c.font = "12px -apple-system,Arial,sans-serif";
  c.fillText(data.fecha || "", W - PAD, y + 22);
  c.fillText("Válido por " + (data.validez || ""), W - PAD, y + 40);
  c.textAlign = "left";

  y += metaH;
  c.fillStyle = "#f4f4f1";
  c.fillRect(PAD, y, contentW, prodH - 10);
  c.fillStyle = "#8a8a8a";
  c.font = "700 9px -apple-system,Arial,sans-serif";
  c.fillText("PRODUCTO", PAD + 20, y + 20);
  c.fillStyle = "#111";
  c.font = "800 14px -apple-system,Arial,sans-serif";
  productoLines.forEach((line, i) => c.fillText(line, PAD + 20, y + 42 + i * 20));
  y += prodH + 14;

  tiers.forEach((t) => {
    const destacar = !!t.destacar;
    const cantidad = parseFloat(t.cantidad) || 0;
    const precioUnit = parseFloat(t.precioUnit) || 0;
    const totalCliente = cantidad * precioUnit;
    c.strokeStyle = destacar ? "#7a1f2b" : "#dededa";
    c.lineWidth = destacar ? 2 : 1;
    c.strokeRect(PAD, y, contentW, tierH - 14);
    c.fillStyle = destacar ? "#7a1f2b" : "#121212";
    c.fillRect(PAD, y, 132, tierH - 14);
    c.fillStyle = "#fff";
    c.font = "900 24px -apple-system,Arial,sans-serif";
    c.fillText(String(cantidad), PAD + 18, y + 34);
    c.font = "700 9px -apple-system,Arial,sans-serif";
    c.fillStyle = destacar ? "#f0d6da" : "#bdbdb8";
    c.fillText((t.etiqueta || "UNIDADES").toUpperCase(), PAD + 18, y + 50);

    c.fillStyle = "#666";
    c.font = "11px -apple-system,Arial,sans-serif";
    c.fillText("Precio unitario", PAD + 152, y + 22);
    c.fillStyle = "#111";
    c.font = "900 18px -apple-system,Arial,sans-serif";
    c.fillText(fmtMoney(precioUnit), PAD + 152, y + 44);

    c.textAlign = "right";
    c.fillStyle = "#666";
    c.font = "11px -apple-system,Arial,sans-serif";
    c.fillText("Total", PAD + contentW - 10, y + 22);
    c.fillStyle = "#111";
    c.font = "900 22px -apple-system,Arial,sans-serif";
    c.fillText(fmtMoney(totalCliente), PAD + contentW - 10, y + 46);
    c.textAlign = "left";

    y += tierH;
  });

  y += 16;
  c.fillStyle = "#8a8a8a";
  c.font = "700 10px -apple-system,Arial,sans-serif";
  c.fillText("CONDICIONES", PAD, y);
  c.fillStyle = "#555";
  c.font = "11.5px -apple-system,Arial,sans-serif";
  notasLines.forEach((line, i) => c.fillText(line, PAD, y + 20 + i * 18));
  y += notesH;

  c.fillStyle = "#121212";
  c.fillRect(0, H - footH, W, footH);
  c.fillStyle = "#fff";
  c.font = "900 13px -apple-system,Arial,sans-serif";
  c.fillText("DROPDEALER", PAD, H - footH / 2 + 5);
  c.textAlign = "right";
  c.fillStyle = "#bdbdb8";
  c.font = "10px -apple-system,Arial,sans-serif";
  c.fillText("@dropdealer.ar · 11 2666-7014 · dropdealer.ar@gmail.com", W - PAD, H - footH / 2 + 4);
  c.textAlign = "left";

  return canvas;
}

function DocPreview({ url, filename }) {
  if (!url) return null;
  return (
    <div className="pp-card" style={{ padding: 14, marginTop: 14, textAlign: "center" }}>
      <img src={url} alt="documento generado" style={{ maxWidth: "100%", borderRadius: 8, border: `1px solid ${COLORS.border}` }} />
      <div style={{ marginTop: 10 }}>
        <button className="pp-btn" style={{ background: COLORS.trabajos, color: "#1B1229" }} onClick={() => downloadDataUrl(url, filename)}>
          ⬇ Descargar imagen
        </button>
      </div>
    </div>
  );
}

function useDatosPago() {
  const [datos, setDatos] = useState({ alias: "drop.ar", banco: "Naranja X", titular: "María Guillermina Bassi Chacón" });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      const raw = await storageGet("dd-datospago");
      if (raw) {
        try {
          setDatos(JSON.parse(raw));
        } catch (e) {}
      }
      setLoaded(true);
    })();
  }, []);
  const save = async (d) => {
    setDatos(d);
    await storageSet("dd-datospago", JSON.stringify(d));
  };
  return [datos, save, loaded];
}

function PresupuestoGenerator() {
  const [datosPago, saveDatosPago] = useDatosPago();
  const [cliente, setCliente] = useState("");
  const [contacto, setContacto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [numero, setNumero] = useState("");
  const [validez, setValidez] = useState("15 días");
  const [items, setItems] = useState([]);
  const [descuentoPct, setDescuentoPct] = useState("0");
  const [senaPct, setSenaPct] = useState("50");
  const [notas, setNotas] = useState(
    "Plazo de entrega a confirmar según disponibilidad de prendas base.\nEl trabajo se inicia con la seña acreditada.\nLos colores del estampado pueden variar levemente respecto a la pantalla."
  );
  const [previewUrl, setPreviewUrl] = useState(null);

  let costoTotal = 0,
    cobraTotal = 0;
  items.forEach((it) => {
    const cant = parseFloat(it.cantidad) || 0;
    costoTotal += (parseFloat(it.costo) || 0) * cant;
    cobraTotal += (parseFloat(it.precio) || 0) * cant;
  });
  const descMonto = cobraTotal * ((parseFloat(descuentoPct) || 0) / 100);
  const totalCliente = cobraTotal - descMonto;
  const gananciaTotal = totalCliente - costoTotal;
  const margen = costoTotal ? Math.round((gananciaTotal / costoTotal) * 100) : 0;

  const generar = () => {
    const canvas = drawPresupuestoCanvas({
      cliente,
      contacto,
      fecha: fecha ? new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" }) : "",
      numero,
      validez,
      items,
      descuentoPct,
      senaPct,
      notas,
      alias: datosPago.alias,
      banco: datosPago.banco,
      titular: datosPago.titular,
    });
    setPreviewUrl(canvas.toDataURL("image/png"));
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 14 }}>
        <input className="pp-input" placeholder="Cliente / empresa" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        <input className="pp-input" placeholder="Contacto" value={contacto} onChange={(e) => setContacto(e.target.value)} />
        <input className="pp-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <input className="pp-input" placeholder="N° de presupuesto" value={numero} onChange={(e) => setNumero(e.target.value)} />
        <select className="pp-select" value={validez} onChange={(e) => setValidez(e.target.value)}>
          {["7 días", "15 días", "30 días", "Sin vencimiento"].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <LineItemsEditor
        title="Detalle del trabajo"
        accent={COLORS.trabajos}
        rows={items}
        onChange={setItems}
        columns={[
          { key: "descripcion", label: "Descripción", type: "text", width: 180 },
          { key: "cantidad", label: "Cant.", type: "number", width: 60 },
          { key: "costo", label: "Costo unit.", type: "number", width: 90 },
          { key: "precio", label: "Precio unit.", type: "number", width: 90 },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 3 }}>Descuento (%)</div>
          <input className="pp-input" type="number" value={descuentoPct} onChange={(e) => setDescuentoPct(e.target.value)} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textDim, marginBottom: 3 }}>Seña requerida (%)</div>
          <input className="pp-input" type="number" value={senaPct} onChange={(e) => setSenaPct(e.target.value)} />
        </div>
      </div>

      <div className="pp-card" style={{ padding: 12, marginBottom: 14 }}>
        <div className="pp-heading" style={{ fontWeight: 700, marginBottom: 8, fontSize: 12, color: COLORS.textDim }}>
          SOLO PARA VOS — no sale en el presupuesto
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textDim }}>Costo total</div>
            <div className="pp-heading" style={{ fontWeight: 800 }}>${costoTotal.toLocaleString("es-AR")}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textDim }}>Total al cliente</div>
            <div className="pp-heading" style={{ fontWeight: 800 }}>${totalCliente.toLocaleString("es-AR")}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textDim }}>Ganancia</div>
            <div className="pp-heading" style={{ fontWeight: 800, color: gananciaTotal >= 0 ? "#7FD9A0" : "#F0729C" }}>
              ${gananciaTotal.toLocaleString("es-AR")}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.textDim }}>Margen</div>
            <div className="pp-heading" style={{ fontWeight: 800 }}>{margen}%</div>
          </div>
        </div>
      </div>

      <div className="pp-card" style={{ padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 8 }}>Datos para abonar (salen en el presupuesto)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10 }}>
          <input className="pp-input" placeholder="Alias" value={datosPago.alias} onChange={(e) => saveDatosPago({ ...datosPago, alias: e.target.value })} />
          <input className="pp-input" placeholder="Banco" value={datosPago.banco} onChange={(e) => saveDatosPago({ ...datosPago, banco: e.target.value })} />
          <input className="pp-input" placeholder="Titular" value={datosPago.titular} onChange={(e) => saveDatosPago({ ...datosPago, titular: e.target.value })} />
        </div>
      </div>

      <textarea className="pp-textarea" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Condiciones y notas" />

      <button className="pp-btn" style={{ background: COLORS.trabajos, color: "#1B1229", marginTop: 12 }} onClick={generar}>
        Generar presupuesto
      </button>

      <DocPreview url={previewUrl} filename={`Presupuesto_DropDealer_${cliente || "cliente"}.png`} />
    </div>
  );
}

function CotizacionGenerator() {
  const [cliente, setCliente] = useState("");
  const [contacto, setContacto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [validez, setValidez] = useState("15 días");
  const [producto, setProducto] = useState("");
  const [tiers, setTiers] = useState([
    { id: newId(), etiqueta: "Muestra", cantidad: "1", costoUnit: "", precioUnit: "" },
    { id: newId(), etiqueta: "", cantidad: "10", costoUnit: "", precioUnit: "" },
    { id: newId(), etiqueta: "", cantidad: "20", costoUnit: "", precioUnit: "" },
  ]);
  const [notas, setNotas] = useState(
    "Precios sujetos a confirmación de stock de prendas base.\nPlazo de entrega a coordinar según cantidad.\nLos valores no incluyen envío.\nAl confirmar la cantidad se emite el presupuesto final con los datos de pago."
  );
  const [previewUrl, setPreviewUrl] = useState(null);

  const addTier = () => setTiers([...tiers, { id: newId(), etiqueta: "", cantidad: "", costoUnit: "", precioUnit: "" }]);
  const updateTier = (id, key, val) => setTiers(tiers.map((t) => (t.id === id ? { ...t, [key]: val } : t)));
  const removeTier = (id) => setTiers(tiers.filter((t) => t.id !== id));

  const generar = () => {
    const canvas = drawCotizacionCanvas({
      cliente,
      contacto,
      fecha: fecha ? new Date(fecha + "T12:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" }) : "",
      validez,
      producto,
      tiers: tiers.map((t) => ({ ...t, precioUnit: t.precioUnit, destacar: t.destacar })),
      notas,
    });
    setPreviewUrl(canvas.toDataURL("image/png"));
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 14 }}>
        <input className="pp-input" placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        <input className="pp-input" placeholder="Contacto" value={contacto} onChange={(e) => setContacto(e.target.value)} />
        <input className="pp-input" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <select className="pp-select" value={validez} onChange={(e) => setValidez(e.target.value)}>
          {["7 días", "15 días", "30 días", "Sin vencimiento"].map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="pp-textarea"
        rows={2}
        style={{ marginBottom: 14 }}
        placeholder="Producto a cotizar (ej: Buzo canguro frisa premium negro + estampado DTF frente y espalda)"
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
      />

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div className="pp-heading" style={{ fontWeight: 700, fontSize: 14 }}>
            Escalas de cantidad
          </div>
          <button className="pp-btn" style={{ background: COLORS.trabajos, color: "#1B1229", fontSize: 12 }} onClick={addTier}>
            + Agregar escala
          </button>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {tiers.map((t) => {
            const cant = parseFloat(t.cantidad) || 0;
            const costo = parseFloat(t.costoUnit) || 0;
            const precio = parseFloat(t.precioUnit) || 0;
            const ganancia = (precio - costo) * cant;
            const margen = costo ? Math.round(((precio - costo) / costo) * 100) : 0;
            return (
              <div key={t.id} className="pp-card" style={{ padding: 8, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <input className="pp-input" style={{ width: 90 }} placeholder="Etiqueta" value={t.etiqueta} onChange={(e) => updateTier(t.id, "etiqueta", e.target.value)} />
                <input className="pp-input" style={{ width: 70 }} type="number" placeholder="Cant." value={t.cantidad} onChange={(e) => updateTier(t.id, "cantidad", e.target.value)} />
                <input className="pp-input" style={{ width: 80 }} type="number" placeholder="Costo unit." value={t.costoUnit} onChange={(e) => updateTier(t.id, "costoUnit", e.target.value)} />
                <input className="pp-input" style={{ width: 80 }} type="number" placeholder="Precio unit." value={t.precioUnit} onChange={(e) => updateTier(t.id, "precioUnit", e.target.value)} />
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: COLORS.textDim }}>
                  <input type="checkbox" className="pp-checkbox" checked={!!t.destacar} onChange={(e) => updateTier(t.id, "destacar", e.target.checked)} />
                  Destacar
                </label>
                <div style={{ fontSize: 11, color: ganancia >= 0 ? "#7FD9A0" : "#F0729C" }}>
                  Gan: ${ganancia.toLocaleString("es-AR")} ({margen}%)
                </div>
                <button
                  className="pp-btn"
                  style={{ background: "transparent", color: "#E08AB0", border: "1px solid #E08AB0", fontSize: 11 }}
                  onClick={() => removeTier(t.id)}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 6 }}>El costo unitario y el margen son solo para vos: no salen en la cotización.</div>
      </div>

      <textarea className="pp-textarea" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Condiciones" />

      <button className="pp-btn" style={{ background: COLORS.trabajos, color: "#1B1229", marginTop: 12 }} onClick={generar}>
        Generar cotización
      </button>

      <DocPreview url={previewUrl} filename={`Cotizacion_DropDealer_${cliente || "cliente"}.png`} />
    </div>
  );
}

/* ======================= TRABAJOS: DROPDEALER ======================= */
function DropDealerTab() {
  const [sub, setSub] = useState("clientes");
  return (
    <div>
      <SubNav
        tabs={[
          { key: "clientes", label: "Clientes" },
          { key: "pedidos", label: "Pedidos" },
          { key: "proveedores", label: "Proveedores" },
          { key: "costos", label: "Costos" },
          { key: "presupuesto", label: "Presupuesto" },
          { key: "cotizacion", label: "Cotización" },
          { key: "contenido", label: "Contenido" },
        ]}
        active={sub}
        onChange={setSub}
        accent={COLORS.trabajos}
      />
      {sub === "clientes" && (
        <EntityList
          prefix="dd-cliente-"
          accent={COLORS.trabajos}
          emptyText="Cargá tu primer cliente."
          fields={[
            { key: "nombre", label: "Nombre del cliente", type: "text" },
            { key: "empresa", label: "Nombre de la empresa", type: "text" },
            { key: "telefono", label: "Teléfono", type: "text" },
            { key: "direccion", label: "Dirección", type: "text" },
            { key: "mail", label: "Mail", type: "text" },
          ]}
          cardTitle={(it) => it.nombre}
          cardSubtitle={(it) => it.empresa}
        />
      )}
      {sub === "pedidos" && <DropDealerPedidos />}
      {sub === "proveedores" && (
        <EntityList
          prefix="dd-proveedor-"
          accent={COLORS.trabajos}
          emptyText="Cargá tu primer proveedor."
          fields={[
            { key: "nombre", label: "Nombre de la marca", type: "text" },
            { key: "direccion", label: "Dirección", type: "text" },
            { key: "telefono", label: "Teléfono", type: "text" },
            { key: "referencia", label: "Qué provee / referencias", type: "textarea" },
            { key: "listaPrecios", label: "Lista de precios (foto)", type: "image" },
          ]}
          cardTitle={(it) => it.nombre}
        />
      )}
      {sub === "costos" && (
        <EntityList
          prefix="dd-costo-"
          accent={COLORS.trabajos}
          emptyText="Cargá tu primer producto para calcular el margen."
          fields={[
            { key: "item", label: "Producto / servicio", type: "text" },
            { key: "costo", label: "Costo tercerizado ($)", type: "number" },
            { key: "precio", label: "Precio de venta ($)", type: "number" },
          ]}
          cardTitle={(it) => it.item}
          extraSummary={(it) => {
            const c = parseFloat(it.costo) || 0;
            const p = parseFloat(it.precio) || 0;
            const margen = p - c;
            const pct = c ? Math.round((margen / c) * 100) : 0;
            return (
              <div style={{ fontSize: 12, color: margen >= 0 ? "#7FD9A0" : "#F0729C" }}>
                Margen: ${margen.toLocaleString("es-AR")} ({pct}%)
              </div>
            );
          }}
        />
      )}
      {sub === "presupuesto" && <PresupuestoGenerator />}
      {sub === "cotizacion" && <CotizacionGenerator />}
      {sub === "contenido" && (
        <EntityList
          prefix="dd-contenido-"
          accent={COLORS.trabajos}
          emptyText="Guardá tu primer link de contenido."
          fields={[
            { key: "tipo", label: "Tipo", type: "select", options: ["Reel", "Publicación", "Otro"] },
            { key: "link", label: "Link", type: "text" },
            { key: "nota", label: "Nota", type: "textarea" },
          ]}
          cardTitle={(it) => it.tipo}
        />
      )}
    </div>
  );
}

/* ======================= TRABAJOS: REPROCAN ======================= */
function ReprocanTab() {
  return (
    <div>
      <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 10 }}>
        Cada cliente de Reprocan con sus datos, credencial, permiso y comprobante de pago.
      </div>
      <EntityList
        prefix="reprocan-cliente-"
        accent={COLORS.trabajos}
        emptyText="Cargá tu primer paciente."
        layout="grid"
        fields={[
          { key: "nombre", label: "Nombre del paciente", type: "text" },
          { key: "datos", label: "Datos del paciente (DNI, dirección, contacto)", type: "textarea" },
          { key: "credencial", label: "Foto credencial", type: "image" },
          { key: "permiso", label: "Foto permiso", type: "image" },
          { key: "pago", label: "Comprobante de pago", type: "image" },
          { key: "notaPago", label: "Nota de pago", type: "text" },
        ]}
        cardTitle={(it) => it.nombre}
      />
    </div>
  );
}

/* ======================= TRABAJOS: FIESTA CALOR ======================= */
function FiestaCalorTab() {
  const [sub, setSub] = useState("fechas");
  return (
    <div>
      <SubNav
        tabs={[
          { key: "fechas", label: "Próximas fechas" },
          { key: "stock", label: "Stock" },
          { key: "compras", label: "Compras" },
          { key: "tickets", label: "Tickets" },
          { key: "ideas", label: "Ideas" },
          { key: "mockups", label: "Mockups" },
        ]}
        active={sub}
        onChange={setSub}
        accent={COLORS.trabajos}
      />
      {sub === "fechas" && (
        <EntityList
          prefix="fc-fecha-"
          accent={COLORS.trabajos}
          emptyText="Cargá la próxima fecha del evento."
          fields={[
            { key: "fecha", label: "Fecha", type: "date" },
            { key: "lugar", label: "Lugar", type: "text" },
            { key: "nota", label: "Nota", type: "textarea" },
          ]}
          cardTitle={(it) => it.fecha}
        />
      )}
      {sub === "stock" && (
        <EntityList
          prefix="fc-stock-"
          accent={COLORS.trabajos}
          emptyText="Cargá lo que tenés disponible en stock."
          fields={[
            { key: "item", label: "Ítem", type: "text" },
            { key: "cantidad", label: "Cantidad", type: "number" },
            { key: "nota", label: "Nota", type: "text" },
          ]}
          cardTitle={(it) => it.item}
        />
      )}
      {sub === "compras" && (
        <EntityList
          prefix="fc-compra-"
          accent={COLORS.trabajos}
          emptyText="Cargá tu primera compra."
          fields={[
            { key: "item", label: "Ítem", type: "text" },
            { key: "monto", label: "Monto ($)", type: "number" },
            { key: "fecha", label: "Fecha", type: "date" },
            { key: "nota", label: "Nota", type: "text" },
          ]}
          cardTitle={(it) => it.item}
        />
      )}
      {sub === "tickets" && (
        <EntityList
          prefix="fc-ticket-"
          accent={COLORS.trabajos}
          emptyText="Subí tu primer ticket."
          fields={[
            { key: "imagen", label: "Ticket", type: "image" },
            { key: "nota", label: "Nota", type: "text" },
          ]}
          cardTitle={() => "Ticket"}
        />
      )}
      {sub === "ideas" && (
        <EntityList
          prefix="fc-idea-"
          accent={COLORS.trabajos}
          emptyText="Anotá tu primera idea."
          fields={[{ key: "texto", label: "Idea", type: "textarea" }]}
          cardTitle={() => "💡"}
        />
      )}
      {sub === "mockups" && (
        <EntityList
          prefix="fc-mockup-"
          accent={COLORS.trabajos}
          emptyText="Subí tu primer mockup o imagen."
          fields={[
            { key: "imagen", label: "Imagen", type: "image" },
            { key: "nota", label: "Nota", type: "text" },
          ]}
          cardTitle={() => "🎨"}
        />
      )}
    </div>
  );
}

/* ======================= DASHBOARD DE TRABAJOS ======================= */
function useCollectionCount(prefix) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    (async () => {
      const keys = await storageListKeys(prefix);
      setCount(keys.length);
    })();
  }, [prefix]);
  return count;
}

function TrabajosDashboard() {
  const { items: pedidos, loading } = useCollection("dd-pedido-");
  const reprocanCount = useCollectionCount("reprocan-cliente-");
  const { items: fcFechas } = useCollection("fc-fecha-");
  const { items: fcStock } = useCollection("fc-stock-");

  const ddTotals = pedidos.reduce(
    (acc, p) => {
      const t = calcTotalesPedido(p);
      acc.costo += t.costo;
      acc.precio += t.precio;
      acc.ganancia += t.ganancia;
      acc.sena += t.senaMonto;
      if ((p.estado || "En curso") !== "Entregado" && (p.estado || "En curso") !== "Pagado") acc.enCurso++;
      return acc;
    },
    { costo: 0, precio: 0, ganancia: 0, sena: 0, enCurso: 0 }
  );

  const proximaFecha = [...fcFechas].filter((f) => f.fecha).sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  const MetricCard = ({ label, value, accent, sub }) => (
    <div className="pp-card" style={{ padding: 14, borderLeft: `3px solid ${accent}` }}>
      <div style={{ fontSize: 11, color: COLORS.textDim }}>{label}</div>
      <div className="pp-heading" style={{ fontSize: 20, fontWeight: 800 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{sub}</div>}
    </div>
  );

  if (loading) return <div style={{ color: COLORS.textDim }}>Cargando…</div>;

  return (
    <div>
      <Section title="DropDealer" accent={COLORS.trabajos}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
          <MetricCard label="Pedidos activos" value={ddTotals.enCurso} accent={COLORS.trabajos} sub={`${pedidos.length} en total`} />
          <MetricCard label="Total facturado" value={`$${ddTotals.precio.toLocaleString("es-AR")}`} accent={COLORS.trabajos} />
          <MetricCard label="Costo total" value={`$${ddTotals.costo.toLocaleString("es-AR")}`} accent={COLORS.trabajos} />
          <MetricCard label="Señas cobradas" value={`$${ddTotals.sena.toLocaleString("es-AR")}`} accent={COLORS.trabajos} />
          <MetricCard
            label="Ganancia total"
            value={`$${ddTotals.ganancia.toLocaleString("es-AR")}`}
            accent={ddTotals.ganancia >= 0 ? "#7FD9A0" : "#F0729C"}
          />
        </div>
      </Section>
      <Section title="Reprocan" accent={COLORS.trabajos}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
          <MetricCard label="Pacientes cargados" value={reprocanCount} accent={COLORS.trabajos} />
        </div>
      </Section>
      <Section title="Fiesta Calor" accent={COLORS.trabajos}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
          <MetricCard label="Próxima fecha" value={proximaFecha ? proximaFecha.fecha : "—"} accent={COLORS.trabajos} sub={proximaFecha?.lugar} />
          <MetricCard label="Ítems en stock" value={fcStock.length} accent={COLORS.trabajos} />
        </div>
      </Section>
    </div>
  );
}

function TrabajosTab() {
  const [sub, setSub] = useState("dashboard");
  return (
    <div>
      <SubNav
        tabs={[
          { key: "dashboard", label: "📊 Dashboard" },
          { key: "dropdealer", label: "DropDealer" },
          { key: "reprocan", label: "Reprocan" },
          { key: "fiestacalor", label: "Fiesta Calor" },
        ]}
        active={sub}
        onChange={setSub}
        accent={COLORS.trabajos}
      />
      {sub === "dashboard" && <TrabajosDashboard />}
      {sub === "dropdealer" && <DropDealerTab />}
      {sub === "reprocan" && <ReprocanTab />}
      {sub === "fiestacalor" && <FiestaCalorTab />}
    </div>
  );
}

/* ======================= DATOS MÍOS ======================= */
function DatosMiosTab() {
  const [sub, setSub] = useState("documentos");
  return (
    <div>
      <SubNav
        tabs={[
          { key: "documentos", label: "Documentos" },
          { key: "fotos", label: "Fotos importantes" },
          { key: "direcciones", label: "Direcciones" },
          { key: "telefonos", label: "Teléfonos" },
          { key: "redes", label: "Redes / Contraseñas" },
        ]}
        active={sub}
        onChange={setSub}
        accent={COLORS.datos}
      />
      {sub === "documentos" && (
        <EntityList
          prefix="datos-documento-"
          accent={COLORS.datos}
          emptyText="Cargá tu primer documento importante (DNI, títulos, contratos…)."
          fields={[
            { key: "nombre", label: "¿Qué documento es?", type: "text" },
            { key: "foto", label: "Foto", type: "image" },
            { key: "nota", label: "Nota", type: "textarea" },
          ]}
          cardTitle={(it) => it.nombre}
        />
      )}
      {sub === "fotos" && (
        <EntityList
          prefix="datos-foto-"
          accent={COLORS.datos}
          emptyText="Subí tu primera foto importante."
          fields={[
            { key: "nombre", label: "¿Qué es?", type: "text" },
            { key: "foto", label: "Foto", type: "image" },
          ]}
          cardTitle={(it) => it.nombre}
        />
      )}
      {sub === "direcciones" && (
        <EntityList
          prefix="datos-direccion-"
          accent={COLORS.datos}
          emptyText="Cargá tu primera dirección."
          fields={[
            { key: "nombre", label: "¿De qué lugar es?", type: "text" },
            { key: "direccion", label: "Dirección", type: "text" },
            { key: "nota", label: "Nota", type: "text" },
          ]}
          cardTitle={(it) => it.nombre}
        />
      )}
      {sub === "telefonos" && (
        <EntityList
          prefix="datos-telefono-"
          accent={COLORS.datos}
          emptyText="Cargá tu primer contacto."
          fields={[
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "telefono", label: "Teléfono", type: "text" },
            { key: "nota", label: "Nota", type: "text" },
          ]}
          cardTitle={(it) => it.nombre}
        />
      )}
      {sub === "redes" && (
        <div>
          <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 10 }}>
            Guardá acá tus usuarios y contraseñas de redes y otros sitios. Solo vos ves esta información.
          </div>
          <EntityList
            prefix="datos-credencial-"
            accent={COLORS.datos}
            emptyText="Cargá tu primer sitio o red social."
            fields={[
              { key: "sitio", label: "Sitio / Red social", type: "text" },
              { key: "usuario", label: "Usuario / Email", type: "text" },
              { key: "contrasena", label: "Contraseña", type: "password" },
              { key: "nota", label: "Nota", type: "text" },
            ]}
            cardTitle={(it) => it.sitio}
          />
        </div>
      )}
    </div>
  );
}

/* ======================= TAREAS / AGENDA ======================= */
function TareasTab() {
  const prefix = "tarea-";
  const { items, loading, addItem, updateItem, deleteItem } = useCollection(prefix);
  const [texto, setTexto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [hora, setHora] = useState("");

  const submit = async () => {
    if (!texto) return;
    await addItem({ texto, fecha, hora, done: false });
    setTexto("");
    setHora("");
  };

  const today = new Date().toISOString().slice(0, 10);
  const hoy = items.filter((i) => i.fecha === today);
  const proximas = items.filter((i) => i.fecha > today).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const pasadas = items.filter((i) => i.fecha < today && !i.done).sort((a, b) => b.fecha.localeCompare(a.fecha));

  const TaskRow = ({ it }) => (
    <div className="pp-card" style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, borderLeft: `3px solid ${COLORS.tareas}`, opacity: it.done ? 0.5 : 1 }}>
      <input type="checkbox" className="pp-checkbox" checked={!!it.done} onChange={() => updateItem(it.id, { ...it, done: !it.done })} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, textDecoration: it.done ? "line-through" : "none" }}>{it.texto}</div>
        <div style={{ fontSize: 11, color: COLORS.textDim }}>
          {it.fecha} {it.hora && `· ${it.hora}`}
        </div>
      </div>
      <button className="pp-btn" style={{ background: "transparent", color: COLORS.textDim, fontSize: 11 }} onClick={() => deleteItem(it.id)}>
        ✕
      </button>
    </div>
  );

  return (
    <div>
      <div className="pp-card" style={{ padding: 16, marginBottom: 18, background: `linear-gradient(135deg, ${COLORS.surface}, ${COLORS.surfaceLight})`, border: `1px solid ${COLORS.tareas}` }}>
        <div className="pp-heading" style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: COLORS.tareas }}>
          ✨ ¿Qué tenés que hacer?
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input className="pp-input" style={{ flex: 1, minWidth: 160 }} placeholder="Nueva tarea…" value={texto} onChange={(e) => setTexto(e.target.value)} />
          <input className="pp-input" style={{ width: 140 }} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          <input className="pp-input" style={{ width: 100 }} type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
          <button className="pp-btn" style={{ background: COLORS.tareas, color: "#1B1229" }} onClick={submit}>
            Agregar
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ color: COLORS.textDim }}>Cargando…</div>
      ) : (
        <>
          {pasadas.length > 0 && (
            <Section title="Atrasadas" accent="#F0729C">
              <div style={{ display: "grid", gap: 8 }}>
                {pasadas.map((it) => (
                  <TaskRow key={it.id} it={it} />
                ))}
              </div>
            </Section>
          )}
          <Section title="Hoy" accent={COLORS.tareas}>
            <div style={{ display: "grid", gap: 8 }}>
              {hoy.length === 0 ? <div style={{ color: COLORS.textDim, fontSize: 13 }}>Nada para hoy. Disfrutá o adelantá algo 🙂</div> : hoy.map((it) => <TaskRow key={it.id} it={it} />)}
            </div>
          </Section>
          <Section title="Próximas" accent={COLORS.tareas}>
            <div style={{ display: "grid", gap: 8 }}>
              {proximas.length === 0 ? <div style={{ color: COLORS.textDim, fontSize: 13 }}>No hay tareas futuras cargadas.</div> : proximas.map((it) => <TaskRow key={it.id} it={it} />)}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}

/* ======================= LIGHTBOX ======================= */
function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <img src={src} alt="" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 10 }} />
    </div>
  );
}

/* ======================= HOMEPAGE / INICIO ======================= */
function addDaysStr(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function HomeTab() {
  const { items: tareas, loading: loadingTareas, updateItem: updateTarea } = useCollection("tarea-");
  const { items: pedidos, loading: loadingPedidos } = useCollection("dd-pedido-");
  const { items: movimientos } = useCollection("economia-mov-");
  const { items: fcFechas } = useCollection("fc-fecha-");

  if (loadingTareas || loadingPedidos) return <div style={{ color: COLORS.textDim }}>Cargando…</div>;

  const today = new Date().toISOString().slice(0, 10);
  const mesActualStr = today.slice(0, 7);
  const in7 = addDaysStr(today, 7);
  const in14 = addDaysStr(today, 14);

  const ingresosMes = movimientos
    .filter((m) => m.tipo === "ingreso" && m.fecha && m.fecha.slice(0, 7) === mesActualStr)
    .reduce((s, m) => s + (parseFloat(m.monto) || 0), 0);
  const gastosMes = movimientos
    .filter((m) => m.tipo === "gasto" && m.fecha && m.fecha.slice(0, 7) === mesActualStr)
    .reduce((s, m) => s + (parseFloat(m.monto) || 0), 0);
  const gananciaDD = pedidos.reduce((s, p) => s + calcTotalesPedido(p).ganancia, 0);

  const tareasPendientes = tareas.filter((t) => !t.done);
  const atrasadas = tareasPendientes.filter((t) => t.fecha < today);
  const estaSemana = tareasPendientes.filter((t) => t.fecha >= today && t.fecha < in7).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const proximaSemana = tareasPendientes.filter((t) => t.fecha >= in7 && t.fecha < in14).sort((a, b) => a.fecha.localeCompare(b.fecha));

  const deadlines = [];
  pedidos.forEach((p) => {
    if (p.fechaEntrega && p.fechaEntrega >= today) {
      deadlines.push({ fecha: p.fechaEntrega, label: `Entrega — ${p.nombreCliente || "pedido"}`, tipo: "DropDealer" });
    }
  });
  fcFechas.forEach((f) => {
    if (f.fecha && f.fecha >= today) {
      deadlines.push({ fecha: f.fecha, label: `Fiesta Calor${f.lugar ? " — " + f.lugar : ""}`, tipo: "Fiesta Calor" });
    }
  });
  tareasPendientes.forEach((t) => {
    if (t.fecha >= today) deadlines.push({ fecha: t.fecha, label: t.texto, tipo: "Tarea" });
  });
  deadlines.sort((a, b) => a.fecha.localeCompare(b.fecha));
  const deadlinesProximos = deadlines.slice(0, 12);

  const MiniTask = ({ t }) => (
    <div className="pp-card" style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, borderLeft: `3px solid ${COLORS.tareas}` }}>
      <input type="checkbox" className="pp-checkbox" checked={!!t.done} onChange={() => updateTarea(t.id, { ...t, done: !t.done })} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13 }}>{t.texto}</div>
        <div style={{ fontSize: 11, color: COLORS.textDim }}>
          {t.fecha} {t.hora && `· ${t.hora}`}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 22 }}>
        <div className="pp-card" style={{ padding: 14, borderLeft: `3px solid ${COLORS.economia}` }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Ingresos del mes</div>
          <div className="pp-heading" style={{ fontSize: 20, fontWeight: 800, color: "#7FD9A0" }}>
            ${ingresosMes.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="pp-card" style={{ padding: 14, borderLeft: `3px solid ${COLORS.economia}` }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Gastos del mes</div>
          <div className="pp-heading" style={{ fontSize: 20, fontWeight: 800, color: "#F0729C" }}>
            ${gastosMes.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="pp-card" style={{ padding: 14, borderLeft: `3px solid ${COLORS.trabajos}` }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Ganancia DropDealer</div>
          <div className="pp-heading" style={{ fontSize: 20, fontWeight: 800, color: gananciaDD >= 0 ? "#7FD9A0" : "#F0729C" }}>
            ${gananciaDD.toLocaleString("es-AR")}
          </div>
        </div>
        <div className="pp-card" style={{ padding: 14, borderLeft: `3px solid ${COLORS.tareas}` }}>
          <div style={{ fontSize: 11, color: COLORS.textDim }}>Tareas pendientes</div>
          <div className="pp-heading" style={{ fontSize: 20, fontWeight: 800 }}>
            {tareasPendientes.length}
          </div>
        </div>
      </div>

      {atrasadas.length > 0 && (
        <Section title="Atrasadas" accent="#F0729C">
          <div style={{ display: "grid", gap: 8 }}>
            {atrasadas.map((t) => (
              <MiniTask key={t.id} t={t} />
            ))}
          </div>
        </Section>
      )}

      <Section title="Esta semana" accent={COLORS.tareas}>
        <div style={{ display: "grid", gap: 8 }}>
          {estaSemana.length === 0 ? (
            <div style={{ fontSize: 13, color: COLORS.textDim }}>Nada cargado para esta semana.</div>
          ) : (
            estaSemana.map((t) => <MiniTask key={t.id} t={t} />)
          )}
        </div>
      </Section>

      <Section title="Próxima semana" accent={COLORS.tareas}>
        <div style={{ display: "grid", gap: 8 }}>
          {proximaSemana.length === 0 ? (
            <div style={{ fontSize: 13, color: COLORS.textDim }}>Nada cargado para la próxima semana.</div>
          ) : (
            proximaSemana.map((t) => <MiniTask key={t.id} t={t} />)
          )}
        </div>
      </Section>

      <Section title="Próximos vencimientos" subtitle="Entregas de trabajos, fechas de eventos y tareas con fecha" accent={COLORS.datos}>
        {deadlinesProximos.length === 0 ? (
          <div style={{ fontSize: 13, color: COLORS.textDim }}>No hay fechas límite cargadas todavía.</div>
        ) : (
          <div style={{ display: "grid", gap: 6 }}>
            {deadlinesProximos.map((d, i) => (
              <div key={i} className="pp-card" style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13 }}>{d.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: 999,
                      background: COLORS.surfaceLight,
                      color: COLORS.textDim,
                    }}
                  >
                    {d.tipo}
                  </span>
                  <span style={{ fontSize: 12, color: COLORS.textDim }}>{d.fecha}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

/* ======================= APP ROOT ======================= */
const TABS = [
  { key: "home", label: "🏠 Inicio", accent: COLORS.primary },
  { key: "economia", label: "💰 Economía", accent: COLORS.economia },
  { key: "salud", label: "🩺 Salud", accent: COLORS.salud },
  { key: "trabajos", label: "💼 Trabajos", accent: COLORS.trabajos },
  { key: "datos", label: "🗂️ Mis datos", accent: COLORS.datos },
  { key: "tareas", label: "✅ Tareas", accent: COLORS.tareas },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [lightboxSrc, setLightboxSrc] = useState(null);

  return (
    <LightboxContext.Provider value={setLightboxSrc}>
      <div className="pp-root" style={{ background: COLORS.ink, minHeight: "100vh", padding: "18px 14px 60px", overflow: "hidden" }}>
        <FontStyles />
        <BackgroundBlobs />
        <FloatingPetals />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 18 }}>
            <div className="pp-heading" style={{ fontSize: 22, fontWeight: 800 }}>
              Panel personal 💫
            </div>
            <div style={{ fontSize: 13, color: COLORS.textDim }}>Todo lo tuyo, en un solo lugar.</div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            {TABS.map((t) => (
              <div
                key={t.key}
                className="pp-tab"
                onClick={() => setTab(t.key)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  background: tab === t.key ? t.accent : COLORS.surface,
                  color: tab === t.key ? "#1B1229" : COLORS.text,
                  border: `1px solid ${tab === t.key ? t.accent : COLORS.border}`,
                }}
              >
                {t.label}
              </div>
            ))}
          </div>

          <div key={tab}>
            {tab === "home" && <HomeTab />}
            {tab === "economia" && <EconomiaTab />}
            {tab === "salud" && <SaludTab />}
            {tab === "trabajos" && <TrabajosTab />}
            {tab === "datos" && <DatosMiosTab />}
            {tab === "tareas" && <TareasTab />}
          </div>
        </div>
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      </div>
    </LightboxContext.Provider>
  );
}
