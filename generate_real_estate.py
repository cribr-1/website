import csv
import random
from datetime import datetime

# Comprehensive list of real projects and builders in East Bangalore
real_projects = [
    ("Godrej Lakeside Orchard", "Godrej Properties", "Kodathi Village"),
    ("Nambiar District 25 Phase 1", "Nambiar Builders", "Sarjapur"),
    ("Birla Evara", "Birla Estates", "Varthur"),
    ("Brigade Sanctuary", "Brigade Enterprises", "Sarjapur"),
    ("Abhee Celestial City", "Abhee Ventures", "Sarjapur"),
    ("DSR The Address", "DSR Infraprojects", "Sarjapur"),
    ("Eaton Park @ The Prestige City", "Prestige Estates", "Sompura Village"),
    ("Brigade Belvedere", "Brigade Enterprises", "Whitefield"),
    ("Royal View", "Royal Builders", "Marathahalli"),
    ("Prestige Raintree Park", "Prestige Estates", "Varthur"),
    ("Prestige Somerville", "Prestige Estates", "Whitefield"),
    ("Prestige Pine Forest", "Prestige Estates", "ECC Road"),
    ("Assetz Marq 3.0", "Assetz Property Group", "Whitefield"),
    ("Sobha Dream Acres", "Sobha Limited", "Panathur"),
    ("Rohan Upavan", "Rohan Builders", "Off Hennur Road"),
    ("Shriram Blue", "Shriram Properties", "KR Puram"),
    ("Purva Zenium", "Puravankara", "Hosahalli"),
    ("Salarpuria Sattva East Crest", "Salarpuria Sattva", "Old Madras Road"),
    ("Mahindra Eden", "Mahindra Lifespaces", "Kanakapura Road"),
    ("Total Environment Pursuit of a Radical Rhapsody", "Total Environment", "Whitefield"),
    ("Sumadhura Folium", "Sumadhura Group", "Whitefield"),
    ("Prestige Waterford", "Prestige Estates", "Whitefield"),
    ("Brigade Cornerstone Utopia", "Brigade Enterprises", "Varthur"),
    ("Godrej Splendour", "Godrej Properties", "Belathur"),
    ("Assetz Sun and Sanctum", "Assetz Property Group", "KR Puram"),
    ("Sobha Windsor", "Sobha Limited", "Whitefield"),
    ("Prestige Lakeside Habitat", "Prestige Estates", "Varthur"),
    ("Rohan Akriti", "Rohan Builders", "Kanakapura Road"),
    ("Purva Atmosphere", "Puravankara", "Thanisandra"),
    ("Salarpuria Sattva Park Cubix", "Salarpuria Sattva", "Devanahalli"),
]

# Generate more names based on typical builder naming conventions to reach 200
builders = ["Prestige Estates", "Sobha Limited", "Brigade Enterprises", "Godrej Properties", "Puravankara", "Salarpuria Sattva", "Assetz Property Group", "Shriram Properties", "Rohan Builders"]
localities = ["Sarjapur", "Whitefield", "Varthur", "Marathahalli", "Bellandur", "Electronic City", "Anekal", "Panathur", "Kadugodi", "KR Puram", "Gunjur"]
suffixes = ["Park", "Meadows", "Enclave", "Residences", "Greens", "Heights", "Oasis", "Woods", "City", "Sanctuary", "Avenue", "Terraces", "Orchards"]

data = []
seen_names = set()

# First add the real ones
for name, builder, loc in real_projects:
    if name not in seen_names:
        data.append({"project_name": name, "builder_name": builder, "locality": loc})
        seen_names.add(name)

# Fill the rest up to 500
while len(data) < 500:
    b = random.choice(builders)
    l = random.choice(localities)
    s = random.choice(suffixes)
    p_name = f"{b.split()[0]} {s} {random.choice(['Phase 1', 'Phase 2', 'Elite', 'Premium', ''])}".strip()
    if p_name not in seen_names:
        data.append({"project_name": p_name, "builder_name": b, "locality": l})
        seen_names.add(p_name)

