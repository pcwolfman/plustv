// TV Kanalları Veritabanı
const channels = [
    {
        id: 1,
        name: "TRT 1",
        category: "news",
        icon: "📺",
        url: "https://tv-trt1.live.trt.com.tr/master_720.m3u8",
        type: "m3u8"
    },
    {
        id: 2,
        name: "TRT Haber",
        category: "news",
        icon: "📰",
        url: "https://tv-trthaber.live.trt.com.tr/master_720.m3u8",
        type: "m3u8"
    },
    {
        id: 3,
        name: "TRT Spor",
        category: "sports",
        icon: "⚽",
        url: "https://tv-trthaber.live.trt.com.tr/master_720.m3u8",
        type: "m3u8"
    },
    {
        id: 4,
        name: "NTV",
        category: "news",
        icon: "📡",
        url: "https://ntvios.mediatriple.net/ntv/ntv.m3u8",
        type: "m3u8"
    },
    {
        id: 5,
        name: "CNN Türk",
        category: "news",
        icon: "🌐",
        url: "https://live.duhnet.tv/S2/HLS/LIVE/streaming/streamName/cnnturk/stream.m3u8",
        type: "m3u8"
    },
    {
        id: 6,
        name: "Show TV",
        category: "entertainment",
        icon: "🎭",
        url: "https://showtv-live.trshow.net/hls/live/showtv_240p.m3u8",
        type: "m3u8"
    },
    {
        id: 7,
        name: "ATV",
        category: "entertainment",
        icon: "🎬",
        url: "https://atvlive.mediatriple.net/atv/atv.m3u8",
        type: "m3u8"
    },
    {
        id: 8,
        name: "Kanal D",
        category: "entertainment",
        icon: "📺",
        url: "https://kanaldlive.mediatriple.net/kanald/kanald.m3u8",
        type: "m3u8"
    },
    {
        id: 9,
        name: "FOX",
        category: "entertainment",
        icon: "🦊",
        url: "https://foxtv-live.trshow.net/hls/live/foxtv_240p.m3u8",
        type: "m3u8"
    },
    {
        id: 10,
        name: "Star TV",
        category: "entertainment",
        icon: "⭐",
        url: "https://startvlive.mediatriple.net/startv/startv.m3u8",
        type: "m3u8"
    },
    {
        id: 11,
        name: "beIN Sports 1",
        category: "sports",
        icon: "🏆",
        url: "https://bein-sports-live.trshow.net/hls/live/beinsports1_240p.m3u8",
        type: "m3u8"
    },
    {
        id: 12,
        name: "beIN Sports 2",
        category: "sports",
        icon: "⚽",
        url: "https://bein-sports-live.trshow.net/hls/live/beinsports2_240p.m3u8",
        type: "m3u8"
    },
    {
        id: 13,
        name: "TRT Müzik",
        category: "music",
        icon: "🎵",
        url: "https://tv-trtmuzik.live.trt.com.tr/master_720.m3u8",
        type: "m3u8"
    },
    {
        id: 14,
        name: "Power TV",
        category: "music",
        icon: "🎤",
        url: "https://livetv.powerapp.com.tr/powertv/powertv.m3u8",
        type: "m3u8"
    },
    {
        id: 15,
        name: "Sinema TV",
        category: "movie",
        icon: "🎬",
        url: "https://sinema-tv-live.trshow.net/hls/live/sinematv_240p.m3u8",
        type: "m3u8"
    }
];

// Global Değişkenler
let currentChannel = null;
let isMuted = true;
let currentCategory = 'all';
let filteredChannels = channels;

// DOM Elementleri
const channelList = document.getElementById('channelList');
const videoContainer = document.getElementById('videoContainer');
const videoPlayer = document.getElementById('videoPlayer');
const iframePlayer = document.getElementById('iframePlayer');
const videoPlaceholder = document.querySelector('.video-placeholder');
const currentChannelInfo = document.getElementById('currentChannelInfo');
const currentChannelName = document.getElementById('currentChannelName');
const currentChannelCategory = document.getElementById('currentChannelCategory');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const loading = document.getElementById('loading');

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    renderChannels();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Arama
    searchInput.addEventListener('input', handleSearch);
    
    // Kategori Filtreleme
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterAndRender();
        });
    });

    // Tam Ekran
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Ses Kontrolü
    volumeBtn.addEventListener('click', toggleVolume);
    
    // Video Çift Tıklama ile Tam Ekran
    videoContainer.addEventListener('dblclick', toggleFullscreen);
    videoPlayer.addEventListener('dblclick', toggleFullscreen);
    
    // Video Oynatıcı Event'leri
    videoPlayer.addEventListener('play', () => {
        videoPlaceholder.style.display = 'none';
    });
    
    videoPlayer.addEventListener('error', handleVideoError);
}

// Kanal Listesi Render
function renderChannels() {
    channelList.innerHTML = '';
    
    if (filteredChannels.length === 0) {
        channelList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Kanal bulunamadı</p>';
        return;
    }
    
    filteredChannels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-item';
        channelItem.innerHTML = `
            <div class="channel-icon">${channel.icon}</div>
            <div class="channel-info">
                <div class="channel-name">${channel.name}</div>
                <div class="channel-category">${getCategoryName(channel.category)}</div>
            </div>
        `;
        
        channelItem.addEventListener('click', () => playChannel(channel));
        channelList.appendChild(channelItem);
    });
}

