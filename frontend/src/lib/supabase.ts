import { createClient } from '@supabase/supabase-js'

// These should ideally be in .env files, but for the user's convenience in this session
// we will ask them to replace these, or we can use placeholders.
const supabaseUrl = 'https://xbyizwynwkunmuztzzgt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhieWl6d3lud2t1bm11enR6emd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMDYwMzYsImV4cCI6MjA4NTU4MjAzNn0.7wZF75rCB2j2n9daL1TX-g38DXHd8CbfYD-xUiBQRV4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
