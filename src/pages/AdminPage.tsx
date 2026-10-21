import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Lock,
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Database,
  LogOut,
  Search,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react'
import {
  fetchEventOrders,
  updateEventOrderStatus,
  isSupabaseConfigured,
  supabase,
  SUPABASE_SCHEMA_SQL,
  type EventOrder,
} from '../lib/supabase'

const ADMIN_SESSION_KEY = 'canvas_events_admin_auth_v1'

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true'
  })
  const [email, setEmail] = useState('admin@canvasevents.co.uk')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [orders, setOrders] = useState<EventOrder[]>([])
  const [dataSource, setDataSource] = useState<'supabase' | 'local'>('local')
  const [dbError, setDbError] = useState<string | undefined>()
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showSchemaModal, setShowSchemaModal] = useState(false)
  const [copiedSql, setCopiedSql] = useState(false)

  const loadOrders = async () => {
    setIsLoadingOrders(true)
    try {
      const res = await fetchEventOrders()
      setOrders(res.orders)
      setDataSource(res.source)
      setDbError(res.error)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setIsLoggingIn(true)

    try {
      // Check pre-configured luxury director credentials first
      if (
        (email.toLowerCase() === 'admin@canvasevents.co.uk' &&
          password === 'Canvas2026!') ||
        (email.toLowerCase() === 'director@canvasevents.co.uk' &&
          password === 'admin123')
      ) {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
        setIsAuthenticated(true)
        return
      }

      // Also support Supabase Auth if configured
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (!error && data.session) {
          sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
          setIsAuthenticated(true)
          return
        }
      }

      setAuthError(
        'Invalid credentials. Use admin@canvasevents.co.uk / Canvas2026! (or your Supabase Auth user).'
      )
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    if (supabase) {
      await supabase.auth.signOut()
    }
    setIsAuthenticated(false)
    setPassword('')
  }

  const handleStatusChange = async (
    id: string,
    newStatus: EventOrder['status']
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    )
    await updateEventOrderStatus(id, newStatus)
  }

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2000)
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.event_type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col justify-between p-6 sm:p-12">
        <div className="flex items-center justify-between max-w-7xl w-full mx-auto">
          <Link
            to="/"
            className="font-cormorant italic text-2xl sm:text-3xl text-[#d4b87a] tracking-wide"
          >
            Canvas Events
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] hover:text-[#d4b87a] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Website
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-md w-full mx-auto bg-[hsl(var(--surface))] border border-[hsl(var(--border))] shadow-2xl overflow-hidden my-12"
        >
          <div className="h-[2px] w-full bg-[#d4b87a]" />
          <div className="p-8 sm:p-10 space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-11 h-11 mx-auto border border-[#d4b87a]/40 bg-[#d4b87a]/10 flex items-center justify-center text-[#d4b87a] mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <p className="label-editorial text-[#d4b87a]">
                Director Portal · Private Access
              </p>
              <h1 className="font-cormorant italic font-bold text-4xl text-[hsl(var(--foreground))]">
                Admin Sign In
              </h1>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                Access client event orders, discovery briefs, and production schedules.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 text-xs text-red-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                  Director Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a]"
                />
              </div>

              <div>
                <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                  Passkey / Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#dfc690] transition-colors cursor-pointer"
              >
                {isLoggingIn ? 'Authenticating...' : 'Enter Director Dashboard →'}
              </button>
            </form>

            <div className="pt-4 border-t border-[hsl(var(--border))] space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]">
                <span>Demo Admin Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@canvasevents.co.uk')
                    setPassword('Canvas2026!')
                  }}
                  className="text-[#d4b87a] underline hover:opacity-80 cursor-pointer"
                >
                  Auto-fill Credentials
                </button>
              </div>
              <div className="p-2.5 bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[11px] font-mono text-[hsl(var(--muted-foreground))] space-y-0.5">
                <div>Email: admin@canvasevents.co.uk</div>
                <div>Pass: Canvas2026!</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center text-xs text-[hsl(var(--muted-foreground))]">
          © 2026 Canvas Events · Luxury Event Planning · London
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#161820]/90 backdrop-blur-md border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-cormorant italic text-2xl sm:text-3xl text-[#d4b87a]"
            >
              Canvas Events
            </Link>
            <span className="hidden sm:inline-block h-4 w-[1px] bg-[hsl(var(--border))]" />
            <span className="hidden sm:inline-flex items-center gap-2 label-editorial text-[hsl(var(--foreground))]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4b87a]" />
              Admin Order Desk
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSchemaModal(!showSchemaModal)}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[11px] text-[hsl(var(--muted-foreground))] hover:text-[#d4b87a] hover:border-[#d4b87a]/50 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-[#d4b87a]" />
              {dataSource === 'supabase'
                ? 'Supabase Connected'
                : isSupabaseConfigured
                ? 'Supabase Table Setup'
                : 'Database Config'}
            </button>

            <Link
              to="/"
              className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] hover:text-[#d4b87a] transition-colors"
            >
              View Live Site
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#d4b87a]/40 text-[#d4b87a] text-xs uppercase tracking-[0.14em] hover:bg-[#d4b87a] hover:text-[#161820] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header & Metrics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[hsl(var(--border))] pb-8">
          <div>
            <p className="label-editorial text-[#d4b87a] mb-2">
              London & International Commissions
            </p>
            <h1 className="font-cormorant italic font-bold text-4xl sm:text-5xl text-[hsl(var(--foreground))]">
              Client Event Orders
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--border))] px-5 py-3.5">
              <p className="label-editorial text-[hsl(var(--muted-foreground))]">
                Total Orders
              </p>
              <p className="font-cormorant italic font-bold text-3xl text-[#d4b87a] mt-1">
                {orders.length}
              </p>
            </div>
            <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--border))] px-5 py-3.5">
              <p className="label-editorial text-[hsl(var(--muted-foreground))]">
                Confirmed
              </p>
              <p className="font-cormorant italic font-bold text-3xl text-emerald-400 mt-1">
                {orders.filter((o) => o.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--border))] px-5 py-3.5">
              <p className="label-editorial text-[hsl(var(--muted-foreground))]">
                Pending Review
              </p>
              <p className="font-cormorant italic font-bold text-3xl text-amber-300 mt-1">
                {orders.filter((o) => o.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        {/* Supabase Schema Helper Collapsible */}
        {(showSchemaModal || dbError) && (
          <div className="bg-[hsl(var(--surface))] border border-[#d4b87a]/40 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-editorial text-[#d4b87a]">
                  Supabase PostgreSQL Configuration
                </p>
                <h3 className="font-cormorant italic text-2xl text-[hsl(var(--foreground))] mt-1">
                  Database Connection & SQL Schema
                </h3>
                {dbError && (
                  <p className="text-xs text-amber-300 mt-1">
                    Note: Supabase returned "{dbError}". Run the SQL below in your Supabase SQL Editor to initialize the `event_orders` table.
                  </p>
                )}
              </div>
              <button
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied SQL
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy SQL Schema
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-[#161820] border border-[hsl(var(--border))] text-xs font-mono text-[hsl(var(--muted-foreground))] overflow-x-auto">
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by event name, client, email, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] pl-10 pr-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/60 focus:outline-none focus:border-[#d4b87a]"
            />
          </div>

          <div className="flex items-center gap-3">
            {(['all', 'pending', 'confirmed', 'completed'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] border transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'bg-[#d4b87a] text-[#161820] border-[#d4b87a] font-medium'
                      : 'bg-[hsl(var(--surface))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-[#d4b87a]/40'
                  }`}
                >
                  {status}
                </button>
              )
            )}

            <button
              onClick={loadOrders}
              disabled={isLoadingOrders}
              className="p-2.5 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[#d4b87a] transition-colors cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--border))] p-12 text-center space-y-3">
              <Sparkles className="w-6 h-6 text-[#d4b87a] mx-auto" />
              <h3 className="font-cormorant italic text-2xl">
                No Matching Event Orders Found
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                New orders placed by clients on the main website will appear here automatically.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[hsl(var(--surface))] border border-[hsl(var(--border))] hover:border-[#d4b87a]/40 transition-colors p-6 sm:p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-2.5 py-1 bg-[#d4b87a]/15 border border-[#d4b87a]/40 label-editorial text-[#d4b87a]">
                        {order.event_type}
                      </span>
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">
                        Booked {new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {order.budget_range && (
                        <span className="text-xs px-2.5 py-0.5 bg-[hsl(var(--surface-raised))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">
                          Budget: {order.budget_range}
                        </span>
                      )}
                    </div>

                    <h2 className="font-cormorant italic font-bold text-3xl text-[hsl(var(--foreground))]">
                      {order.event_name}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs text-[hsl(var(--muted-foreground))]">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#d4b87a]" />
                        <span className="text-[hsl(var(--foreground))] font-normal">
                          {order.customer_name}
                        </span>
                        <span>({order.guest_count} guests)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#d4b87a]" />
                        <span>Event Date: {order.event_date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#d4b87a]" />
                        <span>{order.location || 'London'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#d4b87a]" />
                        <a
                          href={`mailto:${order.customer_email}`}
                          className="hover:text-[#d4b87a] underline"
                        >
                          {order.customer_email}
                        </a>
                      </div>
                    </div>

                    {order.customer_phone && (
                      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                        <Phone className="w-3.5 h-3.5 text-[#d4b87a]" />
                        <span>{order.customer_phone}</span>
                      </div>
                    )}

                    {order.notes && (
                      <div className="mt-4 p-4 bg-[hsl(var(--background))] border-l-2 border-[#d4b87a] text-sm text-[hsl(var(--muted-foreground))] italic">
                        “{order.notes}”
                      </div>
                    )}
                  </div>

                  {/* Status Controls */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[hsl(var(--border))]">
                    <span className="label-editorial text-[hsl(var(--muted-foreground))]">
                      Order Status
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(order.id, 'pending')}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
                          order.status === 'pending'
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                            : 'bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-amber-400/30'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        Pending
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, 'confirmed')
                        }
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
                          order.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-emerald-500/30'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, 'completed')
                        }
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-colors cursor-pointer ${
                          order.status === 'completed'
                            ? 'bg-[#d4b87a] text-[#161820] border-[#d4b87a] font-medium'
                            : 'bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:border-[#d4b87a]/40'
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
