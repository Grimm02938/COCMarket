
import { Star } from "lucide-react";

// Trustpilot logo as an SVG component for easy styling
const TrustpilotLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 24" fill="none" className="h-6 w-auto">
        <title>Trustpilot</title>
        <path d="M11.393 2.768l-4.52 3.328-1.745-6.096h1.86l.94 3.76 4.4-3.232h1.9l-4.4 3.232 2.65 9.28h-1.92l-1.845-6.728-2.615 1.92v6.624H0V0h11.393z" fill="#00b67a"></path>
        <path d="M22.012.008h-6.24v17.2h6.08c3.28 0 5.2-1.84 5.2-4.88 0-2.096-.92-3.6-2.52-4.28.96-.64 1.56-1.696 1.56-2.92 0-2.32-1.6-4.12-4.12-4.12zm-.16 7.4c.88 0 1.48.56 1.48 1.48 0 .96-.6 1.56-1.6 1.56h-3.8V8.408h3.92zm-.04-5.24c.76 0 1.28.48 1.28 1.28s-.52 1.28-1.28 1.28h-3.84V3.168h3.84zM36.191 17.208V.008h-1.88l-5.6 13.088V.008h-1.88v17.2h1.48l6-13.84v13.84h1.88zM42.302 4.168c-2.48 0-4.2 1.6-4.2 4.12s1.72 4.12 4.2 4.12c2.48 0 4.2-1.6 4.2-4.12s-1.72-4.12-4.2-4.12zm0 6.4c-1.2 0-1.92-.84-1.92-2.28s.72-2.28 1.92-2.28c1.2 0 1.92.84 1.92 2.28s-.72 2.28-1.92 2.28zM51.134 17.208V.008h-1.88v17.2h1.88zM61.967 12.368c.96-.64 1.56-1.696 1.56-2.92 0-2.32-1.6-4.12-4.12-4.12h-6.24v17.2h1.88V11.25l.2-.2h4.04c.88 0 1.48.56 1.48 1.48 0 .96-.6 1.56-1.6 1.56h-2.24v3.12h2.4c2.52 0 4.28-1.6 4.28-4.24 0-.96-.32-1.84-.8-2.52zM69.056.008h-1.88v17.2h1.88V.008zM78.607 10.608c0-2.4-1.56-4.28-4.16-4.28s-4.16 1.88-4.16 4.28c0 2.36 1.56 4.24 4.16 4.24 1.44 0 2.68-.6 3.48-1.56l-1.28-1.04c-.56.64-1.24 1-2.16 1-1.4 0-2.28-.96-2.28-2.64h6.52v-.4c0-2.52-1.64-4.2-4.28-4.2-2.52 0-4.2 1.68-4.2 4.12s1.68 4.12 4.2 4.12c2.08 0 3.52-1.24 4.04-2.88h-1.92c-.36.88-1.04 1.48-1.96 1.48-1.2 0-1.92-.84-1.92-2.28h4.08l.16.24zM74.447 8.328c.12-.96.76-1.72 1.72-1.72s1.48.72 1.64 1.72h-3.36zM89.658 6.328l-2.4-6.32h1.92l1.48 4.32 1.48-4.32h1.88l-2.4 6.32v10.88h-1.88V6.328z" fill="black"></path>
    </svg>
);

export const ModernTrustScore = () => {
    const rating = 4.8;
    const reviewCount = 218;
    const maxRating = 5;

    return (
        <div className="p-4 rounded-lg max-w-sm mx-auto font-sans flex items-center space-x-4">
            <TrustpilotLogo />
            <div className="flex-grow">
                <div className="flex items-center space-x-1">
                    {[...Array(maxRating)].map((_, i) => (
                        <div key={i} className="bg-[#00b67a] p-1 w-7 h-7 flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" fill="currentColor" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
