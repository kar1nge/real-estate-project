import { useState, type ImgHTMLAttributes } from "react";

interface AnimatedImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad" | "onError"> {
  frameClassName?: string;
}

function AnimatedImage({
  src,
  alt,
  className = "",
  frameClassName = "",
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  ...imageProps
}: AnimatedImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | undefined>();
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const isLoaded = loadedSrc === src;
  const hasFailed = failedSrc === src;

  return (
    <span
      className={`relative isolate block overflow-hidden bg-[#18352F] ${frameClassName}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-[#18352F] via-[#244E45] to-[#18352F] transition-opacity duration-500 ${
          isLoaded || hasFailed ? "animate-none opacity-0" : "animate-pulse opacity-100"
        }`}
      />
      <img
        {...imageProps}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setFailedSrc(src)}
        style={{
          ...imageProps.style,
          transitionProperty: "opacity, transform",
          transitionDuration: "700ms",
        }}
        className={`${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </span>
  );
}

export default AnimatedImage;
