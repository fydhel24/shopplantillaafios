import { motion } from "framer-motion"

export function AnimatedCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-purple-300/30 to-pink-300/30"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-tr from-blue-300/30 to-green-300/30"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
          y: [0, 20, 0],
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/4 top-1/4 w-1/3 h-1/3 rounded-full bg-gradient-to-bl from-yellow-300/30 to-red-300/30"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 15, 0],
          y: [0, 15, 0],
          rotate: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  )
}

