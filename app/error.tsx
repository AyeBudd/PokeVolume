'use client';

export default function GlobalError({ error: _error, reset }: { error: Error; reset: () => void }): JSX.Element {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Something went wrong.</h1>
      <button type="button" onClick={reset} className="mt-3 rounded bg-white px-3 py-2 text-sm font-semibold text-black">
        Retry
      </button>
    </main>
  );
}
