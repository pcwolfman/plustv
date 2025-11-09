// TV Kanalları Veritabanı - M3U dosyasından dinamik yükleme
let channels = [];

// M3U dosyasını yükle ve parse et
async function loadChannelsFromM3U() {
    try {
        const response = await fetch('https://iptv-org.github.io/iptv/languages/tur.m3u');
        const text = await response.text();
        const lines = text.split('\n');
        
        let currentChannel = null;
        let channelId = 1;
        let nextLineIsUrl = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Boş satırları atla
            if (!line) continue;
            
            // EXTINF satırını parse et
            if (line.startsWith('#EXTINF:')) {
                // Metadata'dan bilgileri çıkar
                const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
                const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
                const groupTitleMatch = line.match(/group-title="([^"]*)"/);
                
                // Kanal adını al (son kısımda, virgülden sonra)
                // Virgül sonrası kısmı al, ancak parantez içindeki kalite bilgisini temizle
                const channelNameMatch = line.match(/,(.*)$/);
                let channelName = channelNameMatch ? channelNameMatch[1].trim() : '';
                // Kalite bilgisini kaldır: (1080p), (720p), [Not 24/7] gibi
                channelName = channelName.replace(/\s*\([^)]*\)\s*/g, '').replace(/\s*\[[^\]]*\]\s*/g, '').trim();
                
                // group-title'i kategori olarak kullan
                const groupTitle = groupTitleMatch ? groupTitleMatch[1].trim() : 'Undefined';
                
                // Kategoriyi Türkçe kategori isimlerine çevir
                let category = 'entertainment';
                let icon = '📺';
                
                const groupUpper = groupTitle.toUpperCase();
                if (groupUpper === 'NEWS' || groupUpper.includes('HABER')) {
                    category = 'news';
                    icon = '📰';
                } else if (groupUpper === 'SPORTS' || groupUpper.includes('SPOR')) {
                    category = 'sports';
                    icon = '⚽';
                } else if (groupUpper === 'MUSIC' || groupUpper.includes('MUZIK')) {
                    category = 'music';
                    icon = '🎵';
                } else if (groupUpper === 'DOCUMENTARY' || groupUpper.includes('BELGESEL') || groupUpper.includes('SINEMA') || groupUpper === 'MOVIE') {
                    category = 'movie';
                    icon = '🎬';
                } else if (groupUpper === 'ENTERTAINMENT' || groupUpper === 'GENERAL') {
                    category = 'entertainment';
                    icon = '📺';
                } else if (groupUpper === 'KIDS' || groupUpper.includes('ÇOCUK')) {
                    category = 'entertainment';
                    icon = '📺';
                } else {
                    // Eğer kategori belirlenemezse, kanal adına göre tahmin et
                    const nameUpper = channelName.toUpperCase();
                    if (nameUpper.match(/HABER|CNN|NTV|TRT HABER|A HABER|TGRT|SKY TURK|HABERTURK|HABERGLOBAL|AKIT|ULKE|FLASH HABER|TH TURK HABER|HABER 61|360|24 TV|AA LIVE/)) {
                        category = 'news';
                        icon = '📰';
                    } else if (nameUpper.match(/SPOR|BEIN|TRT SPOR|SPORTSTV|FANATIK|ASPOR|HT SPOR|GS TV|FB TV|A SPOR/)) {
                        category = 'sports';
                        icon = '⚽';
                    } else if (nameUpper.match(/MUZIK|POWER|NUMBER ONE|KRAL|RADYO|MUSIC|TRT MUZIK|DREAM TURK|NR 1|TATLISES/)) {
                        category = 'music';
                        icon = '🎵';
                    } else if (nameUpper.match(/SINEMA|MOVIE|CINEMA|BELGESEL|TLC|DMAX|TRT BELGESEL|NATIONAL GEO|DISCOVERY|CINE|VIASAT|EXPLORE/)) {
                        category = 'movie';
                        icon = '🎬';
                    }
                }
                
                currentChannel = {
                    id: channelId++,
                    name: channelName,
                    type: 'm3u8',
                    category: category,
                    icon: icon,
                    tvgId: tvgIdMatch ? tvgIdMatch[1] : '',
                    tvgLogo: tvgLogoMatch ? tvgLogoMatch[1] : '',
                    groupTitle: groupTitle
                };
                nextLineIsUrl = true;
            } 
            // EXTVLCOPT gibi ekstra satırları atla (ama currentChannel'ı koru)
            else if (line.startsWith('#EXTVLCOPT:') || line.startsWith('#EXTM3U')) {
                // Bu satırları atla, bir sonraki satıra geç
                continue;
            } 
            // Diğer EXT satırlarını atla
            else if (line.startsWith('#EXT') && !line.startsWith('#EXTINF:')) {
                continue;
            }
            // URL satırı (http veya https ile başlayan)
            else if ((line.startsWith('http://') || line.startsWith('https://')) && currentChannel && nextLineIsUrl) {
                currentChannel.url = line;
                
                channels.push(currentChannel);
                currentChannel = null;
                nextLineIsUrl = false;
            }
        }
        
        // Kanalları yükledikten sonra render et
        filteredChannels = channels;
        renderChannels();
        
        console.log(`✅ ${channels.length} kanal yüklendi!`);
    } catch (error) {
        console.error('M3U dosyası yüklenemedi:', error);
        showError('Kanal listesi yüklenemedi. Lütfen sayfayı yenileyin.');
    }
}

