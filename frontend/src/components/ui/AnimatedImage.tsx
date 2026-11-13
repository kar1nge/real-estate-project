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
  const isSettled = Boolean(src) && (loadedSrc === src || failedSrc === src);
  const framePosition = frameClassName.split(/\s+/).includes("absolute")
    ? ""
    : "relative";
  const imagePosition = className.split(/\s+/).includes("absolute")
    ? ""
    : "relative";

  return (
    <span
      className={`isolate block overflow-hidden ${framePosition} ${frameClassName}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#18352F] via-[#244E45] to-[#18352F] ${
          isSettled ? "" : "animate-pulse"
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
        className={`${imagePosition} z-10 ${className}`}
      />
    </span>
  );
}

export default AnimatedImage;
