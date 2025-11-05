import { motion } from "framer-motion";

export function AnimatedCircles() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
      {/* Círculos grandes */}
      <motion.div
        className="absolute -right-1/4 -top-1/4 w-3/4 h-3/4 rounded-full bg-gradient-to-br from-[#4e04f6]/30 to-[#8004f5]/30"
        animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, -50, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-1/4 -bottom-1/4 w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-[#b707e9]/30 to-[#e10ade]/30"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, 50, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/4 top-1/4 w-2/3 h-2/3 rounded-full bg-gradient-to-bl from-[#4e04f6]/30 to-[#8004f5]/30"
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, 30, 0], rotate: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Más círculos animados para el fondo */}
      <motion.div
        className="absolute right-1/3 top-1/3 w-1/2 h-1/2 rounded-full bg-gradient-to-br from-[#8004f5]/30 to-[#b707e9]/30"
        animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -40, 0], rotate: [0, 25, 0] }}
        transition={{ duration: 11, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/5 bottom-1/4 w-1/3 h-1/3 rounded-full bg-gradient-to-tl from-[#e10ade]/30 to-[#4e04f6]/30"
        animate={{ scale: [1, 1.5, 1], x: [0, -30, 0], y: [0, 30, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  );
}