// Global Değişkenler
let currentChannel = null;
let currentCategory = 'all';
let filteredChannels = [];
let favoriteChannels = JSON.parse(localStorage.getItem('favoriteChannels') || '[]');
let recentChannels = JSON.parse(localStorage.getItem('recentChannels') || '[]');

// DOM Elementleri
const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const iframePlayer = document.getElementById('iframePlayer');
const videoPlaceholder = document.querySelector('.video-placeholder');
const searchInput = document.getElementById('searchInput');
const loading = document.getElementById('loading');
const channelsPanel = document.getElementById('channelsPanel');
const channelsList = document.getElementById('channelsList');
const activeCategoryName = document.getElementById('activeCategoryName');

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    loadChannelsFromM3U();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Arama
    searchInput.addEventListener('input', handleSearch);
    
    // Kategori Seçimi - Sağda kanalları göster
    const categoryAccordions = document.querySelectorAll('.category-accordion');
    categoryAccordions.forEach(accordion => {
        const header = accordion.querySelector('.category-header');
        
        header.addEventListener('click', () => {
            const category = accordion.dataset.category;
            currentCategory = category;
            
            // Tüm kategorileri pasif yap
            categoryAccordions.forEach(acc => {
                acc.querySelector('.category-header').classList.remove('active');
            });
            
            // Seçili kategoriyi aktif yap
            header.classList.add('active');
            
            // Sağda kanalları göster
            showCategoryChannels(category);
        });
    });

    // Video Çift Tıklama ile Tam Ekran (sadece video player üstünde)
    videoPlayer.addEventListener('dblclick', toggleFullscreen);
    
    // Video Oynatıcı Event'leri
    videoPlayer.addEventListener('play', () => {
        videoPlaceholder.style.display = 'none';
    });
    
    videoPlayer.addEventListener('error', handleVideoError);
}

