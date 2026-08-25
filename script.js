
async function runAnalyticsTracking() {
  
    // 1. Session Safeguard: Prevent repetitive pings during active session
    // if (sessionStorage.getItem('analytics_tracked') === 'true') {
    //     updateUI("Status: Standby", "Lifecycle already recorded for this browser session.");
    //     return;
    // }

    try {                
        // 2. Fetch Client IP and Geolocation Metrics                
        const geoResponse = await fetch('https://ipapi.co/json/?key=ptnF4pHKH0lSfNgGEiEdVCtwFbXHQ0tTIlSzEDszQvQRjzwGgm');                
        if (!geoResponse.ok) {
            throw new Error(`Location API rejected request with status: ${geoResponse.status}`);
        }
        
        const geoData = await geoResponse.json();

        // 3. Map Correctly Keyed Web3Forms Structural Payload
        const payload = {
            access_key: "38b2464a-fe97-4dbe-8cf6-a8067415b7fc",
            from_name: "Shodane Traffic Notification",
            subject: `Session Init: ${geoData.city || 'Unknown'}, ${geoData.country_code || 'XX'}`,
            ip_address: geoData.ip || "Unknown",
            location: `${geoData.city || 'Unknown'}, ${geoData.region || 'Unknown'}, ${geoData.country_name || 'Unknown'}`,
            postal: geoData.postal || "N/A",
            timezone: geoData.timezone || "UTC",
            latitude: geoData.latitude || "0.0",
            longitude: geoData.longitude || "0.0"
        };

        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
                    

    } catch (trackingError) {
        // Fails cleanly for safety
        console.error("Tracking error stack context");
    }
}

// Initialize execution safely after the layout tree is fully generated
window.addEventListener('DOMContentLoaded', runAnalyticsTracking);
