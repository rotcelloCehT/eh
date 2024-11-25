const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const puppeteer = require('puppeteer');
const { scrapeSite } = require('./scraper.js');  // Ensure correct import of scrapeSite function

let mainWindow;

app.on('ready', () => {
  console.log("App is ready");
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');

  // Open DevTools for easier debugging
  mainWindow.webContents.openDevTools();
});

ipcMain.on('set-website', async (event, website) => {
  console.log(`Received website: ${website}`);

  // Validate and normalize the website input
  if (!/^https?:\/\//.test(website)) {
    website = `https://${website}`;
  }

  console.log(`Normalized website: ${website}`);

  try {
    // Extract favicon URL
    const favicon = `https://www.google.com/s2/favicons?domain=${new URL(website).hostname}`;
    console.log(`Favicon URL: ${favicon}`);

    // Send the website details back to the renderer
    event.sender.send('website-details', { name: website, logo: favicon });
  } catch (error) {
    console.error("Error processing website input:", error);
    event.sender.send('website-details', { error: "Invalid website URL" });
  }
});

  // Handle search query event and fetch results using Puppeteer (from scraper.js)
  ipcMain.on('search-site', async (event, query) => {
  console.log(`Searching for: ${query}`);

  // Use the imported searchSite function from scraper.js
  try {
    const website = 'https://www.hema.nl'; // Example, you can replace this with dynamic website input
    //!!! change this shit to make interchangable !!!
    console.log(`testing website var: ${website}`);
    const products = await scrapeSite(query, website);

    // Send the search results back to the renderer
    event.sender.send('search-results', products);

  } catch (error) {
    console.error("Error searching site:", error);
    event.sender.send('search-results', { error: "Failed to fetch search results" });
  }
});