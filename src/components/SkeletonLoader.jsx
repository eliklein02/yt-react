import React from 'react'

const SkeletonLoader = () => {
  return (
   <>
    <svg role="img" width="360px" height="202px" aria-labelledby="loading-aria" viewBox="0 0 100 100" preserveAspectRatio="none">
        <title id="loading-aria">Loading...</title>
        <rect x="0" y="0" width="100%" height="100%" rx="5" ry="5" style={{ fill: '#f2f2f2' }} />
        <rect x="0" y="0" width="100%" height="100%" clipPath="url(#clip-path)" style={{ fill: 'url(#fill)' }} />
        <defs>
          <clipPath id="clip-path">
            <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
          </clipPath>
          <linearGradient id="fill">
            <stop offset="0.599964" stopColor="#d9d9d9" stopOpacity="0">
              <animate attributeName="offset" values="-2; -2; 1" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="1.59996" stopColor="#d9d9d9" stopOpacity="1">
              <animate attributeName="offset" values="-1; -1; 2" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="2.59996" stopColor="#d9d9d9" stopOpacity="0">
              <animate attributeName="offset" values="0; 0; 3" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      </svg>
   </>
  )
}

export default SkeletonLoader