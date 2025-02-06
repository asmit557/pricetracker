'use client'
import React, { Fragment, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import Image from 'next/image';
import { addUserEmailToProduct, getProductById } from './lib/actions';

const Modal = ({productId}) => {
    const [isSubmitting,setIsSubmitting] = useState(false);
    const [email,setEmail] = useState('');
    let [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsSubmitting(true);
        await addUserEmailToProduct(productId,email)
      setIsSubmitting(false)
      setEmail('')
      closeModal();    
  }
    return (
        <>
            <button type="button" className="btn" onClick={openModal}>
                Track
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    {/* Background Overlay */}
                    <div className="fixed inset-0 bg-black bg-opacity-25" />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                                <DialogTitle className="text-lg font-semibold flex justify-between">
                                    Track Progress
                                    <Image src="/assets/icons/x-close.svg" 
                                        alt='close'
                                        width={24}
                                        height={24}
                                        className='cursor-pointer '
                                        onClick={closeModal}
                                    />
                                </DialogTitle>
                                <div className="flex justify-between items-center mt-2">
                                    <div className="p-3 border border-gray-200 rounded-lg">
                                        <Image
                                            src="/assets/icons/logo.svg"
                                            alt="logo"
                                            width={28}
                                            height={28}
                                        />
                                    </div>
                                </div>
                                 <h4 className='mt-3 dialog-head_text'>
                                    Stay updated with your product pricing alert right in your inbox!.
                                 </h4>
                                 <p className='mt-2 text-sm text-gray-600'>
                                    Never miss a bargain again with a timely alerts!.
                                 </p>
                                 <form className='flex flex-col mt-5' onSubmit={handleSubmit}>
                                      <label htmlFor='email' className='text-sm font-medium text-gray-700'>
                                      Email Address
                                      </label>
                                      <div className='dialog-input_container'>
                                            <Image src="/assets/icons/mail.svg"
                                                alt="email"
                                                width={18}
                                                height={18}
                                                
                                            />
                                            <input required
                                              type="email"
                                              id="email"
                                              value={email}
                                              onChange={(e)=>setEmail(e.target.value)}
                                              placeholder='Enter your email address'
                                              className='dialog-input'>

                                            </input>
                                      </div>
                                      <button type="submit" className='dialog-btn'>
                                           {isSubmitting ? 'Submitting...': 'Track'}
                                      </button>
                                 </form>
                            </DialogPanel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default Modal;
