import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://jasooisjsnlpbnuxkxkh.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphc29vaXNqc25scGJudXhreGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NjQxNDYsImV4cCI6MjA4MDM0MDE0Nn0.tDjEVzUhs7Xt7hxqEguqNz9M77IB7iBJJeH7Tg7IbgI"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
