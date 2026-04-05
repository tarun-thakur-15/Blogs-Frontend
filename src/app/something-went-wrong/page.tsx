import Link from "next/link";

export default function NotFound() {
  return (
    <main className="h-[calc(100vh-75px)] flex items-center justify-center px-5 py-10 bg-linear-to-br from-[#f8f7f4] to-[#f1f1ee]">
      <section className="w-full h-full text-center flex justify-center items-center flex-col px-5">

        {/* 404 Number */}
        <h1 className="text-[90px] sm:text-[120px] md:text-[160px] font-extrabold tracking-tight text-gray-200 leading-none select-none">
          404
        </h1>

        {/* Card */}
        <div className="relative -mt-10 bg-white/70 backdrop-blur-xl border border-neutral-200 rounded-3xl shadow-xl px-6 flex flex-col justify-center items-center py-5!">

          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-2xl bg-black/5">
              <svg
                className="w-8 h-8 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Lost in the archives?
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
            The page you're looking for doesn’t exist or has been moved. Let’s
            get you back to something useful.
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto
                       bg-black text-white px-6 py-3 rounded-xl
                       text-sm sm:text-base font-medium tracking-wide
                       transition-all duration-200
                       hover:bg-neutral-800 hover:shadow-lg
                       active:scale-[0.96]
                       focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <span>←</span>
            Back to Feed
          </Link>

        </div>
      </section>
    </main>
  );
}