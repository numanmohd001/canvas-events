import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Menu,
  X,
  Star,
  Lock,
  Sparkles,
  Check,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { OrderEventModal } from '../components/OrderEventModal'
import { createEventOrder } from '../lib/supabase'

const SERVICES = [
  {
    title: 'Corporate Events',
    description: 'Brand launches, product reveals, and black-tie galas',
  },
  {
    title: 'Private Celebrations',
    description: 'Milestone birthdays, anniversaries, and private estates',
  },
  {
    title: 'Weddings',
    description: 'Full-service destination and London celebrations',
  },
  {
    title: 'Brand Experiences',
    description: 'Immersive activations and architectural environments',
  },
]

const SIGNATURE_EVENTS = [
  {
    type: 'Corporate & Brand',
    description:
      'Galas, product launches, and award evenings for FTSE 100 clients',
    category: 'Corporate Events',
  },
  {
    type: 'Private Celebrations',
    description:
      'Bespoke milestone events, private dinners, and estate parties up to 400 guests',
    category: 'Private Celebrations',
  },
  {
    type: 'Weddings & Elopements',
    description:
      'Full venue sourcing, architectural styling, and seamless day coordination',
    category: 'Weddings',
  },
]

const GALLERY_ITEMS = [
  {
    title: 'The Shard Dusk Champagne Reception',
    year: '2026',
    aspect: 'aspect-[3/4]',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    alt: 'Rooftop cocktail event at dusk, London skyline, fairy lights, guests with champagne',
  },
  {
    title: 'Kensington Palace Candlelit Banquet',
    year: '2025',
    aspect: 'aspect-[4/3]',
    image:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85',
    alt: 'Intimate formal dinner table, long runner, tall candles, floral, moody warm light',
  },
  {
    title: 'Maison Lumière Immersive Brand Reveal',
    year: '2026',
    aspect: 'aspect-[4/3]',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85',
    alt: 'Brand activation space — dramatic backlit display, immersive atmosphere',
  },
  {
    title: 'Cotswolds Golden Hour Glasshouse Wedding',
    year: '2025',
    aspect: 'aspect-[3/4]',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    alt: 'Marquee wedding exterior at golden hour, fairy lights',
  },
  {
    title: 'FTSE 100 Annual Sovereign Awards Stage',
    year: '2026',
    aspect: 'aspect-[3/4]',
    image:
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=85',
    alt: 'Award ceremony stage, dramatic lighting, empty podium, pre-event atmosphere',
  },
  {
    title: 'Bespoke Gilded Place Setting & Floral Detail',
    year: '2026',
    aspect: 'aspect-[4/3]',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85',
    alt: 'Close-up of event detail — place card, gold cutlery, flower, editorial',
  },
]

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Discovery Call',
    description:
      'An unhurried 30-minute consultation to explore your vision, guest profile, desired atmosphere, and key dates.',
  },
  {
    num: '02',
    title: 'Creative Brief',
    description:
      'Architectural moodboards, curated venue shortlists, bespoke lighting design, and culinary concepts tailored to your narrative.',
  },
  {
    num: '03',
    title: 'Full Coordination',
    description:
      'End-to-end production management across floristry, AV staging, Michelin-calibre catering, and world-class entertainment.',
  },
  {
    num: '04',
    title: 'Event Day',
    description:
      'Discreet on-site direction from first rigging to the final toast, allowing you to inhabit every moment effortlessly.',
  },
]

const TESTIMONIALS = [
  {
    quote:
      'Canvas Events delivered an evening our guests are still talking about six months later. Every detail, down to the menu card typography, was considered.',
    author: 'James H., CEO, London',
    event: 'FTSE 100 Annual Gala',
  },
  {
    quote:
      'From privatising a historic Florentine villa to orchestrating a 200-guest candlelit banquet in the rain without a single compromise, their poise is unmatched.',
    author: 'Lady Victoria M., Belgravia',
    event: 'Destination Wedding · Tuscany & London',
  },
  {
    quote:
      'Our global fragrance launch felt more like an immersive museum exhibition than a corporate press event. Truly editorial craftsmanship.',
    author: 'Sébastien L., Creative Director',
    event: 'Luxury Brand Activation · Mayfair',
  },
]

