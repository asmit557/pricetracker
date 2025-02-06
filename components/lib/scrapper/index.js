import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";
export async function scrapeAmazonProduct(productUrl) {
    if(!productUrl){
        return ;
    }  
    //curl -i --proxy brd.superproxy.io:33335 --proxy-user brd-customer-hl_1e8ff098-zone-pricewise:6xk1q6xrkpu1 -k "https://geo.brdtest.com/welcome.txt?product=unlocker&method=native"
   const username = String(process.env.BRIGHT_DATA_USERNAME);
   const password = String(process.env.BRIGHT_DATA_PASSWORD);

   const port = 33335
   const session_id = (1000000*Math.random()) |0;
   const options={
     auth:{
        username:`${username}-session-${session_id}`,
        password:password
     },
     host:'brd.superproxy.io',
     port:port,
     rejectUnauthorized:false
   }

   try{
       const response = await axios.get(productUrl, options);
       const $ = cheerio.load(response.data);
       const title = $('#productTitle').text().trim();  
       const price =  extractPrice(
        $('.priceToPay span.a-price-whole'),
        $('.a.size.base.a-color-price'),
        $('.a-button-selected .a-color-base'),
       ); 
       console.log(price);
       const originalPrice = extractPrice(
        $('#priceblock_ourprice'),
        $('.a-price.a-text-price span.a-offscreen'),
        $('#listPrice'),
        $('#priceblock_dealprice'),
        $('.a-size-base.a-color-price')
      );

       console.log(originalPrice);
      const outOfStock = $('#availability span').text().trim().toLowerCase()=== 'currently unavailable'; 
      const images =  $('#imgBlkFront').attr('data-a-dynamic-image') || 
      $('#landingImage').attr('data-a-dynamic-image') ||
      '{}' ;
      
      const imageUrls = Object.keys(JSON.parse(images));
      const currency = extractCurrency($('.a-price-symbol'));
      const discountRate = $('.savingsPercentage').text().replace(/[-%]/g,'');
      console.log("wkbbisub")
       const description = extractDescription($)
      const data = {
        url:productUrl,
        currency: currency || '$',
        image: imageUrls[0],
        title,
        currentPrice: Number(price) || Number(originalPrice),
        originalPrice: Number(originalPrice) || Number(price),
        priceHistory: [],
         discountRate: Number(discountRate),
        category: 'category',
        reviewsCount:100,
        stars: 4.5,
        isOutOfStock: outOfStock,
         description,
        lowestPrice: Number(price) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(price),
        averagePrice: Number(price) || Number(originalPrice),
      }
      return data;
   }catch(error){
     throw new Error('Failed to scrape the product details', error);
   }
}