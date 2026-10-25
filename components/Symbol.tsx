/* The Lumanworth symbol. Three bars, geometry from brand/symbol.svg. Never altered; only scaled by CSS. */
export default function Symbol({ className = "sym", id }: { className?: string; id?: string }) {
  return (
    <svg className={className} id={id} viewBox="0 0 42 36" aria-hidden="true">
      <rect className="l1" x="1" y="3" width="28" height="7" rx="3.5" />
      <rect className="l2" x="13" y="15" width="28" height="7" rx="3.5" />
      <rect className="l3" x="1" y="27" width="28" height="7" rx="3.5" />
    </svg>
  );
}
