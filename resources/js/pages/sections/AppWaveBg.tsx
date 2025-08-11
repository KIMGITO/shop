export default function WavyBg() {
    return (
      <div>
        <svg
          className="absolute inset-0 w-full h-full z-0 opacity-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="milkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fd78ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#db0f79" stopOpacity="0.8" />
            </linearGradient>
            <pattern
              id="milkPattern"
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
            >
              <circle cx="20" cy="20" r="3" fill="#fcba03" opacity="0.6" />
              <circle cx="50" cy="50" r="4" fill="#ff99e4" opacity="0.6" />
              <circle cx="80" cy="20" r="2" fill="#d61e5b" opacity="0.6" />
            </pattern>
          </defs>
          <path
            fill="url(#milkGradient)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="url(#milkPattern)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            opacity="0.3"
          ></path>
        </svg>
      </div>
    );
}