// Kategori kanallarını sağda göster
function showCategoryChannels(category) {
    if (!channelsList) return;
    
    let categoryChannels = [];
    
    if (category === 'all') {
        categoryChannels = channels;
    } else if (category === 'favorites') {
        // Favori kanalları ID'ye göre bul
        categoryChannels = channels.filter(ch => favoriteChannels.includes(ch.id));
    } else if (category === 'recent') {
        // Son izlenen kanalları ID'ye göre bul (ters sırada)
        const recentIds = [...new Set(recentChannels)].reverse();
        categoryChannels = recentIds.map(id => channels.find(ch => ch.id === id)).filter(ch => ch);
    } else {
        categoryChannels = channels.filter(ch => ch.category === category);
    }
    
    // Kategori adını güncelle
    if (activeCategoryName) {
        const categoryNames = {
            'all': 'Tüm Kanallar',
            'news': 'Haber Kanalları',
            'sports': 'Spor Kanalları',
            'entertainment': 'Eğlence Kanalları',
            'movie': 'Sinema Kanalları',
            'music': 'Müzik Kanalları',
            'favorites': 'Favori Kanallar',
            'recent': 'Son İzlenen Kanallar'
        };
        activeCategoryName.textContent = categoryNames[category] || 'Kanallar';
    }
    
    channelsList.innerHTML = '';
    
    if (categoryChannels.length === 0) {
        channelsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Bu kategoride kanal bulunamadı</p>';
        return;
    }
    
    categoryChannels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        const isFavorite = favoriteChannels.includes(channel.id);
        channelItem.innerHTML = `
            <div class="channel-icon">${channel.icon}</div>
            <div class="channel-info">
                <div class="channel-name">${channel.name}</div>
            </div>
            <button class="favorite-btn" data-channel-id="${channel.id}" title="${isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}">
                ${isFavorite ? '⭐' : '☆'}
            </button>
        `;
        
        channelItem.addEventListener('click', (e) => {
            // Favori butonuna tıklanırsa sadece favori işlemini yap
            if (e.target.classList.contains('favorite-btn') || e.target.closest('.favorite-btn')) {
                e.stopPropagation();
                const btn = e.target.closest('.favorite-btn');
                const channelId = parseInt(btn.dataset.channelId);
                toggleFavorite(channelId);
                // Buton görünümünü güncelle
                const isFav = favoriteChannels.includes(channelId);
                btn.textContent = isFav ? '⭐' : '☆';
                btn.title = isFav ? 'Favorilerden çıkar' : 'Favorilere ekle';
            } else {
                // Kanal item'ına tıklanırsa oynat
                playChannel(channel);
            }
        });
        
        channelsList.appendChild(channelItem);
    });
}

// İlk yüklemede tüm kanalları göster
function renderChannels() {
    // Favori ve son izlenen kanalları localStorage'dan yükle
    favoriteChannels = JSON.parse(localStorage.getItem('favoriteChannels') || '[]');
    recentChannels = JSON.parse(localStorage.getItem('recentChannels') || '[]');
    
    showCategoryChannels('all');
    // İlk kategoriyi aktif yap
    const firstCategory = document.querySelector('.category-accordion[data-category="all"] .category-header');
    if (firstCategory) {
        firstCategory.classList.add('active');
    }
}

