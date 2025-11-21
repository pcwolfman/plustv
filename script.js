// Global Variables
let channels = [];
let currentCategory = 'all';
let currentView = localStorage.getItem('channelView') || 'list'; // 'large', 'small', 'list'
let allCategories = new Set(); // Tüm kategorileri tutmak için
const m3uFiles = ['tv.m3u', 'tr.m3u']; // Yüklenecek M3U dosyaları

// DOM Elements
let searchInput;
let clearSearch;
let categoryCards;
let channelsGrid;
let categoryTitle;
let channelCount;
let viewMenuBtn;
let viewIcon;
let zoomToggleBtn;
let appContainer;

// Zoom state
let zoomLevel = 1.0; // 1.0 = normal, 0.9 = %90, 0.85 = %85, 0.8 = %80

// Tesla Screen Detection & Orientation Handler
function detectTeslaScreen() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    
    // Tesla ekranları genellikle 17 inç, 1920x1200 veya benzeri
    // Tesla Model S/X: ~1920x1080 veya 1920x1200
    // Tesla Model 3/Y: ~1920x1200
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
    applyTheme(savedTheme);
    
    // Detect Tesla screen and orientation
    detectTeslaScreen();
    
    // Optimized resize handler with debounce
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            detectTeslaScreen();
        }, 50); // Reduced from immediate to 50ms for better performance
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Orientation change handler
    const handleOrientationChange = () => {
        clearTimeout(resizeTimeout);
        // Immediate update for orientation changes
        setTimeout(detectTeslaScreen, 50);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Also use screen.orientation API if available
    if (screen.orientation) {
        screen.orientation.addEventListener('change', handleOrientationChange);
    }
    
    loadChannelsFromM3U();
    setupEventListeners();
});

// Zoom Functions
function loadZoomLevel() {
    try {
        const stored = localStorage.getItem('plusTv_zoomLevel');
        return stored ? parseFloat(stored) : 1.0;
    } catch (e) {
        return 1.0;
    }
}

function saveZoomLevel() {
    try {
        localStorage.setItem('plusTv_zoomLevel', zoomLevel.toString());
        // Storage event'i tetikle (diğer sayfalar için)
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'plusTv_zoomLevel',
            newValue: zoomLevel.toString(),
            oldValue: localStorage.getItem('plusTv_zoomLevel')
        }));
    } catch (e) {
        console.warn('Could not save zoom level:', e);
    }
}

function applyZoom() {
    if (appContainer) {
        appContainer.style.transform = `scale(${zoomLevel})`;
        appContainer.style.transformOrigin = 'top left';
        // Adjust container width to prevent horizontal scroll
        const scalePercent = (1 / zoomLevel) * 100;
        appContainer.style.width = `${scalePercent}%`;
        appContainer.style.height = `${scalePercent}%`;
    }
}

function toggleZoom() {
    // Zoom levels: 1.0 (100%) -> 0.9 (90%) -> 0.85 (85%) -> 0.8 (80%) -> 1.0 (100%)
    const zoomLevels = [1.0, 0.9, 0.85, 0.8];
    const currentIndex = zoomLevels.findIndex(level => Math.abs(level - zoomLevel) < 0.01);
    const nextIndex = (currentIndex + 1) % zoomLevels.length;
    
    zoomLevel = zoomLevels[nextIndex];
    saveZoomLevel();
    applyZoom();
    updateZoomIcon();
}

function updateZoomIcon() {
    if (!zoomToggleBtn) return;
    
    const fullscreenIcon = zoomToggleBtn.querySelector('.fullscreen-icon');
    const fullscreenExitIcon = zoomToggleBtn.querySelector('.fullscreen-exit-icon');
    
    if (fullscreenIcon && fullscreenExitIcon) {
        if (zoomLevel < 1.0) {
            fullscreenIcon.style.display = 'none';
            fullscreenExitIcon.style.display = 'block';
            zoomToggleBtn.title = `Tam ekran (${Math.round(zoomLevel * 100)}%)`;
        } else {
            fullscreenIcon.style.display = 'block';
            fullscreenExitIcon.style.display = 'none';
            zoomToggleBtn.title = 'Tam ekran';
        }
    }
}

