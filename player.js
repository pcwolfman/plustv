// Global Variables
let channels = [];
let currentChannel = null;
let currentCategory = 'all';
let favoriteChannels = JSON.parse(localStorage.getItem('favoriteChannels') || '[]');
let activeTab = 'channels';
let activeTimeouts = []; // Track all timeouts for cleanup
let hlsInstance = null; // Track HLS instance
let allCategories = new Set(); // Tüm kategorileri tutmak için
const m3uFiles = ['tv.m3u', 'tr.m3u']; // Yüklenecek M3U dosyaları

// Kategori eşleştirme (eski -> yeni)
const categoryMapping = {
    'Eglence': 'Eğlence',
    'Muzik': 'Müzik',
    'Cocuk': 'Çocuk',
    'Yurt Disi': 'Yurt Dışı'
};

// Kategoriyi normalize et
function normalizeCategory(category) {
    if (categoryMapping[category]) {
        return categoryMapping[category];
    }
    return category;
}

// Uygulama içinde olup olmadığını kontrol et
function isInApp() {
    // iOS Safari standalone mode
    if (window.navigator.standalone === true) {
        return true;
    }
    
    // PWA standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }
    
    // Fullscreen mode
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
        return true;
    }
    
    // Android app
    if (document.referrer.includes('android-app://')) {
        return true;
    }
    
    // File protocol
    if (window.location.protocol === 'file:') {
        return true;
    }
    
    // No browser UI (window dimensions check)
    const heightDiff = window.outerHeight - window.innerHeight;
    const widthDiff = window.outerWidth - window.innerWidth;
    if (heightDiff < 5 && widthDiff < 5 && heightDiff >= 0 && widthDiff >= 0) {
        return true;
    }
    
    // User agent check for mobile apps
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua) && !/chrome/i.test(ua) && !/firefox/i.test(ua)) {
        return true;
    }
    
    return false;
}

// Video player controls'u ayarla
function setupVideoControls() {
    if (!videoPlayer) return;
    
    const inApp = isInApp();
    console.log('Uygulama içinde mi?', inApp);
    
    if (inApp) {
        // Uygulama içinde: controls'u tamamen kapat
        videoPlayer.controls = false;
        videoPlayer.removeAttribute('controls');
        // Data attribute ile işaretle
        videoPlayer.setAttribute('data-in-app', 'true');
        // Native controls'u tamamen devre dışı bırak
        videoPlayer.setAttribute('controlsList', 'nodownload noplaybackrate nofullscreen noremoteplayback');
        // CSS ile de gizle
        videoPlayer.classList.add('no-controls');
        console.log('Video controls kapatıldı (uygulama modu)');
    } else {
        // Normal tarayıcı: controls göster
        videoPlayer.controls = true;
        videoPlayer.removeAttribute('controlsList');
        videoPlayer.removeAttribute('data-in-app');
        videoPlayer.classList.remove('no-controls');
        console.log('Video controls açıldı (tarayıcı modu)');
    }
}

// DOM Elements
const backBtn = document.getElementById('backBtn');
const sidebarCategoryTitle = document.getElementById('sidebarCategoryTitle');
const categoryCards = document.querySelectorAll('.category-card');
const channelsSidebarList = document.getElementById('channelsSidebarList');
const categorySidebarList = document.getElementById('categorySidebarList');
const tabButtons = document.querySelectorAll('.tab-btn');
const videoPlayer = document.getElementById('videoPlayer');
const iframePlayer = document.getElementById('iframePlayer');
const videoContainerPlayer = document.getElementById('videoContainerPlayer');
const videoPlaceholderPlayer = document.getElementById('videoPlaceholderPlayer');
const loadingPlayer = document.getElementById('loadingPlayer');

