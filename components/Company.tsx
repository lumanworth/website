export default function Company() {
  return (
    <section className="sec company" id="company" aria-labelledby="company-h">
      <div className="wrap">
        <div>
          <h2 id="company-h">The company</h2>
          <p className="lede">Lumanworth is a software company in Perth, Western Australia, privately owned and run by its founder. You deal with the person who designs and builds your product, from the first email to the handover.</p>
        </div>
        <dl className="facts">
          <dt>Based</dt><dd>Perth, Western Australia</dd>
          <dt>Work</dt><dd>Workflow and consulting, business systems, AI in the workflow, websites and apps, built and handed over</dd>
          <dt>Clients</dt><dd>Most of our work comes by introduction. We do not publish client names.</dd>
          <dt>Email</dt><dd><a href="mailto:support@lumanworth.com">support@lumanworth.com</a></dd>
        </dl>
      </div>
    </section>
  );
}
