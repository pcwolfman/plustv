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
    
    // Listen for orientation changes
    window.addEventListener('resize', detectTeslaScreen);
    window.addEventListener('orientationchange', () => {
        setTimeout(detectTeslaScreen, 100); // Delay for orientation to settle
    });
    
    // Also use screen.orientation API if available
    if (screen.orientation) {
        screen.orientation.addEventListener('change', detectTeslaScreen);
    }
    
    loadChannelsFromM3U();
    setupEventListeners();
});

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
    
    // Initialize view
    changeView(currentView, false);
    
    // Event delegation for channel cards (better performance)
    if (channelsGrid) {
        channelsGrid.addEventListener('click', (e) => {
            const channelCard = e.target.closest('.channel-card');
            if (channelCard && channelCard.dataset.channelId) {
                const channelId = channelCard.dataset.channelId;
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
                        const groupTitle = groupTitleMatch ? groupTitleMatch[1].trim() : 'Diğer';
                        
                        // Clean category name (remove " - Yurt Disi" etc.)
                        let category = groupTitle.split(' - ')[0].trim();
                        
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

// Dinamik kategori kartlarını oluştur
function renderDynamicCategories() {
    const categoriesContainer = document.querySelector('.categories-container');
    if (!categoriesContainer) return;
    
    // Mevcut kartları temizle (Tümü hariç)
    const existingCards = categoriesContainer.querySelectorAll('.category-card:not([data-category="all"])');
    existingCards.forEach(card => card.remove());
    
    // Kategorileri sırala
    const sortedCategories = Array.from(allCategories).sort();
    
    // Her kategori için kart oluştur
    sortedCategories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.dataset.category = category;
        
        const icon = document.createElement('div');
        icon.className = 'category-icon';
        icon.textContent = categoryIcons[category] || '📺';
        
        const name = document.createElement('div');
        name.className = 'category-name';
        name.textContent = category;
        
        categoryCard.appendChild(icon);
        categoryCard.appendChild(name);
        
        categoriesContainer.appendChild(categoryCard);
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

// Render Channels (optimized)
function renderChannels() {
    let filteredChannels = channels;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredChannels = channels.filter(ch => ch.category === currentCategory);
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
        'Eglence': 'Eğlence Kanalları',
        'Muzik': 'Müzik Kanalları',
        'Belgesel': 'Belgesel Kanalları',
        'Dini': 'Dini Kanallar',
        'Cocuk': 'Çocuk Kanalları',
        'Ekonomi': 'Ekonomi Kanalları',
        'Yurt Disi': 'Yurt Dışı Kanallar',
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
