import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://crzhqsyjmsnippauzwga.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyemhxc3lqbXNuaXBwYXV6d2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzI0NjYsImV4cCI6MjA3OTYwODQ2Nn0.1rt79cmP66uWk86X01CHLRyishbkxxECHDaq4QFAwxM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