// Kanal Oynat
function playChannel(channel) {
    if (!channel || !channel.url) {
        showError('Geçersiz kanal bilgisi.');
        return;
    }
    
    currentChannel = channel;
    
    // Önceki oynatıcıyı durdur ve temizle
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.load(); // Player'ı sıfırla
    
    // Önceki HLS instance'ını temizle
    if (videoPlayer.hls) {
        videoPlayer.hls.destroy();
        videoPlayer.hls = null;
    }
    
    iframePlayer.src = '';
    iframePlayer.style.display = 'none';
    
    // Loading göster
    loading.style.display = 'flex';
    
    // Aktif kanalı vurgula
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
        const itemName = item.querySelector('.channel-name').textContent;
        if (itemName === channel.name) {
            item.classList.add('active');
        }
    });
    
    // Kanal bilgisini güncelle
    currentChannelName.textContent = channel.name;
    currentChannelCategory.textContent = getCategoryName(channel.category);
    currentChannelInfo.style.display = 'block';
    
    // Video oynat
    if (channel.type === 'm3u8') {
        playM3U8(channel.url);
    } else if (channel.type === 'iframe') {
        playIframe(channel.url);
    } else {
        loading.style.display = 'none';
        showError('Desteklenmeyen kanal tipi.');
    }
}

// M3U8 Oynat
function playM3U8(url) {
    videoPlayer.style.display = 'block';
    iframePlayer.style.display = 'none';
    videoPlaceholder.style.display = 'none';
    
    // HLS.js yüklenmesini bekle
    if (typeof Hls === 'undefined') {
        // HLS.js henüz yüklenmedi, bekle
        let attempts = 0;
        const maxAttempts = 100; // 10 saniye (100ms * 100)
        
        const checkHls = setInterval(() => {
            attempts++;
            if (typeof Hls !== 'undefined') {
                clearInterval(checkHls);
                playM3U8(url); // Tekrar dene
            } else if (attempts >= maxAttempts) {
                clearInterval(checkHls);
                loading.style.display = 'none';
                showError('HLS.js yüklenemedi. Lütfen sayfayı yenileyin.');
                videoPlaceholder.style.display = 'flex';
            }
        }, 100);
        return;
    }
    
    // HLS.js kullanarak M3U8 oynat
    if (Hls.isSupported()) {
        // Önceki HLS instance'ını temizle
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
                loading.style.display = 'none';
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
                videoPlaceholder.style.display = 'flex';
            });
            loading.style.display = 'none';
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
                            loading.style.display = 'none';
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
                            loading.style.display = 'none';
                            hls.destroy();
                            showError('Video çözümlenemedi. Lütfen başka bir kanal deneyin.');
                            videoPlaceholder.style.display = 'flex';
                        }
                        break;
                    default:
                        clearTimeoutSafe();
                        loading.style.display = 'none';
                        hls.destroy();
                        showError('Kanal yüklenemedi. Lütfen başka bir kanal deneyin.');
                        videoPlaceholder.style.display = 'flex';
                        break;
                }
            }
        });
        
        // Timeout ekle - manifest 15 saniye içinde yüklenmezse hata ver
        timeout = setTimeout(() => {
            if (!manifestParsed) {
                loading.style.display = 'none';
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
                loading.style.display = 'none';
            }).catch(err => {
                console.error('Oynatma hatası:', err);
                loading.style.display = 'none';
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
        } else {
            loading.style.display = 'none';
        }
        
        // Timeout ekle - Safari için
        const safariTimeout = setTimeout(() => {
            if (videoPlayer.readyState === 0) {
                loading.style.display = 'none';
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
                videoPlaceholder.style.display = 'flex';
            }
        }, 15000);
        
        videoPlayer.addEventListener('loadeddata', () => {
            clearTimeout(safariTimeout);
        }, { once: true });
    } else {
        loading.style.display = 'none';
        showError('Tarayıcınız bu video formatını desteklemiyor.');
    }
}

// Iframe Oynat
function playIframe(url) {
    videoPlayer.style.display = 'none';
    iframePlayer.style.display = 'block';
    iframePlayer.src = url;
    loading.style.display = 'none';
}

// Video Hatası
function handleVideoError(e) {
    loading.style.display = 'none';
    console.error('Video hatası:', e);
    
    // HLS instance'ını temizle
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
    
    // Placeholder'ı göster
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
    filteredChannels = channels.filter(channel => {
        const matchesCategory = currentCategory === 'all' || channel.category === currentCategory;
        const matchesSearch = searchTerm === '' || 
            channel.name.toLowerCase().includes(searchTerm) ||
            getCategoryName(channel.category).toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesSearch;
    });
    
    renderChannels();
}

// Kategori Adını Al
function getCategoryName(category) {
    const names = {
        'news': 'Haber',
        'sports': 'Spor',
        'entertainment': 'Eğlence',
        'movie': 'Sinema',
        'music': 'Müzik'
    };
    return names[category] || category;
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

// Ses Aç/Kapat
function toggleVolume() {
    isMuted = !isMuted;
    videoPlayer.muted = isMuted;
    volumeIcon.textContent = isMuted ? '🔇' : '🔊';
}

// HLS.js Script Yükle (M3U8 desteği için) - Eğer head'de yüklenmemişse
if (typeof Hls === 'undefined') {
    const hlsScript = document.createElement('script');
    hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    hlsScript.onerror = () => {
        console.error('HLS.js yüklenemedi. Kanal oynatma çalışmayabilir.');
    };
    hlsScript.onload = () => {
        console.log('HLS.js başarıyla yüklendi.');
    };
    document.head.appendChild(hlsScript);
} else {
    console.log('HLS.js zaten yüklü.');
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
    
    // F: Tam Ekran
    if (e.code === 'KeyF') {
        toggleFullscreen();
    }
    
    // M: Ses Aç/Kapat
    if (e.code === 'KeyM') {
        toggleVolume();
    }
});
