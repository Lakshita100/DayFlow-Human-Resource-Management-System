import { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  className?: string;
  altSuffix?: string;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, name, className = 'h-10 w-10 text-sm', altSuffix = 'profile photo' }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = !!src && !imgFailed;

  return showImage ? (
    <img
      src={src ?? undefined}
      alt={`${name} ${altSuffix}`}
      onError={() => setImgFailed(true)}
      className={`shrink-0 rounded-full object-cover object-center ring-2 ring-gray-100 ${className}`}
    />
  ) : (
    <div
      role="img"
      aria-label={`${name} ${altSuffix}`}
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ring-2 ring-gray-100 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
