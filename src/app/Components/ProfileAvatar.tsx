// this is a client side component for profile image fallbacks created for situation when src in <image/> is present but actual image is broken. Use this Component as Image wrapper in Non CSR components.
"use client";

import Image from "next/image";
import { useState } from "react";

const DEFAULT_AVATAR = "https://www.tarunthakur.com/lekhan/images/default-user.webp";

interface ProfileAvatarProps {
  profileImage?: string | String;
  backendBaseUrl: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ProfileAvatar({
  profileImage,
  backendBaseUrl,
  alt = "profile picture",
  width = 40,
  height = 40,
  className = "",
}: ProfileAvatarProps) {
  function getImageSrc(img: any) {
    if (!img) return DEFAULT_AVATAR;

    // ✅ Cloudinary or any external URL
    if (img.startsWith("http")) {
      return img;
    }

    // ✅ Local image → prepend baseUrl
    return `${backendBaseUrl}/${img}`;
  }
  const initialSrc = getImageSrc(profileImage);

  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <Image
      className={className}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      onError={() => {
        if (imgSrc !== DEFAULT_AVATAR) {
          setImgSrc(DEFAULT_AVATAR);
        }
      }}
    />
  );
}
