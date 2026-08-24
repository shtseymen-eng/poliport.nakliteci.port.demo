# Poliport Nakliyeci Portalı

Poliport kara yolu sevkiyatları için hazırlanan rol bazlı GullsEye portal
prototipi. Tüpraş portalından bağımsız bir depo ve ayrı bir uygulamadır.

Canlı GitHub Pages bağlantısı: https://shtseymen-eng.github.io/poliport.nakliteci.port.demo/

## Hazırlanan ekranlar

- Poliport Lojistik sayfasıyla aynı ritimde animasyonlu giriş ve Nakliyeci / Pregate rol seçimi
- GullsEye görünümlü kullanıcı girişi
- Nakliyeci ana sayfası ve son 10 kayıt özeti
- Resmî Poliport görselleri, terminal kuralları, KKD, dokümanlar ve iletişim bilgilerini içeren Nakliyeci Bilgilendirme ekranı
- Yalnızca portal içi bilgilendirme görünümünde yer alan Nakliyeci Portalına geri dönüş düğmesi
- Poliport Ürün & Taşıma Yönetimi rehberinin portal içindeki bütünleşik görünümü
- Seymen Nakliyeci Portalı makro örneğiyle uyumlu lacivert sol menü, başlık şeritleri ve araç kayıt düzeni
- Evrak dosyası ve son geçerlilik tarihine göre Geçerli / Yaklaşıyor / Geçti / Eksik renk kontrolü
- Çekicide FL/AT uygunluğu; kılçık dorse, tanker dorse ve ISO tank için ayrı kayıt/evrak kuralları
- Zorunlu evrak tamamlanmadan Pregate gönderimini engelleyen taslak ve geçmiş tarih kontrolü
- Tanker T9 belgesi için tank kodu veya TSE izinli UN numarası eşleştirmesi
- Sürücüde zorunlu ehliyet/yüksekte çalışabilir raporu, SRC-5 ile tehlikeli ürün ve SRC-5 + ISOPA ile MDI/TDI yetkisi
- Çekici, dorse/tanker, ISO tank, 40 ayak konteyner, kamyon ve sürücü kaydı
- Dosya ve son geçerlilik tarihi bulunan evrak alanları
- Pregate onay, red ve geri gönderme akışı
- Araç tipine göre onaylı havuz ve otomatik red listesi
- Ürün / tank kodu uyumuna göre sevkiyat talebi oluşturma
- Araç-evrak ve operasyon-kantar raporu dışa aktarma

## Demo kullanımı

Karşılama ekranında rol seçildikten sonra **Demo ile Giriş** düğmesi kullanılabilir.
Manuel girişte doğrulama kodu `G7P4` değeridir.

Bu sürüm bir işlevsel prototiptir. Kimlik doğrulama, gerçek evrak dosyaları ve
işlem verileri tarayıcı üzerinde örneklenir; GullsEye, müşteri siparişi, kantar
ve kurumsal dosya servisleriyle canlı entegrasyon sonraki aşamada yapılmalıdır.

## Kapsam dayanağı

- Poliport tarafından paylaşılan evrak ve KKD kontrol listeleri
- Poliport ADR kapsamlı ürün / tank kodu Excel tablosu
- Dökme sıvı yük ile kuru yük / genel kargo süreçleri

Kaynak: <https://www.poliport.com/sirket-profili.html>
