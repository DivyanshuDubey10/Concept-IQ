import { useEffect } from 'react'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { HeroSection } from '../components/landing/HeroSection'
import { ProblemSection } from '../components/landing/ProblemSection'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { AdaptiveLearningSection } from '../components/landing/AdaptiveLearningSection'
import { AITutorSection } from '../components/landing/AITutorSection'
import { MasterySection } from '../components/landing/MasterySection'
import { RevisionSection } from '../components/landing/RevisionSection'
import { FinalCTA } from '../components/landing/FinalCTA'
import { LandingFooter } from '../components/landing/LandingFooter'

export default function Landing() {
  // Set page title and meta description for SEO
  useEffect(() => {
    document.title = 'ConceptIQ — From knowing the answer to mastering the concept.'

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content =
      'ConceptIQ helps you understand what you know, identify what needs work, and practice the concepts that matter most.'

    return () => {
      // Restore default title when navigating away
      document.title = 'ConceptIQ'
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-main overflow-x-hidden w-full relative">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <LandingNavbar />

      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <AdaptiveLearningSection />
        <AITutorSection />
        <MasterySection />
        <RevisionSection />
        <FinalCTA />
      </main>

      <LandingFooter />
    </div>
  )
}
