'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Loading from '@/app/loading';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const [status, setStatus] = useState<'verifying' | 'authorized' | 'unauthorized'>('verifying');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const minLoadingTime = 4000; // 4 seconds as requested

    const verify = async () => {
      // 1. Get verification data
      const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
      const userInfo = localStorage.getItem('adminUser');
      let userRole = '';
      
      if (userInfo) {
        try {
          const parsed = JSON.parse(userInfo);
          userRole = parsed.role || '';
        } catch {
          console.error('Failed to parse user info');
        }
      }

      // 2. Perform authorization check
      let isAuthorized = isAuthenticated;
      if (isAuthorized && requiredRoles && requiredRoles.length > 0) {
        isAuthorized = requiredRoles.includes(userRole);
      }

      // 3. Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      await new Promise(resolve => setTimeout(resolve, remainingTime));

      if (!isMounted) return;

      if (isAuthorized) {
        setStatus('authorized');
      } else {
        setStatus('unauthorized');
        // If not authenticated at all, redirect to login
        if (!isAuthenticated) {
          router.push('/admin');
        } else {
          // If authenticated but not authorized for this specific page
          router.push('/forbidden');
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [requiredRoles, router, pathname]);

  if (status === 'verifying') {
    return <Loading />;
  }

  if (status === 'unauthorized') {
    // Return null or a subtle placeholder while redirecting
    return null;
  }

  return <>{children}</>;
}
