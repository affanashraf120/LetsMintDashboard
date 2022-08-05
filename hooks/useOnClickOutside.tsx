import { RefObject, useEffect } from 'react';

type AnyEvent = MouseEvent | TouchEvent

const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  // eslint-disable-next-line
  handler: (event: AnyEvent) => void,
): void => {
  useEffect(() => {
    const listener = (event: AnyEvent) => {
      const el = ref?.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };

    // Reload only if ref or handler changes
  }, [ref, handler]);
};

export default useOnClickOutside;

// Usage
// import React, { useRef } from 'react'

// import useOnClickOutside from './useOnClickOutside'

// export default function Component() {
//   const ref = useRef(null)

//   const handleClickOutside = () => {
//     // Your custom logic here
//     console.log('clicked outside')
//   }

//   const handleClickInside = () => {
//     // Your custom logic here
//     console.log('clicked inside')
//   }

//   useOnClickOutside(ref, handleClickOutside)

//   return (
//     <div
//       ref={ref}
//       onClick={handleClickInside}
//       style={{ width: 200, height: 200, background: 'cyan' }}
//     />
//   )
// }