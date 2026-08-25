const q = "3 bhk in bangalore under 2cr";
async function run() {
  const res = await fetch("https://cribr.in/api/ai-search-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q })
  });
  const data = await res.json();
  console.log("Intent:", JSON.stringify(data.intent, null, 2));

  const res2 = await fetch("https://cribr.in/api/search-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const data2 = await res2.json();
  console.log("Results count:", data2.length);
  if (data2.length > 0) {
     console.log(data2.map(p => ({name: p.name, min: p.min_price, max: p.max_price, units: p.unit_types})));
  }
}
run();
