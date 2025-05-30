const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
const iplocate = require('node-iplocate');
const fetch = require('node-fetch'); // For calling the reverse geocoding API

const app = express();
const port = process.env.PORT || 3001;
const parser = new Parser();
const allowedOrigins = [
    'http://localhost:3000', // For local frontend development
    'https://news-nearby.vercel.app',
    'https://news-nearby-sar-v-eshs-projects.vercel.app',
    'https://news-nearby-git-main-sar-v-eshs-projects.vercel.app', 
];

const corsOptions = {
    origin: function (origin, callback) {
        console.log(`----------------------------------------------------------------`);
        console.log(`CORS CHECK - Incoming Request Origin: ${origin}`);
        console.log(`CORS CHECK - Allowed Origins: ${allowedOrigins.join(', ')}`);
        
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            console.log(`CORS CHECK - Result: Origin ${origin} ALLOWED.`);
            callback(null, true);
        } else {
            console.error(`CORS CHECK - Result: Origin ${origin} NOT ALLOWED.`);
            callback(new Error('Not allowed by CORS')); 
        }
        console.log(`----------------------------------------------------------------`);
    }
};

app.use(cors(corsOptions)); 


app.use(express.json());

// Helper to fetch and parse Google News RSS (SORTING IS ALREADY IMPLEMENTED HERE)
async function fetchNewsFromGoogle(query, locationParams = {}) {
    let rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}`;
    const { countryCode, languageCode = 'en' } = locationParams;

    if (countryCode) {
        const ccUpper = countryCode.toUpperCase();
        rssUrl += `&gl=${ccUpper}&hl=${languageCode}-${ccUpper}&ceid=${ccUpper}:${languageCode}`;
    } else {
        rssUrl += `&hl=${languageCode}`; 
    }

    console.log("Fetching RSS from:", rssUrl);
    try {
        const feed = await parser.parseURL(rssUrl);
        return feed.items
            .map(item => ({
                title: item.title,
                link: item.link,
                pubDate: item.isoDate,
                snippet: item.contentSnippet || item.content
            }))
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)) 
            .slice(0, 20);
    } catch (error) {
        console.error("Error fetching or parsing RSS:", error.message, "URL:", rssUrl);
        throw new Error("Could not fetch news from provider.");
    }
}

app.get('/api/news', async (req, res) => {
    const { lat, lon, ip_fallback, category, search_query, searched_location } = req.query;
    
    let baseQueryTopic = "latest news";
    let locationPhrase = null;
    let locationOptions = {}; 

    const RAPIDAPI_KEY = 'process.env.RAPIDAPI_KEY'; 

    try {
        // --- 1. Geolocation (lat/lon) ---
        if (lat && lon) {
            console.log(`Attempting reverse geocoding for lat/lon: ${lat}, ${lon}`);
            const geoApiUrl = `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${lat}&lon=${lon}&zoom=10&addressdetails=1&accept-language=en&format=json`;
            const geoApiOptions = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPIDAPI_KEY,
                    'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com'
                }
            };
            try {
                const geoResponse = await fetch(geoApiUrl, geoApiOptions);
                if (!geoResponse.ok) {
                    throw new Error(`Reverse geocoding API request failed. Status: ${geoResponse.status}`);
                }
                const geoResult = await geoResponse.json();
                
                if (geoResult && geoResult.address) {
                    console.log("Full Geocoding Address Object:", JSON.stringify(geoResult.address, null, 2));

                    if (geoResult.address.country_code) {
                        locationOptions.countryCode = geoResult.address.country_code.toUpperCase(); // Ensure uppercase
                    }

                    const city = geoResult.address.city;
                    const town = geoResult.address.town;
                    const village = geoResult.address.village;
                    const county = geoResult.address.county;
                    const district = geoResult.address.state_district || geoResult.address.county || geoResult.address.suburb;
                    const state = geoResult.address.state;
                    const countryName = geoResult.address.country;

                    let mostSpecificAdminArea = county || city || town || village || district;
                    let determinedLoc = "";

                    if (mostSpecificAdminArea && countryName) {
                        determinedLoc = `${mostSpecificAdminArea}, ${countryName}`;
                    } else if (district && state && countryName) { 
                        determinedLoc = `${district}, ${state}, ${countryName}`;
                    } else if (state && countryName) { 
                        determinedLoc = `${state}, ${countryName}`;
                    } else if (countryName) { 
                        determinedLoc = countryName;
                    }

                    if (determinedLoc) {
                        locationPhrase = `in ${determinedLoc}`;
                        console.log(`Geolocation successful. Determined Location for query: ${determinedLoc}, Country Code for Google News: ${locationOptions.countryCode || 'N/A'}`);
                    } else {
                        console.warn("Could not determine a specific location string from geocoding, though country code might be set.");
                    }
                } else {
                    console.warn("Reverse geocoding response did not contain 'address' details or was empty.");
                }
            } catch (geoError) {
                console.error("Error during reverse geocoding API call or parsing:", geoError.message);
            }
        }

        // --- 2. IP Fallback ---
        // Only if geolocation didn't provide a locationPhrase and ip_fallback is requested
        if (!locationPhrase && ip_fallback === 'true') {
            const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log("Attempting IP-based location for IP:", clientIp);
            try {
                const effectiveIp = (clientIp === '::1' || clientIp === '127.0.0.1') ? '8.8.8.8' : clientIp;
                const ipLocationData = await iplocate(effectiveIp);
                if (ipLocationData && ipLocationData.country_code) {
                    locationOptions.countryCode = ipLocationData.country_code.toUpperCase();
                    if (ipLocationData.country) {
                        locationPhrase = `in ${ipLocationData.country}`;
                        console.log(`IP-based location successful. Location: ${ipLocationData.country}, Country Code: ${ipLocationData.country_code}`);
                    }
                } else {
                    throw new Error("Failed to get IP-based location (no country_code from iplocate).");
                }
            } catch (ipError) {
                console.error("IP location error:", ipError.message);
                if (ipError.message.startsWith("Failed to get IP-based location")) {
                    throw ipError; 
                }
            }
        }

        // --- 3. Location Search ---
        // Only if no location determined by geo/IP and searched_location is provided
        if (!locationPhrase && searched_location) {
            locationPhrase = `in ${searched_location}`;
            console.log(`Using user searched location: "${searched_location}"`);
        }

        // --- 4. Determine Topic (Keyword Search / Category) ---
        if (search_query) {
            baseQueryTopic = search_query;
            console.log(`Topic set by keyword search: "${search_query}"`);
        } else if (category && category.toLowerCase() !== 'all') {
            baseQueryTopic = `${category} news`;
            console.log(`Topic set by category: "${category}"`);
        }

        // --- Construct Final News Query ---
        let finalNewsQuery;
        if (locationPhrase) {
            finalNewsQuery = `${baseQueryTopic} ${locationPhrase}`;
        } else {
            finalNewsQuery = baseQueryTopic;
        }
        
        if (finalNewsQuery.toLowerCase() === "latest news" && Object.keys(locationOptions).length === 0 && !locationPhrase) {
            finalNewsQuery = "world news"; 
            console.log("Query was too generic, changed to 'world news'");
        }
        
        console.log("Final news query for Google News:", finalNewsQuery);
        console.log("Google News regional params (countryCode):", locationOptions.countryCode || "None (global/language default)");
        const newsItems = await fetchNewsFromGoogle(finalNewsQuery, locationOptions);
        res.json(newsItems);

    } catch (error) {
        console.error("Error in /api/news:", error.message);
        if (error.message.startsWith("Failed to get IP-based location")) {
            res.status(500).json({ message: "Failed to get IP-based location", details: error.message });
        } else {
            res.status(500).json({ message: "Error fetching news.", details: error.message });
        }
    }
});

app.listen(port, () => {
    console.log(`Backend server listening on ${port}`);
});