const q = "3 bhk in bangalore under 1cr";
async function run() {
  const res = await fetch("https://cribr.in/api/ai-search-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q })
  });
  const data = await res.json();
  console.log("Intent:", data);

  const res2 = await fetch("https://cribr.in/api/search-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  const data2 = await res2.json();
  console.log("Results count:", data2.length);
}
run();
