// Global Variables
let channels = [];
let currentChannel = null;
let currentCategory = 'all';
let favoriteChannels = JSON.parse(localStorage.getItem('favoriteChannels') || '[]');
let activeTab = 'channels';

// DOM Elements
const backBtn = document.getElementById('backBtn');
const sidebarCategoryTitle = document.getElementById('sidebarCategoryTitle');
const categorySelect = document.getElementById('categorySelect');
const channelsSidebarList = document.getElementById('channelsSidebarList');
const tabButtons = document.querySelectorAll('.tab-btn');
const videoPlayer = document.getElementById('videoPlayer');
const iframePlayer = document.getElementById('iframePlayer');
const videoContainerPlayer = document.getElementById('videoContainerPlayer');
const videoPlaceholderPlayer = document.getElementById('videoPlaceholderPlayer');
const loadingPlayer = document.getElementById('loadingPlayer');
const pipBtn = document.getElementById('pipBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Get channel ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('id');
    const category = urlParams.get('category') || 'all';
    
    currentCategory = category;
    
    loadChannelsFromM3U().then(() => {
        if (channelId) {
            const channel = channels.find(ch => ch.id === parseInt(channelId));
            if (channel) {
                playChannel(channel);
            }
        }
        renderSidebarChannels();
    });
    
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Back button
    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            activeTab = btn.dataset.tab;
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSidebarChannels();
        });
    });
    
    // Category selection
    if (categorySelect) {
        categorySelect.value = currentCategory;
        categorySelect.addEventListener('change', () => {
            currentCategory = categorySelect.value;
            renderSidebarChannels();
        });
    }
    
    // Picture-in-Picture
    if (pipBtn) {
        pipBtn.style.display = 'flex';
        pipBtn.addEventListener('click', togglePictureInPicture);
        
        if (document.pictureInPictureEnabled && videoPlayer.disablePictureInPicture !== true) {
            videoPlayer.addEventListener('enterpictureinpicture', () => {
                pipBtn.classList.add('active');
                pipBtn.title = 'Pencere İçinde Pencere Modundan Çık';
            });
            
            videoPlayer.addEventListener('leavepictureinpicture', () => {
                pipBtn.classList.remove('active');
                pipBtn.title = 'Pencere İçinde Pencere';
            });
        }
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.location.href = 'index.html';
        }
    });
}

// Load M3U file
async function loadChannelsFromM3U() {
    try {
        const response = await fetch('tv.m3u');
        const text = await response.text();
        const lines = text.split('\n');
        
        let currentChannel = null;
        let channelId = 1;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line) continue;
            
            if (line.startsWith('#EXTINF:')) {
                const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
                const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
                const groupTitleMatch = line.match(/group-title="([^"]*)"/);
                
                const channelNameMatch = line.match(/,(.*)$/);
                let channelName = channelNameMatch ? channelNameMatch[1].trim() : '';
                
                const groupTitle = groupTitleMatch ? groupTitleMatch[1].trim() : 'Diğer';
                let category = groupTitle.split(' - ')[0].trim();
                
                currentChannel = {
                    id: channelId++,
                    name: channelName,
                    url: '',
                    category: category,
                    tvgId: tvgIdMatch ? tvgIdMatch[1] : '',
                    tvgLogo: tvgLogoMatch ? tvgLogoMatch[1] : ''
                };
            }
            else if ((line.startsWith('http://') || line.startsWith('https://')) && currentChannel) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = null;
            }
        }
        
        console.log(`✅ ${channels.length} kanal yüklendi!`);
    } catch (error) {
        console.error('M3U dosyası yüklenemedi:', error);
        showError('Kanal listesi yüklenemedi. Lütfen sayfayı yenileyin.');
    }
}

