const fs = require('fs');
const path = require('path');

const CVE_FILE_PATH = path.join(__dirname, 'data', 'middle_east_cves.json');
const INTENSITY_FILE_PATH = path.join(__dirname, 'data', 'target_intensity.json');

const feedUrls = [
    { url: 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml', source: 'BBC News (Middle East)' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'https://www.bleepingcomputer.com/feed/', source: 'BleepingComputer' },
    { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News' },
    { url: 'https://www.darkreading.com/rss.xml', source: 'Dark Reading' }
];

const keywords = ['israel', 'gaza', 'palestin', 'iran', 'lebanon', 'syria', 'yemen', 'houthi', 'middle east', 'hamas', 'idf', 'apt33', 'apt34', 'muddywater', 'charming kitten', 'phosphorus', 'state-sponsored', 'cyberwarfare', 'anonymous sudan'];
const targetCountries = ['israel', 'iran', 'lebanon', 'syria', 'jordan', 'egypt'];

async function fetchCVEInfo(cveId) {
    try {
        const response = await fetch(`https://cveawg.mitre.org/api/cve/${cveId}`);
        if (!response.ok) return null;
        const data = await response.json();
        
        let system = "Unknown System";
        try {
            system = data.containers.cna.affected[0].product || "Unknown System";
            if (system.toLowerCase() === 'n/a' || system === 'Unknown System') {
                system = data.containers.cna.affected[0].vendor || "Unknown System";
            }
        } catch (e) {}

        return {
            id: cveId,
            system: system,
            severity: "High", // Default to High for newly detected active exploits in news
            badge: "badge-high"
        };
    } catch (error) {
        console.error(`Failed to fetch info for ${cveId}:`, error);
        return null;
    }
}

async function updateData() {
    let existingCves = [];
    if (fs.existsSync(CVE_FILE_PATH)) {
        existingCves = JSON.parse(fs.readFileSync(CVE_FILE_PATH, 'utf-8'));
    }
    const existingIds = new Set(existingCves.map(c => c.id));
    
    let allFoundCves = new Set();
    
    let countryStats = {};
    targetCountries.forEach(c => countryStats[c] = { recent: 0, previous: 0 });

    for (const feed of feedUrls) {
        try {
            console.log(`Checking ${feed.source}...`);
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
            if (!response.ok) continue;
            const data = await response.json();
            if (!data.items) continue;

            for (const item of data.items) {
                const title = item.title || "";
                const description = item.description || item.content || "";
                const contentStr = (title + " " + description).toLowerCase();
                const pubDate = new Date(item.pubDate || new Date()).getTime();
                const now = Date.now();
                const daysOld = (now - pubDate) / (1000 * 60 * 60 * 24);

                const isRelevant = feed.source.includes('BBC') || keywords.some(kw => contentStr.includes(kw));
                if (isRelevant) {
                    const matches = contentStr.match(/cve-\d{4}-\d+/gi);
                    if (matches) {
                        for (const match of matches) {
                            allFoundCves.add(match.toUpperCase());
                        }
                    }
                    
                    if (daysOld <= 7) {
                        targetCountries.forEach(c => {
                            if (contentStr.includes(c)) countryStats[c].recent++;
                        });
                    } else if (daysOld <= 14) {
                        targetCountries.forEach(c => {
                            if (contentStr.includes(c)) countryStats[c].previous++;
                        });
                    }
                }
            }
        } catch (e) {
            console.error(`Error processing ${feed.source}:`, e);
        }
    }

    let newlyAdded = false;
    for (const cveId of allFoundCves) {
        if (!existingIds.has(cveId)) {
            console.log(`Discovered new relevant CVE: ${cveId}`);
            const cveData = await fetchCVEInfo(cveId);
            if (cveData) {
                existingCves.unshift(cveData); // Add to top of the list
                existingIds.add(cveId);
                newlyAdded = true;
            } else {
                existingCves.unshift({
                    id: cveId,
                    system: "Unknown (Active Exploit)",
                    severity: "High",
                    badge: "badge-high"
                });
                existingIds.add(cveId);
                newlyAdded = true;
            }
        }
    }

    if (newlyAdded) {
        if (existingCves.length > 8) existingCves = existingCves.slice(0, 8);
        fs.writeFileSync(CVE_FILE_PATH, JSON.stringify(existingCves, null, 4));
        console.log('Successfully updated middle_east_cves.json');
    } else {
        console.log('No new CVEs found in the feeds today.');
    }

    // Generate Target Intensity Data
    const intensityData = targetCountries.map(country => {
        const recent = countryStats[country].recent;
        const previous = countryStats[country].previous;
        
        let intensity = "Low";
        let intensityClass = "intensity-low";
        if (recent >= 15) {
            intensity = "Critical";
            intensityClass = "intensity-high";
        } else if (recent >= 5) {
            intensity = "High";
            intensityClass = "intensity-high";
        } else if (recent >= 2) {
            intensity = "Medium";
            intensityClass = "intensity-med";
        }

        let trend = "up";
        if (recent < previous) trend = "down";
        if (recent === 0 && previous === 0) trend = "down";

        return {
            country: country.charAt(0).toUpperCase() + country.slice(1),
            attacks: recent.toString(),
            intensity: intensity,
            trend: trend,
            class: intensityClass
        };
    });

    intensityData.sort((a, b) => parseInt(b.attacks) - parseInt(a.attacks));
    fs.writeFileSync(INTENSITY_FILE_PATH, JSON.stringify(intensityData, null, 4));
    console.log('Successfully updated target_intensity.json');
}

updateData();
