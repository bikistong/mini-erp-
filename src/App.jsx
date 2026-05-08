import { useState, useRef } from "react";

const initBB = [
  { id:1, kode:"BB-001", nama:"Baja Plat 2mm",     satuan:"Lembar", stok:200, hargaBeli:350000 },
  { id:2, kode:"BB-002", nama:"Besi Hollow 40x40",  satuan:"Batang", stok:150, hargaBeli:85000  },
  { id:3, kode:"BB-003", nama:"Cat Primer 4kg",      satuan:"Kaleng", stok:80,  hargaBeli:95000  },
  { id:4, kode:"BB-004", nama:"Kawat Las 2.5mm",     satuan:"Roll",   stok:60,  hargaBeli:185000 },
  { id:5, kode:"BB-005", nama:"Mur Baut Set",        satuan:"Set",    stok:300, hargaBeli:25000  },
];

const initProduk = [
  { id:1, kode:"BJ-001", nama:"Komponen Mesin A", satuan:"Unit", hargaJual:1200000, stok:12,
    bom:[{bbId:1,qty:2},{bbId:2,qty:1},{bbId:4,qty:0.5}] },
  { id:2, kode:"BJ-002", nama:"Komponen Mesin B", satuan:"Unit", hargaJual:2000000, stok:5,
    bom:[{bbId:1,qty:3},{bbId:2,qty:2},{bbId:3,qty:1},{bbId:5,qty:2}] },
  { id:3, kode:"BJ-003", nama:"Rangka Produk C",  satuan:"Unit", hargaJual:750000,  stok:20,
    bom:[{bbId:2,qty:3},{bbId:5,qty:4}] },
];

const initCustomers = [
  { id:1, kode:"CUST-001", nama:"PT Maju Jaya",  telp:"021-111", termin:30 },
  { id:2, kode:"CUST-002", nama:"CV Sejahtera",   telp:"022-222", termin:14 },
  { id:3, kode:"CUST-003", nama:"UD Berkah",       telp:"031-333", termin:21 },
];

const initSuppliers = [
  { id:1, kode:"SUPP-001", nama:"PT Bahan Prima", telp:"021-444", termin:30 },
  { id:2, kode:"SUPP-002", nama:"CV Logam Utama", telp:"021-555", termin:45 },
];

const initBank = [
  { id:"TXN-001", tgl:"2026-04-01", ket:"Setoran modal awal",            tipe:"masuk",  jumlah:500000000, ref:"", saldo:500000000 },
  { id:"TXN-002", tgl:"2026-04-05", ket:"Bayar supplier PT Bahan Prima",  tipe:"keluar", jumlah:80000000,  ref:"", saldo:420000000 },
  { id:"TXN-003", tgl:"2026-04-10", ket:"Terima bayar INV-001",           tipe:"masuk",  jumlah:50000000,  ref:"INV-001", saldo:470000000 },
];

const initPiutang = [
  { id:"INV-001", tgl:"2026-04-01", due:"2026-05-01", customerId:1, total:150000000, dibayar:50000000, status:"Sebagian", items:[{prodId:1,qty:100,harga:1200000,diskon:0}], joId:"JO-001" },
  { id:"INV-002", tgl:"2026-04-05", due:"2026-05-05", customerId:2, total:75000000,  dibayar:0,        status:"Belum",   items:[{prodId:3,qty:100,harga:750000,diskon:0}],  joId:"JO-002" },
];

const initHutang = [
  { id:"PO-001", tgl:"2026-04-02", due:"2026-05-02", supplierId:1, total:80000000, dibayar:30000000, status:"Sebagian", items:[{bbId:1,qty:200,harga:350000}] },
  { id:"PO-002", tgl:"2026-04-06", due:"2026-05-06", supplierId:2, total:45000000, dibayar:0,        status:"Belum",   items:[{bbId:2,qty:150,harga:85000}]  },
];

const initJO = [
  { id:"JO-001", invId:"INV-001", prodId:1, qty:100, status:"In Progress", tgl:"2026-04-01",
    logs:[{tgl:"2026-04-02",ket:"Mulai produksi batch pertama",qty:30},{tgl:"2026-04-05",ket:"Batch pertama selesai QC",qty:30}] },
  { id:"JO-002", invId:"INV-002", prodId:3, qty:100, status:"Draft", tgl:"2026-04-05", logs:[] },
];

const fmt   = n => "Rp " + Math.round(n||0).toLocaleString("id-ID");
const today = () => new Date().toISOString().slice(0,10);
const addDays = d => new Date(Date.now()+d*864e5).toISOString().slice(0,10);
const uid   = pre => pre + "-" + String(Date.now()).slice(-6);
const emptyRow = () => ({ id:Math.random(), prodId:"", qty:1, harga:0, diskon:0 });
const emptyBB  = () => ({ id:Math.random(), bbId:"", qty:1, harga:0 });

// ─── ICONS ────────────────────────────────────────────────────
function Ic({ n, s=16 }) {
  const paths = {
    dash:  "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    bank:  "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
    ar:    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5",
    ap:    "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    prod:  "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    inv:   "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
    master:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    plus:  "M12 5v14M5 12h14",
    x:     "M18 6L6 18M6 6l12 12",
    save:  "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21V13H7v8M7 3v5h8",
    search:"M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
    upload:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
    check: "M20 6L9 17l-5-5",
    log:   "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
    arrow: "M5 12h14M12 5l7 7-7 7",
    eye:   "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[n] || ""} />
    </svg>
  );
}

// ─── SHARED UI ────────────────────────────────────────────────
function Badge({ s }) {
  const m = {
    Lunas:["#dcfce7","#16a34a"], Sebagian:["#fef9c3","#ca8a04"], Belum:["#fee2e2","#dc2626"],
    Draft:["#f1f5f9","#64748b"], "In Progress":["#dbeafe","#2563eb"], Selesai:["#dcfce7","#16a34a"],
    masuk:["#dcfce7","#16a34a"], keluar:["#fee2e2","#dc2626"],
  };
  const [bg,col] = m[s] || ["#f1f5f9","#64748b"];
  return <span style={{background:bg,color:col,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,whiteSpace:"nowrap"}}>{s}</span>;
}

function Btn({ children, variant="primary", onClick, style={} }) {
  const vs = {
    primary:{background:"#6366f1",color:"#fff",border:"none",boxShadow:"0 2px 6px rgba(99,102,241,0.3)"},
    ghost:  {background:"#fff",color:"#64748b",border:"1.5px solid #e2e8f0"},
    danger: {background:"#fee2e2",color:"#dc2626",border:"none"},
    success:{background:"#dcfce7",color:"#16a34a",border:"none"},
    warning:{background:"#fef9c3",color:"#ca8a04",border:"none"},
  };
  return (
    <button onClick={onClick} style={{padding:"7px 14px",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:5,...vs[variant],...style}}>
      {children}
    </button>
  );
}

