// News API proxy route
// Hides API key from client, transforms external API response

import { NextResponse } from 'next/server';
import { transformGNewsArticle, getMockNews } from '@/lib/newsApi';

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_BASE = 'https://gnews.io/api/v4';

// Simple in-memory cache to stay within free tier limits
const cache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

function getCacheKey(params) {
  return `${params.country || 'all'}-${params.category || 'top'}-${params.lang || 'en'}-${params.page || 1}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || '';
  const category = searchParams.get('category') || '';
  const lang = searchParams.get('lang') || 'en';
  const page = searchParams.get('page') || '1';

  const cacheKey = getCacheKey({ country, category, lang, page });

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  // If no API key, return mock data
  if (!GNEWS_API_KEY) {
    const mockData = getMockNews(category, country, lang);
    return NextResponse.json(mockData);
  }

  try {
    // Map our categories to GNews categories
    const categoryMap = {
      'top': 'general',
      'world': 'world',
      'politics': 'nation',
      'business': 'business',
      'technology': 'technology',
      'sports': 'sports',
      'entertainment': 'entertainment',
      'health': 'health',
      'science': 'science',
    };

    const gnewsCategory = categoryMap[category] || 'general';
    
    const params = new URLSearchParams({
      token: GNEWS_API_KEY,
      lang: lang,
      max: '10',
      topic: gnewsCategory,
    });

    if (country) {
      params.set('country', country);
    }

    const response = await fetch(`${GNEWS_BASE}/top-headlines?${params.toString()}`);
    
    if (!response.ok) {
      console.error('GNews API error:', response.status);
      const mockData = getMockNews(category, country, lang);
      return NextResponse.json(mockData);
    }

    const data = await response.json();
    
    const result = {
      totalResults: data.totalArticles || 0,
      articles: (data.articles || []).map(a => transformGNewsArticle(a, category || 'top')),
    };

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error('News API error:', error);
    const mockData = getMockNews(category, country, lang);
    return NextResponse.json(mockData);
  }
}
