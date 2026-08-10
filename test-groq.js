import Groq from "groq-sdk";
const groq = new Groq({ apiKey: "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" });
async function test() {
    const systemPrompt = `You are CRIBR's real estate search intent parser. Return JSON ONLY with this schema: {"locality":string|null,"unitType":string|null,"maxPriceINR":number|null,"minPriceINR":number|null,"minBuilderGrade":string|null,"maxDistanceHubKm":number|null,"nearestOfficeHub":string|null,"possessionYear":number|null,"maxComplaints":number|null,"builderName":string|null,"keywords":string[]}
CRITICAL:
1 Crore (Cr) = 10,000,000 INR. So "1.5cr" = 15000000.
1 Lakh (L) = 100,000 INR. So "50 lakhs" = 5000000.
unitType should be "1BHK", "2BHK", "3BHK", etc.`;
    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User query: "3 bhk in bangalore under 1.5cr"` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
    });
    console.log(completion.choices[0]?.message?.content);
}
test();
