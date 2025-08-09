export default function Logo() {
  return (
    <svg className="heroLogo" width="320" height="92" viewBox="0 0 640 184" xmlns="http://www.w3.org/2000/svg" aria-label="trdy.">
      <defs>
        <linearGradient id="wmark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontFamily="Inter, system-ui" fontSize="96" fontWeight="900" fill="url(#wmark)">trdy.</text>
    </svg>
  );
}