function setupResponsiveZoom() {
    // Ekran boyutuna göre otomatik zoom ayarlama
    function adjustZoomForScreen() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Küçük ekranlar için otomatik zoom
        if (width < 768) {
            // Mobil cihazlar için zoom seviyesini kontrol et
            // Eğer kullanıcı manuel zoom yapmışsa, onu koru
            const savedZoom = loadZoomLevel();
            if (savedZoom === 1.0) {
                // Kullanıcı zoom yapmamışsa, küçük ekranlar için otomatik küçült
                const autoZoom = Math.min(0.9, Math.max(0.8, width / 800));
                if (Math.abs(autoZoom - zoomLevel) > 0.05) {
                    zoomLevel = autoZoom;
                    applyZoom();
                    updateZoomIcon();
                }
            }
        } else if (width >= 768 && width < 1024) {
            // Tablet için
            const savedZoom = loadZoomLevel();
            if (savedZoom === 1.0) {
                const autoZoom = Math.min(0.95, Math.max(0.85, width / 1000));
                if (Math.abs(autoZoom - zoomLevel) > 0.05) {
                    zoomLevel = autoZoom;
                    applyZoom();
                    updateZoomIcon();
                }
            }
        }
    }
    
    // İlk yüklemede ve ekran boyutu değiştiğinde ayarla
    adjustZoomForScreen();
    
    // Optimized resize handler
    let zoomResizeTimeout;
    const handleZoomResize = () => {
        clearTimeout(zoomResizeTimeout);
        zoomResizeTimeout = setTimeout(adjustZoomForScreen, 100); // Reduced from 250ms to 100ms
    };
    
    window.addEventListener('resize', handleZoomResize, { passive: true });
    
    // Orientation change'de de ayarla
    window.addEventListener('orientationchange', () => {
        clearTimeout(zoomResizeTimeout);
        setTimeout(adjustZoomForScreen, 50); // Reduced from 100ms to 50ms
    }, { passive: true });
}

function setupZoomSync() {
    // Storage event listener: diğer sayfalardaki zoom değişikliklerini dinle
    window.addEventListener('storage', (e) => {
        if (e.key === 'plusTv_zoomLevel' && e.newValue) {
            const newZoom = parseFloat(e.newValue);
            if (newZoom !== zoomLevel) {
                zoomLevel = newZoom;
                applyZoom();
                updateZoomIcon();
            }
        }
    });
    
    // Sayfa görünür olduğunda zoom seviyesini kontrol et
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            const savedZoom = loadZoomLevel();
            if (Math.abs(savedZoom - zoomLevel) > 0.01) {
                zoomLevel = savedZoom;
                applyZoom();
                updateZoomIcon();
            }
        }
    });
    
    // Focus olduğunda da kontrol et
    window.addEventListener('focus', () => {
        const savedZoom = loadZoomLevel();
        if (Math.abs(savedZoom - zoomLevel) > 0.01) {
            zoomLevel = savedZoom;
            applyZoom();
            updateZoomIcon();
        }
    });
}

