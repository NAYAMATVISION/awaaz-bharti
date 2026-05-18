"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Manual JWT decoder to avoid external dependencies
 */
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const useAuth = (allowedRoles = []) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPermissions([]);
    setIsAuthorized(false);
    router.push('/login');
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setIsLoading(false);
          if (allowedRoles.length > 0) {
            router.push('/login');
          }
          return;
        }

        const decoded = decodeToken(token);
        
        if (!decoded) {
          throw new Error('Invalid token');
        }

        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          throw new Error('Token expired');
        }

        // Fetch full profile for permissions
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }

        const result = await res.json();
        const fullUser = result.data;

        setUser(fullUser);
        setPermissions(fullUser.permissions || []);

        // Role-based check
        const userRole = fullUser.role;
        
        if (allowedRoles.length > 0) {
          if (userRole === 'admin') {
            setIsAuthorized(true);
          } else if (allowedRoles.includes(userRole)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        setUser(null);
        setPermissions([]);
        setIsAuthorized(false);
        if (allowedRoles.length > 0) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles.length]);

  return { user, permissions, isLoading, isAuthorized, logout };
};
