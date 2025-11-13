// Global Variables
let channels = [];
let currentCategory = 'all';
let currentView = localStorage.getItem('channelView') || 'list'; // 'large', 'small', 'list'

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const categoryCards = document.querySelectorAll('.category-card');
const channelsGrid = document.getElementById('channelsGrid');
const categoryTitle = document.getElementById('categoryTitle');
const channelCount = document.getElementById('channelCount');
const viewMenuBtn = document.getElementById('viewMenuBtn');
const viewMenuDropdown = document.getElementById('viewMenuDropdown');
const viewOptions = document.querySelectorAll('.view-option');

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

    // View menu toggle
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            viewMenuDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!viewMenuBtn.contains(e.target) && !viewMenuDropdown.contains(e.target)) {
                viewMenuDropdown.classList.remove('active');
            }
        });
    }
    
    // View option selection
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            const view = option.dataset.view;
            changeView(view);
            viewMenuDropdown.classList.remove('active');
        });
    });
    
    // Initialize view
    changeView(currentView, false);

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
        
        // Liste görünümü için farklı HTML yapısı
        if (currentView === 'list') {
            channelCard.innerHTML = `
                ${channel.tvgLogo 
                    ? `<img src="${channel.tvgLogo}" alt="${channel.name}" class="channel-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="channel-logo-placeholder" style="display: none;">📺</div>`
                    : `<div class="channel-logo-placeholder">📺</div>`
                }
                <div class="channel-info-list">
                    <div class="channel-name">${channel.name}</div>
                    <div class="channel-category">${channel.category}</div>
                </div>
            `;
        } else {
            channelCard.innerHTML = `
                ${channel.tvgLogo 
                    ? `<img src="${channel.tvgLogo}" alt="${channel.name}" class="channel-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="channel-logo-placeholder" style="display: none;">📺</div>`
                    : `<div class="channel-logo-placeholder">📺</div>`
                }
                <div class="channel-name">${channel.name}</div>
                <div class="channel-category">${channel.category}</div>
            `;
        }
        
        channelCard.addEventListener('click', () => {
            // Navigate to player page
            window.location.href = `player.html?id=${channel.id}&category=${encodeURIComponent(currentCategory)}`;
        });
        
        channelsGrid.appendChild(channelCard);
    });
}

// Change View
function changeView(view, save = true) {
    currentView = view;
    
    if (save) {
        localStorage.setItem('channelView', view);
    }
    
    // Update active state
    viewOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.view === view) {
            option.classList.add('active');
        }
    });
    
    // Update grid class
    channelsGrid.className = 'channels-grid';
    channelsGrid.classList.add(`view-${view}`);
    
    // Re-render channels
    renderChannels();
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
