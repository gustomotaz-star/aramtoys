import { Link } from 'react-router-dom';

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className={`logo ${compact ? 'logo-compact' : ''}`} aria-label="Aram Toys">
      {['A','R','A','M'].map((letter, index) => <span key={`${letter}-${index}`} className="logo-tile">{letter}</span>)}
    </Link>
  );
}
