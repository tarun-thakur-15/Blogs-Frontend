export default function BlogSkeleton() {
    return(
        <>
        <div className="awnser-box animate-pulse">
          {/* Header */}
          <div className="awnser-box-header">
            <div className="h-6 w-[70%] bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Body */}
          <div className="awnser-box-body flex flex-col gap-2">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-[95%] bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-[85%] bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          {/* Footer */}
          <div className="awnser-box-footer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left section */}
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="w-[40px] h-[40px] rounded-full bg-gray-300 dark:bg-gray-700"></div>

                {/* Username */}
                <div className="h-4 w-[80px] bg-gray-300 dark:bg-gray-700 rounded"></div>

                {/* Date */}
                <div className="h-4 w-[100px] bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>

              {/* Reactions */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>

                {/* Comment button */}
                <div className="flex gap-2">
                  <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
    )
}