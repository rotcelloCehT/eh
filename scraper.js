const puppeteer = require('puppeteer');

async function  scrapeSite() {
  const browser = await puppeteer.launch({ headless: true }); // Launch browser in headless mode
  const page = await browser.newPage(); // Open a new browser page

  await page.goto('https://www.hema.nl'); // Navigate to the HEMA website

 // Wait for the page to fully load, ensuring the network is idle
    await page.goto('https://www.hema.nl', { waitUntil: 'networkidle2' }); // Added waitUntil option


  // Type "pencil" into the search bar and press Enter
  await page.type('input[type="search"], input[type="text"]', 'pencil');
  await page.keyboard.press('Enter');

  // Wait for the search results to load
  await page.waitForSelector('.product.js-gtmproduct.js-product-tile'); // Wait for product containers to appear

  // Scrape product details
  const products = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.product.js-gtmproduct.js-product-tile'));
    return items.map(item => {
        // Select the <picture> element
        const pictureTag = item.querySelector('picture');
        const pictureHtml = pictureTag ? pictureTag.outerHTML : ''; // Save the entire <picture> element as HTML

      // Select only <a> tags with the exact class "js-product-link"
      const link = Array.from(item.querySelectorAll('a')).find(a => 
        a.classList.length === 1 && a.classList.contains('js-product-link')
      );
  
      // Extract the product name from the <span> inside the filtered <a> tag
      const name = link?.querySelector('span')?.innerText || 'No name';
  
      // Extract the price
      let price = 'No price';
      const regularPrice = item.querySelector('.price.js-price');
      const discountedPrice = item.querySelector('.price.discounted');
  
      if (discountedPrice) {
        // Discounted price scenario
        const discountedMain = discountedPrice.querySelector('span:not(.price-range)')?.innerText || '';
        const discountedDecimal = discountedPrice.querySelector('.decimal')?.innerText || '';
        price = `${discountedMain}.${discountedDecimal}`;
      } else if (regularPrice) {
        // Regular price scenario
        const regularMain = regularPrice.querySelector('span')?.innerText || '';
        const regularDecimal = regularPrice.querySelector('.decimal')?.innerText || '';
        price = `${regularMain}.${regularDecimal}`;
      }
  
      // Return the product data
      return { name, price, pictureHtml };
    });
  });

  console.log('Scraped Products:', products); // Log the scraped products

  await browser.close(); // Close the browser after scraping
}

 scrapeSite().catch(console.error);
// 


// Export scrapeSite function
module.exports = {
  scrapeSite
};
  

