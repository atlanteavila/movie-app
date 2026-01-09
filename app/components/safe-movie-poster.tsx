"use client";

import Image from "next/image";
import * as React from "react";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

const FALLBACK_SRC = "/poster-placeholder.jpg";

export function SafeMoviePoster({
  src,
  alt,
  className,
  width = 300,
  height = 450,
}: Props) {
  const [imgSrc, setImgSrc] = React.useState(src || FALLBACK_SRC);

  // If the src changes, update state (important when lists rerender).
  React.useEffect(() => {
    setImgSrc(src || FALLBACK_SRC);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt || 'no image for this poster'}
      width={width}
      height={height}
      className={className}
      // ✅ If the image 404s, swap to local fallback.
      onError={() => setImgSrc(FALLBACK_SRC)}
    />
  );
}
