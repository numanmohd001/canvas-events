import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

const isValidSupabaseUrl = /^https?:\/\/[a-z0-9-]+\.supabase\.co/i.test(rawUrl)
const isValidAnonKey =
  rawKey.length > 20 &&
  rawKey !== '[SENSITIVE]' &&
  !rawKey.includes('PASTE_YOUR')

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl && isValidAnonKey
)

let supabaseInstance: SupabaseClient | null = null
if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(rawUrl, rawKey)
  } catch (err) {
    console.warn('Supabase initialization skipped:', err)
    supabaseInstance = null
  }
}

export const supabase = supabaseInstance

export interface EventOrder {
  id: string
  event_name: string
  event_type: string
  customer_name: string
  customer_email: string
  customer_phone: string
  event_date: string
  guest_count: number
  location: string
  budget_range: string
  notes: string
  status: 'pending' | 'confirmed' | 'completed'
  created_at: string
}

const LOCAL_STORAGE_KEY = 'canvas_events_orders_v1'

const SEED_ORDERS: EventOrder[] = [
  {
    id: 'ord-101',
    event_name: 'Sovereign Annual Charity Gala',
    event_type: 'Corporate Events',
    customer_name: 'Lord Julian Sterling',
    customer_email: 'j.sterling@sovereigngroup.co.uk',
    customer_phone: '+44 20 7946 0921',
    event_date: '2026-11-18',
    guest_count: 280,
    location: 'The Dorchester, Mayfair, London',
    budget_range: '£150,000 – £250,000',
    notes: 'Black-tie formal dinner, custom candlelight floral installation, string quartet arrival.',
    status: 'confirmed',
    created_at: '2026-10-14T11:30:00Z',
  },
  {
    id: 'ord-102',
    event_name: 'Aurelia Parfum Global Launch',
    event_type: 'Brand Experiences',
    customer_name: 'Camille Laurent',
    customer_email: 'c.laurent@aureliaparfum.com',
    customer_phone: '+44 7700 900412',
    event_date: '2026-12-04',
    guest_count: 150,
    location: 'Somerset House, London',
    budget_range: '£75,000 – £150,000',
    notes: 'Immersive scent gallery, dramatic backlit alabaster plinths, bespoke champagne tower.',
    status: 'pending',
    created_at: '2026-10-19T16:15:00Z',
  },
  {
    id: 'ord-103',
    event_name: 'Vance & Ashworth Lake Como Wedding',
    event_type: 'Weddings',
    customer_name: 'Eleanor Ashworth',
    customer_email: 'eleanor@ashworthstudio.com',
    customer_phone: '+44 7911 123456',
    event_date: '2027-06-12',
    guest_count: 120,
    location: 'Villa Balbiano, Lake Como, Italy',
    budget_range: '£250,000+',
    notes: 'Three-day destination celebration: welcome boat cocktails, marquee ceremony at golden hour.',
    status: 'confirmed',
    created_at: '2026-10-20T09:45:00Z',
  },
]

function getLocalOrders(): EventOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_ORDERS))
      return SEED_ORDERS
    }
    return JSON.parse(raw)
  } catch {
    return SEED_ORDERS
  }
}

function saveLocalOrders(orders: EventOrder[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    // ignore storage errors
  }
}

export async function fetchEventOrders(): Promise<{
  orders: EventOrder[]
  source: 'supabase' | 'local'
  error?: string
}> {
  if (supabase) {
    const { data, error } = await supabase
      .from('event_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      return { orders: data as EventOrder[], source: 'supabase' }
    }
    return {
      orders: getLocalOrders(),
      source: 'local',
      error: error?.message,
    }
  }

  return { orders: getLocalOrders(), source: 'local' }
}

export async function createEventOrder(
  orderInput: Omit<EventOrder, 'id' | 'status' | 'created_at'>
): Promise<{
  order: EventOrder
  source: 'supabase' | 'local'
  error?: string
}> {
  const newOrder: EventOrder = {
    ...orderInput,
    id: crypto.randomUUID ? crypto.randomUUID() : `ord-${Date.now()}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  }

  // Always save to local backup as well
  const currentLocal = getLocalOrders()
  saveLocalOrders([newOrder, ...currentLocal])

  if (supabase) {
    const { data, error } = await supabase
      .from('event_orders')
      .insert([
        {
          event_name: orderInput.event_name,
          event_type: orderInput.event_type,
          customer_name: orderInput.customer_name,
          customer_email: orderInput.customer_email,
          customer_phone: orderInput.customer_phone,
          event_date: orderInput.event_date,
          guest_count: orderInput.guest_count,
          location: orderInput.location,
          budget_range: orderInput.budget_range,
          notes: orderInput.notes,
          status: 'pending',
        },
      ])
      .select()
      .single()

    if (!error && data) {
      return { order: data as EventOrder, source: 'supabase' }
    }
    return { order: newOrder, source: 'local', error: error?.message }
  }

  return { order: newOrder, source: 'local' }
}

export async function updateEventOrderStatus(
  id: string,
  status: EventOrder['status']
): Promise<{ success: boolean; error?: string }> {
  const localOrders = getLocalOrders().map((o) =>
    o.id === id ? { ...o, status } : o
  )
  saveLocalOrders(localOrders)

  if (supabase) {
    const { error } = await supabase
      .from('event_orders')
      .update({ status })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }
  }
  return { success: true }
}

export const SUPABASE_SCHEMA_SQL = `-- Run this SQL in your Supabase SQL Editor to create the event_orders table:
CREATE TABLE IF NOT EXISTS public.event_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  event_date TEXT NOT NULL,
  guest_count INTEGER DEFAULT 50,
  location TEXT,
  budget_range TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) with public insert & read for the web app
ALTER TABLE public.event_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on event_orders"
  ON public.event_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public select on event_orders"
  ON public.event_orders FOR SELECT
  USING (true);

CREATE POLICY "Allow public update on event_orders"
  ON public.event_orders FOR UPDATE
  USING (true);`