// Event Listeners
function setupEventListeners() {
    // Get DOM elements
    searchInput = document.getElementById('searchInput');
    clearSearch = document.getElementById('clearSearch');
    categoryCards = document.querySelectorAll('.category-card');
    channelsGrid = document.getElementById('channelsGrid');
    categoryTitle = document.getElementById('categoryTitle');
    channelCount = document.getElementById('channelCount');
    viewMenuBtn = document.getElementById('viewMenuBtn');
    viewIcon = document.getElementById('viewIcon');
    zoomToggleBtn = document.getElementById('zoomToggleBtn');
    appContainer = document.querySelector('.app-container');
    
    // Search
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.style.display = 'none';
            handleSearch({ target: searchInput });
        });
    }

    // Category selection - setupCategoryEventListeners() tarafından yapılıyor

    // View toggle - cycle through views
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', () => {
            // Cycle: list -> large -> small -> list
            const views = ['list', 'large', 'small'];
            const currentIndex = views.indexOf(currentView);
            const nextIndex = (currentIndex + 1) % views.length;
            changeView(views[nextIndex]);
        });
    }
    
    // Color picker
    const colorPickerBtns = document.querySelectorAll('.color-picker-btn');
    colorPickerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            applyTheme(color);
            localStorage.setItem('theme', color);
        });
    });
    
    // Zoom toggle
    if (zoomToggleBtn) {
        zoomToggleBtn.addEventListener('click', () => {
            toggleZoom();
        });
        
        // Load and apply saved zoom level
        zoomLevel = loadZoomLevel();
        applyZoom();
        updateZoomIcon();
        
        // Responsive zoom: ekran boyutuna göre otomatik ayarla
        setupResponsiveZoom();
        
        // Storage event listener: diğer sayfalardaki zoom değişikliklerini dinle
        setupZoomSync();
    }
    
    // Initialize view
    changeView(currentView, false);
    
    // Event delegation for channel cards (better performance)
    if (channelsGrid) {
        channelsGrid.addEventListener('click', (e) => {
            const channelCard = e.target.closest('.channel-card');
            if (channelCard && channelCard.dataset.channelId) {
                const channelId = channelCard.dataset.channelId;
                // Zoom seviyesini kaydet (player sayfasına geçmeden önce)
                saveZoomLevel();
                window.location.href = `player.html?id=${channelId}&category=${encodeURIComponent(currentCategory)}`;
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
                    
                    // Parse EXTINF line
                    if (line.startsWith('#EXTINF:')) {
                        const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
                        const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
                        const groupTitleMatch = line.match(/group-title="([^"]*)"/);
                        
                        // Get channel name (after comma)
                        const channelNameMatch = line.match(/,(.*)$/);
                        let channelName = channelNameMatch ? channelNameMatch[1].trim() : '';
                        
                        // Get category from group-title
                        let groupTitle = groupTitleMatch ? groupTitleMatch[1].trim() : 'Diğer';
                        
                        // Clean category name (remove " - Yurt Disi" etc.)
                        let category = groupTitle.split(' - ')[0].trim();
                        
                        // Eğer kategori boşsa veya geçersizse "Diğer" yap
                        if (!category || category === '' || category === 'undefined') {
                            category = 'Diğer';
                        }
                        
                        // Normalize category (normalizeCategory fonksiyonu kullan - büyük/küçük harf duyarsız)
                        category = normalizeCategory(category);
                        
                        // Tüm kategorileri ekle (normalize edilmiş haliyle - çiftlemeyi önlemek için)
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
                    // URL line
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
        
        // Dinamik kategori kartlarını oluştur
        renderDynamicCategories();
        
        // Event listener'ları yeniden bağla
        setupCategoryEventListeners();
        
        renderChannels();
        
        // Set first category as active
        const firstCategoryCard = document.querySelector('.category-card[data-category="all"]');
        if (firstCategoryCard) {
            firstCategoryCard.classList.add('active');
        }
    } catch (error) {
        console.error('M3U dosyası yüklenemedi:', error);
        showError('Kanal listesi yüklenemedi. Lütfen sayfayı yenileyin.');
    }
}

// Kategori ikonları mapping
const categoryIcons = {
    'all': '📺',
    'Ulusal': '📡',
    'Haber': '📰',
    'Spor': '⚽',
    'Eglence': '🎭',
    'Eğlence': '🎭',
    'Muzik': '🎵',
    'Müzik': '🎵',
    'Belgesel': '🎬',
    'Dini': '🕌',
    'Cocuk': '👶',
    'Çocuk': '👶',
    'Ekonomi': '💰',
    'Yurt Disi': '🌍',
    'Yurt Dışı': '🌍',
    'Radyo Canlı': '📻',
    'Radyo': '📻',
    'Diğer': '📺'
};

// Sabit kategori listesi (player.html ile aynı)
const STANDARD_CATEGORIES = [
    { id: 'all', name: 'Tümü', icon: '📺' },
    { id: 'Ulusal', name: 'Ulusal', icon: '📡' },
    { id: 'Haber', name: 'Haber', icon: '📰' },
    { id: 'Spor', name: 'Spor', icon: '⚽' },
    { id: 'Eğlence', name: 'Eğlence', icon: '🎭' },
    { id: 'Müzik', name: 'Müzik', icon: '🎵' },
    { id: 'Belgesel', name: 'Belgesel', icon: '🎬' },
    { id: 'Dini', name: 'Dini', icon: '🕌' },
    { id: 'Çocuk', name: 'Çocuk', icon: '👶' },
    { id: 'Ekonomi', name: 'Ekonomi', icon: '💰' },
    { id: 'Yurt Dışı', name: 'Yurt Dışı', icon: '🌍' },
    { id: 'Radyo Canlı', name: 'Radyo Canlı', icon: '📻' }
];

// Kategori eşleştirme (eski -> yeni)
const categoryMapping = {
    'Eglence': 'Eğlence',
    'Muzik': 'Müzik',
    'Cocuk': 'Çocuk',
    'Yurt Disi': 'Yurt Dışı'
};

// Dinamik kategori kartlarını oluştur
function renderDynamicCategories() {
    const categoriesContainer = document.querySelector('.categories-container');
    if (!categoriesContainer) return;
    
    // Mevcut kartları temizle (Tümü hariç)
    const existingCards = categoriesContainer.querySelectorAll('.category-card:not([data-category="all"])');
    existingCards.forEach(card => card.remove());
    
    // Önce standart kategorileri göster (Tümü hariç - zaten HTML'de var)
    const displayedCategories = new Set();
    
    STANDARD_CATEGORIES.forEach(cat => {
        // "Tümü" kategorisini atla (HTML'de zaten var)
        if (cat.id === 'all') {
            return;
        }
        
        // Kategoride kanal var mı kontrol et
        // Kanal kategorileri zaten normalize edilmiş olarak saklanıyor
        const hasChannels = channels.some(ch => {
            const chCategory = normalizeCategory(ch.category);
            return chCategory === cat.id;
        });
        
        // Eğer kanal varsa göster
        if (hasChannels) {
            displayedCategories.add(cat.id);
            
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.dataset.category = cat.id;
            
            const icon = document.createElement('div');
            icon.className = 'category-icon';
            icon.textContent = cat.icon;
            
            const name = document.createElement('div');
            name.className = 'category-name';
            name.textContent = cat.name;
            
            categoryCard.appendChild(icon);
            categoryCard.appendChild(name);
            
            categoriesContainer.appendChild(categoryCard);
        }
    });
    
    // Sonra M3U'da bulunan ama STANDARD_CATEGORIES'de olmayan kategorileri ekle
    // allCategories zaten normalize edilmiş kategorileri içeriyor, ama yine de normalize edelim (güvenli olması için)
    // Çiftlemeyi önlemek için Set kullan
    const uniqueCategories = new Set();
    
    allCategories.forEach(category => {
        // Normalize et (büyük/küçük harf duyarsız)
        const normalized = normalizeCategory(category);
        
        // Zaten gösterilmiş kategorileri atla
        if (displayedCategories.has(normalized)) {
            return;
        }
        
        // "Tümü" kategorisini atla
        if (normalized === 'all') {
            return;
        }
        
        // Çiftlemeyi önle
        if (uniqueCategories.has(normalized)) {
            return;
        }
        uniqueCategories.add(normalized);
        
        // Kategoride kanal var mı kontrol et
        // Kanal kategorileri zaten normalize edilmiş olarak saklanıyor
        const hasChannels = channels.some(ch => {
            const chCategory = normalizeCategory(ch.category);
            return chCategory === normalized;
        });
        
        // Eğer kanal varsa göster
        if (hasChannels) {
            displayedCategories.add(normalized);
            
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.dataset.category = normalized;
            
            const icon = document.createElement('div');
            icon.className = 'category-icon';
            // Standart kategoride yoksa varsayılan ikon kullan
            const standardCat = STANDARD_CATEGORIES.find(c => c.id === normalized);
            icon.textContent = standardCat ? standardCat.icon : categoryIcons[normalized] || '📺';
            
            const name = document.createElement('div');
            name.className = 'category-name';
            name.textContent = standardCat ? standardCat.name : normalized;
            
            categoryCard.appendChild(icon);
            categoryCard.appendChild(name);
            
            categoriesContainer.appendChild(categoryCard);
        }
    });
}

// Kategori event listener'larını yeniden bağla
function setupCategoryEventListeners() {
    categoryCards = document.querySelectorAll('.category-card');
    
    if (categoryCards && categoryCards.length > 0) {
        categoryCards.forEach(card => {
            // Önceki listener'ları kaldır
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
            
            // Yeni listener ekle
            newCard.addEventListener('click', () => {
                const category = newCard.dataset.category;
                selectCategory(category);
            });
        });
    }
}

// Select Category
function selectCategory(category) {
    currentCategory = category;
    
    // Update active category
    if (categoryCards && categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.classList.remove('active');
            if (card.dataset.category === category) {
                card.classList.add('active');
            }
        });
    }
    
    // Clear search
    if (searchInput) {
        searchInput.value = '';
    }
    if (clearSearch) {
        clearSearch.style.display = 'none';
    }
    
    // Render channels
    renderChannels();
}

