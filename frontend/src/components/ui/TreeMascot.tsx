import { cn } from "@/lib/utils";

interface TreeMascotProps {
  className?: string;
  isThinking?: boolean;
}

export function TreeMascot({ className, isThinking }: TreeMascotProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Soft Green Glow */}
      <div className={cn(
        "absolute inset-0 bg-primary/20 rounded-full blur-xl transition-all duration-700",
        isThinking ? "animate-pulse bg-primary/40 scale-110" : "group-hover:bg-primary/30 group-hover:scale-105"
      )} />
      
      {/* SVG Tree Avatar */}
      <svg 
        viewBox="0 0 100 100" 
        className={cn(
          "w-full h-full relative z-10 drop-shadow-[0_4px_12px_rgba(34,197,94,0.4)]",
          !isThinking && "animate-breathe" // subtle up/down scaling
        )}
      >
        {/* Trunk */}
        <path d="M45,90 Q50,60 45,40 L55,40 Q50,60 55,90 Z" fill="#78350f" className="drop-shadow-md" />
        <path d="M48,90 Q50,60 52,40 L55,40 Q50,60 55,90 Z" fill="#92400e" />

        {/* Leaves / Canopy */}
        <g className="origin-bottom group-hover:animate-sway transition-transform">
          <circle cx="50" cy="35" r="25" fill="#22c55e" />
          <circle cx="35" cy="45" r="18" fill="#16a34a" />
          <circle cx="65" cy="45" r="18" fill="#15803d" />
          <circle cx="40" cy="25" r="15" fill="#4ade80" />
          <circle cx="60" cy="25" r="15" fill="#22c55e" />
          
          {/* Eyes */}
          <g className={cn(isThinking ? "animate-blink" : "group-hover:animate-blink")}>
            <circle cx="43" cy="40" r="3.5" fill="#ffffff" />
            <circle cx="57" cy="40" r="3.5" fill="#ffffff" />
            
            {/* Pupils */}
            <circle cx="44" cy="40" r="1.5" fill="#020617" />
            <circle cx="56" cy="40" r="1.5" fill="#020617" />
            
            {/* Eye Highlights */}
            <circle cx="43.5" cy="39.5" r="0.5" fill="#ffffff" />
            <circle cx="55.5" cy="39.5" r="0.5" fill="#ffffff" />
          </g>

          {/* Smile */}
          <path 
            d="M 45 46 Q 50 50 55 46" 
            stroke="#020617" 
            strokeWidth="1.5" 
            fill="transparent" 
            strokeLinecap="round" 
            className="transition-all duration-300 group-hover:d-[path('M 44 46 Q 50 52 56 46')]"
          />
        </g>
        
        {/* Floating Leaves (active when thinking or hover) */}
        <g className={cn("opacity-0 transition-opacity duration-300", isThinking || "group-hover:opacity-100")}>
          <path d="M20,30 Q25,25 30,30 Q25,35 20,30 Z" fill="#4ade80" className="animate-particle origin-center" style={{ animationDelay: '0ms' }} />
          <path d="M75,20 Q80,15 85,20 Q80,25 75,20 Z" fill="#22c55e" className="animate-particle origin-center" style={{ animationDelay: '300ms' }} />
          <path d="M80,60 Q85,55 90,60 Q85,65 80,60 Z" fill="#16a34a" className="animate-particle origin-center" style={{ animationDelay: '600ms' }} />
        </g>
      </svg>
    </div>
  );
}
