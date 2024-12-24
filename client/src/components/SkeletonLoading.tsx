import { motion } from 'framer-motion'

export const ProfileSkeleton = () => (
  <div className="flex flex-col items-center">
    <motion.div
      className="w-24 h-24 bg-white bg-opacity-20 rounded-full mb-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div
      className="w-48 h-6 bg-white bg-opacity-20 rounded mb-2"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div
      className="w-32 h-4 bg-white bg-opacity-20 rounded"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </div>
)

export const ArtistSkeleton = () => (
  <motion.div
    className="bg-white bg-opacity-20 rounded-lg p-4"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full mx-auto mb-2" />
    <div className="w-3/4 h-4 bg-white bg-opacity-20 rounded mx-auto mb-1" />
    <div className="w-1/2 h-3 bg-white bg-opacity-20 rounded mx-auto" />
  </motion.div>
)

export const TrackSkeleton = () => (
  <motion.div
    className="bg-white bg-opacity-20 rounded-lg p-4 flex items-center space-x-4"
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-md" />
    <div className="flex-1">
      <div className="w-3/4 h-4 bg-white bg-opacity-20 rounded mb-1" />
      <div className="w-1/2 h-3 bg-white bg-opacity-20 rounded" />
    </div>
  </motion.div>
)
