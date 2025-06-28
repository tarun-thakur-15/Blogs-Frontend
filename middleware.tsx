// "use client"
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, ReactNode } from "react";
// import Cookies from "js-cookie";

// interface RouteGuardProps {
//   children: ReactNode;
// }

// const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const accessToken = Cookies.get("accessToken");

//     if (!accessToken && (pathname.startsWith("/myprofile") || pathname.startsWith("/settings"))) {
//       router.replace("/");
//     } else if (accessToken && pathname === "/") {
//       router.replace("/detailBlogs");
//     }
//   }, [pathname, router]);

//   return <>{children}</>;
// };

// export default RouteGuard;
