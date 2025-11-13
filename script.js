// Global Variables
let channels = [];
let currentCategory = 'all';
let currentChannel = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const categoryCards = document.querySelectorAll('.category-card');
const channelsGrid = document.getElementById('channelsGrid');
const categoryTitle = document.getElementById('categoryTitle');
const channelCount = document.getElementById('channelCount');
const videoModal = document.getElementById('videoModal');
const closeModal = document.getElementById('closeModal');
const videoPlayer = document.getElementById('videoPlayer');
const iframePlayer = document.getElementById('iframePlayer');
const videoContainer = document.getElementById('videoContainer');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const loading = document.getElementById('loading');
const currentChannelName = document.getElementById('currentChannelName');
const currentChannelCategory = document.getElementById('currentChannelCategory');
const pipBtn = document.getElementById('pipBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadChannelsFromM3U();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        handleSearch({ target: searchInput });
    });

    // Category selection
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            selectCategory(category);
        });
    });

    // Close modal
    closeModal.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Picture-in-Picture
    if (pipBtn) {
        // Check if PiP is supported
        if (document.pictureInPictureEnabled && videoPlayer.disablePictureInPicture !== true) {
            pipBtn.style.display = 'flex';
            pipBtn.addEventListener('click', togglePictureInPicture);
            
            // Update button state when PiP changes
            videoPlayer.addEventListener('enterpictureinpicture', () => {
                pipBtn.classList.add('active');
                pipBtn.title = 'Pencere İçinde Pencere Modundan Çık';
            });
            
            videoPlayer.addEventListener('leavepictureinpicture', () => {
                pipBtn.classList.remove('active');
                pipBtn.title = 'Pencere İçinde Pencere';
            });
        } else {
            pipBtn.style.display = 'none';
        }
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeVideoModal();
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
            
            // Parse EXTINF line
            if (line.startsWith('#EXTINF:')) {
                const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
                const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
                const groupTitleMatch = line.match(/group-title="([^"]*)"/);
                
                // Get channel name (after comma)
                const channelNameMatch = line.match(/,(.*)$/);
                let channelName = channelNameMatch ? channelNameMatch[1].trim() : '';
                
                // Get category from group-title
                const groupTitle = groupTitleMatch ? groupTitleMatch[1].trim() : 'Diğer';
                
                // Clean category name (remove " - Yurt Disi" etc.)
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
            // URL line
            else if ((line.startsWith('http://') || line.startsWith('https://')) && currentChannel) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = null;
            }
        }
        
        console.log(`✅ ${channels.length} kanal yüklendi!`);
        renderChannels();
        
        // Set first category as active
        if (categoryCards.length > 0) {
            categoryCards[0].classList.add('active');
        }
    } catch (error) {
        console.error('M3U dosyası yüklenemedi:', error);
        showError('Kanal listesi yüklenemedi. Lütfen sayfayı yenileyin.');
    }
}

// Select Category
function selectCategory(category) {
    currentCategory = category;
    
    // Update active category
    categoryCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.category === category) {
            card.classList.add('active');
        }
    });
    
    // Clear search
    searchInput.value = '';
    clearSearch.style.display = 'none';
    
    // Render channels
    renderChannels();
}

