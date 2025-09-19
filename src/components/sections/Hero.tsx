'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface HeroProps {
  coupleNames?: {
    bride: string
    groom: string
  }
  weddingDate?: string
  heroText?: {
    title: string
    subtitle: string
  }
  backgroundImage?: string
  backgroundVideo?: string
}

export const Hero: React.FC<HeroProps> = ({
  coupleNames = { bride: 'Emma', groom: 'James' },
  weddingDate = 'June 15, 2024',
  heroText = {
    title: 'Together Forever',
    subtitle: 'Join us as we begin our journey as one'
  },
  backgroundImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  backgroundVideo
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <div
            className="w-full h-full bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Couple Names */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-wide"
          >
            {coupleNames.bride}
            <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-champagne-200 my-4">
              &
            </span>
            {coupleNames.groom}
          </motion.h1>

          {/* Wedding Date */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl sm:text-2xl lg:text-3xl text-champagne-100 font-light tracking-widest"
          >
            {weddingDate}
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-cream-100">
              {heroText.title}
            </h2>
            <p className="text-lg sm:text-xl text-cream-200 font-light leading-relaxed">
              {heroText.subtitle}
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/80 cursor-pointer"
              onClick={() => {
                const nextSection = document.querySelector('#our-story')
                nextSection?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <ChevronDown size={32} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 1.3 }}
        className="absolute bottom-40 right-20 w-24 h-24 border border-white/20 rounded-full"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, delay: 1.6 }}
        className="absolute top-1/2 right-10 w-16 h-16 border border-white/20 rounded-full"
      />
    </section>
  )
}