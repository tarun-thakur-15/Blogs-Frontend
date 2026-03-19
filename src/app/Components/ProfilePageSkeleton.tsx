export default function ProfilePageSkeleton() {
  return (
    <>
      <main className="main profile">
        <div className="container">
          {/* skeleton */}
          {/* Header Skeleton */}
          <div className="company-header flex items-center justify-between flex-wrap gap-[20px] animate-pulse">
            {/* Left section */}
            <div className="flex items-center">
              {/* Avatar */}
              <div className="wrapper">
                <div className="file-upload">
                  <div className="w-[68px] h-[68px] rounded-full bg-gray-300 dark:bg-gray-700 !important"></div>
                </div>
              </div>

              {/* Info */}
              <div className="company-header-info flex flex-col gap-[5px] ml-[10px]">
                {/* Full name */}
                <div className="flex items-center gap-[8px]">
                  <div className="h-[20px] w-[160px] bg-gray-300 dark:bg-gray-700 rounded !important"></div>
                </div>

                {/* Username + stats */}
                <div className="company-header-details flex items-center gap-[8px] mt-2!">
                  <div className="h-[14px] w-[90px] bg-gray-300 dark:bg-gray-700 rounded !important"></div>

                  <div className="h-[4px] w-[4px] bg-gray-300 dark:bg-gray-700 rounded-full !important"></div>

                  <div className="h-[14px] w-[100px] bg-gray-300 dark:bg-gray-700 rounded !important"></div>

                  <div className="h-[4px] w-[4px] bg-gray-300 dark:bg-gray-700 rounded-full !important"></div>

                  <div className="h-[14px] w-[110px] bg-gray-300 dark:bg-gray-700 rounded !important"></div>

                  <div className="h-[4px] w-[4px] bg-gray-300 dark:bg-gray-700 rounded-full !important"></div>

                  <div className="h-[14px] w-[70px] bg-gray-300 dark:bg-gray-700 rounded !important"></div>
                </div>
              </div>
            </div>

            
          </div>
          <div className="company-tabs mt-2 animate-pulse">
            <div className="flex flex-col about-section">
              {/* About text skeleton */}
              <div className="flex gap-2 mb-4 overflow-x-auto sm:flex-col sm:overflow-visible hide-scrollbar">
                <div className="flex-shrink-0 h-[44.8px] w-[100px] lg:w-[60%] bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex-shrink-0 h-[44.8px] w-[100px] lg:w-[60%] bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex-shrink-0 h-[44.8px] w-[100px] lg:w-[60%] bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex-shrink-0 h-[44.8px] w-[100px] lg:w-[60%] bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
