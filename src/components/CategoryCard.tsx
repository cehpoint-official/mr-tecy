import Image from "next/image"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
    image: string
    label: string
    onClick?: () => void
    className?: string
}

export function CategoryCard({ image, label, onClick, className }: CategoryCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative flex flex-col items-center overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 h-28 bg-slate-100",
                className
            )}
        >
            {/* Background Image */}
            <Image
                src={image}
                alt={label}
                fill
                sizes="(max-width: 768px) 25vw, 200px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                <span className="text-sm font-bold text-white drop-shadow-lg">{label}</span>
            </div>
        </button>
    )
}