// Tesla Screen Detection & Orientation Handler
function detectTeslaScreen() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    
    // Tesla ekranları genellikle 17 inç, 1920x1200 veya benzeri
    const isTeslaScreen = (
        (width >= 1700 && width <= 2200 && height >= 900 && height <= 1300) ||
        (width >= 900 && width <= 1300 && height >= 1700 && height <= 2200)
    );
    
    if (isTeslaScreen) {
        document.documentElement.classList.add('tesla-screen');
        if (isLandscape) {
            document.documentElement.classList.add('tesla-landscape');
            document.documentElement.classList.remove('tesla-portrait');
        } else {
            document.documentElement.classList.add('tesla-portrait');
            document.documentElement.classList.remove('tesla-landscape');
        }
    } else {
        document.documentElement.classList.remove('tesla-screen', 'tesla-landscape', 'tesla-portrait');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'purple';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Video player controls ayarı
    setupVideoControls();
    
    // Detect Tesla screen and orientation
    detectTeslaScreen();
    
    // Listen for orientation changes
    window.addEventListener('resize', detectTeslaScreen);
    window.addEventListener('orientationchange', () => {
        setTimeout(detectTeslaScreen, 100);
    });
    
    if (screen.orientation) {
        screen.orientation.addEventListener('change', detectTeslaScreen);
    }
    
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
        renderCategorySidebar();
    });
    
    setupEventListeners();
});

// Cleanup function
function cleanup() {
    // Clear all timeouts
    activeTimeouts.forEach(timeout => {
        try {
            clearTimeout(timeout);
        } catch (e) {
            console.warn('Timeout cleanup error:', e);
        }
    });
    activeTimeouts = [];
    
    // Destroy HLS instance
    if (hlsInstance) {
        try {
            hlsInstance.destroy();
        } catch (e) {
            console.warn('HLS cleanup error:', e);
        }
        hlsInstance = null;
    }
    
    if (videoPlayer && videoPlayer.hls) {
        try {
            videoPlayer.hls.destroy();
            videoPlayer.hls = null;
        } catch (e) {
            console.warn('Video player HLS cleanup error:', e);
        }
    }
    
    // Stop video
    if (videoPlayer) {
        try {
            videoPlayer.pause();
            videoPlayer.src = '';
            videoPlayer.load();
        } catch (e) {
            console.warn('Video player cleanup error:', e);
        }
    }
    
    if (iframePlayer) {
        try {
            iframePlayer.src = '';
        } catch (e) {
            console.warn('Iframe cleanup error:', e);
        }
    }
    
    // Remove touch event handlers if they exist
    if (videoContainerPlayer && videoContainerPlayer._touchStartHandler) {
        try {
            videoContainerPlayer.removeEventListener('touchstart', videoContainerPlayer._touchStartHandler);
            videoContainerPlayer.removeEventListener('touchend', videoContainerPlayer._touchEndHandler);
            delete videoContainerPlayer._touchStartHandler;
            delete videoContainerPlayer._touchEndHandler;
        } catch (e) {
            console.warn('Touch handler cleanup error:', e);
        }
    }
}

// Safe timeout wrapper
function safeSetTimeout(callback, delay) {
    const timeout = setTimeout(() => {
        activeTimeouts = activeTimeouts.filter(t => t !== timeout);
        callback();
    }, delay);
    activeTimeouts.push(timeout);
    return timeout;
}

// Event Listeners
function setupEventListeners() {
    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
    
    // Back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            cleanup();
            window.location.href = 'index.html';
        });
    }
    
    // Tab switching
    if (tabButtons && tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                activeTab = btn.dataset.tab;
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderSidebarChannels();
            });
        });
    }
    
    // Category selection
    if (categoryCards && categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                currentCategory = category;
                
                // Update active state
                categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                renderSidebarChannels();
            });
        });
    }
    
    // Fullscreen on double click (desktop) - only add once
    if (videoContainerPlayer && !videoContainerPlayer.hasAttribute('data-dblclick-bound')) {
        videoContainerPlayer.setAttribute('data-dblclick-bound', 'true');
        videoContainerPlayer.addEventListener('dblclick', toggleFullscreen);
    }
    
    // Also allow double click on video/iframe (desktop)
    if (videoPlayer && !videoPlayer.hasAttribute('data-dblclick-bound')) {
        videoPlayer.setAttribute('data-dblclick-bound', 'true');
        videoPlayer.addEventListener('dblclick', toggleFullscreen);
    }
    
    if (iframePlayer && !iframePlayer.hasAttribute('data-dblclick-bound')) {
        iframePlayer.setAttribute('data-dblclick-bound', 'true');
        iframePlayer.addEventListener('dblclick', toggleFullscreen);
    }
    
    // Fullscreen on double tap (mobile/touch devices)
    if (videoContainerPlayer && !videoContainerPlayer.hasAttribute('data-touch-bound')) {
        videoContainerPlayer.setAttribute('data-touch-bound', 'true');
        setupDoubleTapFullscreen(videoContainerPlayer);
    }
    
    // Keyboard shortcuts - only add once
    if (!document.hasAttribute('data-keydown-bound')) {
        document.setAttribute('data-keydown-bound', 'true');
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                cleanup();
                window.location.href = 'index.html';
            }
        });
    }
}

