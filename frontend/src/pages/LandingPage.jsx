import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import FeatureSection from '../components/FeatureSection'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProductGrid isAuthenticated={false} />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}
