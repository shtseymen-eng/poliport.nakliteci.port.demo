const app = document.getElementById("app");
const toast = document.getElementById("toast");
const modalLayer = document.getElementById("modalLayer");
const modalCard = document.getElementById("modalCard");

const STORAGE_KEY = "poliport_gullseye_portal_v1";
const CAPTCHA = "G7P4";

const VEHICLE_TYPES = {
  tractor: {
    label: "Çekici",
    plateLabel: "Çekici Plakası",
    image: "./vehicle-truck.png",
    note: "Çekici ve ADR araç uygunluk kayıtları",
    docs: ["Ruhsat", "Trafik Sigorta Poliçesi", "Araç Muayenesi", "Tehlikeli Madde Faaliyet Belgesi (TMFB)", "Tehlikeli Atık Sigortası", "Taşıt Uygunluk Belgesi / T9", "Taşıt Kartı (K1)"],
  },
  trailer: {
    label: "Dorse / Tanker",
    plateLabel: "Dorse Plakası",
    image: "./vehicle-tanker.png",
    note: "Kimyasal tanker, tank kodu ve basınç kayıtları",
    docs: ["Ruhsat", "Trafik Sigorta Poliçesi", "Araç Muayenesi", "Taşıt Uygunluk Belgesi / T9", "Sızdırmazlık Raporu", "ADR Muayene Sertifikası", "Taşıt Kartı (K1)", "Tank Temizlik / Yıkama Sertifikası"],
  },
  iso: {
    label: "ISO Tank Konteyner",
    plateLabel: "ISO Tank Numarası",
    image: "./vehicle-iso-tank.png",
    note: "ISO tank, hidrostatik test ve sızdırmazlık kayıtları",
    docs: ["Tank Sertifikası", "Hidrostatik Test / Basınç Raporu", "Sızdırmazlık Belgesi", "Periyodik Muayene", "CSC Uygunluk Belgesi", "Interchange Belgesi", "Tank Temizlik / Yıkama Sertifikası"],
  },
  container40: {
    label: "40 Ayak Konteyner",
    plateLabel: "Konteyner Numarası",
    image: "./vehicle-container.png",
    note: "40 ayak konteyner ve şasi kayıtları",
    docs: ["Konteyner / CSC Belgesi", "Şasi Ruhsatı", "Trafik Sigorta Poliçesi", "Araç Muayenesi", "Taşıt Kartı", "Yük Uygunluk Belgesi"],
  },
  truck: {
    label: "Kamyon / Kırkayak",
    plateLabel: "Araç Plakası",
    image: "./vehicle-truck.png",
    note: "Kuru yük ve genel kargo araç kayıtları",
    docs: ["Ruhsat", "Trafik Sigorta Poliçesi", "Araç Muayenesi", "Taşıt Kartı", "Takograf Kontrolü", "K1 Yetki Belgesi"],
  },
  driver: {
    label: "Sürücü",
    plateLabel: "Sürücü Ad Soyad",
    image: "./vehicle-truck.png",
    note: "Sürücü yeterlilik ve sağlık kayıtları",
    docs: ["Sürücü Belgesi / Ehliyet", "SRC5 / ADR Eğitim Sertifikası", "SRC3 / SRC4 Belgesi", "Psikoteknik Raporu", "Yüksekte Çalışabilir Sağlık Raporu", "ISOPA Belgesi (TDI / MDI)", "Kimlik Belgesi"],
  },
};

const PRODUCTS = [
  { name: "A.C.N. (Acrylonitrile)", un: "UN 1093", vehicle: "FL", allowed: ["L10CH", "L10CN", "L10DH", "L15BH", "L21CH", "T14", "T19", "T20", "T22"] },
  { name: "Asetik Asit", un: "UN 2789", vehicle: "FL", allowed: ["L4BN", "L4BH", "L4CH", "L10BH", "L15BH", "L21CH", "T7", "T8", "T9", "T10"] },
  { name: "Aseton", un: "UN 1090", vehicle: "FL", allowed: ["LGBF", "LGBH", "L1.5BN", "L4BN", "L4BH", "L10BH", "T4", "T5", "T7"] },
  { name: "Butyl Acetate", un: "UN 1123", vehicle: "FL", allowed: ["LGBF", "LGBH", "L1.5BN", "L4BN", "L4BH", "T4", "T5", "T7"] },
  { name: "Denatüre Etanol", un: "UN 1170", vehicle: "FL", allowed: ["LGBF", "LGBH", "L1.5BN", "L4BN", "L4BH", "T4", "T5", "T7"] },
  { name: "Metanol", un: "UN 1230", vehicle: "FL", allowed: ["L4BH", "L4CH", "L10BH", "L10CH", "L15BH", "L21CH", "T7", "T8", "T9", "T10"] },
  { name: "Ethyl Acetate", un: "UN 1173", vehicle: "FL", allowed: ["LGBF", "LGBH", "L1.5BN", "L4BN", "L4BH", "T4", "T5", "T7"] },
  { name: "Formik Asit", un: "UN 1779", vehicle: "FL", allowed: ["L4BN", "L4BH", "L4CH", "L10BH", "L15BH", "L21CH", "T7", "T8", "T9"] },
  { name: "Methylene Chloride", un: "UN 1593", vehicle: "AT", allowed: ["L4BH", "L4CH", "L10BH", "L10CH", "L21CH", "T7", "T8", "T9"] },
  { name: "Phenol", un: "UN 2821", vehicle: "AT", allowed: ["L4BH", "L4CH", "L10BH", "L10CH", "L15BH", "T7", "T8", "T9"] },
  { name: "Phosphoric Acid", un: "UN 1805", vehicle: "AT", allowed: ["L4BN", "L4BH", "L4CH", "L10BH", "L15BH", "T4", "T5", "T7"] },
  { name: "TDI (Desmodur T-80)", un: "UN 2078", vehicle: "AT", allowed: ["L4BH", "L4CH", "L10BH", "L10CH", "L15BH", "L21CH", "T7", "T8", "T9"] },
  { name: "MDI / Polymeric MDI", un: "ADR kapsamı dışı", vehicle: "AT", allowed: ["L4BH", "L4CH", "L10BH", "T14", "T20"] },
  { name: "Toluene", un: "UN 1294", vehicle: "FL", allowed: ["LGBF", "LGBH", "L1.5BN", "L4BN", "L4BH", "T4", "T5", "T7"] },
  { name: "Xylene", un: "UN 1307", vehicle: "FL", allowed: ["LGBF", "LGBH", "L1.5BN", "L4BN", "L4BH", "T4", "T5", "T7"] },
  { name: "Base Oil SN 150", un: "ADR kapsamı dışı", vehicle: "AT", allowed: ["*"] },
  { name: "Polyol", un: "ADR kapsamı dışı", vehicle: "AT", allowed: ["*"] },
];

const STATUS_LABEL = { approved: "Onaylandı", pending: "Onay Bekliyor", rejected: "Reddedildi", returned: "Geri Gönderildi" };
const STATUS_CLASS = { approved: "approved", pending: "pending", rejected: "rejected", returned: "returned" };

function isoAt(day, hour, minute = 0) {
  return `2026-08-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+03:00`;
}

function docsFor(type, overrides = {}) {
  return VEHICLE_TYPES[type].docs.map((name, index) => {
    const override = overrides[name] || {};
    const status = override.status || "approved";
    return {
      type: name,
      fileName: override.fileName || `${type}_${index + 1}.pdf`,
      expiry: override.expiry || "2027-08-24",
      status,
      submittedAt: override.submittedAt || isoAt(20 + (index % 4), 9 + (index % 6), index * 4),
      reviewedAt: status === "approved" || status === "rejected" ? (override.reviewedAt || isoAt(23, 10 + (index % 5), index * 3)) : "",
      note: override.note || (status === "rejected" ? "Belge üzerindeki tarih okunamadı. Güncel belgeyi tekrar yükleyiniz." : ""),
    };
  });
}

