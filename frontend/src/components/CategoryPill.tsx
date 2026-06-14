interface CategoryPillProps {
  text: string;
  variant?: 'default' | 'gold' | 'emerald';
}

export default function CategoryPill({ text, variant = 'default' }: CategoryPillProps) {
  const styles = {
    default: 'bg-royal-purple/15 border-royal-purple/30 text-royal-purple',
    gold: 'bg-gold/15 border-gold/30 text-gold',
    emerald: 'bg-emerald/15 border-emerald/30 text-emerald',
  };

  return (
    <span className={`inline-block px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-[0.15em] ${styles[variant]}`}>
      {text}
    </span>
  );
}
