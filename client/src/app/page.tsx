'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation'

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('home')
    const { data: session } = useSession();
    const router = useRouter();


    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'features', 'how-it-works', 'contact']
            const scrollPosition = window.scrollY

            for (const section of sections) {
                const element = document.getElementById(section)
                if (element) {
                    const { offsetTop, offsetHeight } = element
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navItems = [
        { name: 'Home', href: '#home' },
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Contact', href: '#contact' },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
            <header className="fixed w-full bg-black bg-opacity-50 backdrop-blur-md z-50">
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-2xl font-bold"
                        >
                            FanSphere
                        </motion.div>
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="flex space-x-4">
                                {navItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={`hover:text-purple-300 transition-colors ${activeSection === item.href.slice(1) ? 'text-purple-300' : ''
                                            }`}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                            <ConnectButton accountStatus={{
                                smallScreen: 'avatar',
                                largeScreen: 'address',
                            }} showBalance={{
                                smallScreen: true,
                                largeScreen: true,
                            }} chainStatus="none" />
                        </div>
                        <button
                            className="md:hidden text-white focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                                    />
                                ) : (
                                    <path
                                        fillRule="evenodd"
                                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden mt-4 space-y-4"
                        >
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block hover:text-purple-300 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                            {session && (
                                <button
                                    className="block hover:text-purple-300 transition-colors"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </button>
                            )
                            }
                            <div className="pt-2">
                                <ConnectButton accountStatus={{
                                    smallScreen: 'avatar',
                                    largeScreen: 'address',
                                }} showBalance={{
                                    smallScreen: true,
                                    largeScreen: true,
                                }} chainStatus="none" />
                            </div>
                        </motion.div>
                    )}
                </nav>
            </header>

            <main>
                <section id="home" className="min-h-screen flex items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="container mx-auto px-6"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">Welcome to FanSphere</h1>
                        <p className="text-xl md:text-2xl mb-8">
                            The ultimate gamified concert ticket management app for music fans
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                            {session ? (
                                <div className="relative">
                                    <button
                                        className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition-colors"
                                        onClick={
                                            () => {
                                                router.push('/dashboard')
                                            }
                                        }
                                    >
                                        Go to Dashboard!
                                    </button>
                                </div>) : (
                                <button onClick={() => signIn()} className="bg-white text-purple-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-100 transition-colors">Sign In</button>
                            )
                            }
                            <div className="md:hidden lg:block">
                                <ConnectButton accountStatus={{
                                    smallScreen: 'avatar',
                                    largeScreen: 'address',
                                }} showBalance={{
                                    smallScreen: true,
                                    largeScreen: true,
                                }} chainStatus="none" />
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section id="features" className="py-20 bg-black bg-opacity-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold mb-12 text-center">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: 'FanScore', description: 'Calculate your rank based on listening habits and concert history' },
                                { title: 'Priority Access', description: 'Get early access to tickets based on your FanRank' },
                                { title: 'NFT Tickets', description: 'Secure, tradeable tickets stored as NFTs' },
                                { title: 'Gamified Missions', description: 'Complete tasks to boost your rank and unlock perks' },
                                { title: 'Community Engagement', description: 'Connect with other fans through group chats and social sharing' },
                                { title: 'Instant Notifications', description: 'Never miss an event with real-time updates' },
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm"
                                >
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="how-it-works" className="py-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full md:w-1/2"
                            >
                                <Image
                                    src="/placeholder.svg?height=400&width=600"
                                    alt="FanSphere App Demo"
                                    width={600}
                                    height={400}
                                    className="rounded-lg shadow-lg"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="w-full md:w-1/2 space-y-4"
                            >
                                <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                                    <h3 className="text-xl font-semibold mb-2">1. Connect Your Spotify</h3>
                                    <p>Link your Spotify account to calculate your initial FanScore.</p>
                                </div>
                                <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                                    <h3 className="text-xl font-semibold mb-2">2. Complete Missions</h3>
                                    <p>Boost your FanRank by completing fun, music-related tasks.</p>
                                </div>
                                <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                                    <h3 className="text-xl font-semibold mb-2">3. Get Priority Access</h3>
                                    <p>Use your FanRank to get early access to concert tickets.</p>
                                </div>
                                <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm">
                                    <h3 className="text-xl font-semibold mb-2">4. Enjoy the Perks</h3>
                                    <p>Unlock exclusive benefits like backstage passes and limited edition merch.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-black bg-opacity-50 py-6">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; 2023 FanSphere. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
