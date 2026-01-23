import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://anrhsknhczzwfkfrtqsl.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFucmhza25oY3p6d2ZrZnJ0cXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTM2MTYsImV4cCI6MjA4Mzk4OTYxNn0.-z-NgwXRwo9SQp1yd4y1SP5vumEvCmDEmQkQeKAE3e8';

export const supabase = createClient(supabaseUrl, supabaseKey);
