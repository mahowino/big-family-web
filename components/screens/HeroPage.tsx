"use client"
import React, { useState } from 'react';

const Introduction: React.FC = () => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="bg-gray-50 h-screen">
            <header className="relative z-10 py-4 md:py-6">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="relative flex items-center justify-between">
                        <div className="flex-shrink-0">
                          
                        </div>

                        <div className="flex md:hidden">
                            <button
                                type="button"
                                className="text-gray-900"
                                onClick={toggleExpanded}
                                aria-expanded={expanded}
                            >
                                {expanded ? (
                                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>

              

                        <div className="hidden md:flex">
                            <a
                                href="/transactions/overview"
                                title=""
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded hover:bg-gray-600 font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                role="button"
                            >
                                Log In as teller
                            </a>
                        </div>
                    </div>

                    <nav style={{ display: expanded ? 'block' : 'none' }}>
                        <div className="px-1 py-8">
                            <div className="grid gap-y-7">
                                
                                <a
                                    href="/transactions/overview"
                                    title=""
                                    className="inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded hover:bg-gray-600 font-pj focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                    role="button"
                                >
                                    Log in as teller
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            <section className="relative py-12 sm:py-16 lg:pb-40">
                <div className="absolute bottom-0 right-0 overflow-hidden">
                    <img className="w-full h-auto origin-bottom-right transform scale-150 lg:w-auto lg:mx-auto lg:object-cover lg:scale-75" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/background-pattern.png" alt="Background pattern" />
                </div>

                <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2">
                        <div className="text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20">
                            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight font-pj">Shop for your users, Make delivery easier.</h1>
                            <p className="mt-2 text-lg text-gray-600 sm:mt-6 font-inter">This software helps bridge the gap between shopkeeper and client in remote homes.</p>

                            <a href="/transactions/overview" title="" className="inline-flex px-8 py-4 mt-8 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded sm:mt-10 font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" role="button">
                                Start as teller
                            </a>

                            <div className="mt-8 sm:mt-16">
                                <div className="flex items-center justify-center lg:justify-start">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                    ))}
                                </div>

                                <blockquote className="mt-6">
                                    <p className="text-lg font-bold text-gray-900 font-pj">Helo clients get their products!</p>
                                    <p className="mt-3 text-base leading-7 text-gray-600 font-inter">This app helps you earn while offering help for clients</p>
                                </blockquote>

                              
                            </div>
                        </div>

                        <div className="relative pl-20 pr-16 lg:pl-12 xl:pl-0">
                            <div className="absolute inset-0">
                                <img className="object-contain w-full h-full mx-auto" src="https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/illustration.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Introduction;
