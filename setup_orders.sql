-- SQL Migration to create the orders table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id TEXT NOT NULL,
    total_amount DECIMAL NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public insert/read access (for testing purposes, in production this should be restricted to authenticated users)
CREATE POLICY "Allow public insert" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON public.orders
    FOR SELECT USING (true);