// Kategoriyi normalize et
function normalizeCategory(category) {
    if (!category) return 'Diğer';
    
    // Önce categoryMapping'e bak
    if (categoryMapping[category]) {
        return categoryMapping[category];
    }
    
    // Büyük/küçük harf duyarsız kontrol (ilk harf büyük, diğerleri küçük)
    const categoryLower = category.toLowerCase();
    const categoryTitleCase = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    
    // categoryMapping'de büyük/küçük harf varyantlarını kontrol et
    for (const [key, value] of Object.entries(categoryMapping)) {
        if (key.toLowerCase() === categoryLower) {
            return value;
        }
    }
    
    // STANDARD_CATEGORIES'de büyük/küçük harf duyarsız kontrol
    const standardCat = STANDARD_CATEGORIES.find(c => 
        c.id.toLowerCase() === categoryLower || 
        c.name.toLowerCase() === categoryLower
    );
    if (standardCat) {
        return standardCat.id;
    }
    
    // İlk harf büyük, diğerleri küçük formatına dönüştür
    return categoryTitleCase;
}

// Render Channels (optimized)
function renderChannels() {
    let filteredChannels = channels;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredChannels = channels.filter(ch => {
            let chCategory = normalizeCategory(ch.category);
            return chCategory === currentCategory;
        });
    }
    
    // Filter by search (optimized with early return)
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredChannels = filteredChannels.filter(ch => 
            ch.name.toLowerCase().includes(searchLower)
        );
    }
    
    // Update title and count
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
    
    if (categoryTitle) {
        categoryTitle.textContent = searchTerm 
            ? `Arama: "${searchTerm}"` 
            : (categoryNames[currentCategory] || 'Kanallar');
    }
    if (channelCount) {
        channelCount.textContent = `${filteredChannels.length} kanal`;
    }
    
    // Clear grid
    if (channelsGrid) {
        channelsGrid.innerHTML = '';
    }
    
    if (filteredChannels.length === 0) {
        if (channelsGrid) {
            channelsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <p>Kanal bulunamadı</p>
                </div>
            `;
        }
        return;
    }
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Render channel cards
    filteredChannels.forEach(channel => {
        const channelCard = document.createElement('div');
        channelCard.className = 'channel-card';
        channelCard.dataset.channelId = channel.id;
        
        // Liste görünümü için farklı HTML yapısı
        if (currentView === 'list') {
            const logoContainer = document.createElement('div');
            logoContainer.className = 'channel-logo-container';
            
            if (channel.tvgLogo) {
                const img = document.createElement('img');
                img.src = channel.tvgLogo;
                img.alt = channel.name;
                img.className = 'channel-logo';
                img.loading = 'lazy'; // Lazy loading for performance
                img.onerror = function() {
                    this.style.display = 'none';
                    if (this.nextElementSibling) {
                        this.nextElementSibling.style.display = 'flex';
                    }
                };
                logoContainer.appendChild(img);
                
                const placeholder = document.createElement('div');
                placeholder.className = 'channel-logo-placeholder';
                placeholder.style.display = 'none';
                placeholder.textContent = '📺';
                logoContainer.appendChild(placeholder);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'channel-logo-placeholder';
                placeholder.textContent = '📺';
                logoContainer.appendChild(placeholder);
            }
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'channel-info-list';
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'channel-name';
            nameDiv.textContent = channel.name;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'channel-category';
            categoryDiv.textContent = channel.category;
            
            infoDiv.appendChild(nameDiv);
            infoDiv.appendChild(categoryDiv);
            
            channelCard.appendChild(logoContainer);
            channelCard.appendChild(infoDiv);
        } else {
            const logoContainer = document.createElement('div');
            logoContainer.className = 'channel-logo-container';
            
            if (channel.tvgLogo) {
                const img = document.createElement('img');
                img.src = channel.tvgLogo;
                img.alt = channel.name;
                img.className = 'channel-logo';
                img.loading = 'lazy'; // Lazy loading for performance
                img.onerror = function() {
                    this.style.display = 'none';
                    if (this.nextElementSibling) {
                        this.nextElementSibling.style.display = 'flex';
                    }
                };
                logoContainer.appendChild(img);
                
                const placeholder = document.createElement('div');
                placeholder.className = 'channel-logo-placeholder';
                placeholder.style.display = 'none';
                placeholder.textContent = '📺';
                logoContainer.appendChild(placeholder);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'channel-logo-placeholder';
                placeholder.textContent = '📺';
                logoContainer.appendChild(placeholder);
            }
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'channel-name';
            nameDiv.textContent = channel.name;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'channel-category';
            categoryDiv.textContent = channel.category;
            
            channelCard.appendChild(logoContainer);
            channelCard.appendChild(nameDiv);
            channelCard.appendChild(categoryDiv);
        }
        
        fragment.appendChild(channelCard);
    });
    
    // Use event delegation instead of individual listeners
    if (channelsGrid) {
        channelsGrid.appendChild(fragment);
    }
}

// Change View
function changeView(view, save = true) {
    currentView = view;
    
    if (save) {
        localStorage.setItem('channelView', view);
    }
    
    // Update icon based on view
    if (viewIcon) {
        let iconSvg = '';
        let title = '';
        
        if (view === 'large') {
            iconSvg = '<rect x="3" y="3" width="18" height="18" rx="2"></rect>';
            title = 'Büyük Kart';
        } else if (view === 'small') {
            iconSvg = '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect>';
            title = 'Küçük Kart';
        } else { // list
            iconSvg = '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>';
            title = 'Liste';
        }
        
        viewIcon.innerHTML = iconSvg;
        if (viewMenuBtn) {
            viewMenuBtn.title = title;
        }
    }
    
    // Update grid class
    if (channelsGrid) {
        channelsGrid.className = 'channels-grid';
        channelsGrid.classList.add(`view-${view}`);
    }
    
    // Re-render channels
    renderChannels();
}

// Debounce function for search
let searchTimeout = null;
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (clearSearch) {
        if (searchTerm) {
            clearSearch.style.display = 'flex';
        } else {
            clearSearch.style.display = 'none';
        }
    }
    
    // Debounce: wait 300ms before rendering
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
        renderChannels();
        searchTimeout = null;
    }, 300);
}


// Apply Theme
function applyTheme(color) {
    document.documentElement.setAttribute('data-theme', color);
    
    // Update active state
    const colorPickerBtns = document.querySelectorAll('.color-picker-btn');
    colorPickerBtns.forEach(btn => {
        if (btn.dataset.color === color) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
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
