export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 container max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">Terms of Service.</h1>
        <div className="prose prose-gray font-medium text-gray-500 space-y-8">
          <p>Welcome to Cribr. By accessing our platform, you agree to these terms. Please read them carefully.</p>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest text-[10px]">1. Purpose of Platform</h3>
            <p>Cribr provides property intelligence and research data for informational purposes only. We are not a licensed financial advisor or a real estate brokerage.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest text-[10px]">2. Data Accuracy</h3>
            <p>While we strive for technical accuracy by sourcing data from RERA and verified records, property data can change. Users should perform their own due diligence before any purchase.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest text-[10px]">3. Use of AI</h3>
            <p>Our summaries and analysis are generated using AI models. These insights should be treated as research aids, not absolute guarantees of property performance.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
