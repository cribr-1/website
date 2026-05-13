"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { supabase } from "@/lib/supabase";
import { mockProjects } from "@/data/mockProjects";
import AiCompareSummary from "@/components/AiCompareSummary";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",") || [];
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*, builders(name)')
          .in('id', ids);

        if (error) throw error;

        if (data && data.length > 0) {
          setProjects(data);
        } else {
          // Fallback to mock data if IDs match mock IDs
          const mockFiltered = mockProjects.filter(p => ids.includes(p.id));
          setProjects(mockFiltered);
        }
      } catch (error) {
        console.error("Error fetching projects for comparison:", error);
        // Fallback to mock
        const mockFiltered = mockProjects.filter(p => ids.includes(p.id));
        setProjects(mockFiltered);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [searchParams]);

  const formatPrice = (price) => {
    return (price / 10000000).toFixed(2) + " Cr";
  };

  if (ids.length === 0) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2>No projects selected for comparison.</h2>
        <p style={{ color: "var(--muted)", marginTop: "1rem" }}>Go back to homepage and select projects.</p>
        <Link href="/">
          <button className={styles.backButton} style={{ marginTop: "2rem" }}>Go Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <button className={styles.backButton} style={{ marginBottom: "2rem" }}>← Back to Search</button>
      </Link>

      <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Project Comparison</h1>

      {/* AI Comparison Summary */}
      {!loading && projects.length > 0 && <AiCompareSummary projects={projects} />}

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem" }}>Loading comparison...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th style={{ minWidth: "150px" }}>Feature</th>
                {projects.map(project => (
                  <th key={project.id} style={{ minWidth: "250px" }}>
                    <div className={styles.projectHeader}>
                      <img 
                        src={project.images?.[0] || "https://placehold.co/600x400/31343c/ffffff?text=No+Image"} 
                        alt={project.name || project.project_name} 
                      />
                      <h3>{project.name || project.project_name}</h3>
                      <p>By {project.builders?.name || project.builder_name}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.featureName}>Price Range</td>
                {projects.map(project => (
                  <td key={project.id} className={styles.priceHighlight}>
                    {formatPrice(project.price_min)} - {formatPrice(project.price_max)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className={styles.featureName}>Locality</td>
                {projects.map(project => (
                  <td key={project.id}>{project.locality}</td>
                ))}
              </tr>
              <tr>
                <td className={styles.featureName}>Unit Types</td>
                {projects.map(project => (
                  <td key={project.id}>{project.unit_types?.join(", ") || "N/A"}</td>
                ))}
              </tr>
              <tr>
                <td className={styles.featureName}>Progress</td>
                {projects.map(project => (
                  <td key={project.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>{project.construction_progress}%</span>
                      <div style={{ width: "100px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                        <div style={{ width: `${project.construction_progress}%`, height: "100%", background: "var(--primary)", borderRadius: "3px" }}></div>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className={styles.featureName}>Google Score</td>
                {projects.map(project => (
                  <td key={project.id}>⭐ {project.google_reviews_score}</td>
                ))}
              </tr>
              <tr>
                <td className={styles.featureName}>Commute Score</td>
                {projects.map(project => (
                  <td key={project.id}>{project.commute_score}/10</td>
                ))}
              </tr>
              <tr>
                <td className={styles.featureName}>RERA Number</td>
                {projects.map(project => (
                  <td key={project.id}>{project.rera_number || "N/A"}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
