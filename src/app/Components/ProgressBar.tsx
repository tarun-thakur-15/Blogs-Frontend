"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import styles

NProgress.configure({ showSpinner: false });

const ProgressBar = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    NProgress.start();

    const timer = setTimeout(() => {
      setLoading(false);
      NProgress.done();
    }, 500); // Simulate delay

    return () => clearTimeout(timer);
  }, [pathname]); // Triggers on path change

  return null;
};

export default ProgressBar;
