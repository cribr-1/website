export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 container max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">Privacy Policy.</h1>
        <div className="prose prose-gray font-medium text-gray-500 space-y-8">
          <p>Your privacy is critical to us. This policy outlines how we handle your research data.</p>
          
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest text-[10px]">1. Data Collection</h3>
            <p>We collect search queries and saved properties to improve our AI models and personalize your research dashboard.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest text-[10px]">2. No Sale of Leads</h3>
            <p>Cribr does not sell your contact information to builders or brokers. We are an intelligence platform, not a lead generation engine.</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest text-[10px]">3. Account Security</h3>
            <p>We use Supabase for secure authentication. Your saved research is private and only accessible via your account.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
