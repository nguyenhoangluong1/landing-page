'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Heart, Send, CheckCircle } from 'lucide-react'

interface RSVPFormData {
  name: string
  email: string
  message: string
  attendance: 'yes' | 'no' | 'maybe' | ''
  guests: string
  phone: string
  dietaryRestrictions: string
  songRequest: string
}

export const RSVPSection: React.FC = () => {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    message: '',
    attendance: '',
    guests: '',
    phone: '',
    dietaryRestrictions: '',
    songRequest: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Failed to submit RSVP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section id="rsvp" className="py-20 bg-champagne-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-lg p-12 shadow-luxury">
              <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
              <h2 className="font-serif text-3xl text-sage-800 mb-4">
                Thank You!
              </h2>
              <p className="text-lg text-sage-600 mb-6">
                Your RSVP has been received successfully. We're so excited to celebrate with you!
              </p>
              <p className="text-sm text-sage-500">
                You should receive a confirmation email shortly with all the wedding details.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="rsvp" className="py-20 bg-champagne-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-sage-800 mb-6">
            RSVP & Wishes
          </h2>
          <p className="text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed">
            Please let us know if you'll be joining us and share your warm wishes for our special day.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-lg p-8 shadow-luxury"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Will you be attending? *
                  </label>
                  <select
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-champagne-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Please select</option>
                    <option value="yes">Yes, I'll be there! 🎉</option>
                    <option value="no">Sorry, can't make it 😢</option>
                    <option value="maybe">Not sure yet 🤔</option>
                  </select>
                </div>

                <Input
                  label="Number of Guests"
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  placeholder="Including yourself"
                  min="1"
                  max="10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />

                <Input
                  label="Dietary Restrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  placeholder="Vegetarian, allergies, etc."
                />
              </div>

              <Input
                label="Song Request"
                name="songRequest"
                value={formData.songRequest}
                onChange={handleChange}
                placeholder="Any song you'd love to hear at our reception?"
              />

              <Textarea
                label="Your Message & Wishes *"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Share your warm wishes, favorite memories, or advice for the happy couple..."
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="text-center">
                <Button
                  type="submit"
                  variant="luxury"
                  disabled={loading}
                  className="px-12"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send size={16} className="mr-2" />
                      Send RSVP & Wishes
                    </div>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-sage-500">
                  RSVP deadline: <span className="font-medium">May 15, 2024</span>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}