// Kanal Oynat
function playChannel(channel) {
    if (!channel || !channel.url) {
        showError('Geçersiz kanal bilgisi.');
        return;
    }
    
    currentChannel = channel;
    
    // Son izlenen kanallara ekle
    addToRecentChannels(channel.id);
    
    // Önceki oynatıcıyı durdur ve temizle
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.load();
    
    // Önceki HLS instance'ını temizle
    if (videoPlayer.hls) {
        videoPlayer.hls.destroy();
        videoPlayer.hls = null;
    }
    
    iframePlayer.src = '';
    iframePlayer.style.display = 'none';
    
    // Loading göster (video container içinde)
    if (loading) {
        loading.style.display = 'flex';
    }
    
    // Aktif kanalı vurgula
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
        const itemName = item.querySelector('.channel-name')?.textContent;
        if (itemName === channel.name) {
            item.classList.add('active');
            // Aktif kanalı görünür yap
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
    
    // Video oynat
    if (channel.type === 'm3u8') {
        playM3U8(channel.url);
    } else if (channel.type === 'iframe') {
        playIframe(channel.url);
    } else {
        if (loading) loading.style.display = 'none';
        showError('Desteklenmeyen kanal tipi.');
    }
}

// M3U8 Oynat
function playM3U8(url) {
    videoPlayer.style.display = 'block';
    videoPlayer.style.zIndex = '3';
    videoPlayer.muted = false; // Ses açık
    iframePlayer.style.display = 'none';
    if (videoPlaceholder) videoPlaceholder.style.display = 'none';
    
    // HLS.js yüklenmesini bekle
    if (typeof Hls === 'undefined') {
        let attempts = 0;
        const maxAttempts = 100;
        
        const checkHls = setInterval(() => {
            attempts++;
            if (typeof Hls !== 'undefined') {
                clearInterval(checkHls);
                playM3U8(url);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkHls);
                if (loading) loading.style.display = 'none';
                showError('HLS.js yüklenemedi. Lütfen sayfayı yenileyin.');
                videoPlaceholder.style.display = 'flex';
            }
        }, 100);
        return;
    }
    
    // HLS.js kullanarak M3U8 oynat
    if (Hls.isSupported()) {
        if (videoPlayer.hls) {
            videoPlayer.hls.destroy();
        }
        
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            debug: false,
            xhrSetup: function(xhr, url) {
                xhr.withCredentials = false;
            }
        });
        
        videoPlayer.hls = hls;
        
        hls.loadSource(url);
        hls.attachMedia(videoPlayer);
        
        let manifestParsed = false;
        let timeout;
        
        const clearTimeoutSafe = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        };
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            manifestParsed = true;
            clearTimeoutSafe();
            videoPlayer.play().catch(err => {
                console.error('Oynatma hatası:', err);
                if (loading) loading.style.display = 'none';
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
                videoPlaceholder.style.display = 'flex';
            });
            if (loading) loading.style.display = 'none';
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Hatası:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Ağ hatası, yeniden deneniyor...');
                        try {
                            hls.startLoad();
                        } catch(e) {
                            console.error('Yeniden yükleme hatası:', e);
                            if (loading) loading.style.display = 'none';
                            hls.destroy();
                            showError('Ağ hatası. İnternet bağlantınızı kontrol edin.');
                            videoPlaceholder.style.display = 'flex';
                        }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Medya hatası, düzeltiliyor...');
                        try {
                            hls.recoverMediaError();
                        } catch(e) {
                            console.error('Medya hatası düzeltilemedi:', e);
                            if (loading) loading.style.display = 'none';
                            hls.destroy();
                            showError('Video çözümlenemedi. Lütfen başka bir kanal deneyin.');
                            videoPlaceholder.style.display = 'flex';
                        }
                        break;
                    default:
                        clearTimeoutSafe();
                        if (loading) loading.style.display = 'none';
                        hls.destroy();
                        showError('Kanal yüklenemedi. Lütfen başka bir kanal deneyin.');
                        videoPlaceholder.style.display = 'flex';
                        break;
                }
            }
        });
        
        timeout = setTimeout(() => {
            if (!manifestParsed) {
                if (loading) loading.style.display = 'none';
                hls.destroy();
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
                videoPlaceholder.style.display = 'flex';
            }
        }, 15000);
        
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari için native HLS desteği
        videoPlayer.src = url;
        const playPromise = videoPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (loading) loading.style.display = 'none';
            }).catch(err => {
                console.error('Oynatma hatası:', err);
                if (loading) loading.style.display = 'none';
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
        } else {
            if (loading) loading.style.display = 'none';
        }
        
        const safariTimeout = setTimeout(() => {
            if (videoPlayer.readyState === 0) {
                if (loading) loading.style.display = 'none';
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
                videoPlaceholder.style.display = 'flex';
            }
        }, 15000);
        
        videoPlayer.addEventListener('loadeddata', () => {
            clearTimeout(safariTimeout);
        }, { once: true });
    } else {
        if (loading) loading.style.display = 'none';
        showError('Tarayıcınız bu video formatını desteklemiyor.');
    }
}

// Iframe Oynat
function playIframe(url) {
    videoPlayer.style.display = 'none';
    iframePlayer.style.display = 'block';
    iframePlayer.src = url;
    if (loading) loading.style.display = 'none';
}

// Video Hatası
function handleVideoError(e) {
    if (loading) loading.style.display = 'none';
    console.error('Video hatası:', e);
    
    if (videoPlayer.hls) {
        videoPlayer.hls.destroy();
        videoPlayer.hls = null;
    }
    
    let errorMessage = 'Video yüklenemedi.';
    
    if (videoPlayer.error) {
        switch(videoPlayer.error.code) {
            case videoPlayer.error.MEDIA_ERR_ABORTED:
                errorMessage = 'Video yükleme iptal edildi.';
                break;
            case videoPlayer.error.MEDIA_ERR_NETWORK:
                errorMessage = 'Ağ hatası. İnternet bağlantınızı kontrol edin.';
                break;
            case videoPlayer.error.MEDIA_ERR_DECODE:
                errorMessage = 'Video çözümlenemedi.';
                break;
            case videoPlayer.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage = 'Video formatı desteklenmiyor.';
                break;
        }
    }
    
    showError(errorMessage + ' Lütfen başka bir kanal deneyin.');
    videoPlaceholder.style.display = 'flex';
}

