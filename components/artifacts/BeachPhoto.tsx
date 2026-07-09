/**
 * The photograph. It appears in every era of the piece: as a filename
 * in the terminal, a row in a window, a tile under a thumb, a search
 * result, a prediction — and in Scene 3, a memory that finds you.
 * The first color in the piece.
 */
export default function BeachPhoto() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 270" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="400" height="150" fill="#7E93A8" />
      <circle cx="96" cy="52" r="26" fill="#E3D5AE" />
      <rect y="150" width="400" height="62" fill="#4F6478" />
      <path d="M0 150 Q50 144 100 150 T200 150 T300 150 T400 150 V158 Q350 164 300 158 T200 158 T100 158 T0 158 Z" fill="#5D7488" />
      <rect y="212" width="400" height="58" fill="#BFB093" />
      <path d="M0 212 Q80 206 160 212 T400 210 V218 H0 Z" fill="#CDBFA2" />
    </svg>
  );
}
