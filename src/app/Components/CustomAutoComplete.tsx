"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import Image from "next/image";
import Link from "next/link";
import { searchBlogsAndUsers } from "../services/api";
import NProgress from "nprogress";
import SearchIcon from "../../../public/images/search.svg";

const DEFAULT_AVATAR = "https://www.tarunthakur.com/lekhan/images/default-user.webp";
const backendBaseUrl = "https://blogs-backend-ftie.onrender.com";

function getImageSrc(img: string | undefined) {
  if (!img) return DEFAULT_AVATAR;
  if (img.startsWith("http")) return img;
  return `${backendBaseUrl}/${img}`;
}

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export const SafeImage = ({ src, alt, width, height, className }: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (imgSrc !== DEFAULT_AVATAR) setImgSrc(DEFAULT_AVATAR);
      }}
    />
  );
};

// ✅ Skeleton shimmer components matching the real result layout
const SkeletonBlogItem = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full p-2 rounded-lg pt-0! my-[6px]! gap-2">
    {/* Avatar */}
    <div className="h-7.5 w-7.5 rounded-full bg-muted animate-pulse shrink-0" />
    {/* Title + topic */}
    <div className="flex-1 flex flex-col gap-1.5">
      <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
      <div className="h-2.5 w-1/3 rounded bg-muted animate-pulse" />
    </div>
    {/* Author + date */}
    <div className="flex flex-col items-end gap-1.5 shrink-0">
      <div className="h-3 w-20 rounded bg-muted animate-pulse" />
      <div className="h-2.5 w-14 rounded bg-muted animate-pulse" />
    </div>
  </div>
);

const SkeletonUserItem = () => (
  <div className="flex items-center gap-3 w-full mt-[6px] h-[40px] px-[10px]">
    {/* Avatar */}
    <div className="h-[30px] w-[30px] rounded-full bg-muted animate-pulse shrink-0 ml-[10px]" />
    {/* Name + username */}
    <div className="flex gap-2 items-center">
      <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
      <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
    </div>
  </div>
);

const SkeletonSectionHeading = ({ label }: { label: string }) => (
  <div className="px-3 py-1! pl-[10px]">
    <div className="h-3 w-10 rounded bg-muted animate-pulse" />
  </div>
);

const SearchSkeleton = () => (
  <div className="absolute p-2.5 z-50 mt-1 w-full bg-background border border-border rounded-lg shadow-lg overflow-hidden">
    {/* Blogs section */}
    <SkeletonSectionHeading label="Blogs" />
    <SkeletonBlogItem />
    <SkeletonBlogItem />
    {/* Users section */}
    <div className="border-t border-border mt-1 pt-2.5!">
      <SkeletonSectionHeading label="Users" />
      <SkeletonUserItem />
      <SkeletonUserItem />
    </div>
  </div>
);

const CustomAutoComplete: React.FC = () => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ loading state
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const onSearch = (query: string) => {
    setValue(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setOptions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    // ✅ Show skeleton immediately when user starts typing
    setIsLoading(true);
    setIsOpen(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await searchBlogsAndUsers(query);
        const blogs = response.blogs || [];
        const users = response.users || [];

        const blogOptions = blogs.map((blog: any) => (
          <CommandItem key={`blog-${blog._id}`} value={blog.title} className="p-2">
            <Link
              href={`/${blog.slug}`}
              onClick={() => NProgress.start()}
              className="flex flex-col sm:flex-row sm:items-center justify-between w-full p-2 rounded-lg hover:bg-accent transition-colors mt-[6px] !px-[10px]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                <div className="h-[30px] w-[30px] overflow-hidden border-[100%]">
                  <SafeImage
                    src={getImageSrc(blog.author.profileImage)}
                    alt={blog.author.fullName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover h-full w-full"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base text-foreground !mb-0">
                    {blog.title}
                  </p>
                  <p className="!text-xs sm:text-sm text-muted-foreground !mb-0">
                    {blog.topic}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end text-right self-start">
                  <p className="!text-xs sm:!text-sm text-foreground font-medium !mb-0">
                    {blog.author.fullName}
                  </p>
                  <p className="!text-xs text-muted-foreground !mb-0">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          </CommandItem>
        ));

        const userOptions = users.map((user: any) => (
          <CommandItem key={`user-${user._id}`} value={user.fullName} className="p-2">
            <Link
              href={`/user/${user.username}`}
              onClick={() => NProgress.start()}
              className="flex items-center gap-3 w-full mt-[6px] h-[40px] justify-center"
            >
              <div className="h-[30px] w-[33px] overflow-hidden !ml-[10px]">
                <SafeImage
                  src={getImageSrc(user.profileImage)}
                  alt={user.fullName}
                  width={36}
                  height={36}
                  className="rounded-full object-cover h-full w-full"
                />
              </div>
              <div className="flex w-full justify-start items-center gap-[10px] h-6">
                <p className="m-0 font-medium !mb-0">{user.fullName}</p>
                <p className="m-0 !text-xs text-muted-foreground !mb-0">
                  @{user.username}
                </p>
              </div>
            </Link>
          </CommandItem>
        ));

        const allOptions = [];

        if (blogOptions.length > 0) {
          allOptions.push(
            <CommandGroup
              key="blogs"
              heading={
                <h4 className="px-3 py-1 pl-[10px] text-xs font-semibold text-foreground bg-muted">
                  Blogs
                </h4>
              }
            >
              {blogOptions}
            </CommandGroup>
          );
        }

        if (userOptions.length > 0) {
          allOptions.push(
            <CommandGroup
              key="users"
              heading={
                <h4 className="px-3 py-1 pl-[10px] text-xs font-semibold text-foreground bg-muted">
                  Users
                </h4>
              }
            >
              {userOptions}
            </CommandGroup>
          );
        }

        setOptions(allOptions);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setOptions([]);
      } finally {
        setIsLoading(false); // ✅ hide skeleton after API resolves
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsLoading(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full !mb-5">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center !pl-3 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-muted-foreground searchIcon" />
        </div>
        <Input
          value={value}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search blogs or users"
          className="w-full !pl-[35px] h-11 rounded-lg border border-input bg-background shadow-sm focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* ✅ Show skeleton while loading, real results after */}
      {isLoading && <SearchSkeleton />}

      {!isLoading && isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-background border border-border rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto">
          <Command>
            <CommandList>
              {options.length > 0 ? (
                options
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default CustomAutoComplete;