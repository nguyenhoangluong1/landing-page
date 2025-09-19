'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Gallery as PhotoSwipeGallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/style.css'

interface GalleryImage {
  id: string
  src: string
  alt: string
  category: 'engagement' | 'pre-wedding' | 'ceremony' | 'reception' | 'couple' | 'family'
  width: number
  height: number
  featured: boolean
}

interface GalleryProps {
  images?: GalleryImage[]
}

const defaultImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Engagement photo 1',
    category: 'engagement',
    width: 800,
    height: 600,
    featured: true
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Engagement photo 2',
    category: 'engagement',
    width: 800,
    height: 1200,
    featured: false
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Pre-wedding photo 1',
    category: 'pre-wedding',
    width: 800,
    height: 600,
    featured: false
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Pre-wedding photo 2',
    category: 'pre-wedding',
    width: 800,
    height: 600,
    featured: true
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Couple photo 1',
    category: 'couple',
    width: 800,
    height: 1000,
    featured: false
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Couple photo 2',
    category: 'couple',
    width: 800,
    height: 600,
    featured: false
  }
]

const categories = [
  { value: 'all', label: 'All Photos' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'pre-wedding', label: 'Pre-Wedding' },
  { value: 'couple', label: 'Couple' },
  { value: 'ceremony', label: 'Ceremony' },
  { value: 'reception', label: 'Reception' },
  { value: 'family', label: 'Family' }
]

export const Gallery: React.FC<GalleryProps> = ({
  images = defaultImages
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(img => img.category === activeCategory)

  const getGridClass = (index: number) => {
    // Create a masonry-like layout with varying heights
    const patterns = [
      'row-span-1', // Standard height
      'row-span-2', // Double height
      'row-span-1', // Standard height
      'row-span-1', // Standard height
      'row-span-2', // Double height
      'row-span-1', // Standard height
    ]
    return patterns[index % patterns.length]
  }

  return (
    <section id="gallery" className="py-20 bg-white">
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
            Our Gallery
          </h2>
          <p className="text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed">
            Capturing the beautiful moments of our journey together. Each photo tells a part of our love story.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setActiveCategory(category.value)}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                activeCategory === category.value
                  ? 'bg-champagne-400 text-white shadow-luxury'
                  : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <PhotoSwipeGallery>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[200px]"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100 
                }}
                className={`relative overflow-hidden rounded-lg group cursor-pointer ${getGridClass(index)}`}
              >
                <Item
                  original={image.src}
                  thumbnail={image.src}
                  width={image.width}
                  height={image.height}
                >
                  {({ ref, open }) => (
                    <div
                      ref={ref}
                      onClick={open}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-3 py-1 bg-white/90 text-sage-700 text-sm rounded-full font-medium capitalize">
                          {image.category.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {image.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="w-6 h-6 bg-champagne-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">★</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Item>
              </motion.div>
            ))}
          </motion.div>
        </PhotoSwipeGallery>

        {/* Load More Button */}
        {filteredImages.length > 12 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <button className="btn-outline-luxury">
              Load More Photos
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}