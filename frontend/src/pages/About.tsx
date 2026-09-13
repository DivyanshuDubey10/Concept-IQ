import { useEffect } from 'react'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { LandingFooter } from '../components/landing/LandingFooter'
import { BrainCircuit } from 'lucide-react'

export default function About() {
  useEffect(() => {
    document.title = 'About ConceptIQ'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background text-text-main">
      <LandingNavbar />
      
      <main className="pt-32 pb-24 px-5 md:px-8 max-w-3xl mx-auto min-h-[70vh]">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow-primary">
            <BrainCircuit className="w-5 h-5 text-text-main" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">About Us</h1>
        </div>
        
        <div className="prose prose-invert prose-p:text-text-muted prose-h2:text-text-main prose-a:text-primary max-w-none space-y-6">
          <p className="text-lg leading-relaxed text-text-main/80">
            Welcome to ConceptIQ. We are on a mission to redefine how students learn by focusing on true mastery of underlying concepts, rather than just memorizing answers for the test.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Our Philosophy</h2>
          <p className="leading-relaxed">
            Most learning platforms are built around endless multiple-choice questions. While testing is important, testing without understanding leads to frustration and shallow knowledge. ConceptIQ was built to flip this dynamic. 
          </p>
          <p className="leading-relaxed">
            By analyzing where you struggle, our AI tutor breaks down complex topics into digestible, bite-sized components. We guide you through the "why" and "how" before testing the "what."
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">The Team</h2>
          <p className="leading-relaxed">
            We are a small, dedicated team of educators, engineers, and designers who believe that personalized education should be accessible to everyone. We've combined the latest advancements in artificial intelligence with proven cognitive science principles like spaced repetition and active recall to build a platform that adapts to your unique learning pace.
          </p>

          <h2 className="text-xl font-semibold mt-10 mb-4">Contact Us</h2>
          <p className="leading-relaxed">
            Have questions, feedback, or just want to say hi? We'd love to hear from you. Reach out to our team anytime at <a href="mailto:hello@conceptiq.com" className="hover:underline">hello@conceptiq.com</a>.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
