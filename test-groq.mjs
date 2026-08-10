import Groq from "groq-sdk";
const groq = new Groq({ apiKey: "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" });
async function testModel(m) {
  try {
    const comp = await groq.chat.completions.create({
      model: m,
      messages: [{role: "user", content: "test"}]
    });
    console.log(`Success ${m}:`, comp.choices[0]?.message?.content);
  } catch (e) {
    console.error(`Error ${m}:`, e.message);
  }
}
async function test() {
  await testModel("llama-3.1-8b-instant");
  await testModel("llama-3.3-70b-versatile");
  await testModel("gemma2-9b-it");
}
test();
