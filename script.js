
  async function runAnalyticsTracking() {
    console.log("Initiating analytics lifecycle...");
      // 1. Session Safeguard: Stop execution if already tracked during this active session
      if (sessionStorage.getItem('analytics_tracked') === 'true') {
          console.log("Analytics lifecycle already recorded for this session.");
          return;
      }

      try {                
        // FIX: Added '/json/' to the end of the URL
        const geoResponse = await fetch('https://ipapi.co'); 
        console.log("Geo API response status:", geoResponse.status); 

        if (!geoResponse.ok) console.log("Geo API error:", geoResponse.statusText); 
 console.log("Geo API response status:", geoResponse.status);
        if (!geoResponse.ok) throw new Error(`HTTP Error: ${geoResponse.status}`);

        const geoData = await geoResponse.json();
        console.log("Retrieved geo data:", geoData);

        // Map the fields safely
        const payload = {
            pipeline_access_key: "38b2464a-fe97-4dbe-8cf6-a8067415b7fc",
            from_name: "Shodane Traffic Intelligence",
            subject: `Session Init: ${geoData.city || 'Unknown'}, ${geoData.countryCode || 'XX'}`,
            ip_address: geoData.query,
            location: `${geoData.city || 'Unknown'}, ${geoData.regionName || 'Unknown'}, ${geoData.country || 'Unknown'}`,
            postal: geoData.zip || "N/A",
            timezone: geoData.timezone || "UTC"
        };

        console.log("Prepared telemetry payload:", payload);


          // 4. Secure Background Dispatch to Mail Router
          const response = await fetch('https://web3forms.com', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              },
              body: JSON.stringify(payload)
          });

          const result = await response.json();
          
          if (result.success) {
              // 5. Lock Session: Flag the visitor browser storage to prevent tracking repetition
              sessionStorage.setItem('analytics_tracked', 'true');
              console.log("Telemetry recorded successfully.");
          } else {
              console.warn("Telemetry transmission rejected by routing core:", result.message);
          }

      } catch (trackingError) {
          // Fail silently to avoid breaking the core webpage layout for the end-user
          // console.error("Tracking lifecycle fault:", trackingError.message);
      }
  }

  // Initialize execution safely after the layout tree is fully generated
  window.addEventListener('DOMContentLoaded',runAnalyticsTracking);
      