// Render Sidebar Channels
function renderSidebarChannels() {
    let filteredChannels = [];
    
    if (activeTab === 'favorites') {
        filteredChannels = channels.filter(ch => favoriteChannels.includes(ch.id));
        sidebarCategoryTitle.textContent = 'Favori Kanallar';
        if (categorySelect) {
            categorySelect.style.display = 'none';
        }
    } else {
        // Show channels from current category
        if (currentCategory === 'all') {
            filteredChannels = channels;
        } else {
            filteredChannels = channels.filter(ch => ch.category === currentCategory);
        }
        
        const categoryNames = {
            'all': 'Tüm Kanallar',
            'Ulusal': 'Ulusal Kanallar',
            'Haber': 'Haber Kanalları',
            'Spor': 'Spor Kanalları',
            'Eglence': 'Eğlence Kanalları',
            'Muzik': 'Müzik Kanalları',
            'Belgesel': 'Belgesel Kanalları',
            'Dini': 'Dini Kanallar',
            'Cocuk': 'Çocuk Kanalları',
            'Ekonomi': 'Ekonomi Kanalları',
            'Yurt Disi': 'Yurt Dışı Kanallar',
            'Radyo Canlı': 'Radyo Canlı'
        };
        sidebarCategoryTitle.textContent = categoryNames[currentCategory] || 'Kanallar';
        if (categorySelect) {
            categorySelect.style.display = 'block';
            categorySelect.value = currentCategory;
        }
    }
    
    channelsSidebarList.innerHTML = '';
    
    if (filteredChannels.length === 0) {
        channelsSidebarList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>Kanal bulunamadı</p>
            </div>
        `;
        return;
    }
    
    filteredChannels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-sidebar-item';
        if (currentChannel && currentChannel.id === channel.id) {
            channelItem.classList.add('active');
        }
        
        const isFavorite = favoriteChannels.includes(channel.id);
        
        channelItem.innerHTML = `
            <div class="channel-sidebar-content">
                ${channel.tvgLogo 
                    ? `<img src="${channel.tvgLogo}" alt="${channel.name}" class="channel-sidebar-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="channel-sidebar-logo-placeholder" style="display: none;">📺</div>`
                    : `<div class="channel-sidebar-logo-placeholder">📺</div>`
                }
                <div class="channel-sidebar-info">
                    <div class="channel-sidebar-name">${channel.name}</div>
                    <div class="channel-sidebar-category">${channel.category}</div>
                </div>
            </div>
            <button class="favorite-sidebar-btn" data-channel-id="${channel.id}" title="${isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}">
                ${isFavorite ? '⭐' : '☆'}
            </button>
        `;
        
        channelItem.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-sidebar-btn') || e.target.closest('.favorite-sidebar-btn')) {
                e.stopPropagation();
                const btn = e.target.closest('.favorite-sidebar-btn');
                const channelId = parseInt(btn.dataset.channelId);
                toggleFavorite(channelId);
                renderSidebarChannels();
            } else {
                playChannel(channel);
            }
        });
        
        channelsSidebarList.appendChild(channelItem);
    });
}

// Play Channel
function playChannel(channel) {
    if (!channel || !channel.url) {
        showError('Geçersiz kanal bilgisi.');
        return;
    }
    
    currentChannel = channel;
    
    // Update active channel in sidebar
    document.querySelectorAll('.channel-sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = Array.from(channelsSidebarList.children).find(item => {
        const btn = item.querySelector('.favorite-sidebar-btn');
        return btn && parseInt(btn.dataset.channelId) === channel.id;
    });
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // Show loading
    videoPlaceholderPlayer.style.display = 'flex';
    loadingPlayer.classList.add('active');
    
    // Stop previous playback
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.load();
    
    if (videoPlayer.hls) {
        videoPlayer.hls.destroy();
        videoPlayer.hls = null;
    }
    
    iframePlayer.src = '';
    iframePlayer.style.display = 'none';
    
    // Play video
    if (channel.url.includes('.m3u8')) {
        playM3U8(channel.url);
    } else if (channel.url.includes('youtube.com') || channel.url.includes('youtu.be')) {
        // YouTube linklerini embed formatına çevir
        const youtubeUrl = convertYouTubeToEmbed(channel.url);
        playIframe(youtubeUrl);
    } else {
        playIframe(channel.url);
    }
}

// Play M3U8
function playM3U8(url) {
    videoPlayer.style.display = 'block';
    iframePlayer.style.display = 'none';
    
    if (typeof Hls === 'undefined') {
        showError('HLS.js yüklenemedi. Lütfen sayfayı yenileyin.');
        loadingPlayer.classList.remove('active');
        return;
    }
    
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
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            manifestParsed = true;
            if (timeout) clearTimeout(timeout);
            videoPlayer.play().catch(err => {
                console.error('Playback error:', err);
                loadingPlayer.classList.remove('active');
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
            loadingPlayer.classList.remove('active');
            videoPlaceholderPlayer.style.display = 'none';
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        try {
                            hls.startLoad();
                        } catch(e) {
                            loadingPlayer.classList.remove('active');
                            hls.destroy();
                            showError('Ağ hatası. İnternet bağlantınızı kontrol edin.');
                        }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        try {
                            hls.recoverMediaError();
                        } catch(e) {
                            loadingPlayer.classList.remove('active');
                            hls.destroy();
                            showError('Video çözümlenemedi. Lütfen başka bir kanal deneyin.');
                        }
                        break;
                    default:
                        if (timeout) clearTimeout(timeout);
                        loadingPlayer.classList.remove('active');
                        hls.destroy();
                        showError('Kanal yüklenemedi. Lütfen başka bir kanal deneyin.');
                        break;
                }
            }
        });
        
        timeout = setTimeout(() => {
            if (!manifestParsed) {
                loadingPlayer.classList.remove('active');
                hls.destroy();
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
            }
        }, 15000);
        
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = url;
        const playPromise = videoPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                loadingPlayer.classList.remove('active');
                videoPlaceholderPlayer.style.display = 'none';
            }).catch(err => {
                console.error('Playback error:', err);
                loadingPlayer.classList.remove('active');
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
        }
        
        const safariTimeout = setTimeout(() => {
            if (videoPlayer.readyState === 0) {
                loadingPlayer.classList.remove('active');
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
            }
        }, 15000);
        
        videoPlayer.addEventListener('loadeddata', () => {
            clearTimeout(safariTimeout);
        }, { once: true });
    } else {
        loadingPlayer.classList.remove('active');
        showError('Tarayıcınız bu video formatını desteklemiyor.');
    }
}

// Convert YouTube URL to embed format
function convertYouTubeToEmbed(url) {
    let videoId = '';
    
    // YouTube URL formatlarını kontrol et
    if (url.includes('youtube.com/watch?v=')) {
        const match = url.match(/[?&]v=([^&]+)/);
        if (match) {
            videoId = match[1];
        }
    } else if (url.includes('youtu.be/')) {
        const match = url.match(/youtu\.be\/([^?&]+)/);
        if (match) {
            videoId = match[1];
        }
    } else if (url.includes('youtube.com/embed/')) {
        // Zaten embed formatında
        return url;
    }
    
    if (videoId) {
        // URL parametrelerini temizle (list, start_radio vb.)
        videoId = videoId.split('&')[0].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    
    return url;
}

// Play Iframe
function playIframe(url) {
    videoPlayer.style.display = 'none';
    iframePlayer.style.display = 'block';
    iframePlayer.src = url;
    loadingPlayer.classList.remove('active');
    videoPlaceholderPlayer.style.display = 'none';
}

// Toggle Picture-in-Picture
async function togglePictureInPicture() {
    try {
        if (!document.pictureInPictureEnabled) {
            showError('Pencere içinde pencere modu bu tarayıcıda desteklenmiyor.');
            return;
        }

        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            if (videoPlayer.readyState >= 2) {
                await videoPlayer.requestPictureInPicture();
            } else {
                showError('Video henüz yüklenmedi. Lütfen bekleyin.');
            }
        }
    } catch (error) {
        console.error('PiP hatası:', error);
        if (error.name === 'NotAllowedError') {
            showError('Pencere içinde pencere modu için izin verilmedi.');
        } else if (error.name === 'InvalidStateError') {
            showError('Video oynatılamıyor. Lütfen başka bir kanal deneyin.');
        } else {
            showError('Pencere içinde pencere modu açılamadı.');
        }
    }
}

// Toggle Favorite
function toggleFavorite(channelId) {
    const index = favoriteChannels.indexOf(channelId);
    if (index > -1) {
        favoriteChannels.splice(index, 1);
    } else {
        favoriteChannels.push(channelId);
    }
    localStorage.setItem('favoriteChannels', JSON.stringify(favoriteChannels));
}

// Show Error
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--danger);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        font-size: 0.9375rem;
        max-width: 400px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, 5000);
}

