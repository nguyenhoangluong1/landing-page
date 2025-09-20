'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface WeddingDetailsProps {
  ceremony?: {
    date: string
    time: string
    venue: string
    address: string
  }
  reception?: {
    date: string
    time: string
    venue: string
    address: string
  }
  dressCode?: string
  timeline?: Array<{
    time: string
    event: string
  }>
}

const defaultCeremony = {
  date: 'June 15, 2024',
  time: '3:00 PM',
  venue: "St. Mary's Cathedral",
  address: '123 Church Street, New York, NY 10001'
}

const defaultReception = {
  date: 'June 15, 2024',
  time: '6:00 PM',
  venue: 'The Grand Ballroom',
  address: '456 Celebration Ave, New York, NY 10002'
}

const defaultTimeline = [
  { time: '2:30 PM', event: 'Guest Arrival & Seating' },
  { time: '3:00 PM', event: 'Wedding Ceremony' },
  { time: '4:00 PM', event: 'Cocktail Hour & Photos' },
  { time: '6:00 PM', event: 'Reception Begins' },
  { time: '7:00 PM', event: 'Dinner Service' },
  { time: '8:30 PM', event: 'First Dance' },
  { time: '9:00 PM', event: 'Dancing & Celebration' },
  { time: '11:00 PM', event: 'Last Dance' }
]

export const WeddingDetails: React.FC<WeddingDetailsProps> = ({
  ceremony = defaultCeremony,
  reception = defaultReception,
  dressCode = 'Cocktail Attire',
  timeline = defaultTimeline
}) => {
  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  return (
    <section id="wedding-details" className="py-20 bg-sage-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-sage-800 mb-6">
            Wedding Details
          </h2>
          <p className="text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed">
            All the important details you need to know about our special day.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Ceremony Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-lg p-8 shadow-luxury"
            >
              <div className="text-center mb-8">
                <h3 className="font-serif text-3xl text-sage-800 mb-2">Ceremony</h3>
                <div className="w-16 h-px bg-champagne-400 mx-auto"></div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Calendar className="text-champagne-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium text-sage-800">Date</h4>
                    <p className="text-sage-600">{ceremony.date}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="text-champagne-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium text-sage-800">Time</h4>
                    <p className="text-sage-600">{ceremony.time}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="text-champagne-500 mt-1 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sage-800">{ceremony.venue}</h4>
                    <p className="text-sage-600 mb-3">{ceremony.address}</p>
                    <Button
                      variant="outline-luxury"
                      size="sm"
                      onClick={() => openInMaps(ceremony.address)}
                    >
                      View on Map
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reception Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-lg p-8 shadow-luxury"
            >
              <div className="text-center mb-8">
                <h3 className="font-serif text-3xl text-sage-800 mb-2">Reception</h3>
                <div className="w-16 h-px bg-champagne-400 mx-auto"></div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Calendar className="text-champagne-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium text-sage-800">Date</h4>
                    <p className="text-sage-600">{reception.date}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="text-champagne-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium text-sage-800">Time</h4>
                    <p className="text-sage-600">{reception.time}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="text-champagne-500 mt-1 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <h4 className="font-medium text-sage-800">{reception.venue}</h4>
                    <p className="text-sage-600 mb-3">{reception.address}</p>
                    <Button
                      variant="outline-luxury"
                      size="sm"
                      onClick={() => openInMaps(reception.address)}
                    >
                      View on Map
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Dress Code */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-champagne-50 rounded-lg p-8 mb-16 text-center"
          >
            <Users className="text-champagne-500 mx-auto mb-4" size={32} />
            <h3 className="font-serif text-2xl text-sage-800 mb-2">Dress Code</h3>
            <p className="text-lg text-sage-600">{dressCode}</p>
            <p className="text-sm text-sage-500 mt-2">
              We can&apos;t wait to celebrate with you in style!
            </p>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-white rounded-lg p-8 shadow-luxury"
          >
            <div className="text-center mb-8">
              <h3 className="font-serif text-3xl text-sage-800 mb-2">Schedule of Events</h3>
              <div className="w-16 h-px bg-champagne-400 mx-auto"></div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-6 group"
                  >
                    <div className="flex-shrink-0 w-20 text-right">
                      <span className="text-champagne-600 font-medium">{item.time}</span>
                    </div>
                    
                    <div className="flex-shrink-0 relative">
                      <div className="w-4 h-4 bg-champagne-400 rounded-full border-4 border-white shadow-sm"></div>
                      {index < timeline.length - 1 && (
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-px h-8 bg-champagne-200"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sage-800 group-hover:text-champagne-600 transition-colors">
                        {item.event}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}