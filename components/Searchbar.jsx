'use client'
import React, { useState } from 'react'
import { scrapeProducts } from './lib/actions';

const isValidAmazonProductLink = (link) => {
        try {
            const parsedUrl = new URL(link);
            const hostname = parsedUrl.hostname;
            if(hostname.includes('amazon.com') || hostname.includes('amazon')|| hostname.includes('amazon.') || hostname.includes('amazon.in')){ 
                return true;
            }
        }catch(error) {
            return false;
        }
    return false;
}

const Searchbar = () => {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    const handleSubmit = async(e) => {
        e.preventDefault();
       const isValidLink = isValidAmazonProductLink(search);
       if(!isValidLink){
           alert('Invalid Amazon Product Link');
           return ;
       }
          
        try{
           setLoading(true);
           // Scape the product details from the link
           const product = await scrapeProducts(search);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
    }
  }
  return (
    <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
        <input type='text' placeholder='Enter product link' className='searchbar-input' value={search} onChange={(e)=>setSearch(e.target.value)}/>
        <button type='submit' disabled={search===""} className='searchbar-button'>
          {loading ? 'Searching...' : 'Search'}
        </button>
    </form>
  )
}

export default Searchbar