import Link from 'next/link';

export default async function Index() {
  const usps = [
    {
      title: 'AI-Powered Grading',
      description:
        'Automated, accurate grading based on teacher-defined criteria, saving time and ensuring consistency.',
    },
    {
      title: 'Customizable Success Metrics',
      description:
        'Tailor success criteria to match specific educational goals and standards for each assignment.',
    },
    {
      title: 'Real-Time Feedback',
      description:
        'Immediate insights and feedback for students, enhancing learning and allowing for timely improvements.',
    },
  ];

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-20">
      <main className="mt-24 flex max-w-4xl flex-1 flex-col gap-6">
        <h2 className="mb-4 text-4xl font-thin text-yellow-600">Qualia.ai</h2>
        <div
          className={[
            'flex *:relative *:aspect-square *:max-w-80',
            '*:p-4',
            '*:border-collapse',
            "*:after:absolute *:after:inset-x-4 *:after:inset-y-0 *:after:border-y *:after:border-zinc-300 *:after:content-['']",
            "*:before:absolute *:before:inset-x-0 *:before:inset-y-4 *:before:border-l *:before:border-zinc-300 *:before:content-['']",
          ].join(' ')}
        >
          {usps.map((usp, index) => (
            <div
              key={index}
              className={usps.length - 1 === index ? 'before:border-r' : ''}
            >
              <h3 className="mb-2 mb-4 text-xl font-thin text-yellow-700">
                {usp.title}
              </h3>
              <p>{usp.description}</p>
            </div>
          ))}
        </div>
        <div>
          Qualia.ai is invite only.{' '}
          <Link href="/login" className="font-bold hover:underline">
            Login
          </Link>
          {' / '}
          <Link href="/waitinglist" className="font-bold hover:underline">
            Join waitinglist
          </Link>
        </div>
      </main>

      <footer className="flex w-full justify-center border-t border-t-foreground/10 p-8 text-center text-xs">
        <p>Built by Joel Sandén in Falkenberg, Sweden with 🩸💦 and 😂</p>
      </footer>
    </div>
  );
}
