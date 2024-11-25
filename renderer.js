function setWebsite() {
    const websiteInput = document.getElementById('website').value;
    console.log(`Entered website: ${websiteInput}`);
  
    if (!websiteInput.trim()) {
      alert("Please enter a website URL.");
      return;
    }
  
    window.electronAPI.send('set-website', websiteInput);
  }
  
  function searchSite() {
    const query = document.getElementById('search-query').value;
    console.log(`Entered search query: ${query}`);
  
    if (!query.trim()) {
      alert("Please enter a search query.");
      return;
    }
  
    window.electronAPI.send('search-site', query);
  }
  
  window.electronAPI.on('website-details', ({ name, logo, error }) => {
    console.log("Received website details:", name, logo, error);
  
    if (error) {
      alert(`Error: ${error}`);
      return;
    }
  
    document.getElementById('query-section').style.display = 'block';
    document.getElementById('website-name').innerText = name;
    document.getElementById('website-logo').src = logo;
  });
  
  window.electronAPI.on('search-results', (results) => {
  console.log("Received search results:", results);

  const resultsDiv = document.getElementById('results');
  
  // Ensure results is an array and not undefined or null
  if (results && Array.isArray(results)) {
    resultsDiv.innerHTML = results.length
      ? results.map(result => `
        <div>
          <img src="${result.pictureHtml}" alt="${result.name}" style="width:100px;">
          <p>Name: ${result.name}</p>
          <p>Price: ${result.price}</p>
        </div>
      `).join('')
      : "<p>No results found.</p>";
  } else {
    resultsDiv.innerHTML = "<p>Error: No results data received.</p>";
  }
});

// code not working because i'm scraping but it's not displaying in the front-end. undefined logged from 
  