// Load M3U file
async function loadChannelsFromM3U() {
    try {
        channels = [];
        allCategories.clear();
        let channelId = 1;
        
        // Tüm M3U dosyalarını yükle
        for (const m3uFile of m3uFiles) {
            try {
                const response = await fetch(m3uFile);
                if (!response.ok) {
                    console.warn(`⚠️ ${m3uFile} dosyası bulunamadı, atlanıyor...`);
                    continue;
                }
                const text = await response.text();
                const lines = text.split('\n');
                
                let currentChannel = null;
                let fileChannelCount = 0;
                
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
                        
                        // Normalize category
                        category = normalizeCategory(category);
                        
                        // Kategoriyi ekle
                        if (category) {
                            allCategories.add(category);
                        }
                        
                        currentChannel = {
                            id: channelId++,
                            name: channelName,
                            url: '',
                            category: category,
                            tvgId: tvgIdMatch ? tvgIdMatch[1] : '',
                            tvgLogo: tvgLogoMatch ? tvgLogoMatch[1] : ''
                        };
                    }
                    else if ((line.startsWith('http://') || line.startsWith('https://') || line.startsWith('www.')) && currentChannel) {
                        currentChannel.url = line;
                        channels.push(currentChannel);
                        fileChannelCount++;
                        currentChannel = null;
                    }
                }
                
                console.log(`✅ ${m3uFile}: ${fileChannelCount} kanal eklendi`);
            } catch (fileError) {
                console.warn(`⚠️ ${m3uFile} yüklenirken hata:`, fileError);
            }
        }
        
        console.log(`✅ Toplam ${channels.length} kanal yüklendi!`);
        console.log(`✅ ${allCategories.size} kategori bulundu:`, Array.from(allCategories).sort());
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
    } else {
        // Show channels from current category
        if (currentCategory === 'all') {
            filteredChannels = channels;
        } else {
            filteredChannels = channels.filter(ch => {
                const chCategory = normalizeCategory(ch.category);
                return chCategory === currentCategory;
            });
        }
        
        const categoryNames = {
            'all': 'Tüm Kanallar',
            'Ulusal': 'Ulusal Kanallar',
            'Haber': 'Haber Kanalları',
            'Spor': 'Spor Kanalları',
            'Eğlence': 'Eğlence Kanalları',
            'Müzik': 'Müzik Kanalları',
            'Belgesel': 'Belgesel Kanalları',
            'Dini': 'Dini Kanallar',
            'Çocuk': 'Çocuk Kanalları',
            'Ekonomi': 'Ekonomi Kanalları',
            'Yurt Dışı': 'Yurt Dışı Kanallar',
            'Radyo Canlı': 'Radyo Canlı'
        };
        sidebarCategoryTitle.textContent = categoryNames[currentCategory] || 'Kanallar';
        // Update active category
        if (categoryCards && categoryCards.length > 0) {
            categoryCards.forEach(card => {
                card.classList.remove('active');
                if (card.dataset.category === currentCategory) {
                    card.classList.add('active');
                }
            });
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
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    filteredChannels.forEach(channel => {
        const channelItem = document.createElement('div');
        channelItem.className = 'channel-sidebar-item';
        channelItem.dataset.channelId = channel.id;
        if (currentChannel && currentChannel.id === channel.id) {
            channelItem.classList.add('active');
        }
        
        const isFavorite = favoriteChannels.includes(channel.id);
        
        // Create structure with DOM methods (better performance than innerHTML)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'channel-sidebar-content';
        
        const logoContainer = document.createElement('div');
        logoContainer.className = 'channel-sidebar-logo-container';
        
        if (channel.tvgLogo) {
            const img = document.createElement('img');
            img.src = channel.tvgLogo;
            img.alt = channel.name;
            img.className = 'channel-sidebar-logo';
            img.loading = 'lazy'; // Lazy loading
            img.onerror = function() {
                this.style.display = 'none';
                if (this.nextElementSibling) {
                    this.nextElementSibling.style.display = 'flex';
                }
            };
            logoContainer.appendChild(img);
            
            const placeholder = document.createElement('div');
            placeholder.className = 'channel-sidebar-logo-placeholder';
            placeholder.style.display = 'none';
            placeholder.textContent = '📺';
            logoContainer.appendChild(placeholder);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'channel-sidebar-logo-placeholder';
            placeholder.textContent = '📺';
            logoContainer.appendChild(placeholder);
        }
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'channel-sidebar-info';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'channel-sidebar-name';
        nameDiv.textContent = channel.name;
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'channel-sidebar-category';
        categoryDiv.textContent = channel.category;
        
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(categoryDiv);
        
        contentDiv.appendChild(logoContainer);
        contentDiv.appendChild(infoDiv);
        
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-sidebar-btn';
        favoriteBtn.dataset.channelId = channel.id;
        favoriteBtn.title = isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle';
        favoriteBtn.textContent = isFavorite ? '⭐' : '☆';
        
        channelItem.appendChild(contentDiv);
        channelItem.appendChild(favoriteBtn);
        
        fragment.appendChild(channelItem);
    });
    
    channelsSidebarList.appendChild(fragment);
    
    // Use event delegation (better performance) - only add once
    if (channelsSidebarList && !channelsSidebarList.hasAttribute('data-delegated')) {
        channelsSidebarList.setAttribute('data-delegated', 'true');
        channelsSidebarList.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.favorite-sidebar-btn');
            if (favoriteBtn) {
                e.stopPropagation();
                const channelId = parseInt(favoriteBtn.dataset.channelId);
                toggleFavorite(channelId);
                // Use requestAnimationFrame to prevent render loops
                requestAnimationFrame(() => {
                    renderSidebarChannels();
                });
                return;
            }
            
            const channelItem = e.target.closest('.channel-sidebar-item');
            if (channelItem && channelItem.dataset.channelId) {
                const channelId = parseInt(channelItem.dataset.channelId);
                const channel = channels.find(ch => ch.id === channelId);
                if (channel) {
                    playChannel(channel);
                }
            }
        });
    }
}

