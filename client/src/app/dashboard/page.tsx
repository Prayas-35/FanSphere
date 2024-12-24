'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import DynamicBackground from '@/components/DynamicBackground'
import { ProfileSkeleton, ArtistSkeleton, TrackSkeleton } from '@/components/SkeletonLoading'
import { Switch } from '@/components/ui/switch'
import { Moon, Sun, ChevronDown, ChevronUp } from 'lucide-react'
// import { PieChart } from '@/components/ui/chart'

interface Data {
    data: {
        token: {
            access_token: string;
            refresh_token: string;
        }
    }
}

interface MusicData {
    userData: {
        image: string;
        name: string;
        followers: number;
        url: string; // Spotify profile URL
    };
    topArtists: {
        id: string;
        image: string;
        name: string;
        followers: number;
        url: string; // Spotify artist URL
        genres: string[];
        popularity: number; // Artist popularity score
    }[];
    topTracks: {
        id: string;
        album: string; // Album name
        image: string;
        name: string;
        artists: { name: string }[];
        release_date: string; // Track release date
        url: string; // Spotify track URL
        popularity: number; // Track popularity score
    }[];
}

const fetchMusicData = async (data: any) => {
    const response = await fetch('/api/spotify', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${data.token.access_token}`,
            Refresh: `Refresh ${data.token.refresh_token}`
        },
    });
    const res = await response.json();
    return res;
}

export default function EnhancedDashboard() {
    const [musicData, setMusicData] = useState<MusicData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showConfetti, setShowConfetti] = useState(false)
    const [expandedSection, setExpandedSection] = useState<'artists' | 'tracks' | null>('artists')
    const { width, height } = useWindowSize()
    const session = useSession();
    const { data }: Data = JSON.parse(JSON.stringify(session));
    const { theme, setTheme } = useTheme()
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!data) return;
        if (musicData) return;
        fetchMusicData(data).then(data => {
            setMusicData(data)
            setLoading(false)
        })
    }, [data])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const toggleSection = (section: 'artists' | 'tracks') => {
        setExpandedSection(expandedSection === section ? null : section)
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
    }


    // const getGenreData = () => {
    //     if (!musicData) return []
    //     const genreCounts: { [key: string]: number } = {}
    //     musicData.topArtists.forEach(artist => {
    //         artist.genres.forEach(genre => {
    //             genreCounts[genre] = (genreCounts[genre] || 0) + 1
    //         })
    //     })
    //     return Object.entries(genreCounts)
    //         .sort((a, b) => b[1] - a[1])
    //         .slice(0, 5)
    //         .map(([name, value]) => ({ name, value }))
    // }

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 text-white p-4 overflow-x-hidden relative">
            <DynamicBackground />
            <div className="relative z-10">
                {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}

                <header className="text-center mb-8 relative">
                    <div className="absolute top-0 right-0">
                        <Switch
                            checked={theme === 'dark'}
                            onCheckedChange={toggleTheme}
                            className="mr-2"
                        />
                        {theme === 'dark' ? <Moon className="inline-block" /> : <Sun className="inline-block" />}
                    </div>
                    {loading ? (
                        <ProfileSkeleton />
                    ) : (
                        <>
                            <motion.div
                                className="inline-block rounded-full overflow-hidden mb-4 pt-16"
                                animate={{
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                            >
                                <UserProfile musicData={musicData} />
                            </motion.div>
                            <motion.h1
                                className="text-3xl font-bold mb-2"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {musicData!.userData?.name}
                            </motion.h1>
                            <motion.p
                                className="text-sm opacity-80"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Followers: {musicData!.userData.followers}
                            </motion.p>
                        </>
                    )}
                </header>
{/* 
                {!loading && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold mb-4">Your Top Genres</h2>
                        <div className="w-full h-[300px]">
                            <PieChart
                                data={getGenreData()}
                                config={{
                                    name: {
                                        label: "Genre",
                                    },
                                    value: {
                                        label: "Count",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                                className="h-full"
                            />
                        </div>
                    </motion.section>
                )} */}

                <section className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <motion.h2
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            Top Artists
                        </motion.h2>
                    </div>
                    <AnimatePresence>
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-2 gap-4 overflow-hidden"
                            >
                                {loading
                                    ? Array(10).fill(0).map((_, index) => (
                                        <ArtistSkeleton key={index} />
                                    ))
                                    : musicData!.topArtists.slice(0,10).map((artist, index) => (
                                        <motion.div
                                            key={artist.id}
                                            className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-20 backdrop-blur-lg rounded-lg p-4 cursor-pointer hover:bg-opacity-30 dark:hover:bg-opacity-30 transition-all shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.05 * index }}
                                            onClick={() => {
                                                setTimeout(() => setShowConfetti(true), 1000);
                                            }}
                                        >
                                            <Image
                                                src={artist.image}
                                                alt={artist?.name}
                                                width={100}
                                                height={100}
                                                className="rounded-full mx-auto mb-2 object-fill h-28 w-28"
                                            />
                                            <h3 className="text-center font-semibold">{artist?.name}</h3>
                                            <p className="text-center text-sm opacity-80">{artist.followers.toLocaleString()} followers</p>
                                            <div className="mt-2 text-xs text-center">
                                                <span className="font-semibold">Popularity:</span> {artist.popularity}/100
                                            </div>
                                            <div className="mt-1 text-xs text-center">
                                                <span className="font-semibold">Genres:</span> {artist.genres.slice(0, 2).join(', ')}
                                            </div>
                                        </motion.div>
                                    ))}
                            </motion.div>
                    </AnimatePresence>
                    {!loading && (
                        <div className="flex py-6 space-x-4 overflow-x-auto pb-4 px-4">
                            {musicData!.topArtists.slice(10, 50).map((artist) => (
                                <motion.div
                                    key={artist.id}
                                    className="flex-shrink-0"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Image
                                        src={artist.image}
                                        alt={artist?.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-fill h-20 w-20"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>

                <section ref={scrollRef}>
                    <div className="flex justify-between items-center mb-4">
                        <motion.h2
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            Top Tracks
                        </motion.h2>
                        <button onClick={() => toggleSection('tracks')} className="text-white">
                            {expandedSection === 'tracks' ? <ChevronUp /> : <ChevronDown />}
                        </button>
                    </div>
                    <AnimatePresence>
                        {expandedSection === 'tracks' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 overflow-hidden"
                            >
                                {loading
                                    ? Array(10).fill(0).map((_, index) => (
                                        <TrackSkeleton key={index} />
                                    ))
                                    : musicData!.topTracks.map((track, index) => (
                                        <motion.div
                                            key={track.id}
                                            className="bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-20 backdrop-blur-lg rounded-lg p-4 flex items-center space-x-4 cursor-pointer hover:bg-opacity-30 dark:hover:bg-opacity-30 transition-all shadow-lg"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                            onClick={() => {
                                                setTimeout(() => setShowConfetti(true), 1000);
                                            }}
                                        >
                                            <Image
                                                src={track.image}
                                                alt={track?.name}
                                                width={60}
                                                height={60}
                                                className="rounded-md"
                                            />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold">{track?.name}</h3>
                                                <p className="text-sm opacity-80">{track.artists.map(a => a?.name).join(', ')}</p>
                                                <div className="text-xs mt-1">
                                                    <span className="font-semibold">Album:</span> {track.album}
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-semibold">Released:</span> {new Date(track.release_date).getFullYear()}
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {track.popularity}/100
                                            </div>
                                        </motion.div>
                                    ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!loading && expandedSection !== 'tracks' && (
                        <div className="flex space-x-2 overflow-x-auto pb-4">
                            {musicData!.topTracks.slice(0, 100).map((track) => (
                                <motion.div
                                    key={track.id}
                                    className="flex-shrink-0"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Image
                                        src={track.image}
                                        alt={track?.name}
                                        width={50}
                                        height={50}
                                        className="rounded-md h-20 w-20 ml-4 object-fill"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

function UserProfile({ musicData }: { musicData: any }) {
    const userName = musicData?.userData?.name || "User";
    const userImage = musicData?.userData?.image;

    return (
        <div className="flex items-center justify-center w-48 h-48 rounded-full bg-gray-200 overflow-hidden">
            {userImage ? (
                <img
                    src={userImage}
                    alt={userName}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                />
            ) : (
                <span className="text-4xl font-bold text-gray-700">
                    {userName.charAt(0).toUpperCase()}
                </span>
            )}
        </div>
    );
}

