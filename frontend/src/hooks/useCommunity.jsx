// frontend/src/hooks/useCommunity.js
import { useEffect, useState } from 'react';
import { getCommunityFromUrl, setCommunityInUrl } from '../lib/api';

export default function useCommunity() {
  const [community, setCommunity] = useState(getCommunityFromUrl());

  useEffect(() => {
    setCommunityInUrl(community);
    // also persist locally (useful if user opens without ?community next time)
    try { localStorage.setItem('ciap:community', community); } catch {}
  }, [community]);

  return { community, setCommunity };
}
