const kinds = [
  {
    title: "Workflow and consulting",
    body: "Where every job starts, and where some of them end. We sit with the people doing the work, map how a day actually runs, and take out the steps that waste it. Sometimes the answer is new software. Often it is a small tool, a link between systems you already have, or a change in how work moves.",
    example: "For example, a quoting process that lived in three spreadsheets and an inbox, rebuilt as one form that feeds the job, the invoice and the monthly report.",
  },
  {
    title: "Business systems",
    body: "The software a company runs on, and the work we know best. Many users, many roles, approvals, work in the field with no signal, records that hold up in an audit, and reporting the owner can trust.",
    example: "For example, a maintenance system for an industrial operation: crews capture work offline, it syncs when they are back in range, supervisors see the day on one screen, and every record shows who did what and when.",
  },
  {
    title: "AI in the workflow",
    body: "AI put to work inside the system, not bolted on the side. It reads your own documents and records, answers with the source attached, and a person still makes the call. We use it where it saves real time and where the answer can be checked.",
    example: "For example, a technician asks a question in plain words and gets the answer from your own manuals and job history, with the page it came from, instead of an hour in a PDF.",
  },
  {
    title: "Websites and apps",
    body: "The front door and the tools around it. Company and product sites, customer portals, and phone apps for staff and customers. Fast, accessible, and easy for your own people to change.",
    example: "For example, a company site your office can edit without calling anyone, with a portal behind it where clients see their jobs and pay.",
  },
];

export default function Kinds() {
  return (
    <section className="sec" id="build" aria-labelledby="build-h">
      <div className="wrap split">
        <div className="stick">
          <h2 id="build-h">What we do</h2>
          <p className="lede">We take the parts of a business that run on spreadsheets, paper, phone calls and memory, and turn them into systems people actually use.</p>
          <p className="small">Four kinds of work, one way of doing it. You bring the problem and the people who live with it every day. We bring the questions, the plan and the build, and every job ends with a handover pack.</p>
        </div>
        <ol className="kinds">
          {kinds.map((k, i) => (
            <li key={k.title}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{k.title}</h3>
                <p>{k.body}</p>
                <p className="eg">{k.example}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
