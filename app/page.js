import HeroCarousel from '@/components/HeroCarousel'
import Searchbar from '@/components/Searchbar'
import Image from 'next/image'
import React from 'react'
import { getProducts } from '@/components/lib/actions'
import ProductCard from '@/components/productCard'
const Home = async() => {
   
   const allProducts = await getProducts();

  return (
    <>
      <section className='px-6 border-2 md:px-20 py-24 border-red-500'>
           <div className='flex max-xl:flex-col gap-16'>
              <div className='flex flex-col justify-center'>
              <p className='small-text'>
                 Smart Shopping Starts Here:
                 <Image src='/assets/icons/arrow-right.svg' alt='arrow-right' width={16} height={16}/>
              </p>
              <h1 className='head-text'>Unleash the power of
               <span className='text-primary'> PriceWise</span></h1>
              <p className='mt-6'>
                Powerful price comparison tool that helps you find the best deals on the products you want.
              </p>

              <Searchbar/>
              </div>
              <HeroCarousel/>
           </div>
      </section>

      <section className='trending-section'>
        <h2 className='section-text'>
          Trending Products
        </h2>
        <div className='flex flex-wrap gap-x-8 gap-y-16' >
           {allProducts?.map((product, index) => (
               <ProductCard key={product._id} product={product}/>
           ))}
        </div>
      </section>
    </>
  )
}

export default Home