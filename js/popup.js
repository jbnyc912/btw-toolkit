onload = async () => {
    let [activeTab] = await chrome.tabs.query({active: true, currentWindow: true})
    let hostname = new URL(activeTab.url).hostname
    
    let ahrefdomainLink = document.querySelector('[data-link=ahrefdomain]')
    let ahreffullLink = document.querySelector('[data-link=ahrefurl]')
    let semrushdomainLink = document.querySelector('[data-link=semrushdomain]')
    let semrushfullLink = document.querySelector('[data-link=semrushurl]')
    let googleLink = document.querySelector('[data-link=google]')
    let waybackLink = document.querySelector('[data-link=wayback]')
    let whoisLink = document.querySelector('[data-link=whois]')
    let pagespeedLink = document.querySelector('[data-link=pagespeed]')
    let htmlsizeLink = document.querySelector('[data-link=htmlsize]')
    let gcacheLink = document.querySelector('[data-link=gcache]')

    let invalidPage = hostname === 'breaktheweb.org'
    
    googleLink.disabled = invalidPage
    waybackLink.disabled = invalidPage
    whoisLink.disabled = invalidPage
    pagespeedLink.disabled = invalidPage
    htmlsizeLink.disabled = invalidPage
    gcacheLink.disabled = invalidPage

    if(!invalidPage) {
        ahrefdomainLink.href = `https://app.ahrefs.com/site-explorer/overview/v2/subdomains/recent?target=${hostname}`
        ahreffullLink.href = `https://app.ahrefs.com/site-explorer/overview/v2/prefix/recent?target=${activeTab.url}`
        semrushdomainLink.href = `https://www.semrush.com/analytics/overview/?q=${hostname}`
        semrushfullLink.href = `https://www.semrush.com/analytics/overview/?q=${activeTab.url}`
        googleLink.href = `https://www.google.com/search?q=site%3A${hostname}`
        waybackLink.href = `https://web.archive.org/web/*/${activeTab.url}`
        whoisLink.href = `https://www.whois.com/whois/${hostname}`
        pagespeedLink.href = `https://pagespeed.web.dev/report?url=${activeTab.url}`
        htmlsizeLink.href = `https://www.debugbear.com/html-size-analyzer?url=${activeTab.url}`
        gcacheLink.href = `http://webcache.googleusercontent.com/search?q=cache:${activeTab.url}`
    }
  // Add event listeners to handle tab switching
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".content");

  tabLinks.forEach((tabLink) => {
    tabLink.addEventListener("click", (event) => {
      event.preventDefault();

      const targetTab = event.target.getAttribute("data-tab");

      tabLinks.forEach((link) => {
        link.classList.remove("active");
      });

      tabContents.forEach((content) => {
        content.style.display = "none";
      });

      event.target.classList.add("active");
      document.querySelector(`[data-tab="${targetTab}"]`).style.display = "block";
    });
  });
  
  // Update the on-page information
  updateOnPageInformation();
};

async function updateOnPageInformation() {
  // Get the active tab
  let [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Extract the page information from the HTML
  chrome.tabs.sendMessage(activeTab.id, { action: "getPageInformation" }, (response) => {
    if (response && response.pageInformation) {
      const { title, metaDescription, url, canonical } = response.pageInformation;
      
      // Update the on-page elements with the retrieved information
      document.getElementById("page-title").textContent = title;
      document.getElementById("meta-description").textContent = metaDescription;
      document.getElementById("page-url").textContent = url;
      document.getElementById("canonical-link").textContent = canonical;
    }
  });
}
