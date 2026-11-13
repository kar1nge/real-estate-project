import type { ImgHTMLAttributes } from "react";

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
  return (
    <span
      className={`block animate-pulse overflow-hidden bg-gradient-to-br from-[#18352F] via-[#244E45] to-[#18352F] ${frameClassName}`}
    >
      <img
        {...imageProps}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={className}
      />
    </span>
  );
}

export default AnimatedImage;
