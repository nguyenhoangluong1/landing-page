'use client'

import { useState, useEffect } from 'react'
import { Hero } from '@/components/sections/Hero'
import { OurStory } from '@/components/sections/OurStory'
import { Gallery } from '@/components/sections/Gallery'
import { WeddingDetails } from '@/components/sections/WeddingDetails'
import { RSVPSection } from '@/components/sections/RSVPSection'
import { GiftRegistry } from '@/components/sections/GiftRegistry'

interface ContentData {
  hero?: {
    couple_names?: { bride: string; groom: string }
    wedding_date?: { date: string; display: string }
    hero_text?: { title: string; subtitle: string }
    background_image?: string
  }
  venue?: any
  // Add other content types as needed
}

export default function HomePage() {
  const [contentData, setContentData] = useState<ContentData>({})
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
    fetchStoryMilestones()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content')
      if (response.ok) {
        const data = await response.json()
        // Transform data into sections
        const sections: any = {}
        data.data.forEach((item: any) => {
          if (!sections[item.section]) {
            sections[item.section] = {}
          }
          let contentValue = item.content_value
          try {
            if (typeof contentValue === 'string') {
              contentValue = JSON.parse(contentValue)
            }
          } catch (e) {
            contentValue = item.content_value
          }
          sections[item.section][item.content_key] = contentValue
        })
        setContentData(sections)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    }
  }

  const fetchStoryMilestones = async () => {
    try {
      const response = await fetch('/api/story')
      if (response.ok) {
        const data = await response.json()
        setMilestones(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch story milestones:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Hero 
        coupleNames={contentData.hero?.couple_names}
        weddingDate={contentData.hero?.wedding_date?.display}
        heroText={contentData.hero?.hero_text}
        backgroundImage={contentData.hero?.background_image}
      />
      <OurStory milestones={milestones} />
      <Gallery />
      <WeddingDetails />
      <RSVPSection />
      <GiftRegistry />
    </main>
  )
}