// Render Channels
function renderChannels() {
    let filteredChannels = channels;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredChannels = channels.filter(ch => ch.category === currentCategory);
    }
    
    // Filter by search
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredChannels = filteredChannels.filter(ch => 
            ch.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Update title and count
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
        'Yurt Disi': 'Yurt Dışı Kanallar'
    };
    
    categoryTitle.textContent = searchTerm 
        ? `Arama: "${searchTerm}"` 
        : (categoryNames[currentCategory] || 'Kanallar');
    channelCount.textContent = `${filteredChannels.length} kanal`;
    
    // Clear grid
    channelsGrid.innerHTML = '';
    
    if (filteredChannels.length === 0) {
        channelsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <p>Kanal bulunamadı</p>
            </div>
        `;
        return;
    }
    
    // Render channel cards
    filteredChannels.forEach(channel => {
        const channelCard = document.createElement('div');
        channelCard.className = 'channel-card';
        channelCard.innerHTML = `
            ${channel.tvgLogo 
                ? `<img src="${channel.tvgLogo}" alt="${channel.name}" class="channel-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                 <div class="channel-logo-placeholder" style="display: none;">📺</div>`
                : `<div class="channel-logo-placeholder">📺</div>`
            }
            <div class="channel-name">${channel.name}</div>
            <div class="channel-category">${channel.category}</div>
        `;
        
        channelCard.addEventListener('click', () => {
            playChannel(channel);
        });
        
        channelsGrid.appendChild(channelCard);
    });
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm) {
        clearSearch.style.display = 'flex';
    } else {
        clearSearch.style.display = 'none';
    }
    
    renderChannels();
}

// Play Channel
function playChannel(channel) {
    if (!channel || !channel.url) {
        showError('Geçersiz kanal bilgisi.');
        return;
    }
    
    currentChannel = channel;
    
    // Update video info
    currentChannelName.textContent = channel.name;
    currentChannelCategory.textContent = channel.category;
    
    // Show modal
    videoModal.classList.add('active');
    videoPlaceholder.style.display = 'flex';
    loading.classList.add('active');
    
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
    } else {
        playIframe(channel.url);
    }
}

// Play M3U8
function playM3U8(url) {
    videoPlayer.style.display = 'block';
    iframePlayer.style.display = 'none';
    
    // Check HLS.js support
    if (typeof Hls === 'undefined') {
        showError('HLS.js yüklenemedi. Lütfen sayfayı yenileyin.');
        loading.classList.remove('active');
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
                loading.classList.remove('active');
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
            loading.classList.remove('active');
            videoPlaceholder.style.display = 'none';
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        try {
                            hls.startLoad();
                        } catch(e) {
                            loading.classList.remove('active');
                            hls.destroy();
                            showError('Ağ hatası. İnternet bağlantınızı kontrol edin.');
                        }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        try {
                            hls.recoverMediaError();
                        } catch(e) {
                            loading.classList.remove('active');
                            hls.destroy();
                            showError('Video çözümlenemedi. Lütfen başka bir kanal deneyin.');
                        }
                        break;
                    default:
                        if (timeout) clearTimeout(timeout);
                        loading.classList.remove('active');
                        hls.destroy();
                        showError('Kanal yüklenemedi. Lütfen başka bir kanal deneyin.');
                        break;
                }
            }
        });
        
        timeout = setTimeout(() => {
            if (!manifestParsed) {
                loading.classList.remove('active');
                hls.destroy();
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
            }
        }, 15000);
        
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        videoPlayer.src = url;
        const playPromise = videoPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                loading.classList.remove('active');
                videoPlaceholder.style.display = 'none';
            }).catch(err => {
                console.error('Playback error:', err);
                loading.classList.remove('active');
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
        }
        
        const safariTimeout = setTimeout(() => {
            if (videoPlayer.readyState === 0) {
                loading.classList.remove('active');
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
            }
        }, 15000);
        
        videoPlayer.addEventListener('loadeddata', () => {
            clearTimeout(safariTimeout);
        }, { once: true });
    } else {
        loading.classList.remove('active');
        showError('Tarayıcınız bu video formatını desteklemiyor.');
    }
}

// Play Iframe
function playIframe(url) {
    videoPlayer.style.display = 'none';
    iframePlayer.style.display = 'block';
    iframePlayer.src = url;
    loading.classList.remove('active');
    videoPlaceholder.style.display = 'none';
}

// Toggle Picture-in-Picture
async function togglePictureInPicture() {
    try {
        if (!document.pictureInPictureEnabled) {
            showError('Pencere içinde pencere modu bu tarayıcıda desteklenmiyor.');
            return;
        }

        if (document.pictureInPictureElement) {
            // Exit PiP
            await document.exitPictureInPicture();
        } else {
            // Enter PiP
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

// Close Video Modal
function closeVideoModal() {
    // Exit PiP if active
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
    }
    
    videoModal.classList.remove('active');
    
    // Stop playback
    videoPlayer.pause();
    videoPlayer.src = '';
    videoPlayer.load();
    
    if (videoPlayer.hls) {
        videoPlayer.hls.destroy();
        videoPlayer.hls = null;
    }
    
    iframePlayer.src = '';
    iframePlayer.style.display = 'none';
    
    videoPlaceholder.style.display = 'flex';
    loading.classList.remove('active');
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
