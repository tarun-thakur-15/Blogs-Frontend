import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6 md:p-12 font-serif">
      <div className="max-w-3xl w-full text-center flex flex-col items-center px-4">
        {/* Top Spacing / Icon */}
        <div className="mb-10 text-amber-600">
          <svg
            className="w-16 h-16 mx-auto"
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

        {/* Large 404 Display */}
        <div className="relative mb-12">
          <h1 className="text-[100px] sm:text-[150px] md:text-[200px] font-black text-gray-200/60 leading-none select-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-6 py-2 rounded-full text-xs md:text-sm font-sans font-bold uppercase tracking-[0.3em] shadow-sm border border-gray-100 text-gray-800">
              Page Not Found
            </span>
          </div>
        </div>

        {/* Text Content with proper line-height and padding */}
        <div className="space-y-6 mb-12 px-2">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1]">
            Lost in the archives?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto font-sans leading-relaxed">
            The article you’re looking for has either moved to a new collection
            or was never published. Let's get you back to the latest stories.
          </p>
        </div>

        {/* Button Group with proper responsive padding and width */}
        <div className="flex justify-center mt-6">
          <div
            className="px-[20px] w-full max-w-sm bg-white/80 backdrop-blur-md
               border border-neutral-200
               rounded-2xl py-3 shadow-lg"
          >
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full
                 bg-black text-white px-6 py-3 rounded-xl
                 font-medium tracking-wide
                 transition-all duration-200
                 hover:bg-neutral-800
                 hover:shadow-md
                 active:scale-[0.97]
                 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <span className="text-base">←</span>
              Back to Feed
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