export const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [selectedEventType, setSelectedEventType] =
    useState<string>('Corporate Events')

  // Inline Order Form State
  const [inlineEventName, setInlineEventName] = useState('')
  const [inlineEventType, setInlineEventType] = useState('Corporate Events')
  const [inlineCustomerName, setInlineCustomerName] = useState('')
  const [inlineCustomerEmail, setInlineCustomerEmail] = useState('')
  const [inlineCustomerPhone, setInlineCustomerPhone] = useState('')
  const [inlineEventDate, setInlineEventDate] = useState('')
  const [inlineGuestCount, setInlineGuestCount] = useState(150)
  const [inlineLocation, setInlineLocation] = useState('London, UK')
  const [inlineBudget, setInlineBudget] = useState('£50,000 – £100,000')
  const [inlineNotes, setInlineNotes] = useState('')
  const [inlineSubmitting, setInlineSubmitting] = useState(false)
  const [inlineSuccess, setInlineSuccess] = useState<string | null>(null)

  const openOrderModal = (category = 'Corporate Events') => {
    setSelectedEventType(category)
    setOrderModalOpen(true)
  }

  const handleInlineOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInlineSubmitting(true)
    try {
      const res = await createEventOrder({
        event_name: inlineEventName,
        event_type: inlineEventType,
        customer_name: inlineCustomerName,
        customer_email: inlineCustomerEmail,
        customer_phone: inlineCustomerPhone,
        event_date: inlineEventDate,
        guest_count: Number(inlineGuestCount) || 100,
        location: inlineLocation,
        budget_range: inlineBudget,
        notes: inlineNotes,
      })
      setInlineSuccess(res.order.event_name)
      setInlineEventName('')
      setInlineCustomerName('')
      setInlineCustomerEmail('')
      setInlineCustomerPhone('')
      setInlineEventDate('')
      setInlineNotes('')
    } finally {
      setInlineSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] selection:bg-[#d4b87a] selection:text-[#161820]">
      {/* 1. Navbar */}
      <header
        className="sticky top-0 z-40 w-full border-b border-[hsl(var(--border))]"
        style={{
          backgroundColor: 'rgba(22, 24, 32, 0.82)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <a
            href="#"
            className="font-cormorant italic font-bold text-2xl sm:text-3xl text-[#d4b87a] tracking-wide"
          >
            Canvas Events
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#services"
              className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--foreground))]/80 hover:text-[#d4b87a] transition-colors"
            >
              Services
            </a>
            <a
              href="#events"
              className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--foreground))]/80 hover:text-[#d4b87a] transition-colors"
            >
              Events
            </a>
            <a
              href="#about"
              className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--foreground))]/80 hover:text-[#d4b87a] transition-colors"
            >
              About
            </a>
            <a
              href="#order-event"
              className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--foreground))]/80 hover:text-[#d4b87a] transition-colors"
            >
              Order Event
            </a>
            <a
              href="#contact"
              className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--foreground))]/80 hover:text-[#d4b87a] transition-colors"
            >
              Contact
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] hover:text-[#d4b87a] transition-colors"
            >
              <Lock className="w-3 h-3 text-[#d4b87a]" />
              Admin
            </Link>
            <button
              onClick={() => openOrderModal('Corporate Events')}
              className="px-5 py-2.5 border border-[#d4b87a] text-[#d4b87a] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#d4b87a] hover:text-[#161820] transition-all duration-300 cursor-pointer"
            >
              Start planning →
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[hsl(var(--foreground))] hover:text-[#d4b87a]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[hsl(var(--surface))] border-b border-[hsl(var(--border))] px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.14em] py-1.5 hover:text-[#d4b87a]"
              >
                Services
              </a>
              <a
                href="#events"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.14em] py-1.5 hover:text-[#d4b87a]"
              >
                Events
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.14em] py-1.5 hover:text-[#d4b87a]"
              >
                About
              </a>
              <a
                href="#order-event"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.14em] py-1.5 hover:text-[#d4b87a]"
              >
                Order Event
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-[0.14em] py-1.5 hover:text-[#d4b87a]"
              >
                Contact
              </a>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] py-1.5 text-[#d4b87a]"
              >
                <Lock className="w-3.5 h-3.5" />
                Admin Login
              </Link>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                openOrderModal('Corporate Events')
              }}
              className="w-full py-3 border border-[#d4b87a] text-[#d4b87a] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#d4b87a] hover:text-[#161820] transition-colors"
            >
              Start planning →
            </button>
          </div>
        )}
      </header>

      {/* 2. Hero */}
      <section className="relative h-screen min-h-[700px] w-full overflow-hidden">
        {/* Full-bleed event photography */}
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=90"
          alt="Luxury gala ballroom event, round tables with tall floral centrepieces, soft candle and pendant lighting"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />

        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(22,24,32,0.55) 0%, rgba(22,24,32,0.15) 40%, rgba(22,24,32,0.88) 100%)',
          }}
        />

        {/* Hero Content */}
        <div
          className="relative z-10 h-full w-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-end text-center"
          style={{ paddingBottom: '7vh' }}
        >
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0 }}
            className="label-editorial text-[#d4b87a] mb-5"
          >
            Luxury Event Planning · London & Destination
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-cormorant italic font-bold text-[hsl(var(--foreground))] tracking-tight mb-6"
            style={{
              fontSize: 'clamp(58px, 9vw, 130px)',
              lineHeight: 0.88,
            }}
          >
            We Don&apos;t Plan Events.
            <br />
            <span className="text-[#d4b87a]">We Build Memories.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-inter font-light text-sm sm:text-base text-[hsl(var(--foreground))]/85 max-w-[560px] leading-relaxed mb-9"
          >
            Galas, corporate dinners, brand launches, and weddings — each one
            designed from the first brief to the final toast
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#events"
              className="w-full sm:w-auto px-8 py-4 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#e1c78e] transition-colors text-center"
            >
              See our events →
            </a>
            <button
              onClick={() => openOrderModal('Corporate Events')}
              className="w-full sm:w-auto px-8 py-4 border border-[hsl(var(--foreground))]/50 text-[hsl(var(--foreground))] text-xs uppercase tracking-[0.14em] font-medium hover:border-[#d4b87a] hover:text-[#d4b87a] transition-colors cursor-pointer"
            >
              Talk to us
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3. Services Strip */}
      <section
        id="services"
        className="w-full bg-[hsl(var(--surface))] border-b border-[hsl(var(--border))] relative"
      >
        {/* Animated gold top border */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="h-[2px] w-full bg-[#d4b87a] origin-left"
        />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
                onClick={() => openOrderModal(service.title)}
                className="group p-6 bg-[hsl(var(--background))]/50 border border-[hsl(var(--border))] hover:border-[#d4b87a]/60 transition-all cursor-pointer"
              >
                <p className="font-cormorant italic font-semibold text-2xl text-[#d4b87a] mb-2 group-hover:translate-x-1 transition-transform">
                  {service.title}
                </p>
                <p className="font-inter font-light text-xs sm:text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Signature Events */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="mb-14">
          <p className="label-editorial text-[#d4b87a] mb-3">
            Curated Commissions
          </p>
          <h2 className="font-cormorant italic font-bold text-5xl sm:text-6xl text-[hsl(var(--foreground))]">
            What We&apos;ve Built
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h-[1px] w-28 bg-[#d4b87a] mt-6 origin-left"
          />
        </div>

        <div className="border-t border-[hsl(var(--border))]">
          {SIGNATURE_EVENTS.map((item) => (
            <div
              key={item.type}
              onClick={() => openOrderModal(item.category)}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 py-10 px-6 border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--surface-raised))] transition-all duration-300 cursor-pointer"
            >
              <h3 className="font-cormorant italic font-semibold text-3xl sm:text-4xl text-[hsl(var(--foreground))] group-hover:text-[#d4b87a] transition-colors">
                {item.type}
              </h3>
              <div className="flex items-center justify-between md:justify-end gap-8 flex-1 max-w-xl">
                <p className="font-inter font-light text-sm sm:text-base text-[hsl(var(--muted-foreground))] group-hover:text-[#d4b87a]/90 transition-colors">
                  {item.description}
                </p>
                <span className="text-2xl text-[#d4b87a] transform group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Gallery */}
      <section id="events" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <p className="label-editorial text-[#d4b87a] mb-3">
              Editorial Portfolio
            </p>
            <h2 className="font-cormorant italic font-bold text-5xl sm:text-6xl text-[hsl(var(--foreground))]">
              The Events
            </h2>
          </div>
          <p className="font-inter font-light text-xs sm:text-sm text-[hsl(var(--muted-foreground))] max-w-sm">
            Six recent commissions across London, the Cotswolds, and European
            destinations.
          </p>
        </div>

        {/* 2-column masonry-style grid, 3px gap, no border-radius */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px] bg-[hsl(var(--border))]">
          {GALLERY_ITEMS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              onClick={() => openOrderModal()}
              className={`relative group overflow-hidden bg-[hsl(var(--surface))] ${item.aspect} cursor-pointer`}
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#161820] opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="label-editorial text-[#d4b87a] mb-2">
                  {item.year} · Commission
                </p>
                <h3 className="font-cormorant italic font-bold text-3xl text-[hsl(var(--foreground))]">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Process */}
      <section className="py-24 sm:py-32 bg-[hsl(var(--surface))] border-y border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="mb-16">
            <p className="label-editorial text-[#d4b87a] mb-3">
              Methodology
            </p>
            <h2 className="font-cormorant italic font-bold text-5xl sm:text-6xl text-[hsl(var(--foreground))]">
              How We Work
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-[1px] w-28 bg-[#d4b87a] mt-6 origin-left"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pt-10 pb-6 border-t border-[hsl(var(--border))]"
              >
                {/* Large faded gold Cormorant italic number (opacity 0.06) behind each */}
                <span
                  className="font-cormorant italic font-bold text-8xl sm:text-9xl text-[#d4b87a] absolute -top-4 right-2 select-none pointer-events-none"
                  style={{ opacity: 0.06 }}
                >
                  {step.num}
                </span>

                <p className="label-editorial text-[#d4b87a] mb-3">
                  Step {step.num}
                </p>
                <h3 className="font-cormorant italic font-bold text-3xl text-[hsl(var(--foreground))] mb-3">
                  {step.title}
                </h3>
                <p className="font-inter font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. About */}
      <section id="about" className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <p className="label-editorial text-[#d4b87a]">
              Our Heritage
            </p>
            <h2 className="font-cormorant italic font-bold text-4xl sm:text-6xl text-[hsl(var(--foreground))] leading-[1.05]">
              Built on 12 years of delivering the extraordinary
            </h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="h-[1px] w-24 bg-[#d4b87a] origin-left"
            />
            <p className="font-inter font-light text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed pt-2">
              Founded by two former luxury hotel event directors in Mayfair,
              Canvas Events was born from a singular conviction: that landmark
              gatherings should be architected with the precision of theatre and
              the intimacy of private hospitality.
            </p>
            <p className="font-inter font-light text-sm sm:text-base text-[hsl(var(--muted-foreground))] leading-relaxed">
              We operate as a full-service studio — handling private venue
              procurement, bespoke culinary direction, architectural lighting and
              AV production, sculptural floristry, and headline entertainment
              under one roof.
            </p>

            {/* Gold chips */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              {['12 Years', '400+ Events', 'London & International'].map(
                (chip) => (
                  <span
                    key={chip}
                    className="px-4 py-2 border border-[#d4b87a]/50 bg-[#d4b87a]/10 text-[#d4b87a] label-editorial"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden border border-[hsl(var(--border))] aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85"
                alt="Event planner at work, behind-the-scenes setup, elegant venue background"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161820]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-[#161820]/85 backdrop-blur-md border border-[hsl(var(--border))]">
                <p className="label-editorial text-[#d4b87a]">
                  Behind the Curtain · Mayfair Studio
                </p>
                <p className="font-cormorant italic text-xl text-[hsl(var(--foreground))] mt-1">
                  “Precision in the unseen hours creates effortless magic when the doors open.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-24 sm:py-32 bg-[hsl(var(--surface))] border-t border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="mb-14 text-center">
            <p className="label-editorial text-[#d4b87a] mb-3">
              Client Reflections
            </p>
            <h2 className="font-cormorant italic font-bold text-5xl sm:text-6xl text-[hsl(var(--foreground))]">
              Words From Our Hosts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((item, idx) => (
              <motion.div
                key={item.author}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="p-8 sm:p-10 bg-[hsl(var(--background))] border border-[hsl(var(--border))] flex flex-col justify-between space-y-8"
              >
                <div className="space-y-6">
                  {/* 5-star row in gold */}
                  <div className="flex items-center gap-1 text-[#d4b87a]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#d4b87a] text-[#d4b87a]"
                      />
                    ))}
                  </div>

                  <p className="font-cormorant italic text-2xl text-[hsl(var(--foreground))] leading-relaxed">
                    “{item.quote}”
                  </p>
                </div>

                <div className="pt-4 border-t border-[hsl(var(--border))]">
                  <p className="label-editorial text-[hsl(var(--foreground))]">
                    {item.author}
                  </p>
                  <p className="label-editorial text-[hsl(var(--muted-foreground))] mt-1">
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Event Order Section (Direct Database Booking on Website) */}
      <section
        id="order-event"
        className="py-24 sm:py-32 max-w-5xl mx-auto px-6 sm:px-10"
      >
        <div className="bg-[hsl(var(--surface))] border border-[hsl(var(--border))] overflow-hidden shadow-2xl">
          <div className="h-[2px] w-full bg-[#d4b87a]" />
          <div className="p-8 sm:p-14">
            <div className="max-w-2xl mb-10">
              <p className="label-editorial text-[#d4b87a] mb-3">
                Direct Online Commission · Stored in Database
              </p>
              <h2 className="font-cormorant italic font-bold text-4xl sm:text-5xl text-[hsl(var(--foreground))] mb-3">
                Order & Reserve Your Event
              </h2>
              <p className="font-inter font-light text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                Submit your event name, category, guest count, and preferred date
                below. Your order is saved directly to our database and
                immediately visible to our Event Directors in the Admin Portal.
              </p>
            </div>

            {inlineSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-[hsl(var(--background))] border border-[#d4b87a]/50 text-center space-y-4"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#d4b87a]/15 border border-[#d4b87a] flex items-center justify-center text-[#d4b87a]">
                  <Check className="w-6 h-6" />
                </div>
                <p className="label-editorial text-[#d4b87a]">
                  Order Stored in Database
                </p>
                <h3 className="font-cormorant italic font-bold text-3xl text-[hsl(var(--foreground))]">
                  “{inlineSuccess}”
                </h3>
                <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
                  Your event order has been saved. Our team will reach out to
                  confirm your 30-minute discovery call, or you can view this
                  order in the{' '}
                  <Link to="/login" className="text-[#d4b87a] underline">
                    Admin Portal
                  </Link>
                  .
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => setInlineSuccess(null)}
                    className="px-6 py-2.5 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium cursor-pointer"
                  >
                    Place Another Event Order
                  </button>
                  <Link
                    to="/login"
                    className="px-6 py-2.5 border border-[#d4b87a]/50 text-[#d4b87a] text-xs uppercase tracking-[0.14em] hover:bg-[#d4b87a]/10"
                  >
                    View in Admin Dashboard →
                  </Link>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleInlineOrderSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block label-editorial text-[#d4b87a] mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Mayfair Winter Solstice Gala / Sterling Wedding"
                      value={inlineEventName}
                      onChange={(e) => setInlineEventName(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a]"
                    />
                  </div>

                  <div>
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      Event Category *
                    </label>
                    <select
                      value={inlineEventType}
                      onChange={(e) => setInlineEventType(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a]"
                    >
                      <option value="Corporate Events" className="bg-[#161820]">
                        Corporate Events
                      </option>
                      <option
                        value="Private Celebrations"
                        className="bg-[#161820]"
                      >
                        Private Celebrations
                      </option>
                      <option value="Weddings" className="bg-[#161820]">
                        Weddings
                      </option>
                      <option
                        value="Brand Experiences"
                        className="bg-[#161820]"
                      >
                        Brand Experiences
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      Estimated Budget
                    </label>
                    <select
                      value={inlineBudget}
                      onChange={(e) => setInlineBudget(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a]"
                    >
                      <option
                        value="£25,000 – £50,000"
                        className="bg-[#161820]"
                      >
                        £25,000 – £50,000
                      </option>
                      <option
                        value="£50,000 – £100,000"
                        className="bg-[#161820]"
                      >
                        £50,000 – £100,000
                      </option>
                      <option
                        value="£100,000 – £250,000"
                        className="bg-[#161820]"
                      >
                        £100,000 – £250,000
                      </option>
                      <option value="£250,000+" className="bg-[#161820]">
                        £250,000+
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name or Organization"
                      value={inlineCustomerName}
                      onChange={(e) => setInlineCustomerName(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a]"
                    />
                  </div>

                  <div>
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      Client Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@domain.co.uk"
                      value={inlineCustomerEmail}
                      onChange={(e) => setInlineCustomerEmail(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a]"
                    />
                  </div>

                  <div>
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      Telephone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+44 20 7946 0000"
                      value={inlineCustomerPhone}
                      onChange={(e) => setInlineCustomerPhone(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a]"
                    />
                  </div>

                  <div>
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#d4b87a]" /> Event
                        Date *
                      </span>
                    </label>
                    <input
                      type="date"
                      required
                      value={inlineEventDate}
                      onChange={(e) => setInlineEventDate(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a]"
                    />
                  </div>

                  <div>
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-[#d4b87a]" /> Guest Count *
                      </span>
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={2000}
                      required
                      value={inlineGuestCount}
                      onChange={(e) =>
                        setInlineGuestCount(Number(e.target.value))
                      }
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a]"
                    />
                  </div>

                  <div>
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#d4b87a]" /> Preferred
                        Location
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="London / Destination"
                      value={inlineLocation}
                      onChange={(e) => setInlineLocation(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                      Bespoke Requirements & Vision
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your event vision, floral & lighting mood, or culinary preferences..."
                      value={inlineNotes}
                      onChange={(e) => setInlineNotes(e.target.value)}
                      className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3.5 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a] resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[hsl(var(--border))]">
                  <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4b87a]" />
                    Instant database registration for our London Planning Desk
                  </p>
                  <button
                    type="submit"
                    disabled={inlineSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#e2c78e] transition-colors cursor-pointer"
                  >
                    {inlineSubmitting
                      ? 'Saving Event Order...'
                      : 'Confirm Event Order'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. Contact CTA */}
      <section
        id="contact"
        className="w-full bg-[#d4b87a] text-[#161820] py-24 sm:py-28 px-6 sm:px-10"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-cormorant italic font-bold text-5xl sm:text-7xl text-[#161820] leading-none">
            Your Next Event Starts Here
          </h2>
          <p className="font-inter font-light text-base sm:text-lg text-[#161820]/85 max-w-2xl mx-auto leading-relaxed">
            Every event begins with a 30-minute discovery call — no commitment,
            just a conversation about what you&apos;re imagining
          </p>
          <div className="pt-4">
            <button
              onClick={() => openOrderModal('Corporate Events')}
              className="px-10 py-4 bg-[#161820] text-[#EBE7DE] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#222530] transition-colors cursor-pointer"
            >
              Book a discovery call →
            </button>
          </div>
          <p className="label-editorial text-[#161820]/70 pt-2">
            Available for events across the UK and internationally
          </p>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-[#161820] border-t border-[hsl(var(--border))] py-16 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <a
              href="#"
              className="font-cormorant italic font-bold text-3xl text-[#d4b87a]"
            >
              Canvas Events
            </a>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
              © 2026 Canvas Events · Luxury Event Planning · London · Available
              Worldwide
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#d4b87a] transition-colors"
            >
              Instagram
            </a>
            <span>·</span>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#d4b87a] transition-colors"
            >
              Pinterest
            </a>
            <span>·</span>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#d4b87a] transition-colors"
            >
              LinkedIn
            </a>
            <span>·</span>
            <Link
              to="/login"
              className="text-[#d4b87a] hover:underline inline-flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* Modal for "Start planning →", "Talk to us", and "Book a discovery call →" */}
      <OrderEventModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        defaultEventType={selectedEventType}
      />
    </div>
  )
}
