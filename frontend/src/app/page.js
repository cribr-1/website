"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { mockProjects } from "@/data/mockProjects";
import { supabase } from "@/lib/supabase";
import { parseQuery } from "@/lib/queryParser";

const COMMON_AMENITIES = [
  "Swimming Pool", "Gym", "Clubhouse", "Power Backup", "Security",
  "Jogging Track", "Children's Play Area", "Landscaped Gardens"
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [parsedFilters, setParsedFilters] = useState(null);

  // Location states
  const [location, setLocation] = useState("Bangalore"); // Default
  const [cityInput, setCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Compare states
  const [selectedProjects, setSelectedProjects] = useState([]);

  // Deep Filters states
  const [selectedBHKs, setSelectedBHKs] = useState([]);
  const [maxPrice, setMaxPrice] = useState(50000000); // Default 5 Cr
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Load selected projects from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("compareProjects");
    if (saved) {
      setSelectedProjects(JSON.parse(saved));
    }
  }, []);

  const toggleCompare = (e, projectId) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    
    let updated;
    if (selectedProjects.includes(projectId)) {
      updated = selectedProjects.filter(id => id !== projectId);
    } else {
      if (selectedProjects.length >= 3) {
        alert("You can only compare up to 3 projects at a time.");
        return;
      }
      updated = [...selectedProjects, projectId];
    }
    
    setSelectedProjects(updated);
    localStorage.setItem("compareProjects", JSON.stringify(updated));
  };

  // Geolocation detection on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            
            const city = data.address.city || data.address.town || data.address.district || data.address.state;
            
            if (data.address.country_code === 'in' && city) {
              setLocation(city);
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
          }
        },
        (error) => {
          console.log("Geolocation permission denied or error:", error.message);
        }
      );
    }
  }, []);

  // Fetch city suggestions when typing
  useEffect(() => {
    if (cityInput.length > 2) {
      const fetchCities = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&featuretype=city&q=${cityInput}`);
          const data = await res.json();
          
          const uniqueCities = data.map(item => ({
            name: item.name,
            state: item.address?.state || item.display_name.split(',')[1]?.trim()
          })).filter((value, index, self) =>
            index === self.findIndex((t) => t.name === value.name)
          );

          setCitySuggestions(uniqueCities);
        } catch (error) {
          console.error("Error fetching city suggestions:", error);
        }
      };
      
      const timer = setTimeout(fetchCities, 300);
      return () => clearTimeout(timer);
    } else {
      setCitySuggestions([]);
    }
  }, [cityInput]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        let query = supabase
          .from('projects')
          .select('*, builders(name)');
        
        const parsed = parseQuery(debouncedQuery);
        setParsedFilters(parsed);

        // Apply Search Bar Filters
        if (parsed.bhk) {
          query = query.contains('unit_types', [parsed.bhk]);
        }
        if (parsed.priceMax) {
          query = query.lte('price_max', parsed.priceMax);
        }
        if (parsed.locality) {
          query = query.ilike('locality', `%${parsed.locality}%`);
        }
        
        if (parsed.remainingQuery && parsed.remainingQuery.length > 2) {
          query = query.textSearch('search_vector', parsed.remainingQuery, {
            type: 'websearch',
            config: 'english'
          });
        }

        // Apply Deep Filters (Sidebar)
        if (selectedBHKs.length > 0) {
          query = query.overlaps('unit_types', selectedBHKs);
        }
        if (maxPrice) {
          query = query.lte('price_max', maxPrice);
        }
        if (selectedAmenities.length > 0) {
          query = query.contains('amenities', selectedAmenities);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setProjects(data);
          setUsingMock(false);
        } else if (!debouncedQuery && selectedBHKs.length === 0 && selectedAmenities.length === 0 && maxPrice === 50000000) {
          setProjects(mockProjects);
          setUsingMock(true);
        } else {
          setProjects([]);
          setUsingMock(false);
        }
      } catch (error) {
        console.error("Error fetching projects from Supabase:", error);
        if (!debouncedQuery) {
          setProjects(mockProjects);
          setUsingMock(true);
        } else {
          setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [debouncedQuery, location, selectedBHKs, maxPrice, selectedAmenities]);

  const formatPrice = (price) => {
    return (price / 10000000).toFixed(2) + " Cr";
  };

  const handleBHKChange = (bhk) => {
    if (selectedBHKs.includes(bhk)) {
      setSelectedBHKs(selectedBHKs.filter(item => item !== bhk));
    } else {
      setSelectedBHKs([...selectedBHKs, bhk]);
    }
  };

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "100px" }}>
      <section className={styles.hero}>
        <h1 className="animate-fade-in">Find Your Perfect Crib</h1>
        <p className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Discover, compare, and analyze premium real estate projects.
        </p>
        
        <div className={styles.searchContainer}>
          <div className={styles.locationSelector}>
            <span onClick={() => setShowDropdown(!showDropdown)}>📍 {location}</span>
            
            {showDropdown && (
              <div className={styles.suggestionsDropdown}>
                <input
                  type="text"
                  placeholder="Change city..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className={styles.cityInput}
                  autoFocus
                />
                <ul>
                  {citySuggestions.length > 0 ? (
                    citySuggestions.map((city, index) => (
                      <li key={index} onClick={() => {
                        setLocation(city.name);
                        setShowDropdown(false);
                        setCityInput("");
                      }}>
                        {city.name}
                      </li>
                    ))
                  ) : cityInput.length > 2 ? (
                    <li style={{ color: "var(--muted)" }}>No cities found</li>
                  ) : (
                    <>
                      <li onClick={() => { setLocation("Bangalore"); setShowDropdown(false); }}>Bangalore</li>
                      <li onClick={() => { setLocation("Mumbai"); setShowDropdown(false); }}>Mumbai</li>
                      <li onClick={() => { setLocation("Delhi"); setShowDropdown(false); }}>Delhi</li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
          
          <input
            type="text"
            placeholder="Try '2BHK under 1 Cr in Whitefield'..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {parsedFilters && (parsedFilters.bhk || parsedFilters.priceMax || parsedFilters.locality || parsedFilters.amenities.length > 0) && (
          <div className={styles.filtersDisplay}>
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Detected Filters:</span>
            {parsedFilters.bhk && <span className={styles.filterChip}>{parsedFilters.bhk}</span>}
            {parsedFilters.priceMax && <span className={styles.filterChip}>{`< ${(parsedFilters.priceMax / 10000000).toFixed(1)} Cr`}</span>}
            {parsedFilters.locality && <span className={styles.filterChip}>{parsedFilters.locality}</span>}
            {parsedFilters.amenities.map((amenity, index) => (
              <span key={index} className={styles.filterChip}>{amenity}</span>
            ))}
          </div>
        )}
      </section>

      {usingMock && (
        <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "2rem", fontSize: "0.9rem", maxWidth: "600px", textAlign: "center" }}>
          ⚠️ Showing mock data. Please run the generated SQL script in your Supabase dashboard to see live data.
        </div>
      )}

      {/* Main Content Layout with Sidebar */}
      <div className={styles.mainLayout}>
        {/* Filter Sidebar */}
        <aside className={`${styles.sidebar} card-glass`}>
          <h3>Filters</h3>
          
          <div className={styles.filterSection}>
            <h4>BHK Type</h4>
            {["1BHK", "2BHK", "3BHK", "4BHK"].map((bhk) => (
              <label key={bhk} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedBHKs.includes(bhk)}
                  onChange={() => handleBHKChange(bhk)}
                />
                {bhk}
              </label>
            ))}
          </div>

          <div className={styles.filterSection}>
            <h4>Max Price</h4>
            <input
              type="range"
              min="5000000"
              max="100000000"
              step="5000000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className={styles.rangeInput}
            />
            <div style={{ fontSize: "0.9rem", color: "var(--primary)", marginTop: "0.5rem" }}>
              Up to {formatPrice(maxPrice)}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4>Amenities</h4>
            {COMMON_AMENITIES.map((amenity) => (
              <label key={amenity} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>

          <button 
            className={styles.clearButton}
            onClick={() => {
              setSelectedBHKs([]);
              setMaxPrice(50000000);
              setSelectedAmenities([]);
            }}
          >
            Clear Filters
          </button>
        </aside>

        {/* Projects Grid */}
        <section style={{ flex: 1 }}>
          <h2 style={{ marginBottom: "1.5rem" }}>
            {debouncedQuery ? `Search Results` : (usingMock ? "Featured Projects (Mock)" : "Live Projects")}
          </h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>Loading projects...</div>
          ) : (
            <div className={styles.grid}>
              {projects.map((project) => (
                <div key={project.id} className={`${styles.card} card-glass`}>
                  <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={project.images?.[0] || "https://placehold.co/600x400/31343c/ffffff?text=No+Image"}
                        alt={project.name || project.project_name}
                        className={styles.cardImage}
                      />
                      <button 
                        className={`${styles.compareButton} ${selectedProjects.includes(project.id) ? styles.compareActive : ""}`}
                        onClick={(e) => toggleCompare(e, project.id)}
                      >
                        {selectedProjects.includes(project.id) ? "✓ Added" : "+ Compare"}
                      </button>
                    </div>
                  </Link>
                  <div className={styles.cardContent}>
                    <Link href={`/localities/${project.locality}`} style={{ textDecoration: 'none' }}>
                      <div className={styles.badge}>{project.locality}</div>
                    </Link>
                    <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3>{project.name || project.project_name}</h3>
                    </Link>
                    <p style={{ color: "var(--muted)" }}>
                      By <Link href={`/builders/${project.builder_id}`} style={{ color: "var(--primary)", textDecoration: "none" }}>{project.builders?.name || project.builder_name}</Link>
                    </p>
                    <div className={styles.price}>
                      {formatPrice(project.price_min)} - {formatPrice(project.price_max)}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)" }}>
                      <span>⭐ {project.google_reviews_score}</span>
                      <span>Progress: {project.construction_progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && projects.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted)" }}>
              No projects found matching your filters.
            </div>
          )}
        </section>
      </div>

      {/* Persistent Compare Bar */}
      {selectedProjects.length > 0 && (
        <div className={styles.compareBar}>
          <div className={styles.compareBarContent}>
            <span>{selectedProjects.length} project{selectedProjects.length > 1 ? "s" : ""} selected</span>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                className={styles.clearButton}
                onClick={() => {
                  setSelectedProjects([]);
                  localStorage.removeItem("compareProjects");
                }}
              >
                Clear All
              </button>
              <Link href={`/compare?ids=${selectedProjects.join(",")}`}>
                <button className={styles.actionButton}>Compare Now</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