// Hata Göster
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--danger);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Arama
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterAndRender(searchTerm);
}

// Filtrele ve Render
function filterAndRender(searchTerm = '') {
    if (searchTerm === '') {
        // Arama yoksa mevcut kategorinin kanallarını göster
        showCategoryChannels(currentCategory);
        return;
    }
    
    // Arama varsa tüm kanallarda ara
    filteredChannels = channels.filter(channel => {
        return channel.name.toLowerCase().includes(searchTerm) ||
               getCategoryName(channel.category).toLowerCase().includes(searchTerm);
    });
    
    // Arama sonuçlarını sağda göster
    if (!channelsList) return;
    
    channelsList.innerHTML = '';
    
    if (activeCategoryName) {
        activeCategoryName.textContent = `Arama: "${searchTerm}"`;
    }
    
    if (filteredChannels.length === 0) {
        channelsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Sonuç bulunamadı</p>';
        return;
    }
    
    filteredChannels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        const isFavorite = favoriteChannels.includes(channel.id);
        channelItem.innerHTML = `
            <div class="channel-icon">${channel.icon}</div>
            <div class="channel-info">
                <div class="channel-name">${channel.name}</div>
            </div>
            <button class="favorite-btn" data-channel-id="${channel.id}" title="${isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}">
                ${isFavorite ? '⭐' : '☆'}
            </button>
        `;
        
        channelItem.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn') || e.target.closest('.favorite-btn')) {
                e.stopPropagation();
                const btn = e.target.closest('.favorite-btn');
                const channelId = parseInt(btn.dataset.channelId);
                toggleFavorite(channelId);
                const isFav = favoriteChannels.includes(channelId);
                btn.textContent = isFav ? '⭐' : '☆';
                btn.title = isFav ? 'Favorilerden çıkar' : 'Favorilere ekle';
            } else {
                playChannel(channel);
            }
        });
        
        channelsList.appendChild(channelItem);
    });
}

// Kategori Adını Al
function getCategoryName(category) {
    const names = {
        'news': 'Haber',
        'sports': 'Spor',
        'entertainment': 'Eğlence',
        'movie': 'Sinema',
        'music': 'Müzik',
        'favorites': 'Favori',
        'recent': 'Son İzlenen'
    };
    return names[category] || category;
}

// Son izlenen kanallara ekle
function addToRecentChannels(channelId) {
    if (!recentChannels) recentChannels = [];
    
    // Aynı kanalı listeden çıkar (tekrar eklememek için)
    recentChannels = recentChannels.filter(id => id !== channelId);
    
    // Başa ekle
    recentChannels.unshift(channelId);
    
    // Maksimum 20 kanal tut
    recentChannels = recentChannels.slice(0, 20);
    
    // LocalStorage'a kaydet
    localStorage.setItem('recentChannels', JSON.stringify(recentChannels));
}

// Favori kanal ekle/çıkar
function toggleFavorite(channelId) {
    if (!favoriteChannels) favoriteChannels = [];
    
    const index = favoriteChannels.indexOf(channelId);
    if (index > -1) {
        favoriteChannels.splice(index, 1);
    } else {
        favoriteChannels.push(channelId);
    }
    
    localStorage.setItem('favoriteChannels', JSON.stringify(favoriteChannels));
    
    // Eğer favoriler kategorisindeyse listeyi güncelle
    if (currentCategory === 'favorites') {
        showCategoryChannels('favorites');
    }
}

// Tam Ekran
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
            console.error('Tam ekran hatası:', err);
        });
    } else {
        document.exitFullscreen();
    }
}


// Klavye Kısayolları
document.addEventListener('keydown', (e) => {
    // Space: Oynat/Duraklat
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    }
    
});
