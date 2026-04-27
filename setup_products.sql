-- SQL Migration to create the products table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    price DECIMAL NOT NULL,
    discount_price DECIMAL,
    category TEXT NOT NULL,
    subcategory TEXT,
    type TEXT,
    rating DECIMAL DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    images TEXT[] NOT NULL,
    description TEXT,
    sizes TEXT[] NOT NULL,
    colors TEXT[] NOT NULL,
    featured BOOLEAN DEFAULT false,
    bestseller BOOLEAN DEFAULT false,
    new_arrival BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.products
    FOR SELECT USING (true);
