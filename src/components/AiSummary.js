"use client";

import { useState, useEffect } from "react";
import styles from "./AiSummary.module.css";

export default function AiSummary({ project }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI generation delay
    const timer = setTimeout(() => {
      // Generate a simulated summary based on project data
      const bhk = project.unit_types?.join(", ") || "various configurations";
      const locality = project.locality || "East Bangalore";
      const builder = project.builders?.name || project.builder_name || "a premium builder";
      
      const simulated = `This project by ${builder} is suitable for families looking for premium ${bhk} apartments in ${locality} with strong connectivity and modern amenities. It scores ${project.commute_score}/10 on commute and is ${project.construction_progress}% complete. Key highlights include amenities like ${project.amenities?.slice(0, 3).join(", ") || "modern facilities"}.`;
      
      setSummary(simulated);
      setLoading(false);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [project]);

  return (
    <div className={styles.aiSection}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.25rem" }}>✨</span>
        <h2 style={{ fontSize: "1.25rem", color: "var(--primary)", margin: 0 }}>AI Project Summary</h2>
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
