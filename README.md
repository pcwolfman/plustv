# 📺 PlusTV - Canlı TV İzleme Platformu

Modern, kullanıcı dostu bir canlı TV izleme web uygulaması. GitHub Pages ile kolayca yayınlayabilirsiniz.

## ✨ Özellikler

- 🎯 **Modern ve Şık Tasarım**: Gradient renkler ve smooth animasyonlarla modern UI
- 📱 **Tam Responsive**: Mobil, tablet ve masaüstü için optimize edilmiş
- 🔍 **Gelişmiş Arama**: Kanalları isme göre arama
- 📂 **Kategori Filtreleme**: Haber, Spor, Eğlence, Sinema, Müzik kategorileri
- 🎬 **M3U8 Desteği**: HLS.js ile M3U8 stream formatı desteği
- 🖥️ **Tam Ekran Modu**: Çift tıklama veya F tuşu ile tam ekran
- ⌨️ **Klavye Kısayolları**:
  - `Space`: Oynat/Duraklat
  - `F`: Tam Ekran
  - `M`: Ses Aç/Kapat
- 🔊 **Ses Kontrolü**: Tek tıkla ses açma/kapama
- ⚡ **Hızlı ve Performanslı**: Optimize edilmiş kod yapısı

## 🚀 Kurulum ve Yayınlama

### GitHub Pages ile Yayınlama

1. **GitHub'da Yeni Repo Oluşturun**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/kullaniciadi/PlusTv.git
   git push -u origin main
   ```

2. **GitHub Pages'i Aktifleştirin**
   - Repo sayfasında `Settings` > `Pages` bölümüne gidin
   - Source olarak `main` branch'ini seçin
   - `/ (root)` klasörünü seçin
   - Save butonuna tıklayın

3. **Sayfanız Hazır!**
   - Birkaç dakika içinde sayfanız `https://kullaniciadi.github.io/PlusTv/` adresinde yayında olacak

### Yerel Olarak Çalıştırma

```bash
# Basit bir HTTP sunucusu ile (Python 3)
python -m http.server 8000

# Veya Node.js ile (http-server)
npx http-server

# Ardından tarayıcıda açın
# http://localhost:8000
```

## 📁 Dosya Yapısı

```
PlusTv/
├── index.html      # Ana HTML dosyası
├── styles.css      # Stil dosyası
├── script.js       # JavaScript fonksiyonları
└── README.md       # Bu dosya
```

## 🎨 Özelleştirme

### Yeni Kanal Eklemek

`script.js` dosyasındaki `channels` array'ine yeni kanal ekleyin:

```javascript
{
    id: 16,
    name: "Kanal Adı",
    category: "news", // news, sports, entertainment, movie, music
    icon: "📺",
    url: "https://kanal-url.m3u8",
    type: "m3u8" // veya "iframe"
}
```

### Renkleri Değiştirmek

`styles.css` dosyasındaki `:root` değişkenlerini düzenleyin:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... diğer renkler */
}
```

### Kategorileri Özelleştirmek

`index.html` içindeki kategori butonlarını ve `script.js` içindeki `getCategoryName` fonksiyonunu düzenleyin.

## 🔧 Teknik Detaylar

- **HLS.js**: M3U8 stream formatı için kullanılan kütüphane
- **Vanilla JavaScript**: Framework bağımlılığı yok
- **CSS Grid & Flexbox**: Modern layout sistemi
- **Responsive Design**: Mobile-first yaklaşım

## 📝 Notlar

- Bazı kanallar CORS politikaları nedeniyle çalışmayabilir
- Kanalların erişilebilirliği internet bağlantınıza ve yayın kaynağına bağlıdır
- M3U8 stream'ler için güncel ve erişilebilir URL'ler kullanılmalıdır

## 📄 Lisans

Bu proje özgürce kullanılabilir ve düzenlenebilir.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## ⚠️ Yasal Uyarı

Bu platform sadece eğitim amaçlıdır. İzlediğiniz içeriklerin telif haklarına saygı gösterin. Kanalların resmi yayın platformlarını kullanmanız önerilir.

---

**Mutlu İzlemeler! 🎉**
