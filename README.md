# 🎯 Middle East Cyber & Conflict Tracker

![Dashboard Preview](https://img.shields.io/badge/Status-LIVE-00ff00?style=for-the-badge&logo=opsgenie)
![Threat Level](https://img.shields.io/badge/Threat_Level-DYNAMIC-00f0ff?style=for-the-badge)
![Automation](https://img.shields.io/badge/Pipeline-100%25_Automated-9d4edd?style=for-the-badge)

A premium, serverless Cyber Threat Intelligence (CTI) dashboard designed to track cyber operations, threat actors, and geopolitical events linked to the Iran–Israel/US conflict in real-time. 

Designed to mimic a professional Security Operations Center (SOC) environment, this dashboard is 100% automated, utilizing GitHub Actions and client-side RSS aggregation to provide a zero-maintenance intelligence feed.

🌐 **[Visit the Live Dashboard Here](https://DanielR91.github.io/Middle_East_Conflict_Tracker)**

---

## ⚡ Key Features

### 📡 Live Intelligence Feed & Auto-Tagging
- Aggregates real-time news from 5 major geopolitical and cybersecurity sources (BBC, Al Jazeera, BleepingComputer, The Hacker News, Dark Reading).
- Custom keyword filtering ensures only Middle East conflict and cyber warfare news is displayed.
- **Smart Tagging:** An automated scanner reads incoming intelligence and dynamically tags articles with glowing neon badges (e.g., `RANSOMWARE`, `ZERO-DAY`, `APT ACTIVITY`, `DDoS`).
- Instant keyword and tag search functionality.

### 🗺️ Target Intensity Heatmap (Automated)
- The "Cyber Attack Target Intensity" table isn't faked—it's a real intelligence heatmap.
- A background scanner analyzes the volume of intelligence reports involving Israel, Iran, Lebanon, Syria, Jordan, and Egypt over a rolling 7-day window.
- Automatically calculates the **Intensity Level** (Critical, High, Medium, Low) and the **Trend** (Accelerating or Cooling) based on statistical deviations.

### 🛡️ Automated CVE Tracking
- Scans the live intelligence feeds for newly mentioned Common Vulnerabilities and Exposures (CVEs).
- Automatically queries the official **MITRE API** to identify the exact affected software/product.
- Populates the "Actively Exploited Vulnerabilities" table with the latest threats weaponized in the region.

### 🥷 Comprehensive Threat Actor Database
- A highly detailed grid tracking **43 active State-Sponsored APTs and Hacktivist Groups** operating in the Middle East.
- Includes groups like *Handala Hack*, *APT33*, *Predatory Sparrow*, and *Moses Staff*.
- Tracks origin country, core motivations, and primary target sectors.
- Features a lightning-fast search bar to filter actors by name, origin, or target.

### 🚨 Dynamic Regional Threat Gauge
- A prominent DEFCON-style gauge that calculates the overall regional threat level in real-time.
- If incoming intelligence spikes (>15 alerts in 24 hours), the dashboard physically pulses red and upgrades the threat level to **CRITICAL**.

---

## 🏗️ Architecture

This dashboard is a showcase of **Serverless Automation**:
- **Frontend:** Pure HTML/CSS/JS with a highly customized neon dark-mode design system. No heavy frontend frameworks.
- **Data Pipeline:** A Node.js script running on GitHub Actions wakes up every 12 hours, scrapes the intelligence feeds, queries external APIs (like MITRE), calculates the Intensity Heatmap, and commits lightweight JSON databases directly back to the repository.
- **Hosting:** Hosted entirely for free on GitHub Pages.

---

> **Disclaimer:** This dashboard aggregates public threat intelligence and news feeds. It is for informational and research purposes only.
