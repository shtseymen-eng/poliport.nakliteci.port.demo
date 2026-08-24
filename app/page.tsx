'use client';

import { useMemo, useState } from 'react';

const shipments = [
  { id: 'PLP-24082', route: 'İstanbul → İzmir', driver: 'Murat Kaya', plate: '34 NAK 275', time: '14:30', status: 'Yolda', tone: 'blue' },
  { id: 'PLP-24079', route: 'Bursa → Ankara', driver: 'Selin Yılmaz', plate: '16 POR 416', time: '16:10', status: 'Yüklemede', tone: 'orange' },
  { id: 'PLP-24074', route: 'Kocaeli → Antalya', driver: 'Erdem Aydın', plate: '41 POL 908', time: '18:45', status: 'Planlandı', tone: 'gray' },
];

const fleet = [
  { plate: '34 NAK 275', route: 'İstanbul · Manisa', progress: 72, eta: '2 sa 15 dk' },
  { plate: '06 PLP 184', route: 'Ankara · Eskişehir', progress: 48, eta: '3 sa 40 dk' },
  { plate: '35 PRT 611', route: 'İzmir · Denizli', progress: 31, eta: '4 sa 25 dk' },
];

export default function Home() {
  const [filter, setFilter] = useState('Tümü');
  const [notice, setNotice] = useState(false);

  const visibleShipments = useMemo(
    () => (filter === 'Tümü' ? shipments : shipments.filter((item) => item.status === filter)),
    [filter],
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Poliport ana sayfa">
          <span className="brand-mark">P</span>
          <span>POLIPORT</span>
        </a>

        <nav aria-label="Ana menü">
          <p className="nav-label">OPERASYON</p>
          <a className="nav-item active" href="#top"><span>⌂</span> Genel Bakış</a>
          <a className="nav-item" href="#shipments"><span>⇄</span> Sevkiyatlar <b>12</b></a>
          <a className="nav-item" href="#fleet"><span>▱</span> Araçlar</a>
          <a className="nav-item" href="#drivers"><span>◎</span> Sürücüler</a>
          <p className="nav-label nav-section">YÖNETİM</p>
          <a className="nav-item" href="#reports"><span>▥</span> Raporlar</a>
          <a className="nav-item" href="#documents"><span>□</span> Belgeler</a>
        </nav>

        <div className="support-card">
          <span className="support-icon">?</span>
          <strong>Yardıma mı ihtiyacınız var?</strong>
          <p>Operasyon ekibimiz 7/24 yanınızda.</p>
          <button type="button" onClick={() => setNotice(true)}>Destek alın</button>
        </div>
        <button className="profile" type="button" onClick={() => setNotice(true)}>
          <span className="avatar">SK</span>
          <span><strong>Serkan Kaya</strong><small>Filo Yöneticisi</small></span>
          <span className="profile-more">•••</span>
        </button>
      </aside>

      <main id="top" className="main-content">
        <header className="topbar">
          <div>
            <span className="mobile-logo">P</span>
            <button className="search" type="button" onClick={() => setNotice(true)} aria-label="Arama yap">
              <span>⌕</span> Sevkiyat, plaka veya sürücü ara...
              <kbd>⌘ K</kbd>
            </button>
          </div>
          <div className="top-actions">
            <button type="button" aria-label="Bildirimler" onClick={() => setNotice(true)} className="icon-button">♢<i /></button>
            <span className="date">24 Ağustos 2026</span>
            <button type="button" onClick={() => setNotice(true)} className="primary-button"><span>＋</span> Yeni Sevkiyat</button>
          </div>
        </header>

        <div className="content-wrap">
          <section className="welcome">
            <div>
              <p className="eyebrow">24 AĞUSTOS · PAZARTESİ</p>
              <h1>Günaydın, Serkan</h1>
              <p>Operasyonunuz akışında. Bugün planlanan 18 sevkiyat bulunuyor.</p>
            </div>
            <div className="live-pill"><i /> Sistemler aktif</div>
          </section>

          <section className="stats" aria-label="Günlük operasyon özeti">
            <article className="stat-card">
              <div className="stat-head"><span className="stat-icon blue">⇄</span><span className="trend up">↗ %8,4</span></div>
              <p>Aktif Sevkiyat</p><strong>24</strong><small>12 yolda · 8 yüklemede</small>
            </article>
            <article className="stat-card">
              <div className="stat-head"><span className="stat-icon green">▱</span><span className="trend up">↗ %3,1</span></div>
              <p>Aktif Araç</p><strong>38</strong><small>Toplam 44 araç</small>
            </article>
            <article className="stat-card">
              <div className="stat-head"><span className="stat-icon violet">◷</span><span className="trend up">↗ %1,7</span></div>
              <p>Zamanında Teslimat</p><strong>%96,2</strong><small>Son 30 gün ortalaması</small>
            </article>
            <article className="stat-card">
              <div className="stat-head"><span className="stat-icon amber">₺</span><span className="trend down">↘ %2,3</span></div>
              <p>Aylık Ciro</p><strong>₺2,48M</strong><small>Ağustos hedefi: ₺3,1M</small>
            </article>
          </section>

          <section className="dashboard-grid">
            <article className="panel shipments-panel" id="shipments">
              <div className="panel-head">
                <div><h2>Bugünün Sevkiyatları</h2><p>Planlanan ve devam eden işler</p></div>
                <button type="button" onClick={() => setFilter('Tümü')}>Tümünü gör <span>→</span></button>
              </div>
              <div className="filters" aria-label="Sevkiyat filtresi">
                {['Tümü', 'Yolda', 'Yüklemede', 'Planlandı'].map((item) => (
                  <button key={item} type="button" className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>
                ))}
              </div>
              <div className="shipment-list">
                {visibleShipments.map((shipment) => (
                  <div className="shipment-row" key={shipment.id}>
                    <div className={`route-dot ${shipment.tone}`}><i /><span /></div>
                    <div className="shipment-main"><strong>{shipment.route}</strong><span>{shipment.id} · {shipment.driver}</span></div>
                    <div className="plate"><small>PLAKA</small><strong>{shipment.plate}</strong></div>
                    <div className="delivery"><small>TAHMİNİ VARIŞ</small><strong>{shipment.time}</strong></div>
                    <span className={`status ${shipment.tone}`}>{shipment.status}</span>
                    <button type="button" onClick={() => setNotice(true)} aria-label={`${shipment.id} detayları`}>›</button>
                  </div>
                ))}
              </div>
              <footer><span><i className="green-dot" /> 7 sevkiyat zamanında</span><span><i className="orange-dot" /> 1 sevkiyat gecikmeli</span></footer>
            </article>

            <article className="panel fleet-panel" id="fleet">
              <div className="panel-head">
                <div><h2>Canlı Filo</h2><p>Yoldaki araçlar</p></div>
                <button type="button" onClick={() => setNotice(true)} className="more-button">•••</button>
              </div>
              <div className="mini-map" aria-label="Türkiye üzerindeki aktif araç rotaları">
                <div className="map-line line-one" /><div className="map-line line-two" />
                <span className="map-city istanbul">İstanbul<i /></span>
                <span className="map-city ankara">Ankara<i /></span>
                <span className="map-city izmir">İzmir<i /></span>
                <span className="truck-point point-one">▣</span><span className="truck-point point-two">▣</span>
              </div>
              <div className="fleet-list">
                {fleet.map((vehicle) => (
                  <div className="fleet-row" key={vehicle.plate}>
                    <span className="vehicle-icon">▰</span>
                    <div className="fleet-info"><strong>{vehicle.plate}</strong><small>{vehicle.route}</small></div>
                    <div className="progress"><i style={{ width: `${vehicle.progress}%` }} /></div>
                    <span className="eta">{vehicle.eta}</span>
                  </div>
                ))}
              </div>
              <button className="map-button" type="button" onClick={() => setNotice(true)}>Haritada görüntüle <span>↗</span></button>
            </article>
          </section>

          <section className="bottom-strip" id="drivers">
            <div><span className="pulse-ring">✓</span><p><strong>Tüm operasyonlar normal ilerliyor</strong><small>Son kontrol: şimdi</small></p></div>
            <p>Bugünkü kapasite kullanımı <strong>%86</strong></p>
            <div className="capacity"><i /></div>
          </section>
        </div>
      </main>

      {notice && (
        <div className="toast" role="status">
          <span>✓</span><p><strong>Demo işlemi hazır</strong>Bu özellik bir sonraki sürümde canlı veriye bağlanacak.</p>
          <button type="button" onClick={() => setNotice(false)} aria-label="Bildirimi kapat">×</button>
        </div>
      )}
    </div>
  );
}
