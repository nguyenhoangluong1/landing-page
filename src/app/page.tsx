import { Hero } from '@/components/sections/Hero'
import { OurStory } from '@/components/sections/OurStory'
import { Gallery } from '@/components/sections/Gallery'
import { WeddingDetails } from '@/components/sections/WeddingDetails'
import { RSVPSection } from '@/components/sections/RSVPSection'
import { GiftRegistry } from '@/components/sections/GiftRegistry'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <OurStory />
      <Gallery />
      <WeddingDetails />
      <RSVPSection />
      <GiftRegistry />
    </main>
  )
}