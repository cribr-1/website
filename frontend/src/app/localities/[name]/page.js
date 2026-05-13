import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";
import Link from "next/link";
import { mockProjects } from "@/data/mockProjects";

export default async function LocalityPage({ params }) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);

  let projects = [];
  let error = null;

  try {
    // Fetch Projects in this Locality
    const { data, error: dbError } = await supabase
      .from('projects')
      .select('*, builders(name)')
      .ilike('locality', `%${name}%`);

    if (dbError) throw dbError;
    
    if (data && data.length > 0) {
      projects = data;
    } else {
      // Fallback to mock data
      const mockFiltered = mockProjects.filter(p => p.locality.toLowerCase().includes(name.toLowerCase()));
      projects = mockFiltered;
    }

  } catch (err) {
    console.error("Error fetching locality data:", err);
    // Fallback to mock data
    const mockFiltered = mockProjects.filter(p => p.locality.toLowerCase().includes(name.toLowerCase()));
    projects = mockFiltered;
  }

  // Simulated Locality Intelligence Metrics
  const localityMetrics = {
    livabilityScore: 8.2,
    connectivityScore: 7.5,
    rentalDemand: "High",
    appreciationPotential: "10-12% YoY",
    trafficLevel: "Moderate",
    waterRisk: "Low",
    safetyScore: 9.0
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
        <div className={styles.localityHeader}>
          <div className={styles.badge}>Locality Profile</div>
          <h1>{name}</h1>
          <p className={styles.description}>
            Comprehensive intelligence and real estate analytics for {name}.
          </p>
        </div>
      </header>

      {/* Locality Intelligence Dashboard */}
      <section className={styles.dashboard}>
        <div className="card-glass" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>📊 Locality Intelligence</h3>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{localityMetrics.livabilityScore}/10</div>
              <div className={styles.metricLabel}>Livability Score</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{localityMetrics.connectivityScore}/10</div>
              <div className={styles.metricLabel}>Connectivity</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{localityMetrics.rentalDemand}</div>
              <div className={styles.metricLabel}>Rental Demand</div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricValue}>{localityMetrics.appreciationPotential}</div>
              <div className={styles.metricLabel}>Appreciation</div>
            </div>
          </div>
        </div>

        <div className="card-glass" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "1rem" }}>🔍 Area Insights</h3>
          <ul className={styles.insightsList}>
            <li><span>Traffic:</span> <span>{localityMetrics.trafficLevel}</span></li>
            <li><span>Water Risk:</span> <span>{localityMetrics.waterRisk}</span></li>
            <li><span>Safety Score:</span> <span>{localityMetrics.safetyScore}/10</span></li>
            <li><span>IT Hub Distance:</span> <span>Near (within 5km)</span></li>
          </ul>
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ marginTop: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Projects in {name}</h2>
        
        {projects.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>No projects found in this locality.</p>
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
                    <h3>{project.name || project.project_name}</h3>
                    <p style={{ color: "var(--muted)" }}>By {project.builders?.name || project.builder_name}</p>
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