# Populate columns
final_rows = []
for row in data:
    builder = row['builder_name']
    locality = row['locality']
    
    price_per_sft = random.randint(9000, 16000)
    area = "Bengaluru East" if locality not in ["Electronic City", "Anekal"] else "Bengaluru South"
    if locality == "Anekal": area = "Anekal"
    
    min_size = random.randint(600, 1200)
    max_size = random.randint(1500, 3500)
    
    price_min = price_per_sft * min_size
    price_max = price_per_sft * max_size
    
    start_year = random.randint(2022, 2024)
    start_date = f"{random.randint(1,28):02d}-{random.randint(1,12):02d}-{start_year}"
    
    possession_year = start_year + random.randint(3, 5)
    possession_date = f"{random.randint(1,28):02d}-{random.randint(1,12):02d}-{possession_year}"
    
    progress = random.randint(5, 95)
    if possession_year < 2025: progress = 100
    
    land_area = round(random.uniform(2.0, 30.0), 2)
    total_units = int(land_area * random.randint(60, 100))
    
    unit_types_pool = ["1BHK", "2BHK", "2.5BHK", "3BHK", "3.5BHK", "4BHK"]
    num_types = random.randint(2, 4)
    unit_types = random.sample(unit_types_pool, num_types)
    unit_types.sort()
    
    complaints_proj = random.choices([0, 1, 2, 3, 5, 10], weights=[60, 20, 10, 5, 3, 2])[0]
    complaints_build = random.choices([0, 2, 5, 10, 20, 45], weights=[40, 25, 15, 10, 5, 5])[0]
    
    litigations = random.choices([0, 1, 2], weights=[85, 10, 5])[0]
    title_summary = "Clear title with no encumbrances." if litigations == 0 else "Clear, marketable title with disclosed litigation."
    
    google_score = round(random.uniform(3.5, 4.9), 1)
    distance_hub = round(random.uniform(1.0, 15.0), 2)
    
    builder_rel = round(random.uniform(0.7, 1.0), 2)
    density = int(total_units / land_area) if land_area > 0 else 0
    timeline_rel = random.choices([0.2, 0.4, 0.6, 0.8, 1.0], weights=[5, 10, 15, 30, 40])[0]
    commute_score = round(random.uniform(0.5, 0.95), 2)
    
    lat = round(12.8 + random.uniform(0.05, 0.15), 4)
    lon = round(77.65 + random.uniform(0.05, 0.15), 4)
    
    rera = f"PRM/KA/RERA/1251/446/PR/{random.randint(100000, 999999)}/{random.randint(10000, 99999)}"
    
    final_rows.append({
        "project_name": row["project_name"],
        "builder_name": builder,
        "locality": locality,
        "area": area,
        "price_min": price_min,
        "price_max": price_max,
        "price_per_sft": price_per_sft,
        "possession_date": possession_date,
        "construction_progress": progress,
        "land_area_acres": land_area,
        "total_units": total_units,
        "unit_types": ", ".join(unit_types),
        "complaints_on_project": complaints_proj,
        "complaints_on_builder": complaints_build,
        "land_litigations": litigations,
        "property_title_summary": title_summary,
        "google_reviews_score": google_score,
        "distance_from_nearest_office_hub": distance_hub,
        "builder_reliability": builder_rel,
        "density": density,
        "timeline_reliability": timeline_rel,
        "commute_score": commute_score,
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "RERA_registration_number": rera
    })

columns = [
    "project_name", "builder_name", "locality", "area", "price_min", "price_max", 
    "price_per_sft", "possession_date", "construction_progress", "land_area_acres", 
    "total_units", "unit_types", "complaints_on_project", "complaints_on_builder", 
    "land_litigations", "property_title_summary", "google_reviews_score", 
    "distance_from_nearest_office_hub", "builder_reliability", "density", 
    "timeline_reliability", "commute_score", "latitude", "longitude", 
    "start_date", "RERA_registration_number"
]

with open("East_Bangalore_Projects_Dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=columns)
    writer.writeheader()
    for row in final_rows:
        writer.writerow(row)

print("Dataset generated successfully at East_Bangalore_Projects_Dataset.csv")
