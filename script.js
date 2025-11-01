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
    currentChannel = channel;
    
    // Önceki oynatıcıyı durdur
    videoPlayer.pause();
    videoPlayer.src = '';
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
    }
    
    // Placeholder'ı gizle
    setTimeout(() => {
        videoPlaceholder.style.display = 'none';
        loading.style.display = 'none';
    }, 1000);
}

// M3U8 Oynat
function playM3U8(url) {
    videoPlayer.style.display = 'block';
    iframePlayer.style.display = 'none';
    
    // HLS.js kullanarak M3U8 oynat
    if (Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });
        
        hls.loadSource(url);
        hls.attachMedia(videoPlayer);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoPlayer.play().catch(err => {
                console.error('Oynatma hatası:', err);
                loading.style.display = 'none';
            });
            loading.style.display = 'none';
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                loading.style.display = 'none';
                showError('Kanal yüklenemedi. Lütfen başka bir kanal deneyin.');
            }
        });
        
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari için native HLS desteği
        videoPlayer.src = url;
        videoPlayer.play().catch(err => {
            console.error('Oynatma hatası:', err);
            loading.style.display = 'none';
        });
        loading.style.display = 'none';
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
function handleVideoError() {
    loading.style.display = 'none';
    showError('Video yüklenemedi. Lütfen başka bir kanal deneyin.');
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

// HLS.js Script Yükle (M3U8 desteği için)
const hlsScript = document.createElement('script');
hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
document.head.appendChild(hlsScript);

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
