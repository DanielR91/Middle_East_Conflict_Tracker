document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked
            item.classList.add('active');
            const targetId = item.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Initialize Charts
    initCharts();

    // Populate Tables
    populateTables();

    // Populate Dummy Data for Threat Actors
    populateThreatActors();
    populateActorsTable();

    // Fetch News Feed
    fetchNewsFeed();
    document.getElementById('refresh-news-btn').addEventListener('click', fetchNewsFeed);

    // Update Last Updated Timestamp
    document.getElementById('last-updated').textContent = `Last Updated: ${new Date().toLocaleString()}`;
});

function initCharts() {
    // Attack Vectors Chart
    const ctxVector = document.getElementById('attackVectorChart');
    if (ctxVector) {
        new Chart(ctxVector, {
            type: 'doughnut',
            data: {
                labels: ['DDoS', 'Phishing', 'Ransomware', 'Zero-Day Exploit', 'Malware'],
                datasets: [{
                    data: [45, 25, 15, 5, 10],
                    backgroundColor: [
                        '#ff3366',
                        '#00f0ff',
                        '#ffcf00',
                        '#9b59b6',
                        '#3498db'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#e6edf3' }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Target Industry Chart
    const ctxIndustry = document.getElementById('industryChart');
    if (ctxIndustry) {
        new Chart(ctxIndustry, {
            type: 'bar',
            data: {
                labels: ['Government', 'Energy', 'Finance', 'Telecom', 'Defense', 'Healthcare'],
                datasets: [{
                    label: 'Targeted Attacks',
                    data: [85, 62, 45, 38, 70, 25],
                    backgroundColor: 'rgba(0, 240, 255, 0.7)',
                    borderColor: '#00f0ff',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#8b949e' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#8b949e' }
                    }
                }
            }
        });
    }
}

const SOCRADAR_ACTORS = [
  {"name": "Handala Hack", "origin": "Iran", "motivation": "MOIS-linked destructive wiper attacks", "primary_targets": ["Medtech", "Education", "Finance"]},
  {"name": "APT33", "origin": "Iran", "motivation": "IRGC-linked targeting aerospace, energy", "primary_targets": ["Aerospace", "Energy", "Defense"]},
  {"name": "APT34", "origin": "Iran", "motivation": "Espionage actor targeting telecom, finance", "primary_targets": ["Telecom", "Finance", "Government"]},
  {"name": "APT35", "origin": "Iran", "motivation": "Credential harvesting and social-engineering", "primary_targets": ["NGOs", "Academia", "Journalists"]},
  {"name": "APT39", "origin": "Iran", "motivation": "Surveillance actor focused on monitoring", "primary_targets": ["Telecom", "Travel", "Hospitality"]},
  {"name": "MuddyWater", "origin": "Iran", "motivation": "MOIS-linked cyber espionage group", "primary_targets": ["Government", "Infrastructure"]},
  {"name": "APT42", "origin": "Iran", "motivation": "Targets civil society, health sector", "primary_targets": ["Civil society", "Healthcare"]},
  {"name": "Fox Kitten", "origin": "Iran", "motivation": "Exploiting unpatched VPN appliances", "primary_targets": ["Enterprise VPNs", "Edge devices"]},
  {"name": "Tortoiseshell", "origin": "Iran", "motivation": "Watering hole and fake recruitment", "primary_targets": ["Defense contractors", "Supply chain"]},
  {"name": "Cyber Av3ngers", "origin": "Iran", "motivation": "PLC exploitation against utilities", "primary_targets": ["Water utilities", "ICS/OT systems"]},
  {"name": "Predatory Sparrow", "origin": "Israel", "motivation": "Destructive attacks on Iranian infrastructure", "primary_targets": ["Iranian steel industry"]},
  {"name": "Equation Group", "origin": "United States / Israel", "motivation": "US NSA/TAO unit with historical collaboration", "primary_targets": ["Iranian nuclear", "SCADA systems"]},
  {"name": "Moses Staff", "origin": "Iran", "motivation": "No ransom demand — pure sabotage", "primary_targets": ["Israeli private sector"]},
  {"name": "Pay2Key", "origin": "Iran", "motivation": "Targeted Israeli defense and aviation firms", "primary_targets": ["Israeli defense and aviation"]},
  {"name": "Agrius", "origin": "Iran", "motivation": "Disguises destructive wiper attacks", "primary_targets": ["Israeli hospital, insurance"]},
  {"name": "Void Manticore", "origin": "Iran", "motivation": "Partners with BullDozer for access brokering", "primary_targets": ["Albanian government", "Israeli orgs"]},
  {"name": "INC Ransomware", "origin": "Iran", "motivation": "Commercially available RaaS weaponized", "primary_targets": ["Israeli contractors"]},
  {"name": "Emennet Pasargad", "origin": "Iran", "motivation": "Iranian influence + hack-and-leak ops", "primary_targets": ["US election infra", "Israeli civilians"]},
  {"name": "NoName057(16)", "origin": "Russia", "motivation": "Russia's most active DDoS collective", "primary_targets": ["Cyprus government portals", "EU infrastructure"]},
  {"name": "RuskiNet", "origin": "Russia", "motivation": "Pro-Russian DDoS collective", "primary_targets": ["Western infrastructure", "NATO allies"]},
  {"name": "Z-Pentest Alliance", "origin": "Russia", "motivation": "Pro-Russian collective focused on ICS", "primary_targets": ["ICS systems", "SCADA networks"]},
  {"name": "ServerKillers", "origin": "Russia", "motivation": "Volumetric DDoS group aligned with Russia", "primary_targets": ["Government portals"]},
  {"name": "Cyber Islamic Resistance", "origin": "Axis of Resistance / Pro-Palestine", "motivation": "Umbrella coordinator for conflict", "primary_targets": ["Israel .gov/.co.il", "Gulf ministries"]},
  {"name": "313 Team", "origin": "Iraq", "motivation": "Iraq-based affiliate of CIR", "primary_targets": ["Jordan .gov", "Saudi Arabia"]},
  {"name": "DieNet", "origin": "Global", "motivation": "Primary DDoS toolkit supplier", "primary_targets": ["Qatar", "Bahrain", "UAE"]},
  {"name": "Nation of Saviors", "origin": "Iran-aligned", "motivation": "Data leak and doxxing specialist", "primary_targets": ["Saudi Baran Co.", "US military"]},
  {"name": "Handala", "origin": "Pro-Palestine", "motivation": "Strategic infrastructure focus", "primary_targets": ["i24 News", "Israeli fuel sector"]},
  {"name": "Moroccan Black Cyber Army", "origin": "Morocco", "motivation": "Telecom-layer targeting", "primary_targets": ["TCS Communications", "Israeli telecom"]},
  {"name": "Keymous+", "origin": "Global", "motivation": "Daily target declarations", "primary_targets": ["Kuwait ministries", "Jordan govt"]},
  {"name": "AnonGhost", "origin": "Pro-Islam", "motivation": "Reconnaissance specialist", "primary_targets": ["US IP ranges", "UAE infrastructure"]},
  {"name": "DarkStorm Team", "origin": "Pro-Palestine", "motivation": "Coordinated with NoName057", "primary_targets": ["Israeli banks", "Financial sector"]},
  {"name": "SYLHET GANG-SG", "origin": "Southeast Asia", "motivation": "Channeling DieNet tools", "primary_targets": ["Kuwait .gov", "Gulf portals"]},
  {"name": "Liwaamohammad", "origin": "Iran-aligned", "motivation": "Leak and doxxing channel", "primary_targets": ["Israeli intelligence", "Mossad agents"]},
  {"name": "CyberAv3ngers", "origin": "Iran", "motivation": "PLC exploitation against water/ICS systems", "primary_targets": ["Water facilities", "Israeli ICS"]},
  {"name": "RipperSec", "origin": "Southeast Asia", "motivation": "Integrated into CIR Electronic Ops Room", "primary_targets": ["Israeli websites", "Media"]},
  {"name": "Team Fearless", "origin": "Pro-Palestine", "motivation": "First post-return operation: Rafael", "primary_targets": ["Rafael Defense", "Israeli tech"]},
  {"name": "Mad Ghost", "origin": "Multi-National", "motivation": "Joined DieNet operational cluster", "primary_targets": ["Bahrain .gov", "Gulf portals"]},
  {"name": "Cyb3rDrag0nzz", "origin": "Multi-National", "motivation": "Defacement specialist", "primary_targets": ["Israeli .co.il", "Saudi Aramco"]},
  {"name": "Gaza Cyber Wolves", "origin": "Pro-Palestine", "motivation": "Joint operations with Handala", "primary_targets": ["Israeli media", "Streaming services"]},
  {"name": "Anonymous Syria Hackers", "origin": "Syria", "motivation": "Pro-Israel counter-hacktivist group", "primary_targets": ["IRGC websites", "Iranian govt"]},
  {"name": "Anonymous Israel", "origin": "Israel", "motivation": "Launched counter-operations", "primary_targets": ["IRGC websites", "Press TV"]},
  {"name": "Indian Cyber Force", "origin": "India", "motivation": "Declared pro-Israel stance", "primary_targets": ["Pro-Iran channels", "Pakistani infra"]}
];

function populateThreatActors() {
    const container = document.getElementById('actors-grid');
    if (!container) return;

    container.innerHTML = SOCRADAR_ACTORS.map(actor => `
        <div class="actor-card">
            <div class="actor-icon">
                <i class="fa-solid fa-user-secret"></i>
            </div>
            <h3 class="actor-name">${actor.name}</h3>
            <p class="actor-origin" style="font-size: 0.75rem;"><i class="fa-solid fa-location-dot"></i> Origin: ${actor.origin}</p>
            <div class="actor-tags" style="margin-top: 10px;">
                ${actor.primary_targets.map(tag => `<span class="actor-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function populateActorsTable() {
    const actorsTbody = document.querySelector('#actors-table tbody');
    if (actorsTbody) {
        // Use top 10 actors for the summary table
        actorsTbody.innerHTML = SOCRADAR_ACTORS.slice(0, 10).map(row => `
            <tr>
                <td style="color: var(--accent-cyan); font-weight: 600;">${row.name}</td>
                <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${row.motivation}">${row.motivation}</td>
                <td>${row.primary_targets.join(', ')}</td>
                <td>Ongoing</td>
                <td><i class="fa-solid fa-bolt" style="color: var(--accent-crimson);"></i></td>
            </tr>
        `).join('');
    }
}

function populateTables() {
    // Intensity Table
    const intensityData = [
        { country: "Israel", attacks: "12,450", intensity: "Critical", trend: "up", class: "intensity-high" },
        { country: "Iran", attacks: "9,820", intensity: "High", trend: "up", class: "intensity-high" },
        { country: "Lebanon", attacks: "4,100", intensity: "Medium", trend: "up", class: "intensity-med" },
        { country: "Syria", attacks: "2,340", intensity: "Medium", trend: "down", class: "intensity-med" },
        { country: "Jordan", attacks: "850", intensity: "Low", trend: "down", class: "intensity-low" },
        { country: "Egypt", attacks: "620", intensity: "Low", trend: "down", class: "intensity-low" }
    ];

    const intensityTbody = document.querySelector('#intensity-table tbody');
    if (intensityTbody) {
        intensityTbody.innerHTML = intensityData.map(row => `
            <tr>
                <td><strong>${row.country}</strong></td>
                <td>${row.attacks}</td>
                <td class="${row.class}">${row.intensity}</td>
                <td><i class="fa-solid fa-arrow-${row.trend}" style="color: ${row.trend === 'up' ? 'var(--accent-crimson)' : 'var(--accent-cyan)'};"></i></td>
            </tr>
        `).join('');
    }

    // CVE Table
    const cveData = [
        { id: "CVE-2023-34362", system: "MOVEit Transfer", severity: "Critical", badge: "badge-critical" },
        { id: "CVE-2024-21412", system: "Windows Defender", severity: "Critical", badge: "badge-critical" },
        { id: "CVE-2023-46805", system: "Ivanti ICS", severity: "High", badge: "badge-high" },
        { id: "CVE-2024-3400", system: "Palo Alto PAN-OS", severity: "Critical", badge: "badge-critical" },
        { id: "CVE-2023-4966", system: "Citrix NetScaler", severity: "High", badge: "badge-high" }
    ];

    const cveTbody = document.querySelector('#cve-table tbody');
    if (cveTbody) {
        cveTbody.innerHTML = cveData.map(row => `
            <tr>
                <td style="color: var(--accent-cyan); font-weight: 600;">${row.id}</td>
                <td>${row.system}</td>
                <td><span class="badge ${row.badge}">${row.severity}</span></td>
            </tr>
        `).join('');
    }
}

async function fetchNewsFeed() {
    const container = document.getElementById('news-container');
    if (!container) return;

    container.innerHTML = '<div class="loading" style="text-align:center; padding:40px; color:#8b949e;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching latest news via RSS...</div>';

    const feedUrls = [
        { url: 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml', source: 'BBC News (Middle East)' },
        { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
        { url: 'https://www.bleepingcomputer.com/feed/', source: 'BleepingComputer' },
        { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News' },
        { url: 'https://www.darkreading.com/rss.xml', source: 'Dark Reading' }
    ];

    let allItems = [];

    try {
        for (const feed of feedUrls) {
            // Use api.rss2json.com to bypass CORS and convert to JSON
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            
            if (!data.items) continue;

            data.items.forEach(item => {
                const title = item.title || "";
                const link = item.link || "";
                const pubDate = item.pubDate || "";
                const description = item.description || item.content || "";
                
                const contentStr = (title + " " + description).toLowerCase();
                const keywords = ['israel', 'gaza', 'palestin', 'iran', 'lebanon', 'syria', 'yemen', 'houthi', 'middle east', 'hamas', 'idf', 'apt33', 'apt34', 'muddywater', 'charming kitten', 'phosphorus', 'state-sponsored', 'cyberwarfare', 'anonymous sudan'];
                
                // Only include if relevant keywords are present, BBC Middle East is mostly relevant but we filter just in case
                const isRelevant = feed.source.includes('BBC') || keywords.some(kw => contentStr.includes(kw));

                if (isRelevant) {
                    allItems.push({
                        title,
                        link,
                        pubDate: new Date(pubDate).getTime() || 0,
                        pubDateStr: pubDate,
                        source: feed.source,
                        summary: description
                    });
                }
            });
        }

        // Sort by date descending
        allItems.sort((a, b) => b.pubDate - a.pubDate);

        if (allItems.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px;">No relevant news found at this time.</div>';
            return;
        }

        // Render top 20
        container.innerHTML = allItems.slice(0, 20).map(item => `
            <div class="news-card">
                <span class="news-source">${item.source}</span>
                <h3 class="news-title">
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
                </h3>
                <p class="news-summary">${item.summary.replace(/<[^>]+>/g, '').substring(0, 150)}...</p>
                <div class="news-date">${new Date(item.pubDateStr).toLocaleString()}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching news:', error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; padding: 20px; border: 1px solid #ff3366; background: rgba(255,51,102,0.1); border-radius: 8px; text-align:center;">
                <i class="fa-solid fa-circle-exclamation text-crimson" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <h3 style="margin-bottom: 10px;">Failed to load news feed</h3>
                <p>Could not fetch RSS feeds due to CORS or network errors.</p>
            </div>
        `;
    }
}
