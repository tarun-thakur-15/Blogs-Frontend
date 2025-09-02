"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import defaultIamge from "../../../public/images/redDot.png";

const CustomAutoComplete: React.FC = () => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const onSearch = (query: string) => {
    setValue(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setOptions([]);
        setIsOpen(false);
        return;
      }

      try {
        const response = await searchBlogsAndUsers(query);
        const blogs = response.blogs || [];
        const users = response.users || [];

        const blogOptions = blogs.map((blog: any) => (
          <CommandItem
            key={`blog-${blog._id}`}
            value={blog.title}
            className="p-2"
          >
            <Link
              href={`/${blog.slug}`}
              onClick={() => NProgress.start()}
              className="flex flex-col sm:flex-row sm:items-center justify-between w-full p-2 rounded-lg hover:bg-accent transition-colors mt-[6px] !px-[10px]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                {/* LEFT: Profile image */}
                <div className="h-[30px] w-[30px] overflow-hidden border-[100%]">
                  <Image
                    src={
                      blog.author.profileImage?.startsWith("http")
                        ? blog.author.profileImage
                        : `https://blogs-backend-ftie.onrender.com/${blog.author.profileImage}`
                    }
                    alt={blog.author.fullName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover h-full w-full"
                  />
                </div>

                {/* MIDDLE: Title + Topic */}
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base text-foreground !mb-0">
                    {blog.title}
                  </p>
                  <p className="!text-xs sm:text-sm text-muted-foreground !mb-0">
                    {blog.topic}
                  </p>
                </div>

                {/* RIGHT: Author + Username + Date */}
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
          <CommandItem
            key={`user-${user._id}`}
            value={user.fullName}
            className="p-2"
          >
            <Link
              href={`/user/${user.username}`}
              onClick={() => NProgress.start()}
              className="flex items-center gap-3 w-full mt-[6px] h-[40px] justify-center"
            >
              <div className="h-[30px] w-[33px] overflow-hidden !ml-[10px]">
                <Image
                  src={
                    user.profileImage?.startsWith("http")
                      ? user.profileImage
                      : `https://blogs-backend-ftie.onrender.com/${user.profileImage}`
                     
                  }
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
              
              heading={
    <h4 className="px-3 py-1 pl-[10px] text-xs font-semibold text-foreground bg-muted">
      Users
    </h4>
  }
              key="users"
              
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
      }
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="relative w-full !mb-5">
<div className="relative ">
  {/* Search Icon */}
  <div className="absolute inset-y-0 left-0 flex items-center !pl-3 pointer-events-none">
    <SearchIcon className="w-5 h-5 text-muted-foreground searchIcon" />
  </div>

  {/* Input Field */}
  <Input
    value={value}
    onChange={(e) => onSearch(e.target.value)}
    placeholder="Search blogs or users"
    className="w-full !pl-[35px] h-11 rounded-lg border border-input bg-background shadow-sm focus:ring-2 focus:ring-primary"
  />
</div>


      {isOpen && (
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
