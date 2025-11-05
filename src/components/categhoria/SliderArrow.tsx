import type React from "react"
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"

interface SliderArrowProps {
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  direction: "left" | "right"
}

const SliderArrow: React.FC<SliderArrowProps> = ({ className, style, onClick, direction }) => {
  return (
    <div
      className={`${className} z-10 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all duration-200`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      {direction === "left" ? (
        <AiOutlineArrowLeft className="text-2xl text-gray-800" />
      ) : (
        <AiOutlineArrowRight className="text-2xl text-gray-800" />
      )}
    </div>
  )
}

export default SliderArrow

