import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";
import Link from "next/link";
import { mockProjects } from "@/data/mockProjects";

export default async function BuilderPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let builder = null;
  let projects = [];
  let error = null;

  try {
    // 1. Fetch Builder Details
    const { data: builderData, error: builderError } = await supabase
      .from('builders')
      .select('*')
      .eq('id', id)
      .single();

    if (builderError) throw builderError;
    builder = builderData;

    // 2. Fetch Projects by this Builder
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('builder_id', id);

    if (projectsError) throw projectsError;
    projects = projectsData;

  } catch (err) {
    console.error("Error fetching builder data:", err);

    // Fallback: Try to find in mock data
    // Since mock data doesn't have a separate builders array, we derive it
    const fallbackProjects = mockProjects.filter(p => p.builder_id === id);

    if (fallbackProjects.length > 0) {
      builder = {
        id: id,
        name: fallbackProjects[0].builder_name || "Unknown Builder",
        description: `Premium real estate developer with a focus on quality and innovation.`
      };
      projects = fallbackProjects;
    } else {
      error = "Builder not found";
    }
  }

  if (error) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2>{error}</h2>
        <Link href="/">
          <button className={styles.backButton} style={{ marginTop: "2rem" }}>Go Home</button>
        </Link>
      </div>
    );
  }

  // Simulated Trust Metrics
  const trustMetrics = {
    reputationScore: 4.7,
    projectsDelivered: 32,
    onTimeRate: 94,
    qualityRating: 4.5,
    transparencyScore: 4.8
  };

  const formatPrice = (price) => {
    return (price / 10000000).toFixed(2) + " Cr";
  };

  return (
    <div className={styles.container}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <button className={styles.backButton}>← Back to Search</button>
      </Link>

      <header className={styles.header}>
        <div className={styles.builderProfile}>
          <div className={styles.logoPlaceholder}>
            {builder.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1>{builder.name}</h1>
            <p className={styles.description}>{builder.description || "No description available."}</p>
          </div>
        </div>
      </header>

      {/* Trust Score Dashboard */}
      <section className={styles.trustDashboard}>
        <div className="card-glass" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>✨ Builder Trust Score</h3>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{trustMetrics.reputationScore}/5</div>
              <div className={styles.metricLabel}>Reputation Score</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{trustMetrics.projectsDelivered}</div>
              <div className={styles.metricLabel}>Projects Delivered</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{trustMetrics.onTimeRate}%</div>
              <div className={styles.metricLabel}>On-Time Delivery</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{trustMetrics.qualityRating}/5</div>
              <div className={styles.metricLabel}>Construction Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ marginTop: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Projects by {builder.name}</h2>

        {projects.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No projects found for this builder.</p>
        ) : (
          <div className={styles.grid}>
            {projects.map((project) => (
              <div key={project.id} className={`${styles.card} card-glass`}>
                <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={project.images?.[0] || "https://placehold.co/600x400/31343c/ffffff?text=No+Image"}
                    alt={project.name || project.project_name}
                    className={styles.cardImage}
                  />
                  <div className={styles.cardContent}>
                    <div className={styles.badge}>{project.locality}</div>
                    <h3>{project.name || project.project_name}</h3>
                    <div className={styles.price}>
                      {formatPrice(project.price_min)} - {formatPrice(project.price_max)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", marginTop: "1rem" }}>
                      <span>⭐ {project.google_reviews_score}</span>
                      <span>Progress: {project.construction_progress}%</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
