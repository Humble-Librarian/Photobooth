import { useEffect, useState } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobile = /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(userAgent);
      setIsMobile(mobile || window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
} 