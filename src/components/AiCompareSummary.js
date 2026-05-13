"use client";

import { useState, useEffect } from "react";
import styles from "./AiSummary.module.css"; // Reusing styles

export default function AiCompareSummary({ projects }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projects.length === 0) return;

    // Simulate AI generation delay
    const timer = setTimeout(() => {
      const names = projects.map(p => p.name || p.project_name);
      
      let simulated = "";
      if (projects.length >= 2) {
        const p1 = projects[0];
        const p2 = projects[1];
        
        simulated = `Comparing ${p1.name || p1.project_name} and ${p2.name || p2.project_name}: `;
        
        if (p1.commute_score > p2.commute_score) {
          simulated += `${p1.name || p1.project_name} offers better connectivity with a score of ${p1.commute_score}/10. `;
        } else {
          simulated += `${p2.name || p2.project_name} offers better connectivity with a score of ${p2.commute_score}/10. `;
        }
        
        if (p1.price_min < p2.price_min) {
          simulated += `${p1.name || p1.project_name} is more accessible with a lower starting price of ${(p1.price_min/10000000).toFixed(2)} Cr. `;
        } else {
          simulated += `${p2.name || p2.project_name} is more accessible with a lower starting price of ${(p2.price_min/10000000).toFixed(2)} Cr. `;
        }
        
        simulated += `Choose ${p1.name || p1.project_name} if you prioritize ${p1.locality} location, or ${p2.name || p2.project_name} if you prefer ${p2.locality}.`;
      } else {
        simulated = "Select at least 2 projects to see a comparison summary.";
      }
      
      setSummary(simulated);
      setLoading(false);
    }, 2500); // 2.5 second delay

    return () => clearTimeout(timer);
  }, [projects]);

  return (
    <div className={styles.aiSection} style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.25rem" }}>✨</span>
        <h2 style={{ fontSize: "1.25rem", color: "var(--primary)", margin: 0 }}>AI Comparison Insights</h2>
      </div>
      {loading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonLine} style={{ width: "60%" }}></div>
        </div>
      ) : (
        <p className={styles.summaryText}>{summary}</p>
      )}
    </div>
  );
}
