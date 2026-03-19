const DetailedBlogHeaderSkeleton = () => {
  return (
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

      {/* Follow button area */}
      <div className="company-header--btns flex items-center gap-[12px]">
        <div className="h-[34px] w-[110px] bg-gray-300 dark:bg-gray-700 rounded-md !important"></div>
      </div>
    </div>
  );
};

export default DetailedBlogHeaderSkeleton;
