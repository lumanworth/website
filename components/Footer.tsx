import Symbol from "./Symbol";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <a className="lockup" href="/" aria-label="Lumanworth home">
          <Symbol />
          <span className="word">Lumanworth</span>
        </a>
        <span>Perth, Western Australia</span>
        <div className="end">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms of use</a>
        </div>
      </div>
    </footer>
  );
}
