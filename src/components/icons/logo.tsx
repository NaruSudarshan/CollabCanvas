import type { SVGProps } from 'react';

export function CollabCanvasLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="32" height="32" rx="6" fill="currentColor" />
      <path
        d="M10 10H16C18.2091 10 20 11.7909 20 14V14C20 16.2091 18.2091 18 16 18H10V10Z"
        fill="white"
        fillOpacity="0.8"
      />
      <path
        d="M22 22H16C13.7909 22 12 20.2091 12 18V18C12 15.7909 13.7909 14 16 14H22V22Z"
        fill="white"
        fillOpacity="0.8"
      />
    </svg>
  );
}
