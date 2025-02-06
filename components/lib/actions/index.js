'use server'

import { revalidatePath } from "next/cache";
import Product from "../models/product";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scrapper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeProducts(productUrl) {
        if(!productUrl){
            return ;
        }  

        try{

           connectToDB();
           const scrapeProduct = await scrapeAmazonProduct(productUrl);
           if(!scrapeProduct) return;

            let product = scrapeProduct;
            const existingProduct = await Product.findOne({url:scrapeProduct.url});

            if(existingProduct){
                const updatedPriceHistory = [
                    ...existingProduct.priceHistory,{
                        price:scrapeProduct.price
                    }
                ]

                 product = {
                    ...scrapeProduct,
                    priceHistory:updatedPriceHistory,
                    lowestPrice:getLowestPrice(updatedPriceHistory),
                    highestPrice:getHighestPrice(updatedPriceHistory),
                    averagePrice:getAveragePrice(updatedPriceHistory),
                 }
            }

            const newProduct = await Product.findOneAndUpdate({url:scrapeProduct.url},product,{upsert:true,new:true});
            revalidatePath(`/products/${newProduct._id}`);
        }catch(error){
            throw new Error('Failed to scrape the product details', error);
        }
}

export async function getProductById(productId){
    try{
       connectToDB();
       const product = await Product.findOne({_id:productId});
       if(!product) return null;

       return product;

    }catch(error){
       console.log(error);
    }
}

export async function getProducts(){
  try{
    connectToDB();
    
    const products = await Product.find()
    return products;
     
  }catch(error){
     console.log(error);
  }
}

export async function getSimilarProducts(productId){
    try{
      connectToDB();
      
      const currentproduct = await Product.findById(productId)
      if(!currentproduct) return null;
    
       const similarProducts = await Product.find({_id:{$ne:productId}}).limit(3);
       return similarProducts
    }catch(error){
       console.log(error);
    }
  }

  export async function addUserEmailToProduct(productId,userEmail){
    try{
        const product = await Product.findById(productId);
         
        if(!product) return;
        const userExists = product.users.some((user)=>user.email===userEmail);

        if(!userExists){
            product.users.push({email:userEmail})
            await product.save();
            const emailContent = await generateEmailBody(product,"WELCOME")
            console.log(emailContent);
            await sendEmail(emailContent,[userEmail]);

        }
    }catch(error){
       console.log(error);
    }
  }