function seedData() {
  return {
    vehicles: [
      { id: "v1", type: "tractor", plate: "34 ABC 123", capacity: "", tankCodes: [], company: "ABC Nakliyat", submittedAt: isoAt(20, 14, 35), documents: docsFor("tractor") },
      { id: "v2", type: "tractor", plate: "41 NAK 512", capacity: "", tankCodes: [], company: "ABC Nakliyat", submittedAt: isoAt(21, 9, 20), documents: docsFor("tractor") },
      { id: "v3", type: "trailer", plate: "41 ADR 908", capacity: "32.000 L", tankCodes: ["L4BH", "L4CH", "L10BH"], company: "ABC Nakliyat", submittedAt: isoAt(21, 11, 10), documents: docsFor("trailer") },
      { id: "v4", type: "trailer", plate: "34 SOL 717", capacity: "30.000 L", tankCodes: ["LGBF", "L4BN", "L4BH"], company: "ABC Nakliyat", submittedAt: isoAt(22, 8, 5), documents: docsFor("trailer") },
      { id: "v5", type: "iso", plate: "TCLU 987654-3", capacity: "24.000 L", tankCodes: ["T14", "T20"], company: "ABC Nakliyat", submittedAt: isoAt(22, 12, 45), documents: docsFor("iso") },
      { id: "v6", type: "truck", plate: "34 KRM 450", capacity: "26 ton", tankCodes: [], company: "ABC Nakliyat", submittedAt: isoAt(23, 9, 50), documents: docsFor("truck") },
      { id: "v7", type: "driver", plate: "Mehmet Yılmaz", capacity: "", tankCodes: [], company: "ABC Nakliyat", submittedAt: isoAt(23, 11, 30), documents: docsFor("driver") },
      { id: "v8", type: "driver", plate: "Ayşe Demir", capacity: "", tankCodes: [], company: "ABC Nakliyat", submittedAt: isoAt(23, 13, 25), documents: docsFor("driver") },
      { id: "v9", type: "trailer", plate: "34 RED 021", capacity: "28.000 L", tankCodes: ["LGBF"], company: "ABC Nakliyat", submittedAt: isoAt(24, 8, 15), documents: docsFor("trailer", { "Trafik Sigorta Poliçesi": { status: "rejected", fileName: "34RED021_sigorta.pdf" } }) },
      { id: "v10", type: "tractor", plate: "34 BEK 110", capacity: "", tankCodes: [], company: "ABC Nakliyat", submittedAt: isoAt(24, 9, 40), documents: docsFor("tractor", { "Taşıt Uygunluk Belgesi / T9": { status: "pending", fileName: "34BEK110_t9.pdf" } }) },
    ],
    operations: [
      { requestNo: "MST-2026-10874", requestType: "tanker", product1: "Metanol", product2: "", createdAt: isoAt(22, 10, 25), pregateAt: isoAt(23, 8, 40), scaleExitAt: isoAt(23, 11, 12), tonnage: "24,68", status: "Tamamlandı", rejectionDepartment: "", vehicles: ["34 ABC 123", "41 ADR 908", "Mehmet Yılmaz"] },
      { requestNo: "MST-2026-10892", requestType: "tankContainer", product1: "A.C.N. (Acrylonitrile)", product2: "", createdAt: isoAt(23, 14, 10), pregateAt: isoAt(24, 7, 55), scaleExitAt: "", tonnage: "", status: "Pregate Onaylı", rejectionDepartment: "", vehicles: ["41 NAK 512", "41 ADR 908", "TCLU 987654-3", "Ayşe Demir"] },
      { requestNo: "MST-2026-10901", requestType: "dry", product1: "Kuru yük / Genel kargo", product2: "", createdAt: isoAt(24, 8, 35), pregateAt: isoAt(24, 9, 10), scaleExitAt: "", tonnage: "", status: "Reddedildi", rejectionDepartment: "Operasyon", vehicles: ["34 KRM 450", "Mehmet Yılmaz"] },
    ],
  };
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.vehicles && saved?.operations) return saved;
  } catch (_) {}
  return seedData();
}

