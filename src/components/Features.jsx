const STEPS = [
  {
    n: '01',
    title: 'Push to main',
    body: 'A commit on GitHub is the only trigger. No buttons, no dashboards, no SSH by hand.',
  },
  {
    n: '02',
    title: 'Runner joins the tailnet',
    body: 'A throwaway machine connects to the private network, does its job, and deletes itself.',
  },
  {
    n: '03',
    title: 'Container rebuilds',
    body: 'The server pulls the code and rebuilds the image. Old container out, new one in.',
  },
  {
    n: '04',
    title: 'Live worldwide',
    body: 'A tunnel reaches out to the edge network, so the site is public with no open ports.',
  },
]

export default function Features() {
  return (
    <section className="features" id="how">
      <h2>Four steps, zero clicks</h2>
      <div className="grid">
        {STEPS.map((s) => (
          <article className="card" key={s.n}>
            <span className="num">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