function Card({ children, style={} }) {
  return <div style={{background:"#fff",borderRadius:14,border:"1px solid #f1f5f9",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",...style}}>{children}</div>;
}

function CardHeader({ title, icon, right }) {
  return (
    <div style={{padding:"13px 16px",borderBottom:"1px solid #f8fafc",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:7,fontWeight:700,fontSize:13,color:"#1e293b"}}>
        <span style={{color:"#6366f1"}}><Ic n={icon} s={14}/></span>{title}
      </div>
      {right}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      {label && <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{label}</div>}
      {children}
    </div>
  );
}

const inputStyle = {width:"100%",padding:"8px 11px",border:"1.5px solid #e2e8f0",borderRadius:9,fontSize:13,fontFamily:"inherit",color:"#1e293b",background:"#fff",outline:"none",boxSizing:"border-box"};

function Inp({ label, ...props }) {
  return <Field label={label}><input style={inputStyle} {...props}/></Field>;
}

function Sel({ label, children, ...props }) {
  return <Field label={label}><select style={inputStyle} {...props}>{children}</select></Field>;
}

function DataTable({ heads, rows, empty="Tidak ada data" }) {
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:400}}>
        <thead>
          <tr style={{background:"#f8fafc"}}>
            {heads.map((h,i) => (
              <th key={i} style={{padding:"9px 13px",textAlign:"left",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,whiteSpace:"nowrap"}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={heads.length} style={{textAlign:"center",padding:40,color:"#94a3b8",fontSize:13}}>{empty}</td></tr>
            : rows.map((r,i) => (
              <tr key={i} style={{borderTop:"1px solid #f8fafc"}}>
                {r.map((c,j) => <td key={j} style={{padding:"10px 13px",fontSize:13,color:"#1e293b"}}>{c}</td>)}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

function Stats({ items }) {
  return (
    <div style={{display:"grid",gridTemplateColumns:`repeat(${items.length},1fr)`,gap:10,marginBottom:18}}>
      {items.map(s => (
        <div key={s.label} style={{background:s.bg||"#eff6ff",borderRadius:12,padding:"13px 14px"}}>
          <div style={{fontSize:10,fontWeight:700,color:s.color||"#6366f1",textTransform:"uppercase",letterSpacing:0.5}}>{s.label}</div>
          <div style={{fontSize:15,fontWeight:800,color:"#1e293b",marginTop:3}}>{s.value}</div>
          {s.sub && <div style={{fontSize:11,color:"#94a3b8",marginTop:1}}>{s.sub}</div>}
        </div>
      ))}
    </div>
  );
}

function Modal({ open, onClose, title, children, width=480 }) {
  if (!open) return null;
  return (
    <div onClick={e => { if(e.target===e.currentTarget) onClose(); }} style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.55)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:18,width:"100%",maxWidth:width,maxHeight:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"15px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:800,fontSize:15,color:"#1e293b"}}>{title}</div>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:8,border:"none",background:"#f1f5f9",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b"}}><Ic n="x" s={13}/></button>
        </div>
        <div style={{overflow:"auto",flex:1,padding:18}}>{children}</div>
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const colors = { success:"#16a34a", error:"#dc2626", info:"#6366f1" };
  return (
    <div style={{position:"fixed",bottom:20,right:20,background:colors[toast.type]||"#1e293b",color:"#fff",padding:"10px 16px",borderRadius:12,fontSize:13,fontWeight:600,zIndex:999,boxShadow:"0 8px 24px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",gap:7}}>
      <Ic n="check" s={13}/> {toast.msg}
    </div>
  );
}

// ─── BAYAR MODAL (shared) ─────────────────────────────────────
function BayarModal({ open, onClose, item, tipeBank, bank, onSave, label }) {
  const [txnId, setTxnId] = useState("");
  const [jumlah, setJumlah] = useState("");

  if (!open || !item) return null;
  const sisa = item.total - item.dibayar;
  const opts = bank.filter(b => b.tipe === tipeBank);

  const handleTxn = e => {
    const t = bank.find(b => b.id === e.target.value);
    setTxnId(e.target.value);
    if (t) setJumlah(String(t.jumlah));
  };

  const submit = () => {
    if (!txnId) return alert("Pilih ID Transaksi Bank!");
    const j = parseFloat(jumlah) || 0;
    if (j <= 0) return alert("Jumlah harus lebih dari 0!");
    onSave(txnId, Math.min(j, sisa));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={"Catat Pembayaran — " + item.id} width={440}>
      <div style={{background:"#f8fafc",borderRadius:10,padding:12,marginBottom:14}}>
        <div style={{fontWeight:800,color:"#6366f1",marginBottom:4}}>{item.id}</div>
        {[["Total",fmt(item.total)],["Terbayar",fmt(item.dibayar)],["Sisa",fmt(sisa)]].map(([l,v]) => (
          <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0"}}>
            <span style={{color:"#64748b"}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",marginBottom:5}}>ID Transaksi Bank {tipeBank === "masuk" ? "Masuk" : "Keluar"}</div>
        <select value={txnId} onChange={handleTxn} style={inputStyle}>
          <option value="">-- Pilih ID Transaksi --</option>
          {opts.map(b => <option key={b.id} value={b.id}>{b.id} — {b.ket.slice(0,28)} — {fmt(b.jumlah)}</option>)}
        </select>
        {opts.length === 0 && <div style={{fontSize:11,color:"#dc2626",marginTop:4}}>Belum ada mutasi {tipeBank} di buku bank</div>}
      </div>
      <div style={{marginBottom:14}}>
        <Inp label="Jumlah Bayar" type="number" value={jumlah} onChange={e => setJumlah(e.target.value)}/>
      </div>
      <div style={{display:"flex",gap:8}}>
        <Btn onClick={submit}><Ic n="check" s={13}/> Konfirmasi</Btn>
        <Btn variant="ghost" onClick={onClose}>Batal</Btn>
      </div>
    </Modal>
  );
}

// ─── MODULE: DASHBOARD ────────────────────────────────────────
function Dashboard({ piutang, hutang, bank, jobOrders, produk, customers }) {
  const saldoBank   = bank.length > 0 ? bank[bank.length-1].saldo : 0;
  const outstanding = piutang.reduce((s,p) => s+(p.total-p.dibayar),0);
  const outHutang   = hutang.reduce((s,h) => s+(h.total-h.dibayar),0);
  const joAktif     = jobOrders.filter(j => j.status==="In Progress").length;

  return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{fontWeight:800,fontSize:20,color:"#1e293b"}}>Dashboard</div>
        <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>Ringkasan keuangan dan operasional</div>
      </div>

      <Stats items={[
        { label:"Saldo Bank",     value:fmt(saldoBank),   bg:"#eff6ff", color:"#6366f1" },
        { label:"Piutang",        value:fmt(outstanding),  bg:"#fef9c3", color:"#ca8a04" },
        { label:"Hutang",         value:fmt(outHutang),    bg:"#fee2e2", color:"#dc2626" },
        { label:"JO Aktif",       value:joAktif+" JO",     bg:"#dbeafe", color:"#2563eb" },
      ]}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <CardHeader title="Invoice Piutang Terbaru" icon="ar"/>
          <DataTable
            heads={["Invoice","Pelanggan","Total","Status"]}
            rows={piutang.slice(0,5).map(p => [
              <span style={{fontWeight:700,color:"#6366f1"}}>{p.id}</span>,
              customers.find(c=>c.id===p.customerId)?.nama||"-",
              <span style={{fontWeight:700}}>{fmt(p.total)}</span>,
              <Badge s={p.status}/>
            ])}
          />
        </Card>
        <Card>
          <CardHeader title="Mutasi Bank Terbaru" icon="bank"/>
          <DataTable
            heads={["ID","Keterangan","Jumlah","Tipe"]}
            rows={[...bank].reverse().slice(0,5).map(b => [
              <span style={{fontWeight:700,color:"#6366f1",fontSize:11}}>{b.id}</span>,
              <span style={{fontSize:12}}>{b.ket.length>28?b.ket.slice(0,28)+"...":b.ket}</span>,
              <span style={{fontWeight:700,color:b.tipe==="masuk"?"#16a34a":"#dc2626"}}>{fmt(b.jumlah)}</span>,
              <Badge s={b.tipe}/>
            ])}
          />
        </Card>
      </div>

      <Card>
        <CardHeader title="Job Order Aktif" icon="prod"/>
        <DataTable
          heads={["JO ID","Invoice","Produk","Qty","Status"]}
          rows={jobOrders.filter(j=>j.status!=="Selesai").map(j => [
            <span style={{fontWeight:700,color:"#6366f1"}}>{j.id}</span>,
            j.invId,
            produk.find(p=>p.id===j.prodId)?.nama||"-",
            j.qty,
            <Badge s={j.status}/>
          ])}
          empty="Tidak ada job order aktif"
        />
      </Card>
    </div>
  );
}

// ─── MODULE: BANK ─────────────────────────────────────────────
function BankModule({ bank, setBank, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tgl:today(), ket:"", tipe:"masuk", jumlah:"", ref:"" });
  const fileRef = useRef();

  const saldo      = bank.length > 0 ? bank[bank.length-1].saldo : 0;
  const totMasuk   = bank.filter(b=>b.tipe==="masuk").reduce((s,b)=>s+b.jumlah,0);
  const totKeluar  = bank.filter(b=>b.tipe==="keluar").reduce((s,b)=>s+b.jumlah,0);

  const set = (k,v) => setForm(p => ({...p,[k]:v}));

  const addManual = () => {
    if (!form.ket || !form.jumlah) { showToast("Lengkapi semua field!","error"); return; }
    const jumlah = parseFloat(form.jumlah);
    const prev   = bank.length > 0 ? bank[bank.length-1].saldo : 0;
    const saldo2 = form.tipe==="masuk" ? prev+jumlah : prev-jumlah;
    const entry  = { id:uid("TXN"), tgl:form.tgl, ket:form.ket, tipe:form.tipe, jumlah, ref:form.ref, saldo:saldo2 };
    setBank(p => [...p, entry]);
    setForm({ tgl:today(), ket:"", tipe:"masuk", jumlah:"", ref:"" });
    showToast("Mutasi "+entry.id+" berhasil ditambahkan","success");
    setShowForm(false);
  };

  const handleCSV = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const lines = ev.target.result.split("\n").filter(l=>l.trim());
      const entries = [];
      let prev = bank.length > 0 ? bank[bank.length-1].saldo : 0;
      for (let i=1; i<lines.length; i++) {
        const [tgl,ket,tipe,jStr,ref=""] = lines[i].split(",").map(c=>c.trim().replace(/"/g,""));
        const jumlah = parseFloat(jStr.replace(/\./g,"").replace(",",".")) || 0;
        prev = tipe==="masuk" ? prev+jumlah : prev-jumlah;
        entries.push({ id:uid("TXN"), tgl, ket, tipe, jumlah, ref, saldo:prev });
      }
      setBank(p => [...p,...entries]);
      showToast(entries.length+" mutasi berhasil diimport","success");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
        <div>
          <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Buku Bank</div>
          <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>ID transaksi sebagai referensi pembayaran piutang/hutang</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <input type="file" accept=".csv" ref={fileRef} onChange={handleCSV} style={{display:"none"}}/>
          <Btn variant="ghost" onClick={() => fileRef.current.click()}><Ic n="upload" s={13}/> Import CSV</Btn>
          <Btn onClick={() => setShowForm(!showForm)}><Ic n="plus" s={13}/> Tambah Manual</Btn>
        </div>
      </div>

      <Stats items={[
        { label:"Saldo Akhir",  value:fmt(saldo),     bg:"#eff6ff", color:"#6366f1" },
        { label:"Total Masuk",  value:fmt(totMasuk),  bg:"#dcfce7", color:"#16a34a" },
        { label:"Total Keluar", value:fmt(totKeluar), bg:"#fee2e2", color:"#dc2626" },
        { label:"Total Mutasi", value:bank.length+" txn", bg:"#f5f3ff", color:"#7c3aed" },
      ]}/>

      {showForm && (
        <Card style={{padding:18,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:"#1e293b",marginBottom:14}}>Tambah Mutasi Manual</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <Inp label="Tanggal" type="date" value={form.tgl} onChange={e=>set("tgl",e.target.value)}/>
            <Sel label="Tipe" value={form.tipe} onChange={e=>set("tipe",e.target.value)}>
              <option value="masuk">Masuk</option>
              <option value="keluar">Keluar</option>
            </Sel>
            <div style={{gridColumn:"1/-1"}}>
              <Inp label="Keterangan" placeholder="Terima pembayaran INV-001 / Bayar supplier..." value={form.ket} onChange={e=>set("ket",e.target.value)}/>
            </div>
            <Inp label="Jumlah (Rp)" type="number" placeholder="0" value={form.jumlah} onChange={e=>set("jumlah",e.target.value)}/>
            <Inp label="Referensi (opsional)" placeholder="INV-001 / PO-001" value={form.ref} onChange={e=>set("ref",e.target.value)}/>
          </div>
          <div style={{background:"#eff6ff",borderRadius:9,padding:"9px 13px",marginBottom:14,fontSize:12,color:"#4338ca"}}>
            ID transaksi (TXN-xxxxxx) dibuat otomatis dan bisa dipakai referensi bayar piutang/hutang.
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={addManual}><Ic n="save" s={13}/> Simpan</Btn>
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Batal</Btn>
          </div>
        </Card>
      )}

      <div style={{background:"#f8fafc",borderRadius:10,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#64748b",display:"flex",alignItems:"center",gap:7}}>
        <Ic n="upload" s={12}/>
        Format CSV: <code style={{background:"#e2e8f0",padding:"1px 6px",borderRadius:4,fontSize:11}}>tanggal,keterangan,tipe,jumlah,referensi</code>
        — tipe: masuk / keluar
      </div>

      <Card>
        <CardHeader title={"Daftar Mutasi ("+bank.length+")"} icon="bank"/>
        <DataTable
          heads={["ID Transaksi","Tanggal","Keterangan","Tipe","Jumlah","Referensi","Saldo"]}
          rows={[...bank].reverse().map(b => [
            <span style={{fontWeight:800,color:"#6366f1",fontSize:11,background:"#eff6ff",padding:"2px 8px",borderRadius:6}}>{b.id}</span>,
            b.tgl,
            <span style={{fontSize:12}}>{b.ket}</span>,
            <Badge s={b.tipe}/>,
            <span style={{fontWeight:700,color:b.tipe==="masuk"?"#16a34a":"#dc2626"}}>{fmt(b.jumlah)}</span>,
            b.ref ? <span style={{fontSize:11,color:"#6366f1",fontWeight:600}}>{b.ref}</span> : <span style={{color:"#cbd5e1"}}>-</span>,
            <span style={{fontWeight:700}}>{fmt(b.saldo)}</span>,
          ])}
        />
      </Card>
    </div>
  );
}

// ─── MODULE: PIUTANG ──────────────────────────────────────────
function PiutangModule({ piutang, setPiutang, jobOrders, setJobOrders, produk, customers, bank, showToast }) {
  const [view, setView]         = useState("list");
  const [bayarItem, setBayarItem] = useState(null);
  const [form, setForm]         = useState({ customerId:"", tgl:today(), due:addDays(30), items:[emptyRow()] });

  const outstanding = piutang.reduce((s,p)=>s+(p.total-p.dibayar),0);
  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  const addItem   = () => setForm(p=>({...p,items:[...p.items,emptyRow()]}));
  const updItem   = (id,k,v) => setForm(p=>({...p,items:p.items.map(it=>it.id===id?{...it,[k]:v}:it)}));
  const delItem   = id => setForm(p=>({...p,items:p.items.filter(it=>it.id!==id)}));
  const calcTotal = () => form.items.reduce((s,it)=>{ const g=(it.qty||0)*(it.harga||0); return s+g-g*(it.diskon||0)/100; },0);

  const saveInv = () => {
    if (!form.customerId) { showToast("Pilih pelanggan!","error"); return; }
    const valid = form.items.filter(it=>it.prodId&&it.qty>0&&it.harga>0);
    if (valid.length===0) { showToast("Tambah minimal 1 barang!","error"); return; }
    const invId = uid("INV");
    const joId  = uid("JO");
    const inv   = { id:invId, tgl:form.tgl, due:form.due, customerId:parseInt(form.customerId), total:calcTotal(), dibayar:0, status:"Belum", items:valid, joId };
    const jo    = { id:joId, invId, prodId:parseInt(valid[0].prodId), qty:parseInt(valid[0].qty), status:"Draft", tgl:form.tgl, logs:[] };
    setPiutang(p=>[inv,...p]);
    setJobOrders(p=>[jo,...p]);
    showToast("Invoice "+invId+" & Job Order "+joId+" dibuat!","success");
    setForm({ customerId:"", tgl:today(), due:addDays(30), items:[emptyRow()] });
    setView("list");
  };

  const doBayar = (txnId, jumlah) => {
    const newDibayar = bayarItem.dibayar + jumlah;
    const status     = newDibayar >= bayarItem.total ? "Lunas" : "Sebagian";
    setPiutang(p=>p.map(x=>x.id===bayarItem.id?{...x,dibayar:newDibayar,status}:x));
    showToast("Bayar "+fmt(jumlah)+" dicatat (ref: "+txnId+")","success");
  };

  if (view==="form") return (
    <div style={{maxWidth:620,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div>
          <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Invoice Baru</div>
          <div style={{fontSize:12,color:"#94a3b8"}}>Otomatis buat Job Order setelah simpan</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="ghost" onClick={()=>setView("list")}>Batal</Btn>
          <Btn onClick={saveInv}><Ic n="save" s={13}/> Simpan + Buat JO</Btn>
        </div>
      </div>
      <Card style={{padding:18,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13,color:"#1e293b",marginBottom:13}}>Informasi Invoice</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Sel label="Pelanggan" value={form.customerId} onChange={e=>setF("customerId",e.target.value)}>
            <option value="">-- Pilih --</option>
            {customers.map(c=><option key={c.id} value={c.id}>{c.nama}</option>)}
          </Sel>
          <Inp label="Tanggal" type="date" value={form.tgl} onChange={e=>setF("tgl",e.target.value)}/>
          <Inp label="Jatuh Tempo" type="date" value={form.due} onChange={e=>setF("due",e.target.value)}/>
        </div>
      </Card>
      <Card style={{padding:18,marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:13,color:"#1e293b",marginBottom:13}}>Detail Produk</div>
        {form.items.map((it,i)=>(
          <div key={it.id} style={{background:"#f8fafc",borderRadius:10,padding:13,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
              <span style={{fontSize:11,fontWeight:700,color:"#94a3b8"}}>ITEM {i+1}</span>
              {form.items.length>1 && (
                <button onClick={()=>delItem(it.id)} style={{border:"none",background:"transparent",cursor:"pointer",color:"#94a3b8",padding:2}}><Ic n="trash" s={13}/></button>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:8}}>
              <select value={it.prodId} onChange={e=>{
                const p=produk.find(p=>p.id===parseInt(e.target.value));
                updItem(it.id,"prodId",e.target.value);
                if(p) updItem(it.id,"harga",p.hargaJual);
              }} style={inputStyle}>
                <option value="">-- Pilih Produk --</option>
                {produk.map(p=><option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
              <input type="number" placeholder="Qty" value={it.qty} onChange={e=>updItem(it.id,"qty",e.target.value)} style={inputStyle}/>
              <input type="number" placeholder="Harga" value={it.harga} onChange={e=>updItem(it.id,"harga",e.target.value)} style={inputStyle}/>
              <input type="number" placeholder="Disc%" value={it.diskon} onChange={e=>updItem(it.id,"diskon",e.target.value)} style={inputStyle}/>
            </div>
            {it.prodId && (
              <div style={{marginTop:7,fontSize:11,color:"#94a3b8"}}>
                BOM: {produk.find(p=>p.id===parseInt(it.prodId))?.bom?.length||0} komponen bahan baku
              </div>
            )}
          </div>
        ))}
        <button onClick={addItem} style={{width:"100%",padding:9,borderRadius:9,border:"2px dashed #e2e8f0",background:"transparent",color:"#6366f1",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontFamily:"inherit"}}>
          <Ic n="plus" s={12}/> Tambah Item
        </button>
        <div style={{marginTop:12,background:"#6366f1",borderRadius:10,padding:"9px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{color:"rgba(255,255,255,0.75)",fontSize:12}}>TOTAL</span>
          <span style={{color:"#fff",fontWeight:800,fontSize:15}}>{fmt(calcTotal())}</span>
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      <BayarModal open={!!bayarItem} onClose={()=>setBayarItem(null)} item={bayarItem} tipeBank="masuk" bank={bank} onSave={doBayar} label="Piutang"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Piutang Dagang</div>
        <Btn onClick={()=>setView("form")}><Ic n="plus" s={13}/> Invoice Baru</Btn>
      </div>
      <Stats items={[
        { label:"Outstanding",   value:fmt(outstanding), bg:"#fef9c3", color:"#ca8a04" },
        { label:"Invoice Lunas", value:piutang.filter(p=>p.status==="Lunas").length+" inv", bg:"#dcfce7", color:"#16a34a" },
        { label:"Total Invoice", value:piutang.length+" inv", bg:"#eff6ff", color:"#6366f1" },
      ]}/>
      <Card>
        <CardHeader title="Daftar Invoice" icon="ar"/>
        <DataTable
          heads={["Invoice","Pelanggan","Tgl","Due","Total","Terbayar","Status","JO","Aksi"]}
          rows={piutang.map(p=>[
            <span style={{fontWeight:700,color:"#6366f1"}}>{p.id}</span>,
            customers.find(c=>c.id===p.customerId)?.nama||"-",
            p.tgl, p.due,
            <span style={{fontWeight:700}}>{fmt(p.total)}</span>,
            <span style={{fontWeight:700,color:"#16a34a"}}>{fmt(p.dibayar)}</span>,
            <Badge s={p.status}/>,
            <span style={{fontSize:11,color:"#6366f1",fontWeight:600}}>{p.joId}</span>,
            p.status!=="Lunas" && <Btn variant="success" onClick={()=>setBayarItem(p)} style={{padding:"3px 9px",fontSize:11}}>Bayar</Btn>
          ])}
        />
      </Card>
    </div>
  );
}

// ─── MODULE: HUTANG ───────────────────────────────────────────
function HutangModule({ hutang, setHutang, suppliers, bahanBaku, bank, showToast }) {
  const [view, setView]          = useState("list");
  const [bayarItem, setBayarItem] = useState(null);
  const [form, setForm]          = useState({ supplierId:"", tgl:today(), due:addDays(30), items:[emptyBB()] });

  const outstanding = hutang.reduce((s,h)=>s+(h.total-h.dibayar),0);
  const setF = (k,v) => setForm(p=>({...p,[k]:v}));

  const addItem  = () => setForm(p=>({...p,items:[...p.items,emptyBB()]}));
  const updItem  = (id,k,v) => setForm(p=>({...p,items:p.items.map(it=>it.id===id?{...it,[k]:v}:it)}));
  const calcTotal= () => form.items.reduce((s,it)=>s+(it.qty||0)*(it.harga||0),0);

  const savePO = () => {
    if (!form.supplierId) { showToast("Pilih supplier!","error"); return; }
    const po = { id:uid("PO"), tgl:form.tgl, due:form.due, supplierId:parseInt(form.supplierId), total:calcTotal(), dibayar:0, status:"Belum", items:form.items };
    setHutang(p=>[po,...p]);
    showToast("PO "+po.id+" berhasil dibuat!","success");
    setForm({ supplierId:"", tgl:today(), due:addDays(30), items:[emptyBB()] });
    setView("list");
  };

  const doBayar = (txnId, jumlah) => {
    const newDibayar = bayarItem.dibayar + jumlah;
    const status     = newDibayar >= bayarItem.total ? "Lunas" : "Sebagian";
    setHutang(p=>p.map(x=>x.id===bayarItem.id?{...x,dibayar:newDibayar,status}:x));
    showToast("Bayar hutang "+fmt(jumlah)+" dicatat (ref: "+txnId+")","success");
  };

  if (view==="form") return (
    <div style={{maxWidth:580,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Purchase Order Baru</div>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="ghost" onClick={()=>setView("list")}>Batal</Btn>
          <Btn onClick={savePO}><Ic n="save" s={13}/> Simpan PO</Btn>
        </div>
      </div>
      <Card style={{padding:18,marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Sel label="Supplier" value={form.supplierId} onChange={e=>setF("supplierId",e.target.value)}>
            <option value="">-- Pilih --</option>
            {suppliers.map(s=><option key={s.id} value={s.id}>{s.nama}</option>)}
          </Sel>
          <Inp label="Tanggal" type="date" value={form.tgl} onChange={e=>setF("tgl",e.target.value)}/>
          <Inp label="Jatuh Tempo" type="date" value={form.due} onChange={e=>setF("due",e.target.value)}/>
        </div>
      </Card>
      <Card style={{padding:18}}>
        <div style={{fontWeight:700,fontSize:13,color:"#1e293b",marginBottom:13}}>Bahan Baku yang Dibeli</div>
        {form.items.map((it,i)=>(
          <div key={it.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:8,alignItems:"end"}}>
            <select value={it.bbId} onChange={e=>{
              const bb=bahanBaku.find(b=>b.id===parseInt(e.target.value));
              updItem(it.id,"bbId",e.target.value);
              if(bb) updItem(it.id,"harga",bb.hargaBeli);
            }} style={inputStyle}>
              <option value="">-- Bahan Baku --</option>
              {bahanBaku.map(b=><option key={b.id} value={b.id}>{b.nama}</option>)}
            </select>
            <input type="number" placeholder="Qty" value={it.qty} onChange={e=>updItem(it.id,"qty",e.target.value)} style={inputStyle}/>
            <input type="number" placeholder="Harga" value={it.harga} onChange={e=>updItem(it.id,"harga",e.target.value)} style={inputStyle}/>
            <button onClick={()=>setForm(p=>({...p,items:p.items.filter(x=>x.id!==it.id)}))}
              style={{padding:8,border:"none",background:"#fee2e2",color:"#dc2626",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center"}}>
              <Ic n="trash" s={13}/>
            </button>
          </div>
        ))}
        <button onClick={addItem} style={{width:"100%",padding:9,borderRadius:9,border:"2px dashed #e2e8f0",background:"transparent",color:"#6366f1",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontFamily:"inherit"}}>
          <Ic n="plus" s={12}/> Tambah Bahan Baku
        </button>
        <div style={{marginTop:12,background:"#6366f1",borderRadius:10,padding:"9px 13px",display:"flex",justifyContent:"space-between"}}>
          <span style={{color:"rgba(255,255,255,0.75)",fontSize:12}}>TOTAL PO</span>
          <span style={{color:"#fff",fontWeight:800,fontSize:15}}>{fmt(calcTotal())}</span>
        </div>
      </Card>
    </div>
  );

  return (
    <div>
      <BayarModal open={!!bayarItem} onClose={()=>setBayarItem(null)} item={bayarItem} tipeBank="keluar" bank={bank} onSave={doBayar} label="Hutang"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Hutang Dagang</div>
        <Btn onClick={()=>setView("form")}><Ic n="plus" s={13}/> PO Baru</Btn>
      </div>
      <Stats items={[
        { label:"Outstanding",  value:fmt(outstanding), bg:"#fee2e2", color:"#dc2626" },
        { label:"PO Lunas",    value:hutang.filter(h=>h.status==="Lunas").length+" PO", bg:"#dcfce7", color:"#16a34a" },
        { label:"Total PO",    value:hutang.length+" PO", bg:"#eff6ff", color:"#6366f1" },
      ]}/>
      <Card>
        <CardHeader title="Daftar Purchase Order" icon="ap"/>
        <DataTable
          heads={["PO ID","Supplier","Tanggal","Due","Total","Terbayar","Status","Aksi"]}
          rows={hutang.map(h=>[
            <span style={{fontWeight:700,color:"#6366f1"}}>{h.id}</span>,
            suppliers.find(s=>s.id===h.supplierId)?.nama||"-",
            h.tgl, h.due,
            <span style={{fontWeight:700}}>{fmt(h.total)}</span>,
            <span style={{fontWeight:700,color:"#16a34a"}}>{fmt(h.dibayar)}</span>,
            <Badge s={h.status}/>,
            h.status!=="Lunas" && <Btn variant="danger" onClick={()=>setBayarItem(h)} style={{padding:"3px 9px",fontSize:11}}>Bayar</Btn>
          ])}
        />
      </Card>
    </div>
  );
}

// ─── MODULE: PRODUKSI ─────────────────────────────────────────
function ProduksiModule({ jobOrders, setJobOrders, produk, bahanBaku, setBahanBaku, setProduk, showToast }) {
  const [logModal, setLogModal] = useState(null);
  const [logForm, setLogForm]   = useState({ ket:"", qty:"" });

  const addLog = () => {
    if (!logForm.ket) { showToast("Isi keterangan!","error"); return; }
    const log = { tgl:today(), ket:logForm.ket, qty:parseInt(logForm.qty)||0 };
    setJobOrders(p=>p.map(j=>j.id===logModal.id?{...j,logs:[...j.logs,log]}:j));
    showToast("Log produksi ditambahkan","success");
    setLogModal(null);
  };

  const startJO = jo => {
    const prod = produk.find(p=>p.id===jo.prodId);
    if (!prod) return;
    prod.bom.forEach(b => {
      setBahanBaku(p=>p.map(bb=>bb.id===b.bbId?{...bb,stok:Math.max(0,bb.stok-(b.qty*jo.qty))}:bb));
    });
    setJobOrders(p=>p.map(j=>j.id===jo.id?{...j,status:"In Progress"}:j));
    showToast("JO "+jo.id+" dimulai — stok bahan baku dikurangi","success");
  };

  const selesaiJO = jo => {
    setProduk(p=>p.map(pr=>pr.id===jo.prodId?{...pr,stok:(pr.stok||0)+jo.qty}:pr));
    setJobOrders(p=>p.map(j=>j.id===jo.id?{...j,status:"Selesai"}:j));
    showToast("JO "+jo.id+" selesai — "+jo.qty+" unit masuk persediaan","success");
  };

  return (
    <div>
      <Modal open={!!logModal} onClose={()=>setLogModal(null)} title={"Log Produksi — "+(logModal?.id||"")} width={420}>
        <div style={{marginBottom:12}}>
          <Inp label="Keterangan" placeholder="Batch 1 selesai assembly..." value={logForm.ket} onChange={e=>setLogForm(p=>({...p,ket:e.target.value}))}/>
        </div>
        <div style={{marginBottom:16}}>
          <Inp label="Qty Selesai (opsional)" type="number" value={logForm.qty} onChange={e=>setLogForm(p=>({...p,qty:e.target.value}))}/>
        </div>
        <Btn onClick={addLog}><Ic n="log" s={13}/> Tambah Log</Btn>
      </Modal>

      <div style={{marginBottom:18}}>
        <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Produksi & Job Order</div>
        <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>Kelola JO berdasarkan BOM — log progress — selesai masuk persediaan</div>
      </div>

      <Stats items={[
        { label:"Draft",       value:jobOrders.filter(j=>j.status==="Draft").length+" JO",       bg:"#f1f5f9", color:"#64748b" },
        { label:"In Progress", value:jobOrders.filter(j=>j.status==="In Progress").length+" JO", bg:"#dbeafe", color:"#2563eb" },
        { label:"Selesai",     value:jobOrders.filter(j=>j.status==="Selesai").length+" JO",     bg:"#dcfce7", color:"#16a34a" },
      ]}/>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {jobOrders.map(jo => {
          const prod = produk.find(p=>p.id===jo.prodId);
          return (
            <Card key={jo.id}>
              <div style={{padding:18}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontWeight:800,fontSize:15,color:"#6366f1"}}>{jo.id}</span>
                      <Badge s={jo.status}/>
                    </div>
                    <div style={{fontWeight:600,fontSize:14,color:"#1e293b"}}>{prod?.nama||"-"}</div>
                    <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>
                      Invoice: <span style={{color:"#6366f1",fontWeight:600}}>{jo.invId}</span>
                      {" · "} Qty: <strong>{jo.qty} {prod?.satuan}</strong>
                      {" · "} Tgl: {jo.tgl}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {jo.status==="Draft" && (
                      <Btn variant="ghost" onClick={()=>startJO(jo)} style={{fontSize:11}}><Ic n="arrow" s={12}/> Mulai</Btn>
                    )}
                    {jo.status==="In Progress" && (
                      <>
                        <Btn variant="ghost" onClick={()=>{ setLogModal(jo); setLogForm({ket:"",qty:""}); }} style={{fontSize:11}}><Ic n="log" s={12}/> Log</Btn>
                        <Btn variant="success" onClick={()=>selesaiJO(jo)} style={{fontSize:11}}><Ic n="check" s={12}/> Selesai</Btn>
                      </>
                    )}
                  </div>
                </div>

                {prod?.bom && (
                  <div style={{background:"#f8fafc",borderRadius:9,padding:11,marginBottom:12}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:7}}>Bill of Materials (x{jo.qty})</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {prod.bom.map(b => {
                        const bb = bahanBaku.find(x=>x.id===b.bbId);
                        const needed = b.qty * jo.qty;
                        const ok = (bb?.stok||0) >= needed;
                        return (
                          <span key={b.bbId} style={{background:ok?"#dcfce7":"#fee2e2",color:ok?"#16a34a":"#dc2626",fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:7}}>
                            {bb?.nama||"?"} x{needed} {bb?.satuan}
                            {!ok && " (!!)"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {jo.logs.length > 0 && (
                  <div style={{borderLeft:"2px solid #e2e8f0",paddingLeft:12}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:7}}>Log Produksi</div>
                    {jo.logs.map((l,i) => (
                      <div key={i} style={{marginBottom:7}}>
                        <div style={{fontSize:11,color:"#94a3b8"}}>{l.tgl}</div>
                        <div style={{fontSize:13,fontWeight:600,color:"#1e293b"}}>{l.ket}</div>
                        {l.qty>0 && <div style={{fontSize:11,color:"#16a34a",fontWeight:600}}>{l.qty} unit selesai</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── MODULE: PERSEDIAAN ───────────────────────────────────────
function PersediaanModule({ bahanBaku, produk }) {
  return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Persediaan</div>
        <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>Update otomatis dari job order produksi</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <CardHeader title="Bahan Baku" icon="inv"/>
          <DataTable
            heads={["Kode","Nama","Stok","Satuan","Nilai"]}
            rows={bahanBaku.map(b=>[
              <span style={{fontSize:11,color:"#6366f1",fontWeight:700}}>{b.kode}</span>,
              b.nama,
              <span style={{fontWeight:700,color:b.stok<20?"#dc2626":"#1e293b"}}>{b.stok}</span>,
              b.satuan,
              fmt(b.stok*b.hargaBeli)
            ])}
          />
        </Card>
        <Card>
          <CardHeader title="Barang Jadi" icon="inv"/>
          <DataTable
            heads={["Kode","Nama","Stok","Satuan","Nilai"]}
            rows={produk.map(p=>[
              <span style={{fontSize:11,color:"#6366f1",fontWeight:700}}>{p.kode}</span>,
              p.nama,
              <span style={{fontWeight:700,color:(p.stok||0)<5?"#dc2626":"#1e293b"}}>{p.stok||0}</span>,
              p.satuan,
              fmt((p.stok||0)*p.hargaJual)
            ])}
          />
        </Card>
      </div>
    </div>
  );
}

// ─── MODULE: MASTER ───────────────────────────────────────────
function MasterModule({ produk, setProduk, bahanBaku, customers, suppliers, showToast }) {
  const [tab, setTab]        = useState("produk");
  const [bomModal, setBomModal] = useState(null);
  const [newBom, setNewBom]  = useState({ bbId:"", qty:1 });

  const addBom = () => {
    if (!newBom.bbId) return;
    const updated = { ...bomModal, bom:[...(bomModal.bom||[]),{bbId:parseInt(newBom.bbId),qty:parseFloat(newBom.qty)||1}] };
    setProduk(p=>p.map(pr=>pr.id===bomModal.id?updated:pr));
    setBomModal(updated);
    setNewBom({ bbId:"", qty:1 });
    showToast("Komponen BOM ditambahkan","success");
  };

  const removeBom = bbId => {
    const updated = { ...bomModal, bom:bomModal.bom.filter(b=>b.bbId!==bbId) };
    setProduk(p=>p.map(pr=>pr.id===bomModal.id?updated:pr));
    setBomModal(updated);
  };

  const tabs = ["produk","bahan","customer","supplier"];
  const tabLabels = { produk:"Produk & BOM", bahan:"Bahan Baku", customer:"Customer", supplier:"Supplier" };

  return (
    <div>
      <Modal open={!!bomModal} onClose={()=>setBomModal(null)} title={"Edit BOM — "+(bomModal?.nama||"")} width={500}>
        <div style={{marginBottom:14}}>
          {(bomModal?.bom||[]).map(b => {
            const bb = bahanBaku.find(x=>x.id===b.bbId);
            return (
              <div key={b.bbId} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",background:"#f8fafc",borderRadius:8,marginBottom:6}}>
                <span style={{fontWeight:600,fontSize:13}}>{bb?.nama}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,color:"#6366f1",fontWeight:700}}>x{b.qty} {bb?.satuan}</span>
                  <button onClick={()=>removeBom(b.bbId)} style={{border:"none",background:"#fee2e2",color:"#dc2626",borderRadius:6,padding:"2px 8px",cursor:"pointer",fontSize:11}}>Hapus</button>
                </div>
              </div>
            );
          })}
          {(bomModal?.bom||[]).length===0 && <div style={{textAlign:"center",color:"#94a3b8",padding:20,fontSize:13}}>Belum ada komponen</div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr auto",gap:8,alignItems:"end"}}>
          <select value={newBom.bbId} onChange={e=>setNewBom(p=>({...p,bbId:e.target.value}))} style={inputStyle}>
            <option value="">-- Bahan Baku --</option>
            {bahanBaku.filter(b=>!(bomModal?.bom||[]).find(x=>x.bbId===b.id)).map(b=><option key={b.id} value={b.id}>{b.nama}</option>)}
          </select>
          <input type="number" placeholder="Qty" value={newBom.qty} onChange={e=>setNewBom(p=>({...p,qty:e.target.value}))} style={inputStyle}/>
          <Btn onClick={addBom}><Ic n="plus" s={13}/></Btn>
        </div>
      </Modal>

      <div style={{marginBottom:18}}>
        <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Master Data</div>
      </div>

      <div style={{display:"flex",gap:3,background:"#f1f5f9",borderRadius:11,padding:3,marginBottom:18,width:"fit-content"}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",background:tab===t?"#fff":"transparent",color:tab===t?"#6366f1":"#64748b",boxShadow:tab===t?"0 1px 3px rgba(0,0,0,0.08)":"none"}}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {tab==="produk" && (
        <Card>
          <CardHeader title="Produk & BOM" icon="inv"/>
          <DataTable
            heads={["Kode","Nama","Satuan","Harga Jual","Stok","BOM","Aksi"]}
            rows={produk.map(p=>[
              <span style={{fontSize:11,color:"#6366f1",fontWeight:700}}>{p.kode}</span>,
              p.nama, p.satuan, fmt(p.hargaJual), p.stok||0,
              <span style={{fontSize:11,color:"#6366f1"}}>{p.bom?.length||0} komponen</span>,
              <Btn variant="ghost" onClick={()=>setBomModal(p)} style={{padding:"3px 9px",fontSize:11}}>Edit BOM</Btn>
            ])}
          />
        </Card>
      )}

      {tab==="bahan" && (
        <Card>
          <CardHeader title="Bahan Baku" icon="inv"/>
          <DataTable
            heads={["Kode","Nama","Satuan","Stok","Harga Beli"]}
            rows={bahanBaku.map(b=>[
              <span style={{fontSize:11,color:"#6366f1",fontWeight:700}}>{b.kode}</span>,
              b.nama, b.satuan,
              <span style={{fontWeight:700,color:b.stok<20?"#dc2626":"#1e293b"}}>{b.stok}</span>,
              fmt(b.hargaBeli)
            ])}
          />
        </Card>
      )}

      {tab==="customer" && (
        <Card>
          <CardHeader title="Customer" icon="master"/>
          <DataTable
            heads={["Kode","Nama","Telp","Termin"]}
            rows={customers.map(c=>[
              <span style={{fontSize:11,color:"#6366f1",fontWeight:700}}>{c.kode}</span>,
              c.nama, c.telp, c.termin+" hari"
            ])}
          />
        </Card>
      )}

      {tab==="supplier" && (
        <Card>
          <CardHeader title="Supplier" icon="master"/>
          <DataTable
            heads={["Kode","Nama","Telp","Termin"]}
            rows={suppliers.map(s=>[
              <span style={{fontSize:11,color:"#6366f1",fontWeight:700}}>{s.kode}</span>,
              s.nama, s.telp, s.termin+" hari"
            ])}
          />
        </Card>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [nav, setNav] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const [bank,     setBank]     = useState(initBank);
  const [piutang,  setPiutang]  = useState(initPiutang);
  const [hutang,   setHutang]   = useState(initHutang);
  const [jobOrders,setJobOrders]= useState(initJO);
  const [produk,   setProduk]   = useState(initProduk);
  const [bahanBaku,setBahanBaku]= useState(initBB);
  const [customers]             = useState(initCustomers);
  const [suppliers]             = useState(initSuppliers);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navItems = [
    { id:"dashboard",  label:"Dashboard",   icon:"dash"   },
    { id:"bank",       label:"Bank",         icon:"bank"   },
    { id:"piutang",    label:"Piutang",      icon:"ar"     },
    { id:"hutang",     label:"Hutang",       icon:"ap"     },
    { id:"produksi",   label:"Produksi",     icon:"prod"   },
    { id:"persediaan", label:"Persediaan",   icon:"inv"    },
    { id:"master",     label:"Master Data",  icon:"master" },
  ];

  const allProps = { bank, setBank, piutang, setPiutang, hutang, setHutang, jobOrders, setJobOrders, produk, setProduk, bahanBaku, setBahanBaku, customers, suppliers, showToast };

  const pages = {
    dashboard:  <Dashboard  {...allProps}/>,
    bank:       <BankModule {...allProps}/>,
    piutang:    <PiutangModule {...allProps}/>,
    hutang:     <HutangModule {...allProps}/>,
    produksi:   <ProduksiModule {...allProps}/>,
    persediaan: <PersediaanModule {...allProps}/>,
    master:     <MasterModule {...allProps}/>,
  };

  return (
    <div style={{display:"flex",height:"100vh",fontFamily:"'Plus Jakarta Sans',-apple-system,sans-serif",background:"#f8fafc",overflow:"hidden"}}>

      {/* SIDEBAR */}
      <div style={{width:210,background:"#fff",borderRight:"1px solid #f1f5f9",display:"flex",flexDirection:"column",padding:"0 0 14px",boxShadow:"1px 0 8px rgba(0,0,0,0.04)",flexShrink:0}}>
        <div style={{padding:"16px 18px 13px",borderBottom:"1px solid #f1f5f9"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:34,height:34,background:"linear-gradient(135deg,#6366f1,#4f46e5)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:15}}>W</div>
            <div>
              <div style={{fontWeight:800,fontSize:13,color:"#1e293b"}}>Wijaya Finance</div>
              <div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>Mini ERP v2.0</div>
            </div>
          </div>
        </div>

        <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
          {navItems.map(n => (
            <button key={n.id} onClick={()=>setNav(n.id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 11px",borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",marginBottom:2,background:nav===n.id?"#eff6ff":"transparent",color:nav===n.id?"#6366f1":"#64748b",fontFamily:"inherit",transition:"all 0.15s"}}>
              <span style={{opacity:nav===n.id?1:0.65}}><Ic n={n.icon} s={16}/></span>
              <span style={{fontSize:13,fontWeight:nav===n.id?700:500}}>{n.label}</span>
              {nav===n.id && <span style={{marginLeft:"auto",width:5,height:5,borderRadius:3,background:"#6366f1"}}/>}
            </button>
          ))}
        </nav>

        <div style={{margin:"0 8px",padding:11,borderRadius:11,background:"#f8fafc",display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#6366f1,#818cf8)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12}}>A</div>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#1e293b"}}>Administrator</div>
            <div style={{fontSize:10,color:"#94a3b8"}}>Full Access</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:"#fff",borderBottom:"1px solid #f1f5f9",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",flexShrink:0}}>
          <div style={{fontSize:13,color:"#94a3b8",fontWeight:500}}>
            {navItems.find(n=>n.id===nav)?.label}
          </div>
          <div style={{fontSize:11,color:"#94a3b8"}}>{today()}</div>
        </div>
        <div style={{flex:1,overflow:"auto",padding:18}}>
          {pages[nav]}
        </div>
      </div>

      <Toast toast={toast}/>
    </div>
  );
}
