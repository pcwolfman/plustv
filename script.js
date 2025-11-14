// Global Variables
let channels = [];
let currentCategory = 'all';
let currentView = localStorage.getItem('channelView') || 'list'; // 'large', 'small', 'list'

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const voiceSearchBtn = document.getElementById('voiceSearchBtn');
const categoryCards = document.querySelectorAll('.category-card');
const channelsGrid = document.getElementById('channelsGrid');
const categoryTitle = document.getElementById('categoryTitle');
const channelCount = document.getElementById('channelCount');
const viewMenuBtn = document.getElementById('viewMenuBtn');
const viewIcon = document.getElementById('viewIcon');

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

    // Voice Search
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('click', toggleVoiceSearch);
    }

    // Category selection
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            selectCategory(category);
        });
    });

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
        'Yurt Disi': 'Yurt Dışı Kanallar',
        'Radyo Canlı': 'Radyo Canlı'
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

// Voice Search
let recognition = null;
let isListening = false;

// Check if browser supports speech recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;
        if (voiceSearchBtn) {
            voiceSearchBtn.classList.add('listening');
            voiceSearchBtn.title = 'Dinleniyor...';
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        handleSearch({ target: searchInput });
    };

    recognition.onerror = (event) => {
        console.error('Sesli arama hatası:', event.error);
        if (event.error === 'no-speech') {
            showError('Ses algılanamadı. Lütfen tekrar deneyin.');
        } else if (event.error === 'not-allowed') {
            showError('Mikrofon izni verilmedi. Lütfen tarayıcı ayarlarından izin verin.');
        } else {
            showError('Sesli arama hatası: ' + event.error);
        }
        stopVoiceSearch();
    };

    recognition.onend = () => {
        stopVoiceSearch();
    };
} else {
    // Browser doesn't support speech recognition
    if (voiceSearchBtn) {
        voiceSearchBtn.style.display = 'none';
    }
}

function toggleVoiceSearch() {
    if (!recognition) {
        showError('Tarayıcınız sesli aramayı desteklemiyor.');
        return;
    }

    if (isListening) {
        recognition.stop();
        stopVoiceSearch();
    } else {
        try {
            recognition.start();
        } catch (error) {
            console.error('Sesli arama başlatılamadı:', error);
            showError('Sesli arama başlatılamadı. Lütfen tekrar deneyin.');
        }
    }
}

function stopVoiceSearch() {
    isListening = false;
    if (voiceSearchBtn) {
        voiceSearchBtn.classList.remove('listening');
        voiceSearchBtn.title = 'Sesli Arama';
    }
    if (recognition && recognition.state !== 'inactive') {
        recognition.stop();
    }
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
