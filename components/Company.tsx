import { COMPANY, PROMISES } from "@/lib/words";

/* Your records, then Perth: two bands, no client names. The link to Security and data lands with that page. */
export function Records() {
  return (
    <section className="band ta" id="data" aria-labelledby="data-h">
      <div className="wrap data">
        <h2 id="data-h" data-r>Your records never<br />reach our tools.</h2>
        <dl data-r>
          {PROMISES.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function Company() {
  return (
    <section className="co band ta" id="company" aria-labelledby="co-h">
      <div className="wrap">
        <h2 id="co-h" data-r>Perth,<br />Western Australia.</h2>
        <div className="under" data-r>
          <p className="lede">{COMPANY}</p>
          <dl>
            <div><dt>Clients</dt><dd>Most of our work comes by introduction. We do not publish client names.</dd></div>
            <div><dt>Email</dt><dd><a href="mailto:support@lumanworth.com">support@lumanworth.com</a></dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