let store = loadData();
const ui = {
  stage: "intro",
  loginRole: "carrier",
  role: null,
  page: "home",
  vehicleType: "tractor",
  editVehicleId: null,
  draftFiles: {},
  selectedDocKey: "",
  docFilter: { carrier: "all", status: "all", type: "all" },
  requestDraft: { requestNo: "", requestType: "tanker", product1: "Metanol", second: false, product2: "Aseton", matches: {} },
};

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function esc(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function fmt(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? esc(value) : date.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
}

function nowIso() {
  return new Date().toISOString();
}

function vehicleStatus(vehicle) {
  if (vehicle.documents.some((doc) => doc.status === "rejected")) return "rejected";
  if (vehicle.documents.every((doc) => doc.status === "approved")) return "approved";
  return "pending";
}

function statusPill(status) {
  return `<span class="pill ${STATUS_CLASS[status] || "info"}">${esc(STATUS_LABEL[status] || status)}</span>`;
}

function documentValidity(doc) {
  if (!doc?.fileName || !doc?.expiry) return "missing";
  const expires = new Date(`${doc.expiry}T23:59:59`);
  if (Number.isNaN(expires.getTime())) return "missing";
  const days = Math.ceil((expires.getTime() - Date.now()) / 86400000);
  if (days < 0) return "expired";
  if (days <= 30) return "approaching";
  return "valid";
}

function validityBadge(doc) {
  const state = documentValidity(doc);
  const label = { valid: "GEÇERLİ", approaching: "YAKLAŞIYOR", expired: "GEÇTİ", missing: "EKSİK" }[state];
  return `<span class="validity-badge ${state}">${label}</span>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function openModal(html) {
  modalCard.innerHTML = `<button class="modal-close" data-action="close-modal" aria-label="Kapat">×</button>${html}`;
  modalLayer.classList.remove("hidden");
}

function closeModal() {
  modalLayer.classList.add("hidden");
  modalCard.innerHTML = "";
}

function renderIntro() {
  return `<section class="intro" id="intro"><div class="intro-inner"><div class="splash-title">POLİPORT</div><div class="splash-subtitle">LOJİSTİK YÖNETİM</div><div class="load-track"><i></i></div><div class="intro-credit">S. Seymen tarafından hazırlanmıştır</div></div></section>`;
}

function renderGateway() {
  return `<main class="gateway"><div class="gateway-shell"><img class="gateway-logo" src="./poliport-logo.png" alt="Poliport"><div class="eyebrow">GullsEye yetkilendirilmiş operasyon ekranları</div><h1>Nasıl devam etmek istersiniz?</h1><p class="gateway-lead">Nakliyeci işlemleri ile Pregate evrak kontrolü birbirinden ayrılmış, kullanıcı yetkisine göre açılan iki güvenli çalışma alanıdır.</p><div class="role-cards"><button class="role-card" data-action="choose-role" data-role="carrier"><span class="role-icon">N</span><h2>Nakliyeci Girişi</h2><p>Araç ve sürücü kayıtları, evrak yükleme, onaylı havuz, sevkiyat talebi ve operasyon raporları.</p><b>Portala devam et →</b></button><button class="role-card" data-action="choose-role" data-role="pregate"><span class="role-icon">P</span><h2>Pregate Evrak Onay</h2><p>Bekleyen evrakları inceleme, önizleme, onaylama, reddetme ve nakliyeciye geri gönderme.</p><b>Kontrol ekranına devam et →</b></button></div><div class="gateway-note">Bu ekran, GullsEye üzerinden kullanıcı adı ve parola ile giriş yapıldıktan sonra kullanıcıya verilen yetkiye göre görünür. Nakliyeci kullanıcıları portal ekranlarına; Pregate personeli ise mevcut GullsEye yetkilerine eklenen evrak kontrol ekranlarına yönlendirilir.</div><div class="credit">Poliport GullsEye · S. Seymen tarafından hazırlanmıştır.</div></div></main>`;
}

function renderLogin() {
  const pregate = ui.loginRole === "pregate";
  return `<main class="login-page"><section class="login-shell"><div class="login-form"><img class="login-logo" src="./poliport-logo.png" alt="Poliport"><h1>${pregate ? "Pregate personel girişi" : "Nakliyeci portal girişi"}</h1><p>Lütfen GullsEye kullanıcı bilgileriniz ile giriş yapınız.</p><div class="input-icon"><span>K</span><input id="loginUser" autocomplete="username" placeholder="Kullanıcı adı"></div><div class="input-icon"><span>Ş</span><input id="loginPassword" type="password" autocomplete="current-password" placeholder="Şifre"></div><div class="captcha"><div class="captcha-code">${CAPTCHA}</div><input id="loginCaptcha" aria-label="Doğrulama kodu" placeholder="Doğrulama kodunu girin"></div><div class="login-buttons"><button class="btn btn-primary" data-action="login">Giriş Yap</button><button class="btn btn-light" data-action="demo-login">Demo ile Giriş</button><button class="btn btn-light" data-action="back-gateway">Geri</button></div><div class="login-help"><span>Şifremi unuttum</span><span>GullsEye kullanıcı desteği</span></div></div><aside class="login-side"><div class="side-role">${pregate ? "PREGATE YETKİLİ EKRANI" : "NAKLİYECİ PORTALI"}</div><h2>${pregate ? "Evrakları tek noktadan inceleyin" : "Sevkiyata hazır olun"}</h2><p>${pregate ? "Giriş sonrasında mevcut Pregate yetkilerinize eklenen Evrak Kontrol ekranı açılır. Bekleyen belgeleri önizleyebilir, onaylayabilir, reddedebilir veya düzeltme için geri gönderebilirsiniz." : "Araç, sürücü ve evrak havuzunuzu hazırlayın; ürün–tank kodu uyumluluğuna göre sevkiyat talebinizi oluşturun ve süreci takip edin."}</p><div class="notice warn">Pilot notu: Bu önizleme gerçek GullsEye kimlik doğrulama servisine bağlı değildir. Demo girişi rol bazlı ekran akışını gösterir.</div><div class="credit">Poliport GullsEye · S. Seymen tarafından hazırlanmıştır.</div></aside></section></main>`;
}

function carrierStats() {
  const approvedVehicles = store.vehicles.filter((vehicle) => vehicleStatus(vehicle) === "approved").length;
  const rejectedDocs = store.vehicles.flatMap((vehicle) => vehicle.documents).filter((doc) => doc.status === "rejected").length;
  const pendingDocs = store.vehicles.flatMap((vehicle) => vehicle.documents).filter((doc) => doc.status === "pending" || doc.status === "returned").length;
  const completedOps = store.operations.filter((op) => op.status === "Tamamlandı").length;
  return { approvedVehicles, rejectedDocs, pendingDocs, completedOps };
}

function carrierNav() {
  const stats = carrierStats();
  const items = [
    ["home", "01", "Ana Sayfa"], ["info", "02", "Nakliyeci Bilgilendirme"], ["vehicles", "03", "Araç / Sürücü Ekle"], ["pool", "04", "Onaylı Havuz"], ["requests", "05", "Talep Oluştur"], ["reports", "06", "Raporlar"],
  ];
  return items.map(([page, icon, label]) => `<button class="nav-button ${ui.page === page ? "active" : ""}" data-action="nav" data-page="${page}"><span class="nav-ico">${icon}</span>${label}${page === "vehicles" && stats.pendingDocs ? `<span class="nav-count">${stats.pendingDocs}</span>` : ""}</button>`).join("");
}

function renderCarrierShell() {
  const stats = carrierStats();
  return `<div class="shell carrier-shell"><aside class="side"><div class="side-brand portal-brand"><strong>GULLSEYE</strong><span>Poliport Nakliyeci Portalı</span></div><div class="nav-title">NAKLİYECİ PORTALI</div>${carrierNav()}<div class="nav-title">HESAP</div><button class="nav-button" data-action="logout"><span class="nav-ico">↗</span>Güvenli Çıkış</button><div class="side-summary"><h3>Hızlı Durum</h3><div class="summary-line"><span>Havuzdaki kayıt</span><b class="green">${stats.approvedVehicles}</b></div><div class="summary-line"><span>Onay bekleyen evrak</span><b class="orange">${stats.pendingDocs}</b></div><div class="summary-line"><span>Reddedilen evrak</span><b class="red">${stats.rejectedDocs}</b></div></div></aside><main class="main"><header class="top"><div class="top-left"><span class="top-title">ABC Nakliyat · Poliport GullsEye</span><span class="pilot">PİLOT</span></div><div class="top-right"><button class="btn btn-light btn-sm" data-action="back-gateway">Rol Seçimi</button><div class="top-user"><div class="avatar">AY</div><span><b style="font-size:11px">Ayşe Yılmaz</b><small style="display:block;color:var(--muted)">Nakliyeci Yetkilisi</small></span></div></div></header>${renderCarrierPage()}</main></div>`;
}

function renderCarrierPage() {
  if (ui.page === "info") return renderInfoPage();
  if (ui.page === "vehicles") return renderVehiclePage();
  if (ui.page === "pool") return renderPoolPage();
  if (ui.page === "requests") return renderRequestPage();
  if (ui.page === "reports") return renderReportsPage();
  return renderHomePage();
}

function renderHomePage() {
  const stats = carrierStats();
  const recent = [...store.vehicles].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 10);
  return `<section class="page"><div class="page-band"><h1>Nakliyeci Operasyon Merkezi</h1><p>Araç, evrak, onaylı havuz ve sevkiyat süreçlerinin genel görünümü</p></div><div class="metrics"><article class="metric" style="--accent:var(--green)"><span>Onaylanmış operasyon</span><strong>${stats.completedOps}</strong><small>Kantar çıkışı tamamlanan</small></article><article class="metric" style="--accent:var(--red)"><span>Reddedilen evrak</span><strong>${stats.rejectedDocs}</strong><small>Düzeltme bekleyen</small></article><article class="metric" style="--accent:var(--blue)"><span>Havuzdaki kayıt</span><strong>${stats.approvedVehicles}</strong><small>Araç ve sürücü</small></article><article class="metric" style="--accent:var(--orange)"><span>Onay bekleyen</span><strong>${stats.pendingDocs}</strong><small>Pregate incelemesinde</small></article></div><div class="home-grid"><div class="card"><div class="section-head"><div><h2>Son 10 araç / sürücü işlemi</h2><p>Reddedilmiş tek bir evrak varsa kayıt kırmızı gösterilir.</p></div><button class="btn btn-primary btn-sm" data-action="new-vehicle">+ Yeni kayıt</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Plaka / Kayıt</th><th>Tip</th><th>Onaya Gönderim</th><th>Evrak</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>${recent.map((vehicle) => { const status = vehicleStatus(vehicle); return `<tr class="${status === "rejected" ? "row-red" : ""}"><td class="${status === "rejected" ? "plate-red" : ""}">${esc(vehicle.plate)}</td><td>${esc(VEHICLE_TYPES[vehicle.type].label)}</td><td>${fmt(vehicle.submittedAt)}</td><td>${vehicle.documents.length}</td><td>${statusPill(status)}</td><td><button class="btn btn-light btn-sm" data-action="vehicle-detail" data-id="${vehicle.id}">Detay</button></td></tr>`; }).join("")}</tbody></table></div></div><aside><div class="card"><div class="card-title">Hızlı İşlemler</div><div class="quick-actions"><button class="quick-action" data-action="nav" data-page="info"><b>Nakliyeci rehberi</b><small>Terminal kuralları, KKD ve iletişim.</small></button><button class="quick-action" data-action="new-vehicle"><b>Araç ekle</b><small>Evrakları yükle ve onaya gönder.</small></button><button class="quick-action" data-action="nav" data-page="pool"><b>Havuzu aç</b><small>Onaylı araç ve sürücüleri gör.</small></button><button class="quick-action" data-action="nav" data-page="requests"><b>Talep oluştur</b><small>Ürün–tank kodu uyumluluğunu kontrol et.</small></button><button class="quick-action" data-action="nav" data-page="reports"><b>Rapor indir</b><small>Evrak ve operasyon kayıtlarını dışa aktar.</small></button></div></div><div class="card" style="margin-top:14px"><div class="card-title">Aktif Durumlar</div><div class="status-list">${store.operations.slice().reverse().slice(0, 4).map((operation) => `<div class="status-item"><i class="status-dot" style="background:${operation.status === "Reddedildi" ? "var(--red)" : operation.status === "Tamamlandı" ? "var(--green)" : "var(--blue)"}"></i><div><b>${esc(operation.requestNo)}</b><small>${esc(operation.product1)} · ${esc(operation.status)}</small></div><span class="subtle">${fmt(operation.createdAt)}</span></div>`).join("")}</div></div></aside></div></section>`;
}

function renderInfoPage() {
  const featuredProducts = PRODUCTS.slice(0, 8);
  return `<section class="page info-page"><div class="info-hero"><div class="info-hero-copy"><div class="eyebrow">POLİPORT TERMİNAL OPERASYONLARI</div><h1>Nakliyeci Bilgilendirme Merkezi</h1><p>Terminale gelmeden önce araç, sürücü, ADR, KKD ve ürün–tank kodu gerekliliklerini tek ekrandan kontrol edin.</p><div class="info-hero-actions"><a class="btn btn-orange" href="#info-guide">İnteraktif rehbere git</a><a class="btn btn-ghost" href="https://www.poliport.com/pdf/terminal-kara-tankerleri-icin-aranan-sartlar.pdf" target="_blank" rel="noreferrer">Resmî tanker şartları</a></div></div></div><div class="info-stat-grid"><article><strong>271.000 m³</strong><span>Sıvı yük terminal kapasitesi</span></article><article><strong>5 milyon ton/yıl</strong><span>Kuru yük elleçleme kapasitesi</span></article><article><strong>43.250+ m²</strong><span>Açık ve kapalı antrepo alanı</span></article><article><strong>Giriş öncesi kontrol</strong><span>ADR, araç, sürücü ve KKD uygunluğu</span></article></div><div class="section-head info-heading"><div><h2>Poliport hizmet alanları</h2><p>Resmî Poliport web sitesindeki operasyon alanları nakliyeci sürecine göre özetlenmiştir.</p></div></div><div class="terminal-showcase"><article class="terminal-card"><img src="./poliport-liquid-terminal.jpg" alt="Poliport sıvı yük terminali tank sahası"><div><span>SIVI YÜK</span><h3>Kara tankeri dolumu</h3><p>Uygunluk kontrolü tamamlanan tankerler elektronik topraklama ve yangın korumalı platformlarda doluma alınır. Özel ürünlerde kapalı devre dolum uygulanabilir.</p><a href="https://www.poliport.com/sivi-yuk-terminali.html" target="_blank" rel="noreferrer">Poliport kaynağı →</a></div></article><article class="terminal-card"><img src="./poliport-dry-terminal.jpg" alt="Poliport kuru yük terminali ve liman sahası"><div><span>KURU YÜK</span><h3>Kuru yük ve genel kargo</h3><p>Kamyon, kırkayak ve TIR kayıtlarında araç uygunluğu, yük emniyeti, sürücü belgeleri ve saha kuralları birlikte değerlendirilir.</p><a href="https://www.poliport.com/kuru-yuk-terminali.html" target="_blank" rel="noreferrer">Poliport kaynağı →</a></div></article><article class="terminal-card"><img src="./poliport-warehouse.jpg" alt="Poliport A tipi antrepo"><div><span>ANTREPO</span><h3>A tipi genel antrepo</h3><p>Tehlikeli ve ambalajlı ürünler ile metal ve maden ürünlerinin kabul, depolama ve sevkiyat süreçleri yürütülür.</p><a href="https://www.poliport.com/antrepo.html" target="_blank" rel="noreferrer">Poliport kaynağı →</a></div></article></div><div class="info-grid"><article class="card safety-card"><div class="card-title">Terminale gelmeden önce</div><div class="safety-list"><div><b>01</b><span><strong>Araç ve tank uygunluğu</strong>Plaka, araç tipi, T9/ADR, tank kodu, sızdırmazlık ve muayene geçerliliklerini kontrol edin.</span></div><div><b>02</b><span><strong>Sürücü belgeleri</strong>Ehliyet, SRC/ADR, psikoteknik ve ürüne özel ISOPA belgelerini hazır bulundurun.</span></div><div><b>03</b><span><strong>Kişisel koruyucu donanım</strong>Baret, iş eldiveni, iş elbisesi, tam sızdırmaz gözlük, uygun maske ve antistatik ayakkabı bulundurun.</span></div><div><b>04</b><span><strong>İşaretleme ve ekipman</strong>Turuncu plakalar, ADR etiketleri, takoz, yangın tüpleri, ikaz yeleği ve acil durum ekipmanlarını kontrol edin.</span></div><div><b>05</b><span><strong>Temizlik ve ürün uygunluğu</strong>Tank yıkama sertifikası ile ürün–tank kodu uyumunu sevkiyattan önce doğrulayın.</span></div></div></article><article class="card"><div class="card-title">Sık kullanılan ürün ve tank kodları</div><div class="product-info-list">${featuredProducts.map((product) => `<div><span><b>${esc(product.name)}</b><small>${esc(product.un)} · ${esc(product.vehicle)}</small></span><span class="tank-code">${esc(product.allowed.slice(0, 2).join(" / "))}</span></div>`).join("")}</div><button class="btn btn-primary" data-action="nav" data-page="requests">Ürüne uygun araç bul</button></article></div><div class="info-grid info-docs"><article class="card"><div class="card-title">Resmî dokümanlar</div><a class="resource-link" href="https://www.poliport.com/pdf/terminal-kara-tankerleri-icin-aranan-sartlar.pdf" target="_blank" rel="noreferrer"><b>Kara tankerleri için aranan şartlar</b><span>PDF'i aç →</span></a><a class="resource-link" href="https://www.poliport.com/pdf/TehlikeliYuk_ElleclemeRehberi_Mayis2025.pdf" target="_blank" rel="noreferrer"><b>Tehlikeli yük elleçleme rehberi</b><span>PDF'i aç →</span></a><a class="resource-link" href="https://www.poliport.com/sertifikalarimiz.html" target="_blank" rel="noreferrer"><b>Sertifika ve uygunluk belgeleri</b><span>Sayfayı aç →</span></a></article><article class="card"><div class="card-title">Operasyon iletişimleri</div><div class="contact-list"><div><b>Sıvı Yük Operasyon</b><span>0 262 679 71 00 · operasyon@polisan.com.tr</span></div><div><b>Sıvı Yük Sevkiyat</b><span>0 262 679 71 00 · terminalsevkiyat@polisan.com.tr</span></div><div><b>Kuru Yük Operasyon</b><span>0 262 679 72 91 · kuruyuk@poliport.com</span></div><div><b>Antrepo Operasyon</b><span>0 262 679 71 39 · antreposevkiyat@poliport.com</span></div></div><a class="btn btn-light" href="https://www.poliport.com/iletisim.html" target="_blank" rel="noreferrer">Tüm iletişim bilgileri</a></article></div><section class="embedded-guide" id="info-guide"><div class="embedded-guide-head"><div><div class="eyebrow">S. SEYMEN · POLİPORT LOJİSTİK</div><h2>Ürün & Taşıma Yönetimi Rehberi</h2><p>Ürün listesi, araç gereklilikleri, KKD ve araç işaretleme ekranını portal içinde kullanabilirsiniz.</p></div><a class="btn btn-light" href="https://shtseymen-eng.github.io/poliport-lojistik/#" target="_blank" rel="noreferrer">Tam ekranda aç ↗</a></div><iframe src="https://shtseymen-eng.github.io/poliport-lojistik/#" title="Poliport Lojistik Ürün ve Taşıma Yönetimi Rehberi" loading="lazy"></iframe></section><div class="info-source-note">Bilgilendirmeler resmî Poliport sayfaları ve paylaşılan Poliport Lojistik rehberi esas alınarak özetlenmiştir. Operasyon öncesinde güncel resmî belge ve Pregate talimatları geçerlidir.</div></section>`;
}

function currentVehicleDraft() {
  if (!ui.editVehicleId) return null;
  return store.vehicles.find((vehicle) => vehicle.id === ui.editVehicleId) || null;
}

function renderVehiclePage() {
  const existing = currentVehicleDraft();
  const type = existing?.type || ui.vehicleType;
  const config = VEHICLE_TYPES[type];
  const docs = existing?.documents || config.docs.map((name) => ({ type: name, fileName: "", expiry: "", status: "pending", note: "" }));
  const pageTitle = `${config.label.toLocaleUpperCase("tr-TR")} KAYIT`;
  return `<section class="page macro-page"><div class="macro-titlebar">${esc(pageTitle)}</div><div class="vehicle-tabs">${Object.entries(VEHICLE_TYPES).map(([key, item]) => `<button class="vehicle-tab ${type === key ? "active" : ""}" data-action="vehicle-tab" data-type="${key}"><b>${esc(item.label)}</b><small>${item.docs.length} evrak alanı</small></button>`).join("")}</div><form id="vehicleForm" class="macro-form"><div class="macro-form-head"><section><h2>ARAÇ / KAYIT BİLGİLERİ</h2><div class="macro-fields"><div class="field"><label>${esc(config.plateLabel)}</label><input id="vehiclePlate" value="${esc(existing?.plate || "")}" placeholder="${type === "driver" ? "Ad Soyad" : "34 ABC 123"}"></div><div class="field"><label>Model / Üretim Yılı</label><input id="vehicleModelYear" inputmode="numeric" value="${esc(existing?.modelYear || "")}" placeholder="2024"></div><div class="field"><label>Nakliyeci Firma</label><input id="vehicleCompany" value="${esc(existing?.company || "ABC Nakliyat")}"></div></div></section><section><h2>TEKNİK BİLGİ ALANI</h2><div class="macro-fields"><div class="field"><label>Tank Kodları</label><input id="vehicleTankCodes" value="${esc((existing?.tankCodes || []).join(", "))}" placeholder="L4BH, LGBF, T14"></div><div class="field"><label>Kapasite</label><input id="vehicleCapacity" value="${esc(existing?.capacity || "")}" placeholder="32.000 L / 26 ton"></div><div class="field"><label>Uygunluk</label><div class="technical-check">${existing ? statusPill(vehicleStatus(existing)) : `<span class="pill pending">KONTROL BEKLİYOR</span>`}</div></div></div></section></div><div class="macro-doc-title"><div><h2>EVRAK YÜKLEME VE GEÇERLİLİK TAKİBİ</h2><p>Dosya seçimi ve son geçerlilik tarihi makrodaki renk mantığıyla kontrol edilir.</p></div><div class="validity-legend"><span class="validity-badge valid">GEÇERLİ</span><span class="validity-badge approaching">YAKLAŞIYOR</span><span class="validity-badge expired">GEÇTİ</span><span class="validity-badge missing">EKSİK</span></div></div><div class="macro-doc-table"><div class="macro-doc-header"><span>Evrak</span><span>Yükle</span><span>Dosya Adı</span><span>Son Geçerlilik</span><span>Durum</span></div>${docs.map((doc, index) => `<article class="doc-upload macro-doc-row ${doc.status || "pending"}" data-doc-index="${index}"><strong class="doc-name">${esc(doc.type)}</strong><label class="file-button">DOSYA YÜKLE<input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" aria-label="${esc(doc.type)} dosyası"></label><div class="file-name">${esc(doc.fileName || "Dosya seçilmedi")}</div><input type="date" class="doc-expiry" value="${esc(doc.expiry || "")}" aria-label="${esc(doc.type)} son geçerlilik tarihi"><div class="doc-status-stack">${validityBadge(doc)}${statusPill(doc.status)}</div>${doc.status === "rejected" && doc.note ? `<div class="macro-row-note">${esc(doc.note)}</div>` : ""}</article>`).join("")}</div><div class="macro-help">Tank kodu ve belge kapsamı Pregate tarafından doğrulanır. ISO tanklarda hidrostatik test/basınç raporu; tehlikeli ürün tankerlerinde T9 ve ADR belgeleri zorunlu kontrol alanıdır.</div><div class="form-actions macro-actions">${existing ? `<button type="button" class="btn btn-light" data-action="cancel-edit">Yeni Kayda Dön</button>` : ""}<button type="button" class="btn btn-light" data-action="save-draft">Taslağı Kaydet</button><button type="button" class="btn btn-primary macro-save" data-action="submit-vehicle">KAYDET VE PREGATE ONAYINA GÖNDER</button></div></form></section>`;
}

function renderPoolPage() {
  const approved = store.vehicles.filter((vehicle) => vehicleStatus(vehicle) === "approved");
  const rejected = store.vehicles.filter((vehicle) => vehicleStatus(vehicle) === "rejected");
  const groups = Object.entries(VEHICLE_TYPES).map(([type, config]) => ({ type, config, items: approved.filter((vehicle) => vehicle.type === type) })).filter((group) => group.items.length);
  return `<section class="page"><div class="section-head"><div><h2>Onaylı araç ve sürücü havuzu</h2><p>Pregate tarafından tüm evrakları onaylanan kayıtlar tiplerine göre gruplanır.</p></div><button class="btn btn-primary" data-action="new-vehicle">+ Yeni kayıt</button></div><div class="pool-groups">${groups.map((group) => `<section class="pool-group"><div class="pool-head"><span>${esc(group.config.label)}</span><span>${group.items.length} kayıt</span></div><div class="pool-cards">${group.items.map((vehicle) => `<article class="pool-card"><h3>${esc(vehicle.plate)}</h3><p>${esc(vehicle.company)}<br>${vehicle.capacity ? `Kapasite: ${esc(vehicle.capacity)}<br>` : ""}${vehicle.tankCodes.length ? `Tank kodu: ${esc(vehicle.tankCodes.join(", "))}` : ""}</p><div class="tags"><span class="mini-tag">${vehicle.documents.length} evrak</span><span class="mini-tag">Onaylı</span></div></article>`).join("")}</div></section>`).join("") || `<div class="empty">Henüz tüm evrakları onaylanmış kayıt yok.</div>`}</div><div class="section-head" style="margin-top:22px"><div><h2>Red listesi</h2><p>En az bir evrakı reddedilen kayıt burada kalır; belge yeniden yüklenip onaylanınca otomatik kalkar.</p></div></div>${rejected.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Plaka / Kayıt</th><th>Tip</th><th>Reddedilen Evrak</th><th>Açıklama</th><th>İşlem</th></tr></thead><tbody>${rejected.map((vehicle) => { const bad = vehicle.documents.find((doc) => doc.status === "rejected"); return `<tr class="row-red"><td class="plate-red">${esc(vehicle.plate)}</td><td>${esc(VEHICLE_TYPES[vehicle.type].label)}</td><td>${esc(bad?.type || "-")}</td><td>${esc(bad?.note || "-")}</td><td><button class="btn btn-danger btn-sm" data-action="edit-vehicle" data-id="${vehicle.id}">Evrakı Yenile</button></td></tr>`; }).join("")}</tbody></table></div>` : `<div class="notice success">Reddedilmiş evrakı bulunan araç yok.</div>`}</section>`;
}

function productOptions(selected) {
  return PRODUCTS.map((product) => `<option value="${esc(product.name)}" ${product.name === selected ? "selected" : ""}>${esc(product.name)} · ${esc(product.un)}</option>`).join("");
}

function compatibleVehicles(type, productNames) {
  const products = productNames.filter(Boolean).map((name) => PRODUCTS.find((product) => product.name === name)).filter(Boolean);
  return store.vehicles.filter((vehicle) => vehicle.type === type && vehicleStatus(vehicle) === "approved" && products.every((product) => {
    if (!product || !["trailer", "iso"].includes(type) || product.allowed.includes("*")) return true;
    return vehicle.tankCodes.some((code) => product.allowed.includes(code));
  }));
}

function requestMatchTypes() {
  if (ui.requestDraft.requestType === "tankContainer") return ["tractor", "trailer", "iso", "driver"];
  if (ui.requestDraft.requestType === "dry") return ["truck", "driver"];
  return ["tractor", "trailer", "driver"];
}

function renderRequestPage() {
  const draft = ui.requestDraft;
  const products = [draft.product1, draft.second ? draft.product2 : ""];
  const matchTypes = requestMatchTypes();
  const optionsByType = Object.fromEntries(matchTypes.map((type) => [type, compatibleVehicles(type, products)]));
  const missing = matchTypes.filter((type) => optionsByType[type].length === 0);
  return `<section class="page"><div class="section-head"><div><h2>Sevkiyat talebi oluştur</h2><p>Müşterinin sipariş/talep numarası portal talep numarası olarak aynen kullanılır.</p></div></div><div class="request-grid"><div class="card"><div class="card-title">Talep ve ürün bilgileri</div><div class="grid-2"><div class="field"><label>Müşteri Talep / Sipariş No</label><input id="requestNo" value="${esc(draft.requestNo)}" placeholder="MST-2026-10945"></div><div class="field"><label>Araç / Operasyon Tipi</label><select id="requestType"><option value="tanker" ${draft.requestType === "tanker" ? "selected" : ""}>Kimyasal Tanker</option><option value="tankContainer" ${draft.requestType === "tankContainer" ? "selected" : ""}>Tank Konteyner</option><option value="dry" ${draft.requestType === "dry" ? "selected" : ""}>Kuru Yük Kamyon</option></select></div><div class="field"><label>Alınacak Ürün</label><select id="product1">${productOptions(draft.product1)}</select></div><div class="field ${draft.requestType === "dry" ? "hidden" : ""}"><label>Ürün Tank Kodu</label><input value="${esc(PRODUCTS.find((product) => product.name === draft.product1)?.allowed.slice(0, 5).join(", ") || "-")}" disabled></div></div><label class="second-product ${draft.requestType === "dry" ? "hidden" : ""}"><input id="secondProduct" type="checkbox" ${draft.second ? "checked" : ""}> İkinci ürün alınacak</label>${draft.second && draft.requestType !== "dry" ? `<div class="field"><label>2. Ürün Seçimi</label><select id="product2">${productOptions(draft.product2)}</select></div>` : ""}<div class="notice" style="margin-top:13px">Ürün listesi, paylaşılan Poliport ADR kapsamlı ürün ve tank kodu tablosundan hazırlanmış operasyon ön listesidir. Nihai onay güncel ürün/araç kayıtlarıyla yapılmalıdır.</div></div><div class="card"><div class="card-title">Uygun araç ve sürücü eşlemesi</div><div class="selector-stack">${matchTypes.map((type) => `<div class="match-row"><label>${esc(VEHICLE_TYPES[type].label)}</label><select class="match-select" data-match-type="${type}">${optionsByType[type].length ? optionsByType[type].map((vehicle) => `<option value="${vehicle.id}">${esc(vehicle.plate)}${vehicle.tankCodes.length ? ` · ${esc(vehicle.tankCodes.join("/"))}` : ""}</option>`).join("") : `<option value="">Uygun kayıt yok</option>`}</select></div>`).join("")}</div><div class="compat-box ${missing.length ? "bad" : ""}" style="margin-top:13px">${missing.length ? `Bu ürünü alabilmeniz için uygun ${missing.map((type) => VEHICLE_TYPES[type].label).join(", ")} kaydınız bulunmamaktadır. Evrak onayı veya tank kodu eşleştirmesini kontrol ediniz.` : "Seçilen ürün ve araç tipine uygun onaylı kayıtlar listelendi. Talep Pregate ve operasyon onayına gönderilebilir."}</div><div class="form-actions"><button class="btn btn-primary" data-action="create-request" ${missing.length ? "disabled" : ""}>Talebi Oluştur ve Onaya Gönder</button></div></div></div><div class="section-head" style="margin-top:20px"><div><h2>Oluşturulan talepler</h2><p>Talep numarası müşteri sipariş numarası ile aynıdır.</p></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Talep No</th><th>Araç Tipi</th><th>Ürün</th><th>Oluşturma</th><th>Durum</th></tr></thead><tbody>${store.operations.slice().reverse().map((operation) => `<tr><td>${esc(operation.requestNo)}</td><td>${esc(operation.requestType)}</td><td>${esc([operation.product1, operation.product2].filter(Boolean).join(" + "))}</td><td>${fmt(operation.createdAt)}</td><td><span class="pill ${operation.status === "Reddedildi" ? "rejected" : operation.status === "Tamamlandı" ? "approved" : "pending"}">${esc(operation.status)}</span></td></tr>`).join("")}</tbody></table></div></section>`;
}

function renderReportsPage() {
  const docRows = store.vehicles.flatMap((vehicle) => vehicle.documents.map((doc) => ({ vehicle, doc }))).slice().sort((a, b) => new Date(b.doc.submittedAt) - new Date(a.doc.submittedAt));
  return `<section class="page"><div class="section-head"><div><h2>Raporlar</h2><p>Araç/evrak onay geçmişi ile operasyon yaşam döngüsü ayrı raporlanır.</p></div></div><div class="report-actions"><article class="report-card"><div class="eyebrow">RAPOR 01</div><h3>Araç Kayıt ve Evrak Onayları</h3><p>Plaka, araç tipi, evrak adı, yüklenme tarihi/saati, onay-red durumu ve işlem tarihi.</p><button class="btn btn-success" data-action="download-doc-report">Excel/CSV İndir</button></article><article class="report-card"><div class="eyebrow">RAPOR 02</div><h3>Operasyon ve Kantar Hareketleri</h3><p>Talep oluşturma, Pregate geliş, kantar çıkış saatleri, çıkış tonajı, onay ve red departmanı.</p><button class="btn btn-success" data-action="download-op-report">Excel/CSV İndir</button></article></div><div class="card" style="margin-top:15px"><div class="card-title">Araç / Evrak Önizlemesi</div><div class="table-wrap"><table class="table"><thead><tr><th>Plaka / Kayıt</th><th>Araç Tipi</th><th>Evrak</th><th>Yükleme</th><th>İşlem</th><th>Durum</th></tr></thead><tbody>${docRows.slice(0, 12).map(({ vehicle, doc }) => `<tr><td>${esc(vehicle.plate)}</td><td>${esc(VEHICLE_TYPES[vehicle.type].label)}</td><td>${esc(doc.type)}</td><td>${fmt(doc.submittedAt)}</td><td>${fmt(doc.reviewedAt)}</td><td>${statusPill(doc.status)}</td></tr>`).join("")}</tbody></table></div></div><div class="card" style="margin-top:15px"><div class="card-title">Operasyon Önizlemesi</div><div class="table-wrap"><table class="table"><thead><tr><th>Talep No</th><th>Talep Oluşturma</th><th>Pregate Geliş</th><th>Kantar Çıkış</th><th>Çıkış Tonajı</th><th>Durum / Red</th></tr></thead><tbody>${store.operations.map((operation) => `<tr><td>${esc(operation.requestNo)}</td><td>${fmt(operation.createdAt)}</td><td>${fmt(operation.pregateAt)}</td><td>${fmt(operation.scaleExitAt)}</td><td>${esc(operation.tonnage || "-")}</td><td>${esc(operation.status)}${operation.rejectionDepartment ? ` · ${esc(operation.rejectionDepartment)}` : ""}</td></tr>`).join("")}</tbody></table></div></div></section>`;
}

function allDocuments() {
  return store.vehicles.flatMap((vehicle) => vehicle.documents.map((doc, index) => ({ vehicle, doc, index, key: `${vehicle.id}:${index}` })));
}

function pregateCounts() {
  const docs = allDocuments();
  return { total: docs.length, pending: docs.filter((item) => item.doc.status === "pending" || item.doc.status === "returned").length, approved: docs.filter((item) => item.doc.status === "approved").length, rejected: docs.filter((item) => item.doc.status === "rejected").length };
}

function filteredDocuments() {
  return allDocuments().filter((item) => (ui.docFilter.carrier === "all" || item.vehicle.company === ui.docFilter.carrier) && (ui.docFilter.status === "all" || item.doc.status === ui.docFilter.status) && (ui.docFilter.type === "all" || item.doc.type === ui.docFilter.type));
}

function pregateNav() {
  const pending = pregateCounts().pending;
  const items = [["gate", "K", "Kapı Kayıt İşlemleri"], ["adr", "A", "ADR Kontrolleri"], ["questions", "S", "Ön Kapı Soruları"], ["events", "V", "Vukuat Tanımlama"], ["docs", "E", "Evrak Kontrol"], ["carriers", "N", "Nakliyeciler"], ["pregateReports", "R", "Raporlar"], ["definitions", "T", "Tanımlar"]];
  return items.map(([page, icon, label]) => `<button class="nav-button ${ui.page === page ? "active" : ""}" data-action="pregate-nav" data-page="${page}"><span class="nav-ico">${icon}</span>${label}${page === "docs" && pending ? `<span class="nav-count">${pending}</span>` : ""}</button>`).join("");
}

function renderPregateShell() {
  const counts = pregateCounts();
  return `<div class="shell pregate-shell"><aside class="side"><div class="side-brand gulls"><div class="g-mark">G</div><b>GullsEye</b></div><div class="nav-title">ÖN KAPI</div>${pregateNav()}<div class="side-summary"><h3>Evrak Kontrol Özeti</h3><div class="summary-line"><span>Toplam Evrak</span><b>${counts.total}</b></div><div class="summary-line"><span>Onay Bekleyen</span><b class="orange">${counts.pending}</b></div><div class="summary-line"><span>Onaylanan</span><b class="green">${counts.approved}</b></div><div class="summary-line"><span>Reddedilen</span><b class="red">${counts.rejected}</b></div></div></aside><main class="main"><header class="top"><div class="top-left"><div class="g-mark small">G</div><span class="top-title">sseymen - LUNA DANIŞMANLIK</span></div><div class="top-right"><span class="pilot">GULLSEYE PİLOT</span><button class="btn btn-light btn-sm" data-action="back-gateway">Rol Seçimi</button><button class="btn btn-dark btn-sm" data-action="logout">Çıkış</button></div></header>${renderPregatePage()}</main></div>`;
}

function renderPregatePage() {
  if (ui.page !== "docs") return `<section class="page"><div class="pregate-titlebar">${esc(ui.page)}</div><div class="empty">Bu GullsEye modülü mevcut sistemde yer almaya devam eder. Yeni çalışma kapsamında Evrak Kontrol ekranı ayrıntılı olarak tasarlanmıştır.</div></section>`;
  const docs = filteredDocuments();
  if (!ui.selectedDocKey || !docs.some((item) => item.key === ui.selectedDocKey)) ui.selectedDocKey = docs[0]?.key || "";
  const selected = docs.find((item) => item.key === ui.selectedDocKey) || docs[0];
  const carriers = [...new Set(store.vehicles.map((vehicle) => vehicle.company))];
  const types = [...new Set(allDocuments().map((item) => item.doc.type))].sort((a, b) => a.localeCompare(b, "tr"));
  return `<section class="page"><div class="pregate-titlebar">Evrak Kontrol</div><div class="pregate-tabs"><button class="pregate-tab active">Evrak Listesi</button><button class="pregate-tab">Evrak Detay</button></div><div class="pregate-grid"><div><div class="filter-panel"><div class="filter-grid"><div class="field"><label>Nakliyeci</label><select id="filterCarrier"><option value="all">Tümü</option>${carriers.map((carrier) => `<option ${ui.docFilter.carrier === carrier ? "selected" : ""}>${esc(carrier)}</option>`).join("")}</select></div><div class="field"><label>Durum</label><select id="filterStatus"><option value="all">Tümü</option><option value="pending" ${ui.docFilter.status === "pending" ? "selected" : ""}>Onay Bekliyor</option><option value="approved" ${ui.docFilter.status === "approved" ? "selected" : ""}>Onaylandı</option><option value="rejected" ${ui.docFilter.status === "rejected" ? "selected" : ""}>Reddedildi</option><option value="returned" ${ui.docFilter.status === "returned" ? "selected" : ""}>Geri Gönderildi</option></select></div><div class="field"><label>Evrak Türü</label><select id="filterDocType"><option value="all">Tümü</option>${types.map((type) => `<option ${ui.docFilter.type === type ? "selected" : ""}>${esc(type)}</option>`).join("")}</select></div><div class="row"><button class="btn btn-primary" data-action="apply-doc-filter">Filtrele</button><button class="btn btn-light" data-action="clear-doc-filter">Temizle</button></div></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Tarih</th><th>Nakliyeci</th><th>Plaka / Kayıt</th><th>Evrak Türü</th><th>Evrak Adı</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>${docs.length ? docs.map((item) => `<tr class="clickable ${item.key === ui.selectedDocKey ? "selected-row" : ""}" data-action="select-doc" data-key="${item.key}"><td>${fmt(item.doc.submittedAt)}</td><td>${esc(item.vehicle.company)}</td><td>${esc(item.vehicle.plate)}</td><td>${esc(item.doc.type)}</td><td>${esc(item.doc.fileName)}</td><td>${statusPill(item.doc.status)}</td><td><button class="btn btn-primary btn-sm" data-action="select-doc" data-key="${item.key}">Görüntüle</button></td></tr>`).join("") : `<tr><td colspan="7"><div class="empty">Filtreye uygun evrak bulunamadı.</div></td></tr>`}</tbody></table></div></div><aside>${selected ? renderDocumentDetail(selected) : `<div class="empty">İncelenecek evrak seçiniz.</div>`}</aside></div></section>`;
}

function renderDocumentDetail(item) {
  return `<div class="detail-panel"><div class="panel-head">Evrak Detay / Önizleme</div><div class="detail-body"><div class="doc-detail"><div><div class="kv"><b>Nakliyeci</b><span>${esc(item.vehicle.company)}</span></div><div class="kv"><b>Plaka / Kayıt</b><span>${esc(item.vehicle.plate)}</span></div><div class="kv"><b>Evrak Türü</b><span>${esc(item.doc.type)}</span></div><div class="kv"><b>Evrak Adı</b><span>${esc(item.doc.fileName)}</span></div><div class="kv"><b>Yükleme Tarihi</b><span>${fmt(item.doc.submittedAt)}</span></div><div class="kv"><b>Son Geçerlilik</b><span>${esc(item.doc.expiry || "-")}</span></div><div class="kv"><b>Durum</b><span>${statusPill(item.doc.status)}</span></div></div><div><div class="preview-box"><div><div class="doc-sheet"><i></i><i></i><i></i><i></i><strong>${esc(item.doc.fileName)}</strong><i></i><i></i></div><small class="subtle">PDF/JPG belge önizleme alanı</small></div></div></div></div>${item.doc.note ? `<div class="notice ${item.doc.status === "rejected" ? "danger" : "warn"}" style="margin-top:10px">${esc(item.doc.note)}</div>` : ""}</div></div><div class="detail-panel approval-box"><div class="panel-head">Evrak Onay İşlemleri</div><div class="detail-body"><div class="field"><label>Açıklama</label><textarea id="reviewNote" placeholder="Onay, red veya geri gönderme açıklamasını giriniz...">${esc(item.doc.note || "")}</textarea></div><div class="approval-actions"><button class="btn btn-success" data-action="review-doc" data-status="approved">✓ Onayla</button><button class="btn btn-danger" data-action="review-doc" data-status="rejected">× Reddet</button><button class="btn btn-primary" data-action="review-doc" data-status="returned">↩ Geri Gönder</button></div></div></div>`;
}

function render() {
  if (ui.stage === "intro") app.innerHTML = renderIntro();
  else if (ui.stage === "gateway") app.innerHTML = renderGateway();
  else if (ui.stage === "login") app.innerHTML = renderLogin();
  else if (ui.role === "pregate") app.innerHTML = renderPregateShell();
  else app.innerHTML = renderCarrierShell();
}

function login(demo = false) {
  const user = document.getElementById("loginUser");
  const password = document.getElementById("loginPassword");
  const captcha = document.getElementById("loginCaptcha");
  if (demo) {
    user.value = ui.loginRole === "pregate" ? "sseymen" : "nakliyeci.demo";
    password.value = "demo123";
    captcha.value = CAPTCHA;
  }
  if (!user.value.trim() || !password.value.trim() || captcha.value.trim().toUpperCase() !== CAPTCHA) {
    showToast("Kullanıcı adı, şifre ve doğrulama kodunu kontrol ediniz.");
    return;
  }
  ui.role = ui.loginRole;
  ui.stage = "portal";
  ui.page = ui.role === "pregate" ? "docs" : "home";
  render();
}

function beginVehicle(type = "tractor", editId = null) {
  ui.page = "vehicles";
  ui.vehicleType = type;
  ui.editVehicleId = editId;
  ui.draftFiles = {};
  render();
}

function refreshValidityRow(card, index) {
  const expiry = card.querySelector(".doc-expiry")?.value || "";
  const fileName = ui.draftFiles[index] || (card.querySelector(".file-name")?.textContent.includes("Dosya seçilmedi") ? "" : card.querySelector(".file-name")?.textContent || "");
  const badge = card.querySelector(".validity-badge");
  if (!badge) return;
  const state = documentValidity({ fileName, expiry });
  badge.className = `validity-badge ${state}`;
  badge.textContent = { valid: "GEÇERLİ", approaching: "YAKLAŞIYOR", expired: "GEÇTİ", missing: "EKSİK" }[state];
}

function submitVehicle() {
  const type = currentVehicleDraft()?.type || ui.vehicleType;
  const config = VEHICLE_TYPES[type];
  const existing = currentVehicleDraft();
  const plate = document.getElementById("vehiclePlate").value.trim().toLocaleUpperCase("tr-TR");
  const modelYear = document.getElementById("vehicleModelYear").value.trim();
  const company = document.getElementById("vehicleCompany").value.trim();
  const capacity = document.getElementById("vehicleCapacity").value.trim();
  const tankCodes = document.getElementById("vehicleTankCodes").value.split(",").map((code) => code.trim().toUpperCase()).filter(Boolean);
  if (!plate || !company) return showToast(`${config.plateLabel} ve nakliyeci firma alanı zorunludur.`);
  const cards = [...document.querySelectorAll(".doc-upload")];
  const documents = cards.map((card, index) => {
    const previous = existing?.documents[index];
    const fileName = ui.draftFiles[index] || previous?.fileName || "";
    const expiry = card.querySelector(".doc-expiry").value || previous?.expiry || "";
    const changed = Boolean(ui.draftFiles[index]) || (previous && expiry !== previous.expiry);
    return {
      type: config.docs[index],
      fileName,
      expiry,
      status: existing ? (changed ? "pending" : previous.status) : "pending",
      submittedAt: changed || !existing ? nowIso() : previous.submittedAt,
      reviewedAt: changed ? "" : (previous?.reviewedAt || ""),
      note: changed ? "Belge yeniden yüklendi; Pregate onayı bekleniyor." : (previous?.note || ""),
    };
  });
  const missing = documents.filter((doc) => !doc.fileName || !doc.expiry);
  if (missing.length) return showToast(`${missing.length} evrakta dosya veya son geçerlilik tarihi eksik.`);
  if (existing) {
    Object.assign(existing, { plate, modelYear, company, capacity, tankCodes, submittedAt: nowIso(), documents });
    showToast("Kayıt güncellendi ve değişen evraklar Pregate onayına gönderildi.");
  } else {
    store.vehicles.push({ id: `v${Date.now()}`, type, plate, modelYear, company, capacity, tankCodes, submittedAt: nowIso(), documents });
    showToast("Kayıt oluşturuldu ve Pregate evrak onayına gönderildi.");
  }
  saveStore();
  ui.editVehicleId = null;
  ui.page = "home";
  render();
}

function showVehicleDetail(id) {
  const vehicle = store.vehicles.find((item) => item.id === id);
  if (!vehicle) return;
  openModal(`<h2>${esc(vehicle.plate)} · ${esc(VEHICLE_TYPES[vehicle.type].label)}</h2><p class="subtle">${esc(vehicle.company)}${vehicle.modelYear ? ` · ${esc(vehicle.modelYear)}` : ""} · Onaya gönderim: ${fmt(vehicle.submittedAt)}</p><div class="table-wrap"><table class="table"><thead><tr><th>Evrak</th><th>Dosya</th><th>Son Geçerlilik</th><th>Geçerlilik</th><th>Pregate</th></tr></thead><tbody>${vehicle.documents.map((doc) => `<tr><td>${esc(doc.type)}</td><td>${esc(doc.fileName)}</td><td>${esc(doc.expiry)}</td><td>${validityBadge(doc)}</td><td>${statusPill(doc.status)}</td></tr>`).join("")}</tbody></table></div><div class="modal-footer"><button class="btn btn-light" data-action="close-modal">Kapat</button><button class="btn btn-primary" data-action="edit-vehicle" data-id="${vehicle.id}">Evrakları Güncelle</button></div>`);
}

function syncRequestDraft() {
  const no = document.getElementById("requestNo");
  const type = document.getElementById("requestType");
  const p1 = document.getElementById("product1");
  const second = document.getElementById("secondProduct");
  const p2 = document.getElementById("product2");
  if (no) ui.requestDraft.requestNo = no.value;
  if (type) ui.requestDraft.requestType = type.value;
  if (p1) ui.requestDraft.product1 = p1.value;
  if (second) ui.requestDraft.second = second.checked;
  if (p2) ui.requestDraft.product2 = p2.value;
}

function createRequest() {
  syncRequestDraft();
  const draft = ui.requestDraft;
  const requestNo = draft.requestNo.trim();
  if (!requestNo) return showToast("Müşteri talep / sipariş numarası zorunludur.");
  if (store.operations.some((operation) => operation.requestNo === requestNo)) return showToast("Bu müşteri talep numarası daha önce kullanılmış.");
  const matchSelects = [...document.querySelectorAll(".match-select")];
  if (matchSelects.some((select) => !select.value)) return showToast("Ürüne uygun tüm araç ve sürücü eşleşmelerini tamamlayınız.");
  const vehicles = matchSelects.map((select) => store.vehicles.find((vehicle) => vehicle.id === select.value)?.plate).filter(Boolean);
  store.operations.push({ requestNo, requestType: draft.requestType, product1: draft.requestType === "dry" ? "Kuru yük / Genel kargo" : draft.product1, product2: draft.second && draft.requestType !== "dry" ? draft.product2 : "", createdAt: nowIso(), pregateAt: "", scaleExitAt: "", tonnage: "", status: "Onay Bekliyor", rejectionDepartment: "", vehicles });
  saveStore();
  ui.requestDraft.requestNo = "";
  render();
  showToast(`${requestNo} numaralı talep oluşturuldu ve onaya gönderildi.`);
}

function reviewDocument(status) {
  const item = allDocuments().find((docItem) => docItem.key === ui.selectedDocKey);
  if (!item) return;
  const note = document.getElementById("reviewNote")?.value.trim() || "";
  if ((status === "rejected" || status === "returned") && !note) return showToast("Red veya geri gönderme için açıklama yazınız.");
  item.doc.status = status;
  item.doc.note = note;
  item.doc.reviewedAt = nowIso();
  saveStore();
  render();
  showToast(`${item.vehicle.plate} · ${item.doc.type}: ${STATUS_LABEL[status]}`);
}

function applyDocumentFilter(clear = false) {
  if (clear) ui.docFilter = { carrier: "all", status: "all", type: "all" };
  else ui.docFilter = { carrier: document.getElementById("filterCarrier").value, status: document.getElementById("filterStatus").value, type: document.getElementById("filterDocType").value };
  ui.selectedDocKey = "";
  render();
}

function csvCell(value) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

function downloadCsv(filename, headers, rows) {
  const content = "\ufeff" + [headers, ...rows].map((row) => row.map(csvCell).join(";")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function downloadDocumentReport() {
  const validityLabels = { valid: "Geçerli", approaching: "Yaklaşıyor", expired: "Geçti", missing: "Eksik" };
  const rows = store.vehicles.flatMap((vehicle) => vehicle.documents.map((doc) => [vehicle.plate, VEHICLE_TYPES[vehicle.type].label, vehicle.company, doc.type, doc.fileName, doc.expiry, validityLabels[documentValidity(doc)], fmt(doc.submittedAt), fmt(doc.reviewedAt), STATUS_LABEL[doc.status], doc.note]));
  downloadCsv("poliport_arac_evrak_onay_raporu.csv", ["Plaka/Kayıt", "Araç Tipi", "Nakliyeci", "Evrak", "Dosya", "Son Geçerlilik", "Belge Geçerlilik", "Yükleme Tarih/Saat", "Onay İşlem Tarih/Saat", "Pregate Durumu", "Açıklama"], rows);
}

function downloadOperationReport() {
  const rows = store.operations.map((operation) => [operation.requestNo, operation.requestType, operation.product1, operation.product2, operation.vehicles.join(" / "), fmt(operation.createdAt), fmt(operation.pregateAt), fmt(operation.scaleExitAt), operation.tonnage, operation.status, operation.rejectionDepartment]);
  downloadCsv("poliport_operasyon_kantar_raporu.csv", ["Talep No", "Araç/Operasyon Tipi", "1. Ürün", "2. Ürün", "Araç/Sürücü Eşleşmesi", "Talep Oluşturma", "Pregate Geliş", "Kantar Çıkış", "Çıkış Tonajı", "Durum", "Red Departmanı"], rows);
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "choose-role") { ui.loginRole = target.dataset.role; ui.stage = "login"; render(); }
  if (action === "back-gateway") { ui.stage = "gateway"; ui.role = null; closeModal(); render(); }
  if (action === "login") login(false);
  if (action === "demo-login") login(true);
  if (action === "logout") { ui.stage = "gateway"; ui.role = null; render(); }
  if (action === "nav") { ui.page = target.dataset.page; ui.editVehicleId = null; render(); }
  if (action === "pregate-nav") { ui.page = target.dataset.page; render(); if (ui.page !== "docs") showToast("Bu mevcut GullsEye modülü örnek olarak korunmuştur."); }
  if (action === "new-vehicle") beginVehicle("tractor", null);
  if (action === "vehicle-tab") { ui.vehicleType = target.dataset.type; ui.editVehicleId = null; ui.draftFiles = {}; render(); }
  if (action === "cancel-edit") beginVehicle(ui.vehicleType, null);
  if (action === "save-draft") showToast("Taslak bu tarayıcıda geçici olarak saklandı.");
  if (action === "submit-vehicle") submitVehicle();
  if (action === "vehicle-detail") showVehicleDetail(target.dataset.id);
  if (action === "edit-vehicle") { closeModal(); const vehicle = store.vehicles.find((item) => item.id === target.dataset.id); if (vehicle) beginVehicle(vehicle.type, vehicle.id); }
  if (action === "create-request") createRequest();
  if (action === "download-doc-report") downloadDocumentReport();
  if (action === "download-op-report") downloadOperationReport();
  if (action === "select-doc") { ui.selectedDocKey = target.dataset.key; render(); }
  if (action === "review-doc") reviewDocument(target.dataset.status);
  if (action === "apply-doc-filter") applyDocumentFilter(false);
  if (action === "clear-doc-filter") applyDocumentFilter(true);
});

app.addEventListener("change", (event) => {
  if (event.target.matches(".doc-upload input[type='file']")) {
    const card = event.target.closest(".doc-upload");
    const index = Number(card.dataset.docIndex);
    const file = event.target.files[0];
    if (file) {
      ui.draftFiles[index] = file.name;
      card.querySelector(".file-name").textContent = `${file.name} · ${Math.max(1, Math.round(file.size / 1024))} KB`;
      refreshValidityRow(card, index);
    }
  }
  if (event.target.matches(".doc-expiry")) {
    const card = event.target.closest(".doc-upload");
    refreshValidityRow(card, Number(card.dataset.docIndex));
  }
  if (["requestType", "product1", "secondProduct", "product2"].includes(event.target.id)) {
    syncRequestDraft();
    if (ui.requestDraft.requestType === "dry") ui.requestDraft.second = false;
    render();
  }
});

modalLayer.addEventListener("click", (event) => {
  if (event.target === modalLayer || event.target.closest("[data-action='close-modal']")) closeModal();
});

document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });

render();
setTimeout(() => {
  const intro = document.getElementById("intro");
  if (intro) intro.classList.add("out");
  setTimeout(() => { ui.stage = "gateway"; render(); }, 750);
}, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 2000);