// Render Category Sidebar
function renderCategorySidebar() {
    if (!categorySidebarList) return;
    
    const categories = ['all', 'Ulusal', 'Haber', 'Spor', 'Eğlence', 'Müzik', 'Belgesel', 'Dini', 'Çocuk', 'Ekonomi', 'Yurt Dışı', 'Radyo Canlı'];
    const categoryNames = {
        'all': 'Tümü',
        'Ulusal': 'Ulusal',
        'Haber': 'Haber',
        'Spor': 'Spor',
        'Eğlence': 'Eğlence',
        'Müzik': 'Müzik',
        'Belgesel': 'Belgesel',
        'Dini': 'Dini',
        'Çocuk': 'Çocuk',
        'Ekonomi': 'Ekonomi',
        'Yurt Dışı': 'Yurt Dışı',
        'Radyo Canlı': 'Radyo Canlı'
    };
    
    categorySidebarList.innerHTML = '';
    
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-sidebar-item';
        if (currentCategory === category) {
            categoryItem.classList.add('active');
        }
        
        categoryItem.innerHTML = `
            <div class="category-sidebar-name">${categoryNames[category]}</div>
        `;
        
        categoryItem.addEventListener('click', () => {
            currentCategory = category;
            renderSidebarChannels();
            renderCategorySidebar();
            
            // Update category cards
            if (categoryCards && categoryCards.length > 0) {
                categoryCards.forEach(card => {
                    card.classList.remove('active');
                    if (card.dataset.category === category) {
                        card.classList.add('active');
                    }
                });
            }
        });
        
        categorySidebarList.appendChild(categoryItem);
    });
}

