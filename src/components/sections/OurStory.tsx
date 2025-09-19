'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Milestone {
  id: string
  title: string
  description: string
  date: string
  image_url?: string
  sort_order: number
}

interface OurStoryProps {
  milestones?: Milestone[]
}

const defaultMilestones: Milestone[] = [
  {
    id: '1',
    title: 'First Meeting',
    description: 'We met at a coffee shop downtown on a rainy Tuesday morning. What started as a chance encounter turned into hours of conversation over lattes and shared dreams.',
    date: 'Fall 2020',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    sort_order: 1
  },
  {
    id: '2',
    title: 'First Date',
    description: 'Our first official date was at the botanical gardens. We walked among the flowers, talking about everything and nothing, knowing this was something special.',
    date: 'Winter 2020',
    image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    sort_order: 2
  },
  {
    id: '3',
    title: 'Moving In Together',
    description: 'We decided to take the next step and move in together. Building a home filled with love, laughter, and countless memories.',
    date: 'Summer 2021',
    image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    sort_order: 3
  },
  {
    id: '4',
    title: 'The Proposal',
    description: 'James proposed during our weekend getaway to the mountains. With the sunset painting the sky golden, he got down on one knee and asked me to be his forever.',
    date: 'Spring 2023',
    image_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    sort_order: 4
  }
]

export const OurStory: React.FC<OurStoryProps> = ({
  milestones = defaultMilestones
}) => {
  const sortedMilestones = [...milestones].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <section id="our-story" className="py-20 bg-cream-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-sage-800 mb-6">
            Our Story
          </h2>
          <p className="text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed">
            Every love story is beautiful, but ours is our favorite. Here's how our journey began and led us to this magical moment.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {sortedMilestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center mb-20 last:mb-0 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                <div className="relative">
                  <div className={`relative overflow-hidden rounded-lg shadow-luxury ${
                    index % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'
                  }`}>
                    {milestone.image_url ? (
                      <Image
                        src={milestone.image_url}
                        alt={milestone.title}
                        width={600}
                        height={400}
                        className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-80 bg-champagne-100 flex items-center justify-center">
                        <span className="text-champagne-400 text-6xl">💕</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative element */}
                  <div className={`absolute -top-4 ${
                    index % 2 === 0 ? '-right-4' : '-left-4'
                  } w-8 h-8 bg-champagne-300 rounded-full opacity-60`} />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium tracking-wider uppercase">
                    {milestone.date}
                  </span>
                </div>
                
                <h3 className="font-serif text-3xl sm:text-4xl text-sage-800 mb-6">
                  {milestone.title}
                </h3>
                
                <p className="text-lg text-sage-600 leading-relaxed max-w-md lg:max-w-none mx-auto">
                  {milestone.description}
                </p>

                {/* Timeline connector for larger screens */}
                {index < sortedMilestones.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 mt-12">
                    <div className="w-px h-16 bg-sage-200"></div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline line for mobile */}
        <div className="lg:hidden relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-sage-200"></div>
          {sortedMilestones.map((_, index) => (
            <div
              key={index}
              className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-champagne-400 rounded-full"
              style={{
                top: `${(index + 1) * (100 / (sortedMilestones.length + 1))}%`
              }}
            />
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="font-serif text-2xl sm:text-3xl text-sage-700 mb-8">
            And now, we're ready to write the next chapter...
          </p>
          <div className="w-24 h-px bg-champagne-400 mx-auto"></div>
        </motion.div>
      </div>
    </section>
  )
}