import Product from "@/components/lib/models/product";
import { connectToDB } from "@/components/lib/mongoose";
import { generateEmailBody } from "@/components/lib/nodemailer";
import { scrapAmazonProduct } from "@/components/lib/scrapper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/components/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
    try{
         connectToDB();
         const products = await Product.find({});
         if(!products) throw new Error('No products found');

         const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                const scrappedProduct = await scrapAmazonProduct(currentProduct.url);

                if(!scrappedProduct) throw new Error("No product found");

                const updatedPriceHistory = [
                    ...currentProduct.priceHistory,{
                        price:scrappedProduct.price
                    }
                ]

               const product = { ...scrappedProduct,
                    priceHistory:updatedPriceHistory,
                    lowestPrice:getLowestPrice(updatedPriceHistory),
                    highestPrice:getHighestPrice(updatedPriceHistory),
                    averagePrice:getAveragePrice(updatedPriceHistory),
                  }

                  const updatedProduct = await Product.findOneAndUpdate({url:scrappedProduct.url},product,);

                
                const emailNotifType = getEmailNotifType(scrappedProduct,currentProduct);

                if(emailNotifType && updatedProduct.users.length>0){
                    const productInfo = {
                        title:updatedProduct.title,
                        url:updatedProduct.url,
                    }

                const emailContent = await generateEmailBody(productInfo,emailNotifType);
                const userEmails = updatedProduct.users.map((user)=>user.email)
                await sendEmail(emailContent,userEmails);
                }

                return updatedProduct;

            }

         ))

         return NextResponse.json({
            products:updatedProducts,
            message:'Ok'
         })
    }catch(error){
       console.log(error);
    }
}