// Play Channel
function playChannel(channel) {
    if (!channel || !channel.url) {
        showError('Geçersiz kanal bilgisi.');
        return;
    }
    
    currentChannel = channel;
    
    // Update document title and video title (hide URL)
    document.title = `${channel.name} - PlusTV`;
    if (videoPlayer) {
        videoPlayer.title = channel.name;
        // Controls'u tekrar ayarla (uygulama içinde olabilir)
        setupVideoControls();
    }
    
    // Update active channel in sidebar (optimized)
    const items = channelsSidebarList.querySelectorAll('.channel-sidebar-item');
    items.forEach(item => {
        if (parseInt(item.dataset.channelId) === channel.id) {
            item.classList.add('active');
            // Use requestAnimationFrame for smooth scrolling
            requestAnimationFrame(() => {
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        } else {
            item.classList.remove('active');
        }
    });
    
    // Cleanup previous playback
    cleanup();
    
    // Reset displays
    if (iframePlayer) {
        iframePlayer.style.display = 'none';
    }
    
    // Play video
    if (channel.url.includes('.m3u8')) {
        // M3U8 için loading göster
        videoPlaceholderPlayer.style.display = 'flex';
        loadingPlayer.classList.add('active');
        playM3U8(channel.url);
    } else if (channel.url.includes('youtube.com') || channel.url.includes('youtu.be')) {
        // YouTube linkleri için loading'i gösterme (iframe hızlı yüklenir)
        videoPlaceholderPlayer.style.display = 'none';
        loadingPlayer.classList.remove('active');
        // YouTube linklerini embed formatına çevir
        const youtubeUrl = convertYouTubeToEmbed(channel.url);
        playIframe(youtubeUrl);
    } else {
        // Diğer iframe linkleri için loading göster
        videoPlaceholderPlayer.style.display = 'flex';
        loadingPlayer.classList.add('active');
        playIframe(channel.url);
    }
}

// Play M3U8
function playM3U8(url) {
    videoPlayer.style.display = 'block';
    iframePlayer.style.display = 'none';
    if (currentChannel && videoPlayer) {
        videoPlayer.title = currentChannel.name;
    }
    
    // Video element'ini optimize et
    videoPlayer.preload = 'auto';
    videoPlayer.playsInline = true;
    
    // Controls'u ayarla (uygulama içinde olabilir)
    setupVideoControls();
    
    if (typeof Hls === 'undefined') {
        showError('HLS.js yüklenemedi. Lütfen sayfayı yenileyin.');
        loadingPlayer.classList.remove('active');
        return;
    }
    
    if (Hls.isSupported()) {
        // Cleanup previous HLS instance
        if (hlsInstance) {
            try {
                hlsInstance.destroy();
            } catch (e) {
                console.warn('Previous HLS cleanup error:', e);
            }
        }
        
        if (videoPlayer.hls) {
            try {
                videoPlayer.hls.destroy();
            } catch (e) {
                console.warn('Video player HLS cleanup error:', e);
            }
            videoPlayer.hls = null;
        }
        
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true, // Enable for faster loading
            debug: false,
            maxBufferLength: 10, // Reduced buffer for faster start
            maxMaxBufferLength: 20,
            maxBufferSize: 30 * 1000 * 1000, // 30MB max buffer (reduced for faster start)
            startLevel: -1, // Auto start level
            capLevelToPlayerSize: true, // Auto adjust quality
            startFragPrefetch: true, // Prefetch first fragment
            testBandwidth: false, // Disable bandwidth testing for faster start
            progressive: false, // Use HLS.js instead of native
            xhrSetup: function(xhr, url) {
                xhr.withCredentials = false;
                // Set timeout for faster failure detection
                xhr.timeout = 8000; // 8 seconds timeout
            }
        });
        
        hlsInstance = hls;
        videoPlayer.hls = hls;
        
        // VideoPlayer'ı temizle ve optimize et
        videoPlayer.src = '';
        videoPlayer.load();
        
        // HLS'yi yükle
        hls.loadSource(url);
        hls.attachMedia(videoPlayer);
        
        let manifestParsed = false;
        let timeout;
        
        // Loading'i daha erken kaldırmak için fragment loading event'lerini dinle
        let firstFragmentLoaded = false;
        hls.on(Hls.Events.FRAG_LOADED, () => {
            // İlk fragment yüklendiğinde loading'i kaldır
            if (!firstFragmentLoaded && loadingPlayer && loadingPlayer.classList.contains('active')) {
                firstFragmentLoaded = true;
                loadingPlayer.classList.remove('active');
                if (videoPlaceholderPlayer) videoPlaceholderPlayer.style.display = 'none';
            }
        });
        
        hls.on(Hls.Events.LEVEL_LOADED, () => {
            // Level yüklendiğinde de loading'i kaldır (fallback)
            if (loadingPlayer && loadingPlayer.classList.contains('active')) {
                loadingPlayer.classList.remove('active');
                if (videoPlaceholderPlayer) videoPlaceholderPlayer.style.display = 'none';
            }
        });
        
        // VideoPlayer'ın canplay event'ini dinle (daha erken loading kaldırma)
        const canPlayHandler = () => {
            if (loadingPlayer && loadingPlayer.classList.contains('active')) {
                loadingPlayer.classList.remove('active');
                if (videoPlaceholderPlayer) videoPlaceholderPlayer.style.display = 'none';
            }
            videoPlayer.removeEventListener('canplay', canPlayHandler);
        };
        videoPlayer.addEventListener('canplay', canPlayHandler);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            manifestParsed = true;
            if (timeout) {
                clearTimeout(timeout);
                activeTimeouts = activeTimeouts.filter(t => t !== timeout);
            }
            // Loading'i kaldır
            if (loadingPlayer) loadingPlayer.classList.remove('active');
            if (videoPlaceholderPlayer) videoPlaceholderPlayer.style.display = 'none';
            
            // Controls'u tekrar ayarla (video yüklendiğinde)
            setupVideoControls();
            
            videoPlayer.play().catch(err => {
                console.error('Playback error:', err);
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        try {
                            hls.startLoad();
                        } catch(e) {
                            if (loadingPlayer) loadingPlayer.classList.remove('active');
                            try {
                                hls.destroy();
                            } catch (destroyErr) {
                                console.warn('HLS destroy error:', destroyErr);
                            }
                            showError('Ağ hatası. İnternet bağlantınızı kontrol edin.');
                        }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        try {
                            hls.recoverMediaError();
                        } catch(e) {
                            if (loadingPlayer) loadingPlayer.classList.remove('active');
                            try {
                                hls.destroy();
                            } catch (destroyErr) {
                                console.warn('HLS destroy error:', destroyErr);
                            }
                            showError('Video çözümlenemedi. Lütfen başka bir kanal deneyin.');
                        }
                        break;
                    default:
                        if (timeout) {
                            clearTimeout(timeout);
                            activeTimeouts = activeTimeouts.filter(t => t !== timeout);
                        }
                        if (loadingPlayer) loadingPlayer.classList.remove('active');
                        try {
                            hls.destroy();
                        } catch (destroyErr) {
                            console.warn('HLS destroy error:', destroyErr);
                        }
                        showError('Kanal yüklenemedi. Lütfen başka bir kanal deneyin.');
                        break;
                }
            }
        });
        
        timeout = safeSetTimeout(() => {
            if (!manifestParsed) {
                if (loadingPlayer) loadingPlayer.classList.remove('active');
                try {
                    hls.destroy();
                } catch (destroyErr) {
                    console.warn('HLS destroy error:', destroyErr);
                }
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
            }
        }, 10000); // 10 saniye timeout (15'ten 10'a düşürüldü)
        
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        // Controls'u ayarla (Safari için)
        setupVideoControls();
        
        videoPlayer.src = url;
        
        // Safari için loading'i daha erken kaldırmak için canplay event'ini dinle
        const canPlayHandler = () => {
            if (loadingPlayer) loadingPlayer.classList.remove('active');
            if (videoPlaceholderPlayer) videoPlaceholderPlayer.style.display = 'none';
            // Controls'u tekrar ayarla
            setupVideoControls();
            videoPlayer.removeEventListener('canplay', canPlayHandler);
            if (safariTimeout) {
                clearTimeout(safariTimeout);
                activeTimeouts = activeTimeouts.filter(t => t !== safariTimeout);
            }
        };
        videoPlayer.addEventListener('canplay', canPlayHandler);
        
        const playPromise = videoPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Play başarılı olduğunda loading'i kaldır
                if (loadingPlayer) loadingPlayer.classList.remove('active');
                if (videoPlaceholderPlayer) videoPlaceholderPlayer.style.display = 'none';
            }).catch(err => {
                console.error('Playback error:', err);
                if (loadingPlayer) loadingPlayer.classList.remove('active');
                showError('Video oynatılamadı. Lütfen başka bir kanal deneyin.');
            });
        }
        
        const safariTimeout = safeSetTimeout(() => {
            if (videoPlayer.readyState === 0) {
                if (loadingPlayer) loadingPlayer.classList.remove('active');
                showError('Kanal yükleme zaman aşımı. Lütfen başka bir kanal deneyin.');
            }
        }, 10000); // 10 saniye timeout (15'ten 10'a düşürüldü)
        
        const loadedDataHandler = () => {
            if (safariTimeout) {
                clearTimeout(safariTimeout);
                activeTimeouts = activeTimeouts.filter(t => t !== safariTimeout);
            }
            videoPlayer.removeEventListener('loadeddata', loadedDataHandler);
        };
        videoPlayer.addEventListener('loadeddata', loadedDataHandler, { once: true });
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
        // YouTube embed URL'ini optimize et: autoplay, rel=0, modestbranding, controls=1
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&playsinline=1&enablejsapi=1`;
    }
    
    return url;
}

// Play Iframe
function playIframe(url) {
    videoPlayer.style.display = 'none';
    iframePlayer.style.display = 'block';
    iframePlayer.src = url;
    
    if (currentChannel && iframePlayer) {
        iframePlayer.title = currentChannel.name;
    }
    
    // YouTube olmayan linkler için load event'ini bekle
    if (!url.includes('youtube.com')) {
        iframePlayer.onload = () => {
            loadingPlayer.classList.remove('active');
            videoPlaceholderPlayer.style.display = 'none';
        };
    }
}

// Setup double tap for fullscreen (mobile)
function setupDoubleTapFullscreen(element) {
    if (!element) return;
    
    let lastTap = 0;
    let tapTimeout = null;
    let touchStartX = 0;
    let touchStartY = 0;
    
    const touchStartHandler = function(e) {
        // Store touch start position
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    };
    
    const touchEndHandler = function(e) {
        // Only handle single finger taps
        if (e.changedTouches.length !== 1) return;
        
        const touch = e.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        
        // Check if it's a tap (not a swipe) - movement should be less than 10px
        const deltaX = Math.abs(touchEndX - touchStartX);
        const deltaY = Math.abs(touchEndY - touchStartY);
        
        if (deltaX > 10 || deltaY > 10) {
            // It's a swipe, not a tap - ignore
            lastTap = 0;
            if (tapTimeout) {
                clearTimeout(tapTimeout);
                activeTimeouts = activeTimeouts.filter(t => t !== tapTimeout);
                tapTimeout = null;
            }
            return;
        }
        
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapTimeout) {
            clearTimeout(tapTimeout);
            activeTimeouts = activeTimeouts.filter(t => t !== tapTimeout);
            tapTimeout = null;
        }
        
        if (tapLength < 400 && tapLength > 0) {
            // Double tap detected
            e.preventDefault();
            e.stopPropagation();
            toggleFullscreen();
            lastTap = 0; // Reset to prevent triple tap
        } else {
            // Single tap - wait to see if there's another tap
            tapTimeout = safeSetTimeout(() => {
                // Single tap confirmed, do nothing
                tapTimeout = null;
            }, 400);
        }
        
        lastTap = currentTime;
    };
    
    element.addEventListener('touchstart', touchStartHandler, { passive: true });
    element.addEventListener('touchend', touchEndHandler, { passive: false });
    
    // Store handlers for potential cleanup
    element._touchStartHandler = touchStartHandler;
    element._touchEndHandler = touchEndHandler;
}

// Toggle Fullscreen
function toggleFullscreen() {
    const container = videoContainerPlayer;
    
    try {
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
            // Enter fullscreen
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    } catch (error) {
        console.error('Tam ekran hatası:', error);
        showError('Tam ekran modu açılamadı.');
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
    
    // Zaman aşımı mesajları 2 saniye, diğerleri 5 saniye sonra kaybolsun
    const timeoutDuration = message.includes('zaman aşımı') ? 2000 : 5000;
    
    const fadeTimeout = safeSetTimeout(() => {
        errorDiv.style.opacity = '0';
        errorDiv.style.transition = 'opacity 0.3s ease';
        const removeTimeout = safeSetTimeout(() => {
            errorDiv.remove();
        }, 300);
    }, timeoutDuration);
}

