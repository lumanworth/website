/* The wordmark footer. Letters light on hover; the name is read once, as a word. */
export default function Footer() {
  return (
    <footer className="foot ta">
      <div className="wrap">
        <a className="big" href="/" aria-label="Lumanworth home">
          {[..."LUMANWORTH"].map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}
        </a>
        <div className="row">
          <span>Perth, Western Australia</span>
          <a href="mailto:support@lumanworth.com">support@lumanworth.com</a>
          <div className="end">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms of use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
