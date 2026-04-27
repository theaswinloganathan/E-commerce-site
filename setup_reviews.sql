-- CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL, -- References our product id string
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;

-- RLS POLICIES
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Public reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Authenticated users can insert reviews
CREATE POLICY "Users can insert their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
