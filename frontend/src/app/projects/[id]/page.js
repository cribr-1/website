import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";
import { mockProjects } from "@/data/mockProjects";
import AiSummary from "@/components/AiSummary";
import Link from "next/link";

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let project = null;
  let error = null;

  // Try to fetch from Supabase first
  try {
    const { data, error: dbError } = await supabase
      .from('projects')
      .select('*, builders(name)')
      .eq('id', id)
      .single();

    if (dbError) throw dbError;
    project = data;
  } catch (err) {
    console.error("Supabase fetch error or invalid UUID:", err);
    // If it fails (e.g. invalid UUID), try to find in mock data as fallback
    project = mockProjects.find(p => p.id === id);
    if (!project) {
      error = "Project not found";
    }
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const formatPrice = (price) => {
    return (price / 10000000).toFixed(2) + " Cr";
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={`/localities/${project.locality}`} style={{ textDecoration: 'none' }}>
          <div className={styles.badge}>{project.locality}</div>
        </Link>
        <h1>{project.name || project.project_name}</h1>
        <p className={styles.builder}>
          By <Link href={`/builders/${project.builder_id}`} style={{ color: "var(--primary)", textDecoration: "none" }}>{project.builders?.name || project.builder_name}</Link>
        </p>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainContent}>
          <img
            src={project.images?.[0] || "https://placehold.co/1200x800/31343c/ffffff?text=No+Image"}
            alt={project.name || project.project_name}
            className={styles.mainImage}
          />
          
          {/* AI Summary Section */}
          <AiSummary project={project} />
          
          <div className={styles.section}>
            <h2>About Project</h2>
            <p>{project.property_title_summary || "No summary available."}</p>
          </div>

          <div className={styles.section}>
            <h2>Amenities</h2>
            <div className={styles.tags}>
              {project.amenities?.map((amenity, index) => (
                <span key={index} className={styles.tag}>{amenity}</span>
              )) || <span>No amenities listed.</span>}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className="card-glass" style={{ padding: "1.5rem" }}>
            <h3>Pricing & Configurations</h3>
            <div className={styles.price}>
              {formatPrice(project.price_min)} - {formatPrice(project.price_max)}
            </div>
            <p style={{ color: "var(--muted)" }}>Price per sft: ₹{project.price_per_sft}</p>
            
            <hr style={{ margin: "1rem 0", borderColor: "var(--glass-border)" }} />
            
            <h4>Unit Types</h4>
            <div className={styles.tags}>
              {project.unit_types?.map((type, index) => (
                <span key={index} className={styles.tag}>{type}</span>
              )) || <span>N/A</span>}
            </div>
          </div>

          <div className="card-glass" style={{ padding: "1.5rem", marginTop: "1rem" }}>
            <h3>Key Details</h3>
            <ul className={styles.detailsList}>
              <li><span>Status:</span> <span>{project.construction_progress}% Complete</span></li>
              <li><span>Total Units:</span> <span>{project.total_units}</span></li>
              <li><span>Land Area:</span> <span>{project.land_area_acres} Acres</span></li>
              <li><span>RERA:</span> <span>{project.rera_number || "N/A"}</span></li>
              <li><span>Commute Score:</span> <span>{project.commute_score}/10</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
