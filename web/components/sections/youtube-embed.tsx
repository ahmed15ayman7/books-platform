"use client";

interface YoutubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
}

export function YoutubeEmbed({ videoId, title, className }: YoutubeEmbedProps) {
  return (
    <div className={`aspect-video overflow-hidden rounded-xl bg-black ${className ?? ""}`}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
