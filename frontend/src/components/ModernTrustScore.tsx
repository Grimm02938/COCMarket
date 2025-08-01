
import { Star } from "lucide-react";

export const ModernTrustScore = () => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
        
        {/* Layout horizontal comme dans l'image */}
        <div className="flex items-center space-x-6">
          {/* Left side: Green ribbon icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-20 bg-gradient-to-b from-green-400 to-green-500 rounded-lg flex items-center justify-center relative">
              {/* White ribbon/award icon */}
              <div className="w-8 h-10 bg-white rounded-sm flex items-center justify-center">
                <div className="w-4 h-6 bg-green-500 rounded-sm"></div>
              </div>
              {/* Small diamond shapes for decoration */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-green-300 rotate-45"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-300 rotate-45"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 bg-green-300 rotate-45"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-green-300 rotate-45"></div>
            </div>
            
            {/* Five stars below the icon */}
            <div className="flex items-center justify-center space-x-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="relative">
                  {/* Star-like diamond shape */}
                  <div className="w-4 h-4 bg-green-400 rotate-45 rounded-sm"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-green-400 rotate-45 scale-75 rounded-sm"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical separator */}
          <div className="h-20 w-px bg-gray-600"></div>

          {/* Right side content */}
          <div className="flex-1">
            {/* TrustScore text */}
            <div className="text-white text-lg font-semibold mb-1">TrustScore</div>
            
            {/* Large 4.5 number */}
            <div className="text-white text-5xl font-bold mb-2">4.5</div>
            
            {/* Right side - Base sur and 200 reviews */}
            <div className="text-right">
              <div className="text-gray-300 text-sm">Basé sur</div>
              <div className="text-green-400 text-lg font-semibold">Excellent</div>
              <div className="text-gray-400 text-sm mt-1">200+ avis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
