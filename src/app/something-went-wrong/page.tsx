import Link from "next/link";

export default function SomethingWentWrong() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="!text-[22px] lg:text-3xl font-semibold text-red-600 mb-4">
        Something went wrong...
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        We're sorry for the inconvenience. Please try again or go back home.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
