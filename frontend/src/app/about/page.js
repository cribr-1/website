export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 container max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-8">About Cribr.</h1>
        <p className="text-xl text-gray-500 leading-relaxed font-medium mb-12">
          Cribr is a property intelligence platform built on the radical idea that property data should be transparent, technical, and unbiased. 
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-t border-gray-100">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">The Problem</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              Real estate platforms today are optimized for sales, not for buyers. Marketing brochures hide technical trade-offs, and broker opinions are often incentivized by commissions. 
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              We empower buyers with AI-powered technical research. We analyze thousands of data points—from RERA compliance to density metrics—to give you the truth behind every project.
            </p>
          </div>
        </div>

        <div className="p-12 rounded-[3rem] bg-gray-50 border border-gray-100 mt-20">
          <h2 className="text-3xl font-bold mb-6">Built for Research.</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Cribr is designed for home buyers, families, and researchers who want to understand the long-term value and livability of a property before committing to a decision. We don't sell leads; we provide intelligence.
          </p>
        </div>
      </section>
    </div>
  );
}
