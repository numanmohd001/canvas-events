import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Check, Sparkles, Calendar, Users, MapPin, ArrowRight } from 'lucide-react'
import { createEventOrder } from '../lib/supabase'

interface OrderEventModalProps {
  isOpen: boolean
  onClose: () => void
  defaultEventType?: string
}

const EVENT_TYPES = [
  'Corporate Events',
  'Private Celebrations',
  'Weddings',
  'Brand Experiences',
]

const BUDGET_RANGES = [
  '£25,000 – £50,000',
  '£50,000 – £100,000',
  '£100,000 – £250,000',
  '£250,000+',
]

export const OrderEventModal: React.FC<OrderEventModalProps> = ({
  isOpen,
  onClose,
  defaultEventType = 'Corporate Events',
}) => {
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState(defaultEventType)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState(120)
  const [location, setLocation] = useState('London, UK')
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[1])
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedOrder, setSubmittedOrder] = useState<{
    eventName: string
    source: 'supabase' | 'local'
  } | null>(null)

  useEffect(() => {
    if (defaultEventType) {
      setEventType(defaultEventType)
    }
  }, [defaultEventType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await createEventOrder({
        event_name: eventName,
        event_type: eventType,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        event_date: eventDate,
        guest_count: Number(guestCount) || 50,
        location,
        budget_range: budgetRange,
        notes,
      })

      setSubmittedOrder({
        eventName: result.order.event_name,
        source: result.source,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetAndClose = () => {
    setSubmittedOrder(null)
    setEventName('')
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')
    setEventDate('')
    setNotes('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-[#161820]/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] shadow-2xl overflow-hidden my-8"
          >
            {/* Gold top bar */}
            <div className="h-[2px] w-full bg-[#d4b87a]" />

            <div className="p-6 sm:p-10">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="label-editorial text-[#d4b87a] mb-2">
                    Bespoke Event Commission · Discovery Brief
                  </p>
                  <h3 className="font-cormorant italic font-bold text-3xl sm:text-4xl text-[hsl(var(--foreground))]">
                    Commission Your Event
                  </h3>
                </div>
                <button
                  onClick={handleResetAndClose}
                  className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[#d4b87a] transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedOrder ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 text-center space-y-6"
                >
                  <div className="w-14 h-14 mx-auto rounded-full border border-[#d4b87a]/50 bg-[#d4b87a]/10 flex items-center justify-center text-[#d4b87a]">
                    <Check className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <p className="label-editorial text-[#d4b87a]">
                      Event Order Registered
                    </p>
                    <h4 className="font-cormorant italic font-bold text-3xl text-[hsl(var(--foreground))]">
                      “{submittedOrder.eventName}”
                    </h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-md mx-auto leading-relaxed">
                      Thank you. Your event commission has been recorded in our database. Our Senior Event Directors will review your brief and contact you within 24 hours.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleResetAndClose}
                      className="px-8 py-3 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#dfc690] transition-colors cursor-pointer"
                    >
                      Return to Canvas Events
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block label-editorial text-[#d4b87a] mb-2">
                        Event Name / Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Kensington Autumn Black-Tie Gala"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        Event Category *
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a] transition-colors"
                      >
                        {EVENT_TYPES.map((type) => (
                          <option key={type} value={type} className="bg-[#161820]">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        Estimated Budget
                      </label>
                      <select
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a] transition-colors"
                      >
                        {BUDGET_RANGES.map((range) => (
                          <option key={range} value={range} className="bg-[#161820]">
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Lady / Lord / Full Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.co.uk"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        Telephone
                      </label>
                      <input
                        type="tel"
                        placeholder="+44 20 7946 0000"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#d4b87a]" /> Preferred Date *
                        </span>
                      </label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-[#d4b87a]" /> Estimated Guests *
                        </span>
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={2000}
                        required
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] focus:outline-none focus:border-[#d4b87a] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#d4b87a]" /> Location / Destination
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Mayfair, London / Lake Como"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a] transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block label-editorial text-[hsl(var(--muted-foreground))] mb-2">
                        Creative Brief & Atmosphere Notes
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe your vision, preferred venues, floral aesthetic, culinary expectations, or production requirements..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[#d4b87a] transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[hsl(var(--border))]">
                    <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#d4b87a]" />
                      Includes a 30-minute discovery call — no commitment
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#dfc690] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting Brief...' : 'Submit Event Order'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
