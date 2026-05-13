
-- Create builders table
CREATE TABLE IF NOT EXISTS builders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    builder_id UUID REFERENCES builders(id),
    locality TEXT,
    area TEXT,
    price_min BIGINT,
    price_max BIGINT,
    price_per_sft INT,
    possession_date DATE,
    construction_progress INT,
    land_area_acres FLOAT,
    total_units INT,
    unit_types TEXT[],
    amenities TEXT[],
    complaints INT,
    land_litigations INT,
    property_title_summary TEXT,
    google_reviews_score FLOAT,
    distance_from_nearest_office_hub FLOAT,
    density INT,
    timeline_reliability FLOAT,
    commute_score FLOAT,
    latitude FLOAT,
    longitude FLOAT,
    start_date DATE,
    rera_number TEXT,
    images TEXT[],
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Enable full-text search
ALTER TABLE projects ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS projects_search_idx ON projects USING gin(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION projects_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
    to_tsvector('english', coalesce(new.name, '')) ||
    to_tsvector('english', coalesce(new.locality, '')) ||
    to_tsvector('english', coalesce(new.area, ''));
  return new;
end
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER projects_search_update
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION projects_search_trigger();

INSERT INTO builders (name) VALUES ('UKN Properties') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('SNN Estates') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Confident Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Mahindra Lifespaces') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Shriram Properties') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Sumadhura Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Mana Projects') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Abhee Ventures') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Excel Dwellings') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Krupa Builders') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Assetz Property Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Pioneer Developers') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Nambiar Builders') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Habitat Ventures') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Radiant Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Arvind SmartSpaces') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Pavani Builders') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('SJR Primecorp') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('DSR Infraprojects') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Amrutha Shelters') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Vaswani Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('KNS Infrastructure') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('MIMS Builders') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Mfar Developers') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('HM Constructions') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Aishwarya Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Valmark Developers') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('NVT Quality Lifestyle') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('DS MAX Properties') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Sobha Limited') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Bhartiya City') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Vamshi Builders') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Maithri Developers') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Raja Housing') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Total Environment') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Mahaveer Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('DivyaSree Developers') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Birla Estates') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Century Real Estate') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Puravankara') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Rohan Builders') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Brigade Enterprises') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('CASA Grand') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Concorde Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Prestige Estates') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Goyal & Co') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Ozone Group') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Adarsh Developers') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Salarpuria Sattva') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Alembic Real Estate') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Godrej Properties') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Bren Corporation') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Gopalan Enterprises') ON CONFLICT (name) DO NOTHING;
INSERT INTO builders (name) VALUES ('Vaishnavi Group') ON CONFLICT (name) DO NOTHING;

INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Silver Oak',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 19999902, 54776118, 17889,
    '2025-04-05', 92, 36.43, 2258,
    ARRAY['2BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 10.74, 61,
    1.0, 0.62, 12.9329, 77.7463, '2021-11-04', 'PRM/KA/RERA/1251/446/PR/161386/95581'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'SNN Raj Etternia',
    (SELECT id FROM builders WHERE name = 'SNN Estates'),
    'Harlur', 'Bengaluru East', 9071491, 39428103, 10439,
    '2025-11-24', 95, 3.93, 279,
    ARRAY['2.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 11.23, 70,
    0.8, 0.79, 12.9027, 77.6851, '2021-08-09', 'PRM/KA/RERA/1251/446/PR/680473/84550'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'NVT Symphony of Orchards',
    (SELECT id FROM builders WHERE name = 'NVT Quality Lifestyle'),
    'Sarjapur', 'Bengaluru East', 15250680, 31474140, 15690,
    '2027-11-06', 20, 25.26, 2020,
    ARRAY['2.5BHK', '2BHK', '3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 10.04, 79,
    0.6, 0.77, 12.922, 77.6955, '2023-09-03', 'PRM/KA/RERA/1251/446/PR/683134/27618'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Habitech',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Whitefield', 'Bengaluru East', 10881585, 44506319, 12727,
    '2025-11-22', 14, 5.04, 423,
    ARRAY['2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 10.92, 83,
    0.9, 0.77, 12.8813, 77.6635, '2021-08-18', 'PRM/KA/RERA/1251/446/PR/214046/97070'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Ferns Residency',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Harlur', 'Bengaluru East', 14670448, 23233080, 14612,
    '2028-11-08', 59, 15.37, 1291,
    ARRAY['1BHK', '2.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 5.54, 83,
    0.4, 0.65, 12.9377, 77.7337, '2023-12-12', 'PRM/KA/RERA/1251/446/PR/111989/91664'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej Lakeside Orchard',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Kodathi Village', 'Bengaluru East', 12313107, 48340346, 14711,
    '2027-04-08', 23, 31.51, 3056,
    ARRAY['2.5BHK', '3.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.1, 13.8, 96,
    0.9, 0.81, 12.9109, 77.6734, '2024-06-13', 'PRM/KA/RERA/1251/446/PR/597560/40073'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram Summit',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'Electronic City', 'Bengaluru South', 12258763, 30824987, 11489,
    '2023-12-16', 100, 26.8, 2492,
    ARRAY['1BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 14.8, 92,
    1.0, 0.79, 12.9397, 77.6727, '2018-09-14', 'PRM/KA/RERA/1251/446/PR/627843/70086'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Promenade',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Hennur', 'Bengaluru North', 14845110, 19971000, 13314,
    '2026-11-12', 79, 14.64, 1259,
    ARRAY['1BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 13.76, 85,
    1.0, 0.8, 12.9069, 77.6914, '2021-10-18', 'PRM/KA/RERA/1251/446/PR/709447/39173'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Sunshine',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Sarjapur', 'Bengaluru East', 11270030, 25169370, 10910,
    '2027-07-27', 73, 25.34, 2103,
    ARRAY['2.5BHK', '3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.9, 6.8, 82,
    0.8, 0.81, 12.9529, 77.663, '2023-09-02', 'PRM/KA/RERA/1251/446/PR/348426/69746'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DSR Waterscape',
    (SELECT id FROM builders WHERE name = 'DSR Infraprojects'),
    'Horamavu', 'Bengaluru East', 10422082, 16833976, 11017,
    '2024-06-03', 100, 35.09, 2456,
    ARRAY['2BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 4.55, 69,
    0.8, 0.9, 12.9757, 77.7055, '2019-11-05', 'PRM/KA/RERA/1251/446/PR/664478/44669'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'NVT Arcot Vaksana',
    (SELECT id FROM builders WHERE name = 'NVT Quality Lifestyle'),
    'Sarjapur', 'Bengaluru East', 18913200, 36675847, 15761,
    '2024-12-08', 100, 36.98, 3106,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 1.35, 83,
    0.8, 0.65, 12.8844, 77.6584, '2019-03-11', 'PRM/KA/RERA/1251/446/PR/669362/71876'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Valmark Apas',
    (SELECT id FROM builders WHERE name = 'Valmark Developers'),
    'Hulimavu', 'Bengaluru East', 14524826, 24801960, 14254,
    '2027-05-27', 55, 33.98, 2412,
    ARRAY['2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.8, 4.19, 70,
    0.8, 0.88, 12.8569, 77.6624, '2022-05-24', 'PRM/KA/RERA/1251/446/PR/287898/94911'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'SNN Raj Serenity',
    (SELECT id FROM builders WHERE name = 'SNN Estates'),
    'Begur', 'Bengaluru East', 10331702, 41881613, 12329,
    '2023-12-15', 100, 26.95, 1805,
    ARRAY['1BHK', '2.5BHK', '2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 5.64, 66,
    0.8, 0.75, 12.9283, 77.7015, '2020-04-10', 'PRM/KA/RERA/1251/446/PR/155827/92632'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'HM Symphony',
    (SELECT id FROM builders WHERE name = 'HM Constructions'),
    'Kasavanahalli', 'Bengaluru East', 11763636, 45837128, 14156,
    '2025-02-21', 74, 22.28, 1804,
    ARRAY['2BHK', '3.5BHK'], 2, 1, 'Clear, marketable title with disclosed litigation.',
    4.0, 5.03, 80,
    0.6, 0.91, 12.9002, 77.7422, '2022-12-23', 'PRM/KA/RERA/1251/446/PR/234093/79999'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DSR Sunrise',
    (SELECT id FROM builders WHERE name = 'DSR Infraprojects'),
    'Whitefield', 'Bengaluru East', 17270000, 25434000, 15700,
    '2023-02-21', 100, 38.35, 3183,
    ARRAY['2.5BHK', '3BHK'], 2, 2, 'Clear, marketable title with disclosed litigation.',
    4.6, 7.23, 82,
    1.0, 0.8, 12.8676, 77.7017, '2018-05-19', 'PRM/KA/RERA/1251/446/PR/916734/37204'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Vaswani Reserve',
    (SELECT id FROM builders WHERE name = 'Vaswani Group'),
    'Marathahalli', 'Bengaluru East', 15264030, 60152100, 17385,
    '2027-03-21', 79, 11.76, 870,
    ARRAY['1BHK', '2.5BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    4.7, 14.03, 73,
    0.6, 0.9, 12.9452, 77.7288, '2024-12-16', 'PRM/KA/RERA/1251/446/PR/874301/42883'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram Smrithi',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'Sarjapur', 'Bengaluru East', 13965056, 40196294, 15586,
    '2025-02-28', 65, 25.05, 2429,
    ARRAY['1BHK', '3.5BHK', '3BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.1, 9.92, 96,
    1.0, 0.82, 12.9608, 77.6562, '2022-03-08', 'PRM/KA/RERA/1251/446/PR/980990/32098'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Necklace Pride',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'Tank Bund Road', 'Bengaluru East', 13355100, 37062000, 15975,
    '2027-01-06', 98, 25.93, 1789,
    ARRAY['1BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.9, 6.36, 68,
    0.9, 0.93, 12.8675, 77.7034, '2024-01-24', 'PRM/KA/RERA/1251/446/PR/238728/39526'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Birla Evara',
    (SELECT id FROM builders WHERE name = 'Birla Estates'),
    'Varthur', 'Bengaluru East', 8447676, 36470512, 10468,
    '2029-04-25', 84, 34.08, 2419,
    ARRAY['1BHK', '2.5BHK', '2BHK', '4BHK'], 1, 1, 'Clear, marketable title with disclosed litigation.',
    4.4, 13.73, 70,
    0.9, 0.68, 12.9391, 77.7013, '2024-08-09', 'PRM/KA/RERA/1251/446/PR/729910/73574'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Ozone Promenade',
    (SELECT id FROM builders WHERE name = 'Ozone Group'),
    'Whitefield', 'Bengaluru East', 9101507, 34990010, 10261,
    '2022-07-15', 100, 36.07, 3498,
    ARRAY['3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.2, 3.12, 96,
    0.8, 0.62, 12.9896, 77.7162, '2018-05-11', 'PRM/KA/RERA/1251/446/PR/853248/15306'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'MIMS Northbrook',
    (SELECT id FROM builders WHERE name = 'MIMS Builders'),
    'Hennur', 'Bengaluru North', 10473901, 21069979, 11107,
    '2025-09-05', 72, 39.79, 2665,
    ARRAY['2.5BHK', '2BHK', '3.5BHK', '3BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.6, 2.97, 66,
    0.9, 0.68, 12.9859, 77.6629, '2020-06-26', 'PRM/KA/RERA/1251/446/PR/611636/57351'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Greenage',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'Hosur Road', 'Bengaluru South', 18729666, 27835020, 15726,
    '2026-08-12', 18, 20.91, 1505,
    ARRAY['2.5BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 7.68, 71,
    0.8, 0.7, 12.8928, 77.6891, '2022-09-01', 'PRM/KA/RERA/1251/446/PR/169006/79179'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Nambiar Ellegenza',
    (SELECT id FROM builders WHERE name = 'Nambiar Builders'),
    'Sarjapur', 'Bengaluru East', 18494476, 41085044, 17732,
    '2025-09-01', 89, 15.75, 960,
    ARRAY['1BHK', '2BHK', '3.5BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.6, 2.92, 60,
    1.0, 0.9, 12.8569, 77.7014, '2022-05-07', 'PRM/KA/RERA/1251/446/PR/678729/92330'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'UKN Miraya Rose',
    (SELECT id FROM builders WHERE name = 'UKN Properties'),
    'Whitefield', 'Bengaluru East', 13590544, 52842840, 16696,
    '2027-02-25', 28, 16.42, 1198,
    ARRAY['1BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.9, 4.79, 72,
    1.0, 0.82, 12.8869, 77.6532, '2022-03-23', 'PRM/KA/RERA/1251/446/PR/469820/23119'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Rohan Vasantha',
    (SELECT id FROM builders WHERE name = 'Rohan Builders'),
    'Marathahalli', 'Bengaluru East', 15716820, 32491190, 16270,
    '2025-05-13', 47, 38.2, 3017,
    ARRAY['2BHK', '3.5BHK', '4BHK'], 10, 0, 'Clear title with no encumbrances.',
    4.6, 12.8, 78,
    0.9, 0.8, 12.888, 77.672, '2020-06-02', 'PRM/KA/RERA/1251/446/PR/484691/22902'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Cinnamon',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Harlur', 'Bengaluru East', 18144630, 39896325, 15615,
    '2026-09-05', 65, 5.4, 513,
    ARRAY['1BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 2.47, 95,
    0.9, 0.88, 12.9148, 77.7159, '2023-05-09', 'PRM/KA/RERA/1251/446/PR/941279/46333'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Radiant Silver Oak',
    (SELECT id FROM builders WHERE name = 'Radiant Group'),
    'Whitefield', 'Bengaluru East', 13935080, 29886000, 11720,
    '2023-06-28', 100, 23.93, 1507,
    ARRAY['1BHK', '2BHK', '3.5BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.1, 2.19, 62,
    1.0, 0.77, 12.8752, 77.6591, '2019-12-24', 'PRM/KA/RERA/1251/446/PR/605457/76678'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram Signiaa',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'Electronic City', 'Bengaluru South', 12918807, 35956753, 11863,
    '2022-01-25', 100, 35.07, 2419,
    ARRAY['2.5BHK', '3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.2, 4.1, 68,
    0.8, 0.88, 12.9582, 77.6559, '2018-02-06', 'PRM/KA/RERA/1251/446/PR/941111/99984'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Ozone Residenza',
    (SELECT id FROM builders WHERE name = 'Ozone Group'),
    'Sarjapur', 'Bengaluru East', 12621404, 43018196, 14642,
    '2025-02-25', 89, 32.48, 3150,
    ARRAY['2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 3.73, 96,
    1.0, 0.81, 12.9533, 77.6671, '2020-09-24', 'PRM/KA/RERA/1251/446/PR/894208/34084'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz 63 Degree East',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'Sarjapur', 'Bengaluru East', 15830964, 23879853, 14823,
    '2023-01-14', 100, 19.84, 1964,
    ARRAY['2.5BHK', '2BHK', '3.5BHK', '3BHK'], 1, 1, 'Clear, marketable title with disclosed litigation.',
    3.9, 3.68, 98,
    0.6, 0.9, 12.8964, 77.7493, '2020-03-10', 'PRM/KA/RERA/1251/446/PR/161424/98028'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Vaishnavi Serene',
    (SELECT id FROM builders WHERE name = 'Vaishnavi Group'),
    'Yelahanka', 'Bengaluru North', 11874324, 30801078, 10934,
    '2023-03-05', 100, 34.23, 3286,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 5, 0, 'Clear title with no encumbrances.',
    4.2, 12.25, 95,
    1.0, 0.64, 12.9714, 77.7163, '2018-06-15', 'PRM/KA/RERA/1251/446/PR/811684/76964'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Tech Vista',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Kadugodi', 'Bengaluru East', 12004312, 35931904, 11576,
    '2026-03-21', 35, 26.64, 2370,
    ARRAY['2BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 7.15, 88,
    1.0, 0.9, 12.8715, 77.6545, '2023-03-25', 'PRM/KA/RERA/1251/446/PR/263711/92167'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sumadhura Folium',
    (SELECT id FROM builders WHERE name = 'Sumadhura Group'),
    'Whitefield', 'Bengaluru East', 11521440, 28338660, 11340,
    '2025-07-10', 26, 20.59, 1832,
    ARRAY['2.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 2.26, 88,
    0.4, 0.86, 12.9823, 77.7219, '2020-12-16', 'PRM/KA/RERA/1251/446/PR/772600/47257'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DSR Green Fields',
    (SELECT id FROM builders WHERE name = 'DSR Infraprojects'),
    'Whitefield', 'Bengaluru East', 10469870, 22348705, 11455,
    '2024-12-14', 100, 18.16, 1362,
    ARRAY['2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 8.35, 75,
    0.8, 0.67, 12.9232, 77.7215, '2020-02-03', 'PRM/KA/RERA/1251/446/PR/453846/31348'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Mahaveer Ranches',
    (SELECT id FROM builders WHERE name = 'Mahaveer Group'),
    'Harlur', 'Bengaluru East', 15332688, 22725234, 13038,
    '2021-06-21', 100, 22.6, 1740,
    ARRAY['1BHK', '3.5BHK', '3BHK', '4BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    4.6, 11.96, 76,
    0.9, 0.94, 12.9432, 77.6817, '2018-04-28', 'PRM/KA/RERA/1251/446/PR/774568/27412'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Adarsh Palm Retreat',
    (SELECT id FROM builders WHERE name = 'Adarsh Developers'),
    'Bellandur', 'Bengaluru East', 9325212, 18390524, 10396,
    '2025-09-17', 62, 18.33, 1594,
    ARRAY['3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 1.33, 86,
    1.0, 0.63, 12.8737, 77.6882, '2020-03-20', 'PRM/KA/RERA/1251/446/PR/476151/61553'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej United',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Whitefield', 'Bengaluru East', 17388980, 62274820, 17132,
    '2028-02-01', 49, 15.91, 1591,
    ARRAY['1BHK', '2BHK', '3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 13.33, 100,
    0.8, 0.66, 12.9212, 77.6665, '2024-05-20', 'PRM/KA/RERA/1251/446/PR/643837/91522'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Cosmopolis',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Whitefield', 'Bengaluru East', 11724250, 25324380, 10195,
    '2026-05-21', 12, 11.48, 1113,
    ARRAY['1BHK', '2.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 3.13, 96,
    0.9, 0.68, 12.8954, 77.692, '2021-12-28', 'PRM/KA/RERA/1251/446/PR/200602/60404'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Gopalan Atlantis',
    (SELECT id FROM builders WHERE name = 'Gopalan Enterprises'),
    'Whitefield', 'Bengaluru East', 16828058, 45142188, 16042,
    '2028-07-26', 46, 5.2, 494,
    ARRAY['1BHK', '2.5BHK', '2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 4.06, 95,
    0.9, 0.87, 12.9606, 77.6568, '2023-02-05', 'PRM/KA/RERA/1251/446/PR/350974/57475'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Vaswani Brentwood',
    (SELECT id FROM builders WHERE name = 'Vaswani Group'),
    'Brookefield', 'Bengaluru East', 12200082, 25950392, 10618,
    '2025-04-28', 98, 35.92, 3556,
    ARRAY['1BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 9.64, 98,
    1.0, 0.68, 12.8588, 77.6546, '2022-07-10', 'PRM/KA/RERA/1251/446/PR/528285/28217'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'CASA Grand Meridian',
    (SELECT id FROM builders WHERE name = 'CASA Grand'),
    'KR Puram', 'Bengaluru East', 16061108, 51206409, 15503,
    '2023-03-16', 100, 22.59, 1649,
    ARRAY['3.5BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.2, 12.77, 72,
    1.0, 0.88, 12.8971, 77.7004, '2019-03-14', 'PRM/KA/RERA/1251/446/PR/951570/83174'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Ivy Terraces',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Marathahalli', 'Bengaluru East', 16198920, 36371160, 16980,
    '2023-07-19', 100, 3.28, 200,
    ARRAY['1BHK', '2BHK', '3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 3.12, 60,
    1.0, 0.78, 12.9692, 77.6821, '2020-12-27', 'PRM/KA/RERA/1251/446/PR/855941/18711'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'SNN Raj Greenbay',
    (SELECT id FROM builders WHERE name = 'SNN Estates'),
    'Electronic City', 'Bengaluru South', 16912635, 25137987, 14901,
    '2027-04-25', 12, 18.33, 1154,
    ARRAY['2.5BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.9, 6.95, 62,
    1.0, 0.94, 12.8515, 77.6743, '2022-07-28', 'PRM/KA/RERA/1251/446/PR/600230/71134'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Raja Woods Park',
    (SELECT id FROM builders WHERE name = 'Raja Housing'),
    'JP Nagar', 'Bengaluru South', 11278080, 42609996, 11748,
    '2025-06-12', 37, 9.41, 743,
    ARRAY['2.5BHK', '3.5BHK', '3BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.3, 11.2, 78,
    0.9, 0.92, 12.9951, 77.6619, '2021-11-28', 'PRM/KA/RERA/1251/446/PR/724684/29220'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Langleigh',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 12205304, 22983562, 11602,
    '2025-01-16', 33, 5.21, 468,
    ARRAY['2BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 1.89, 89,
    0.9, 0.94, 12.9466, 77.749, '2022-05-24', 'PRM/KA/RERA/1251/446/PR/793238/80507'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Bhartiya City Nikoo Homes 2',
    (SELECT id FROM builders WHERE name = 'Bhartiya City'),
    'Thanisandra', 'Bengaluru North', 11484306, 24333084, 12634,
    '2027-11-24', 93, 36.53, 2776,
    ARRAY['2BHK', '3.5BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.6, 3.16, 75,
    0.8, 0.84, 12.899, 77.6791, '2023-11-01', 'PRM/KA/RERA/1251/446/PR/250601/74612'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Rose',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Whitefield', 'Bengaluru East', 18368840, 40630730, 15890,
    '2021-06-26', 100, 19.66, 1494,
    ARRAY['1BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 8.21, 75,
    1.0, 0.66, 12.9447, 77.6783, '2018-07-02', 'PRM/KA/RERA/1251/446/PR/355747/47664'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Krupa Altius',
    (SELECT id FROM builders WHERE name = 'Krupa Builders'),
    'Whitefield', 'Bengaluru East', 13666378, 30927780, 13217,
    '2026-07-05', 14, 31.46, 2768,
    ARRAY['1BHK', '2.5BHK', '3.5BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.0, 10.01, 87,
    0.6, 0.71, 12.8864, 77.7388, '2021-05-06', 'PRM/KA/RERA/1251/446/PR/127594/20062'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Total Environment Pursuit of a Radical Rhapsody',
    (SELECT id FROM builders WHERE name = 'Total Environment'),
    'Whitefield', 'Bengaluru East', 14081199, 31833072, 15423,
    '2029-05-28', 57, 8.18, 507,
    ARRAY['1BHK', '2.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 4.65, 61,
    1.0, 0.85, 12.9131, 77.7073, '2024-01-25', 'PRM/KA/RERA/1251/446/PR/806368/58484'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Ozone WF48',
    (SELECT id FROM builders WHERE name = 'Ozone Group'),
    'Mahadevapura', 'Bengaluru East', 10626576, 44626352, 13168,
    '2024-08-03', 100, 39.05, 3826,
    ARRAY['1BHK', '2BHK', '3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 3.8, 97,
    0.8, 0.64, 12.8575, 77.7162, '2019-10-10', 'PRM/KA/RERA/1251/446/PR/696349/72593'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Fontaine Bleau',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 12539184, 18493608, 11256,
    '2027-07-17', 80, 14.15, 863,
    ARRAY['2.5BHK', '3BHK'], 1, 1, 'Clear, marketable title with disclosed litigation.',
    4.0, 8.16, 60,
    1.0, 0.91, 12.944, 77.7379, '2024-11-27', 'PRM/KA/RERA/1251/446/PR/991666/12175'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz Bloom and Dell',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'Whitefield', 'Bengaluru East', 12059360, 41635980, 12995,
    '2029-04-28', 35, 38.27, 2793,
    ARRAY['1BHK', '2.5BHK', '2BHK', '3.5BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.0, 3.61, 72,
    0.9, 0.74, 12.9195, 77.6998, '2024-10-05', 'PRM/KA/RERA/1251/446/PR/220480/86905'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Pioneer White Orchid',
    (SELECT id FROM builders WHERE name = 'Pioneer Developers'),
    'Whitefield', 'Bengaluru East', 11005372, 30611196, 11452,
    '2022-03-25', 100, 9.33, 755,
    ARRAY['1BHK', '2BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.9, 9.29, 80,
    0.4, 0.61, 12.9072, 77.6578, '2019-07-20', 'PRM/KA/RERA/1251/446/PR/461717/16671'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej Reflections',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Sarjapur', 'Bengaluru East', 13954220, 47702970, 14210,
    '2027-09-20', 61, 31.62, 2213,
    ARRAY['2.5BHK', '3.5BHK', '3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.7, 7.22, 69,
    0.9, 0.8, 12.9979, 77.6587, '2023-04-05', 'PRM/KA/RERA/1251/446/PR/358084/63030'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Mahindra Eden',
    (SELECT id FROM builders WHERE name = 'Mahindra Lifespaces'),
    'Kanakapura Road', 'Bengaluru East', 8833748, 20409004, 10879,
    '2026-12-17', 34, 25.76, 2241,
    ARRAY['1BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.8, 10.79, 86,
    1.0, 0.8, 12.9504, 77.7154, '2022-04-13', 'PRM/KA/RERA/1251/446/PR/865173/33733'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DS MAX Starnest',
    (SELECT id FROM builders WHERE name = 'DS MAX Properties'),
    'Electronic City', 'Bengaluru South', 10616697, 34608600, 10179,
    '2027-12-28', 81, 33.86, 2674,
    ARRAY['2.5BHK', '2BHK', '3.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.7, 1.57, 78,
    1.0, 0.71, 12.8921, 77.6902, '2024-09-27', 'PRM/KA/RERA/1251/446/PR/121587/86553'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Total Environment The Magic Faraway Tree',
    (SELECT id FROM builders WHERE name = 'Total Environment'),
    'Kanakapura Road', 'Bengaluru East', 15313152, 30234432, 15072,
    '2028-09-23', 16, 12.2, 878,
    ARRAY['1BHK', '2.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 4.14, 71,
    1.0, 0.87, 12.8833, 77.6576, '2023-10-16', 'PRM/KA/RERA/1251/446/PR/626987/40134'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Chrysanthemum',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Thanisandra', 'Bengaluru North', 16447887, 32272426, 14167,
    '2024-07-07', 100, 32.58, 3258,
    ARRAY['3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 13.82, 100,
    0.9, 0.86, 12.9961, 77.6652, '2021-10-23', 'PRM/KA/RERA/1251/446/PR/721395/32246'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Arvind Sporcia',
    (SELECT id FROM builders WHERE name = 'Arvind SmartSpaces'),
    'Hebbal', 'Bengaluru North', 13202230, 44755700, 14030,
    '2024-02-12', 100, 28.11, 2586,
    ARRAY['2.5BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 11.95, 91,
    1.0, 0.73, 12.9273, 77.6817, '2021-10-06', 'PRM/KA/RERA/1251/446/PR/965843/86186'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram Luxor',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'Hennur', 'Bengaluru North', 12522868, 41872300, 11092,
    '2026-09-28', 21, 20.12, 1710,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 13.7, 84,
    0.9, 0.85, 12.9573, 77.747, '2023-10-23', 'PRM/KA/RERA/1251/446/PR/891838/93174'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz 38 and Banyan',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'CV Raman Nagar', 'Bengaluru East', 14413605, 39388569, 12927,
    '2027-12-18', 32, 17.56, 1545,
    ARRAY['1BHK', '3.5BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.5, 2.33, 87,
    0.9, 0.94, 12.87, 77.6973, '2022-05-17', 'PRM/KA/RERA/1251/446/PR/441986/21665'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Total Environment Windmills of Your Mind',
    (SELECT id FROM builders WHERE name = 'Total Environment'),
    'Whitefield', 'Bengaluru East', 13516184, 28484520, 13963,
    '2025-09-13', 33, 14.85, 1009,
    ARRAY['1BHK', '2.5BHK', '3.5BHK'], 1, 1, 'Clear, marketable title with disclosed litigation.',
    3.9, 12.01, 67,
    1.0, 0.82, 12.9665, 77.7424, '2021-06-04', 'PRM/KA/RERA/1251/446/PR/530335/81863'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Adarsh Tranqville',
    (SELECT id FROM builders WHERE name = 'Adarsh Developers'),
    'Hennur', 'Bengaluru North', 12093156, 53386512, 14244,
    '2021-04-02', 100, 35.91, 2980,
    ARRAY['1BHK', '3.5BHK', '3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.7, 12.42, 82,
    0.4, 0.69, 12.8554, 77.7042, '2018-07-23', 'PRM/KA/RERA/1251/446/PR/182766/31308'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Silicon Oasis',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Electronic City', 'Bengaluru South', 18220739, 45989932, 17881,
    '2027-11-07', 29, 5.19, 347,
    ARRAY['1BHK', '2BHK', '3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 7.54, 66,
    0.9, 0.69, 12.8887, 77.7116, '2023-01-02', 'PRM/KA/RERA/1251/446/PR/393996/17114'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Mana Foresta',
    (SELECT id FROM builders WHERE name = 'Mana Projects'),
    'Sarjapur', 'Bengaluru East', 11785926, 37607586, 12783,
    '2026-10-09', 42, 39.47, 2802,
    ARRAY['2.5BHK', '2BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 12.59, 70,
    0.8, 0.75, 12.9257, 77.6966, '2021-07-16', 'PRM/KA/RERA/1251/446/PR/188194/80196'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Mayberry',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 15187536, 30715818, 16226,
    '2026-01-12', 64, 32.98, 2209,
    ARRAY['2.5BHK', '3BHK', '4BHK'], 1, 2, 'Clear, marketable title with disclosed litigation.',
    4.0, 4.22, 66,
    1.0, 0.79, 12.8569, 77.7354, '2021-09-11', 'PRM/KA/RERA/1251/446/PR/963255/14028'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'KNS Unnati',
    (SELECT id FROM builders WHERE name = 'KNS Infrastructure'),
    'Sarjapur', 'Bengaluru East', 19362507, 67051332, 16881,
    '2021-05-22', 100, 21.01, 1659,
    ARRAY['2BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.9, 1.78, 78,
    1.0, 0.69, 12.9539, 77.6693, '2018-02-28', 'PRM/KA/RERA/1251/446/PR/422305/88070'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Morzaria Grandeur',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Koramangala', 'Bengaluru East', 9265602, 29395044, 10446,
    '2025-06-24', 94, 17.53, 1542,
    ARRAY['1BHK', '2.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 10.29, 87,
    1.0, 0.71, 12.9842, 77.6886, '2022-05-22', 'PRM/KA/RERA/1251/446/PR/769786/35119'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Windsor',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Whitefield', 'Bengaluru East', 16337188, 66506920, 17548,
    '2024-07-10', 100, 21.6, 1447,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    3.9, 14.21, 66,
    1.0, 0.7, 12.9628, 77.6546, '2019-10-01', 'PRM/KA/RERA/1251/446/PR/529043/24255'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Adarsh Wisteria',
    (SELECT id FROM builders WHERE name = 'Adarsh Developers'),
    'Hennur', 'Bengaluru North', 11104249, 17621706, 11701,
    '2027-07-06', 23, 15.54, 1367,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.8, 3.28, 87,
    1.0, 0.8, 12.896, 77.7132, '2024-02-13', 'PRM/KA/RERA/1251/446/PR/268154/63660'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Shantiniketan',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 12793864, 36030776, 11302,
    '2026-10-27', 89, 4.39, 421,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 8.32, 95,
    0.6, 0.75, 12.8797, 77.6703, '2023-03-07', 'PRM/KA/RERA/1251/446/PR/409075/96759'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Alembic Urban Forest',
    (SELECT id FROM builders WHERE name = 'Alembic Real Estate'),
    'Whitefield', 'Bengaluru East', 19939545, 32994135, 17883,
    '2025-01-25', 15, 6.85, 465,
    ARRAY['2.5BHK', '2BHK', '3.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.6, 7.35, 67,
    1.0, 0.64, 12.9457, 77.6573, '2020-12-01', 'PRM/KA/RERA/1251/446/PR/646273/59276'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Water''s Edge',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'Hebbal', 'Bengaluru North', 13939848, 21728304, 12402,
    '2025-05-02', 67, 25.37, 2105,
    ARRAY['1BHK', '2.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 2.43, 82,
    0.9, 0.91, 12.8806, 77.6585, '2022-08-18', 'PRM/KA/RERA/1251/446/PR/391037/72011'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'SJR Watermark',
    (SELECT id FROM builders WHERE name = 'SJR Primecorp'),
    'Ambalipura', 'Bengaluru East', 16283796, 39672694, 15247,
    '2023-03-25', 100, 5.73, 355,
    ARRAY['1BHK', '2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 4.99, 61,
    0.6, 0.89, 12.9646, 77.7095, '2019-07-26', 'PRM/KA/RERA/1251/446/PR/221489/90066'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Neopolis',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Panathur', 'Bengaluru East', 14591625, 43687200, 12525,
    '2027-12-07', 29, 19.69, 1260,
    ARRAY['2.5BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 6.23, 63,
    0.8, 0.93, 12.8568, 77.6705, '2023-04-27', 'PRM/KA/RERA/1251/446/PR/397454/87991'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Atmosphere',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Thanisandra', 'Bengaluru North', 11785187, 25860273, 11989,
    '2024-02-11', 100, 7.0, 448,
    ARRAY['1BHK', '2.5BHK', '3.5BHK'], 0, 2, 'Clear, marketable title with disclosed litigation.',
    3.8, 12.46, 64,
    0.8, 0.65, 12.9736, 77.7099, '2019-08-19', 'PRM/KA/RERA/1251/446/PR/690834/36296'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Halcyon',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Whitefield', 'Bengaluru East', 15930114, 37554978, 15186,
    '2022-08-13', 100, 33.17, 2587,
    ARRAY['3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 12.71, 77,
    0.9, 0.61, 12.9766, 77.6744, '2018-04-28', 'PRM/KA/RERA/1251/446/PR/713321/71213'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Adarsh Premia',
    (SELECT id FROM builders WHERE name = 'Adarsh Developers'),
    'Banashankari', 'Bengaluru East', 15507667, 63513141, 16657,
    '2023-05-26', 100, 27.85, 2283,
    ARRAY['2.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.8, 6.59, 81,
    0.9, 0.9, 12.9506, 77.686, '2019-01-28', 'PRM/KA/RERA/1251/446/PR/939091/81155'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram Chirping Woods',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'Harlur', 'Bengaluru East', 13610796, 54784266, 16242,
    '2021-02-12', 100, 31.08, 2766,
    ARRAY['2BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 5.83, 88,
    0.8, 0.87, 12.973, 77.651, '2018-04-11', 'PRM/KA/RERA/1251/446/PR/965663/93974'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sumadhura Shikaram',
    (SELECT id FROM builders WHERE name = 'Sumadhura Group'),
    'Whitefield', 'Bengaluru East', 9913706, 21361966, 12179,
    '2023-04-14', 100, 33.69, 2526,
    ARRAY['1BHK', '2BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.1, 1.79, 74,
    0.9, 0.67, 12.8999, 77.6857, '2018-10-07', 'PRM/KA/RERA/1251/446/PR/878449/36828'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Total Environment Learning to Fly',
    (SELECT id FROM builders WHERE name = 'Total Environment'),
    'JP Nagar', 'Bengaluru South', 17343018, 29370978, 16254,
    '2023-09-18', 100, 3.75, 356,
    ARRAY['2BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 2.15, 94,
    1.0, 0.64, 12.9872, 77.6838, '2018-03-12', 'PRM/KA/RERA/1251/446/PR/303974/49941'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz Capital 83',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'Sarjapur', 'Bengaluru East', 12858385, 31105661, 12923,
    '2023-01-06', 100, 22.04, 1675,
    ARRAY['2.5BHK', '4BHK'], 0, 2, 'Clear, marketable title with disclosed litigation.',
    4.6, 6.42, 75,
    1.0, 0.76, 12.9771, 77.6882, '2019-12-20', 'PRM/KA/RERA/1251/446/PR/373068/32488'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Gopalan Grandeur',
    (SELECT id FROM builders WHERE name = 'Gopalan Enterprises'),
    'Hoodi', 'Bengaluru East', 19676313, 25809408, 16803,
    '2026-10-26', 33, 38.25, 3519,
    ARRAY['2.5BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 10.47, 92,
    0.6, 0.8, 12.8927, 77.7022, '2022-04-06', 'PRM/KA/RERA/1251/446/PR/542645/81569'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Abhee Prakruthi Villa',
    (SELECT id FROM builders WHERE name = 'Abhee Ventures'),
    'Chandapura', 'Bengaluru East', 20128892, 68247872, 17626,
    '2024-02-06', 100, 31.6, 2780,
    ARRAY['1BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 10.3, 87,
    1.0, 0.89, 12.97, 77.7363, '2020-02-19', 'PRM/KA/RERA/1251/446/PR/396097/56545'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Golden Triangle',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Old Madras Road', 'Bengaluru East', 12302056, 48210760, 14456,
    '2022-10-28', 100, 33.96, 2784,
    ARRAY['1BHK', '2.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.1, 8.73, 81,
    0.6, 0.9, 12.9279, 77.6732, '2018-09-10', 'PRM/KA/RERA/1251/446/PR/228868/22860'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Rohan Akriti',
    (SELECT id FROM builders WHERE name = 'Rohan Builders'),
    'Kanakapura Road', 'Bengaluru East', 11491270, 54029612, 13762,
    '2021-12-14', 100, 26.24, 1941,
    ARRAY['1BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 13.21, 73,
    0.8, 0.66, 12.9485, 77.7116, '2018-03-18', 'PRM/KA/RERA/1251/446/PR/913507/81663'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Gopalan National Elegance',
    (SELECT id FROM builders WHERE name = 'Gopalan Enterprises'),
    'CV Raman Nagar', 'Bengaluru East', 10335150, 45328752, 12159,
    '2029-09-18', 78, 5.52, 485,
    ARRAY['1BHK', '2.5BHK', '2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 2.65, 87,
    1.0, 0.63, 12.9328, 77.7485, '2024-07-17', 'PRM/KA/RERA/1251/446/PR/337157/72775'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Goyal Orchid Whitefield',
    (SELECT id FROM builders WHERE name = 'Goyal & Co'),
    'Whitefield', 'Bengaluru East', 13693330, 33623454, 11507,
    '2026-06-21', 69, 10.55, 654,
    ARRAY['3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 11.05, 61,
    0.9, 0.69, 12.9689, 77.7063, '2023-10-08', 'PRM/KA/RERA/1251/446/PR/547179/31517'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Concorde Cuppa',
    (SELECT id FROM builders WHERE name = 'Concorde Group'),
    'Sarjapur', 'Bengaluru East', 14729216, 42854400, 15872,
    '2028-11-13', 60, 33.59, 3157,
    ARRAY['1BHK', '2.5BHK', '2BHK', '3BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    4.6, 9.88, 93,
    1.0, 0.67, 12.931, 77.6897, '2023-05-08', 'PRM/KA/RERA/1251/446/PR/181929/59880'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Boulevard',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 17800354, 34145800, 14846,
    '2022-01-01', 100, 5.89, 418,
    ARRAY['3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 14.4, 70,
    0.9, 0.7, 12.9693, 77.734, '2019-09-15', 'PRM/KA/RERA/1251/446/PR/920241/89412'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej Air',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Hoodi', 'Bengaluru East', 16686980, 39378480, 17455,
    '2022-09-27', 100, 28.31, 2802,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.0, 9.85, 98,
    0.9, 0.66, 12.9288, 77.6603, '2018-08-23', 'PRM/KA/RERA/1251/446/PR/366752/69448'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Park Cubix',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'Devanahalli', 'Bengaluru North', 20059606, 43951598, 17263,
    '2023-12-05', 100, 10.55, 1012,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 3.69, 95,
    0.6, 0.62, 12.9922, 77.7048, '2020-09-28', 'PRM/KA/RERA/1251/446/PR/127923/30705'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Bren Starlight',
    (SELECT id FROM builders WHERE name = 'Bren Corporation'),
    'Budigere Cross', 'Bengaluru East', 13752060, 30136575, 14385,
    '2022-09-11', 100, 27.99, 2015,
    ARRAY['2.5BHK', '3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.2, 11.71, 71,
    0.8, 0.76, 12.9803, 77.7154, '2018-02-14', 'PRM/KA/RERA/1251/446/PR/616263/94128'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej 24',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Sarjapur', 'Bengaluru East', 15173384, 34593588, 14396,
    '2026-08-05', 24, 11.05, 983,
    ARRAY['1BHK', '2.5BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    3.9, 7.76, 88,
    1.0, 0.7, 12.9465, 77.7184, '2021-06-06', 'PRM/KA/RERA/1251/446/PR/143573/17975'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Quartz',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Bellandur', 'Bengaluru East', 13127673, 39989157, 15951,
    '2022-07-10', 100, 29.86, 2956,
    ARRAY['1BHK', '2.5BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 1.02, 98,
    0.9, 0.64, 12.9362, 77.6716, '2018-06-13', 'PRM/KA/RERA/1251/446/PR/254508/59655'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Cadenza',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'Kudlu Gate', 'Bengaluru East', 8232678, 39878640, 10278,
    '2025-10-08', 51, 33.47, 2108,
    ARRAY['2.5BHK', '2BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 1.02, 62,
    1.0, 0.62, 12.8666, 77.6906, '2020-10-21', 'PRM/KA/RERA/1251/446/PR/442097/99809'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sumadhura Sushantham',
    (SELECT id FROM builders WHERE name = 'Sumadhura Group'),
    'Sahakar Nagar', 'Bengaluru East', 14056350, 66124478, 17038,
    '2023-08-23', 100, 20.6, 1483,
    ARRAY['1BHK', '2.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.9, 6.45, 71,
    0.6, 0.86, 12.9291, 77.7438, '2019-09-10', 'PRM/KA/RERA/1251/446/PR/147171/96522'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'SJR Primecorp Palazza City',
    (SELECT id FROM builders WHERE name = 'SJR Primecorp'),
    'Sarjapur', 'Bengaluru East', 17532228, 41512119, 16923,
    '2026-06-22', 55, 8.8, 572,
    ARRAY['1BHK', '2.5BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 9.21, 65,
    1.0, 0.82, 12.8835, 77.7456, '2023-01-13', 'PRM/KA/RERA/1251/446/PR/916096/18926'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Woods',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Whitefield', 'Bengaluru East', 15996780, 27415476, 17676,
    '2026-05-02', 38, 17.17, 1287,
    ARRAY['1BHK', '2BHK', '3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.0, 1.53, 74,
    0.9, 0.62, 12.8696, 77.6774, '2021-11-18', 'PRM/KA/RERA/1251/446/PR/841145/45275'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Bren Northern Lights',
    (SELECT id FROM builders WHERE name = 'Bren Corporation'),
    'Jakkur', 'Bengaluru North', 19879249, 31304923, 17797,
    '2027-12-11', 64, 19.98, 1798,
    ARRAY['2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 8.14, 89,
    0.4, 0.74, 12.904, 77.663, '2023-09-02', 'PRM/KA/RERA/1251/446/PR/214565/43639'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Bharatiya City Nikoo Homes 4',
    (SELECT id FROM builders WHERE name = 'Bhartiya City'),
    'Thanisandra', 'Bengaluru North', 14324970, 58037310, 15690,
    '2027-12-06', 44, 7.89, 512,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.1, 7.39, 64,
    0.6, 0.76, 12.9032, 77.7374, '2022-12-28', 'PRM/KA/RERA/1251/446/PR/542599/10727'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Sunrise Park',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Electronic City', 'Bengaluru South', 12291564, 26268892, 11164,
    '2028-07-16', 34, 6.66, 606,
    ARRAY['2.5BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 4.98, 90,
    0.8, 0.67, 12.9288, 77.666, '2023-11-19', 'PRM/KA/RERA/1251/446/PR/731983/83790'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Rohan Jidnyasa',
    (SELECT id FROM builders WHERE name = 'Rohan Builders'),
    'Whitefield', 'Bengaluru East', 13064825, 33423714, 11119,
    '2024-04-08', 100, 6.65, 578,
    ARRAY['1BHK', '2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 1.4, 86,
    0.4, 0.89, 12.8722, 77.7056, '2019-06-07', 'PRM/KA/RERA/1251/446/PR/318491/11317'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Tranquility',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Budigere Cross', 'Bengaluru East', 15802958, 37087616, 15662,
    '2025-04-23', 25, 15.07, 949,
    ARRAY['2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 14.05, 62,
    0.6, 0.86, 12.8893, 77.6564, '2020-05-18', 'PRM/KA/RERA/1251/446/PR/119307/42620'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DivyaSree 77 East',
    (SELECT id FROM builders WHERE name = 'DivyaSree Developers'),
    'Marathahalli', 'Bengaluru East', 20564400, 49337423, 17137,
    '2027-05-23', 78, 36.12, 3503,
    ARRAY['1BHK', '2.5BHK', '2BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.8, 6.92, 96,
    1.0, 0.79, 12.9443, 77.725, '2023-03-22', 'PRM/KA/RERA/1251/446/PR/525335/68426'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Bren Champions Square',
    (SELECT id FROM builders WHERE name = 'Bren Corporation'),
    'Sarjapur', 'Bengaluru East', 13042668, 20684670, 11922,
    '2024-01-27', 100, 26.64, 1598,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 1, 2, 'Clear, marketable title with disclosed litigation.',
    4.3, 13.52, 59,
    0.8, 0.8, 12.8502, 77.6535, '2021-05-02', 'PRM/KA/RERA/1251/446/PR/241408/47764'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Augusta Golf Village',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Horamavu', 'Bengaluru East', 13975902, 39379527, 15633,
    '2023-04-13', 100, 23.03, 1934,
    ARRAY['1BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 7.16, 83,
    0.8, 0.65, 12.9379, 77.6534, '2019-08-09', 'PRM/KA/RERA/1251/446/PR/756231/54353'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Lakeside Habitat',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Varthur', 'Bengaluru East', 14435345, 38925320, 16165,
    '2023-09-14', 100, 7.23, 477,
    ARRAY['1BHK', '2.5BHK', '2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 7.56, 65,
    0.8, 0.86, 12.9119, 77.6533, '2019-07-05', 'PRM/KA/RERA/1251/446/PR/853987/47130'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Cornerstone Utopia',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Varthur', 'Bengaluru East', 17860156, 43547472, 17789,
    '2023-07-25', 100, 34.67, 2253,
    ARRAY['1BHK', '2.5BHK', '2BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.6, 14.76, 64,
    1.0, 0.94, 12.9689, 77.7343, '2018-09-10', 'PRM/KA/RERA/1251/446/PR/618955/11979'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Casabella',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Electronic City', 'Bengaluru South', 12763284, 56919012, 15396,
    '2024-10-21', 100, 39.04, 3708,
    ARRAY['2.5BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 12.9, 94,
    1.0, 0.79, 12.8912, 77.6695, '2021-01-14', 'PRM/KA/RERA/1251/446/PR/901134/17932'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Fountain Square',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Marathahalli', 'Bengaluru East', 13931940, 20277180, 12540,
    '2026-01-25', 47, 24.98, 1823,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 9.11, 72,
    1.0, 0.78, 12.8819, 77.7326, '2022-01-28', 'PRM/KA/RERA/1251/446/PR/696256/41172'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Vaswani Exquisite',
    (SELECT id FROM builders WHERE name = 'Vaswani Group'),
    'Whitefield', 'Bengaluru East', 15166756, 47211304, 16612,
    '2024-12-03', 100, 33.71, 2090,
    ARRAY['2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 14.5, 61,
    1.0, 0.64, 12.9472, 77.6988, '2021-09-05', 'PRM/KA/RERA/1251/446/PR/144645/68972'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva East Crest',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'Old Madras Road', 'Bengaluru East', 18256266, 30120282, 17046,
    '2029-08-11', 14, 7.48, 553,
    ARRAY['2.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    3.9, 7.17, 73,
    0.4, 0.72, 12.95, 77.7464, '2024-09-03', 'PRM/KA/RERA/1251/446/PR/248553/87595'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz Sun and Sanctum',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'KR Puram', 'Bengaluru East', 10358589, 20705175, 12003,
    '2023-03-17', 100, 23.11, 2010,
    ARRAY['1BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 10.03, 86,
    0.8, 0.94, 12.9592, 77.67, '2019-05-01', 'PRM/KA/RERA/1251/446/PR/173159/17890'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Metropolis',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Mahadevapura', 'Bengaluru East', 12538581, 41919555, 10653,
    '2026-04-24', 89, 25.87, 2354,
    ARRAY['2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 8.28, 90,
    1.0, 0.78, 12.9332, 77.7164, '2022-08-17', 'PRM/KA/RERA/1251/446/PR/232368/62773'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Amethyst',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Whitefield', 'Bengaluru East', 18144342, 33568605, 15723,
    '2023-01-04', 100, 24.9, 2041,
    ARRAY['2.5BHK', '3.5BHK', '3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.1, 12.08, 81,
    0.8, 0.92, 12.9844, 77.7289, '2018-11-18', 'PRM/KA/RERA/1251/446/PR/404985/61428'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Belvedere',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Whitefield', 'Bengaluru East', 9554415, 33841851, 11307,
    '2026-02-23', 14, 13.6, 965,
    ARRAY['2BHK', '3.5BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.7, 2.5, 70,
    1.0, 0.95, 12.9767, 77.6793, '2021-04-22', 'PRM/KA/RERA/1251/446/PR/396343/33825'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Abhee Prince',
    (SELECT id FROM builders WHERE name = 'Abhee Ventures'),
    'Bellandur', 'Bengaluru East', 15207909, 61021089, 17223,
    '2024-04-18', 100, 24.51, 2009,
    ARRAY['2.5BHK', '2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 7.69, 81,
    0.9, 0.91, 12.8664, 77.6576, '2021-01-11', 'PRM/KA/RERA/1251/446/PR/468879/80263'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Summer Fields',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Sarjapur', 'Bengaluru East', 12794488, 41290648, 14392,
    '2023-02-07', 100, 38.41, 2765,
    ARRAY['2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 7.7, 71,
    1.0, 0.8, 12.9831, 77.7295, '2019-01-20', 'PRM/KA/RERA/1251/446/PR/590432/12990'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Zenium',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Hosahalli', 'Bengaluru East', 14820783, 41438417, 17581,
    '2022-02-26', 100, 34.28, 3325,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.6, 14.84, 96,
    0.6, 0.79, 12.8653, 77.6928, '2018-10-04', 'PRM/KA/RERA/1251/446/PR/130568/55527'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Sentosa',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Panathur', 'Bengaluru East', 13988674, 52204978, 17122,
    '2023-06-22', 100, 7.08, 531,
    ARRAY['1BHK', '2.5BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 8.57, 75,
    1.0, 0.84, 12.8559, 77.736, '2020-11-27', 'PRM/KA/RERA/1251/446/PR/208030/89913'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej Splendour',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Belathur', 'Bengaluru East', 17800442, 26420278, 16022,
    '2027-08-07', 10, 5.04, 332,
    ARRAY['1BHK', '2.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 4.85, 65,
    0.9, 0.93, 12.9662, 77.6589, '2022-12-04', 'PRM/KA/RERA/1251/446/PR/372029/87726'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Abhee Silicon Shine',
    (SELECT id FROM builders WHERE name = 'Abhee Ventures'),
    'Sarjapur', 'Bengaluru East', 12033600, 47369765, 12535,
    '2028-09-12', 29, 36.17, 2531,
    ARRAY['1BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.9, 4.81, 69,
    1.0, 0.9, 12.9024, 77.7489, '2024-04-19', 'PRM/KA/RERA/1251/446/PR/571593/82485'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Concorde Auriga',
    (SELECT id FROM builders WHERE name = 'Concorde Group'),
    'KR Puram', 'Bengaluru East', 11881514, 27238882, 11359,
    '2021-05-16', 100, 32.68, 2516,
    ARRAY['1BHK', '3.5BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    3.9, 10.4, 76,
    0.8, 0.63, 12.9894, 77.6528, '2018-06-07', 'PRM/KA/RERA/1251/446/PR/848756/78004'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz Here and Now',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'Thanisandra', 'Bengaluru North', 14106750, 26305730, 13435,
    '2024-09-14', 100, 21.04, 1830,
    ARRAY['1BHK', '2.5BHK', '2BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.5, 3.77, 86,
    0.6, 0.66, 12.9497, 77.7373, '2021-02-06', 'PRM/KA/RERA/1251/446/PR/562554/65271'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Dream Acres',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Panathur', 'Bengaluru East', 10314120, 40018275, 12765,
    '2025-09-13', 62, 38.49, 2501,
    ARRAY['3BHK', '4BHK'], 5, 0, 'Clear title with no encumbrances.',
    4.2, 2.15, 64,
    0.8, 0.61, 12.9501, 77.669, '2022-01-11', 'PRM/KA/RERA/1251/446/PR/573061/65628'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Nambiar Bellezea',
    (SELECT id FROM builders WHERE name = 'Nambiar Builders'),
    'Sarjapur', 'Bengaluru East', 14413725, 22031532, 12267,
    '2024-10-07', 100, 30.17, 1810,
    ARRAY['2.5BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.8, 13.66, 59,
    0.9, 0.66, 12.9145, 77.7328, '2021-01-23', 'PRM/KA/RERA/1251/446/PR/187616/51869'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Waterford',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 12114765, 33376536, 14337,
    '2028-09-13', 96, 39.54, 3242,
    ARRAY['2.5BHK', '2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 12.0, 81,
    1.0, 0.81, 12.9578, 77.6728, '2023-02-08', 'PRM/KA/RERA/1251/446/PR/579765/66767'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Woodside',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Yelahanka', 'Bengaluru North', 9854608, 26786405, 11621,
    '2026-10-11', 65, 35.13, 2740,
    ARRAY['1BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 4.29, 77,
    0.9, 0.69, 12.9787, 77.687, '2023-02-04', 'PRM/KA/RERA/1251/446/PR/768734/11999'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Petunia',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Hebbal', 'Bengaluru North', 13043727, 28496502, 15849,
    '2027-07-07', 95, 27.32, 1967,
    ARRAY['2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 5.3, 71,
    0.9, 0.69, 12.9931, 77.6774, '2024-06-28', 'PRM/KA/RERA/1251/446/PR/120451/62791'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz Earth and Essence',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'Off International Airport Road', 'Bengaluru East', 14176610, 56589880, 14570,
    '2021-02-15', 100, 20.02, 1561,
    ARRAY['1BHK', '2BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 9.25, 77,
    0.9, 0.77, 12.8814, 77.7356, '2018-09-07', 'PRM/KA/RERA/1251/446/PR/445122/12583'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sumadhura Eden Garden',
    (SELECT id FROM builders WHERE name = 'Sumadhura Group'),
    'Whitefield', 'Bengaluru East', 13248534, 46246872, 11714,
    '2027-04-01', 53, 35.27, 2504,
    ARRAY['2.5BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 1.27, 70,
    1.0, 0.68, 12.8924, 77.6527, '2024-12-10', 'PRM/KA/RERA/1251/446/PR/988614/24475'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Arvind Bel Air',
    (SELECT id FROM builders WHERE name = 'Arvind SmartSpaces'),
    'Yelahanka', 'Bengaluru North', 12120880, 28524630, 11930,
    '2024-06-20', 100, 19.62, 1922,
    ARRAY['2.5BHK', '2BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.9, 8.01, 97,
    0.9, 0.85, 12.9717, 77.6837, '2020-10-18', 'PRM/KA/RERA/1251/446/PR/747619/13109'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Serenity',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Whitefield', 'Bengaluru East', 13109052, 19143780, 12678,
    '2028-12-01', 93, 3.0, 273,
    ARRAY['1BHK', '2BHK', '3BHK'], 5, 0, 'Clear title with no encumbrances.',
    4.2, 11.76, 91,
    1.0, 0.95, 12.9094, 77.6806, '2023-07-27', 'PRM/KA/RERA/1251/446/PR/979294/94557'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Altamont',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Hennur', 'Bengaluru North', 13233242, 38335000, 15334,
    '2027-04-14', 88, 24.37, 2095,
    ARRAY['1BHK', '2.5BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 2.07, 85,
    0.8, 0.72, 12.944, 77.6593, '2022-08-17', 'PRM/KA/RERA/1251/446/PR/216489/18425'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DSR The Address',
    (SELECT id FROM builders WHERE name = 'DSR Infraprojects'),
    'Sarjapur', 'Bengaluru East', 14423760, 36436140, 13455,
    '2027-05-05', 60, 9.57, 794,
    ARRAY['1BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 10.17, 82,
    0.9, 0.78, 12.8628, 77.6625, '2023-02-18', 'PRM/KA/RERA/1251/446/PR/852196/87717'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Excel Stone',
    (SELECT id FROM builders WHERE name = 'Excel Dwellings'),
    'Sarjapur', 'Bengaluru East', 13336974, 24244992, 11142,
    '2029-01-18', 83, 4.92, 329,
    ARRAY['2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.9, 5.32, 66,
    0.9, 0.93, 12.8601, 77.688, '2024-03-05', 'PRM/KA/RERA/1251/446/PR/457164/58849'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Mana Tropicale',
    (SELECT id FROM builders WHERE name = 'Mana Projects'),
    'Sarjapur', 'Bengaluru East', 13438508, 22623411, 14419,
    '2028-04-18', 55, 26.79, 2625,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 7.02, 97,
    0.6, 0.94, 12.9414, 77.7199, '2024-12-03', 'PRM/KA/RERA/1251/446/PR/552873/34668'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DSR White Waters',
    (SELECT id FROM builders WHERE name = 'DSR Infraprojects'),
    'Carmelaram', 'Bengaluru East', 14471538, 59163992, 15973,
    '2023-04-18', 100, 33.59, 2149,
    ARRAY['3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 14.19, 63,
    0.8, 0.79, 12.8777, 77.677, '2020-01-19', 'PRM/KA/RERA/1251/446/PR/323142/48851'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Lakefront',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'EPIP Zone', 'Bengaluru East', 11064790, 29750676, 11834,
    '2025-02-12', 84, 32.23, 2062,
    ARRAY['1BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.9, 3.42, 63,
    1.0, 0.86, 12.891, 77.7276, '2021-05-28', 'PRM/KA/RERA/1251/446/PR/401041/32284'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'UKN The Belvedere',
    (SELECT id FROM builders WHERE name = 'UKN Properties'),
    'Airport Road', 'Bengaluru East', 13288302, 25300575, 14667,
    '2024-06-07', 100, 25.94, 2438,
    ARRAY['1BHK', '2BHK', '3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 2.58, 93,
    0.9, 0.63, 12.8628, 77.7016, '2019-11-19', 'PRM/KA/RERA/1251/446/PR/716994/20749'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Knowledge City',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'HITECH City', 'Bengaluru East', 8930704, 37895420, 10012,
    '2025-07-21', 12, 12.38, 1176,
    ARRAY['2BHK', '3.5BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    4.8, 9.24, 94,
    0.8, 0.82, 12.8871, 77.6535, '2020-11-03', 'PRM/KA/RERA/1251/446/PR/509298/71040'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DivyaSree Republic of Whitefield',
    (SELECT id FROM builders WHERE name = 'DivyaSree Developers'),
    'Whitefield', 'Bengaluru East', 12195862, 20014005, 11027,
    '2025-06-27', 69, 28.88, 2252,
    ARRAY['1BHK', '3.5BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.2, 3.61, 77,
    0.6, 0.63, 12.8891, 77.7035, '2020-10-04', 'PRM/KA/RERA/1251/446/PR/937949/48882'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DSR Woodwinds',
    (SELECT id FROM builders WHERE name = 'DSR Infraprojects'),
    'Sarjapur', 'Bengaluru East', 12838735, 38237927, 12649,
    '2022-11-09', 100, 8.82, 723,
    ARRAY['1BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 4.6, 81,
    0.8, 0.62, 12.9384, 77.7122, '2019-07-25', 'PRM/KA/RERA/1251/446/PR/827447/23193'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Vamshi Flora',
    (SELECT id FROM builders WHERE name = 'Vamshi Builders'),
    'Marathahalli', 'Bengaluru East', 14540512, 44960384, 15568,
    '2025-09-17', 19, 39.59, 3206,
    ARRAY['1BHK', '2BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 8.57, 80,
    0.9, 0.65, 12.9908, 77.6583, '2020-10-25', 'PRM/KA/RERA/1251/446/PR/241194/82795'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Serenity',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'HSR Layout', 'Bengaluru East', 12937620, 44370570, 15185,
    '2026-11-02', 12, 38.33, 3258,
    ARRAY['2BHK', '3.5BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.5, 14.52, 84,
    0.4, 0.83, 12.9011, 77.6935, '2021-09-03', 'PRM/KA/RERA/1251/446/PR/628726/55880'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Nambiar District 25 Phase 1',
    (SELECT id FROM builders WHERE name = 'Nambiar Builders'),
    'Sarjapur', 'Bengaluru East', 15377937, 48488088, 16697,
    '2026-04-15', 92, 36.22, 2426,
    ARRAY['3.5BHK', '3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.4, 7.81, 66,
    0.8, 0.75, 12.9533, 77.6611, '2023-08-05', 'PRM/KA/RERA/1251/446/PR/638513/28620'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Signet',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'Sarjapur', 'Bengaluru East', 14462700, 22787240, 13580,
    '2027-05-01', 31, 29.69, 2583,
    ARRAY['2.5BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 11.32, 86,
    1.0, 0.68, 12.8844, 77.7184, '2022-04-27', 'PRM/KA/RERA/1251/446/PR/483514/31812'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DivyaSree Elan',
    (SELECT id FROM builders WHERE name = 'DivyaSree Developers'),
    'Sarjapur', 'Bengaluru East', 16871984, 52923488, 14984,
    '2025-08-23', 71, 26.31, 2262,
    ARRAY['2.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 11.91, 85,
    0.9, 0.69, 12.9002, 77.6762, '2021-07-27', 'PRM/KA/RERA/1251/446/PR/191877/96413'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Sunflower',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Magadi Road', 'Bengaluru East', 14287312, 55336216, 15496,
    '2027-04-28', 64, 24.32, 2188,
    ARRAY['1BHK', '3.5BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.2, 4.47, 89,
    0.8, 0.61, 12.9356, 77.6567, '2024-08-01', 'PRM/KA/RERA/1251/446/PR/572466/49536'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej Air Nxt',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Whitefield', 'Bengaluru East', 16689732, 34106320, 13978,
    '2024-06-10', 100, 26.21, 2463,
    ARRAY['1BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 1.08, 93,
    0.6, 0.9, 12.8537, 77.6877, '2021-07-23', 'PRM/KA/RERA/1251/446/PR/859455/34517'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Mana Capitol',
    (SELECT id FROM builders WHERE name = 'Mana Projects'),
    'Sarjapur', 'Bengaluru East', 13847130, 46456146, 13002,
    '2026-03-06', 27, 18.98, 1556,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 9.43, 81,
    1.0, 0.72, 12.9433, 77.7078, '2021-07-06', 'PRM/KA/RERA/1251/446/PR/236942/65991'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Kew Gardens',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Yemalur', 'Bengaluru East', 12061107, 37280709, 10161,
    '2026-08-07', 88, 33.82, 3009,
    ARRAY['2.5BHK', '3BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    3.9, 12.29, 88,
    1.0, 0.83, 12.9117, 77.7398, '2022-05-21', 'PRM/KA/RERA/1251/446/PR/404739/37845'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Sanctuary',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Whitefield', 'Bengaluru East', 12875031, 26178007, 12227,
    '2022-09-13', 100, 33.32, 2299,
    ARRAY['1BHK', '3.5BHK', '3BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.1, 4.69, 68,
    0.8, 0.71, 12.9251, 77.6536, '2019-07-08', 'PRM/KA/RERA/1251/446/PR/161824/48171'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Century Ethos',
    (SELECT id FROM builders WHERE name = 'Century Real Estate'),
    'Hebbal', 'Bengaluru North', 14947548, 52815594, 13866,
    '2024-03-02', 100, 14.43, 1255,
    ARRAY['2.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 12.65, 86,
    1.0, 0.92, 12.8535, 77.6549, '2021-04-05', 'PRM/KA/RERA/1251/446/PR/626955/12719'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Goyal Orchid Piccadilly',
    (SELECT id FROM builders WHERE name = 'Goyal & Co'),
    'Thanisandra', 'Bengaluru North', 12698692, 30817263, 12071,
    '2029-12-10', 94, 28.32, 2067,
    ARRAY['2BHK', '3.5BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.3, 7.3, 72,
    0.4, 0.87, 12.9892, 77.7049, '2024-05-16', 'PRM/KA/RERA/1251/446/PR/770609/13548'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Riviera',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Marathahalli', 'Bengaluru East', 12500904, 50367720, 15171,
    '2029-09-01', 84, 32.75, 3242,
    ARRAY['2.5BHK', '2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 1.16, 98,
    1.0, 0.75, 12.9504, 77.7435, '2024-04-26', 'PRM/KA/RERA/1251/446/PR/469020/63505'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Celesta',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'KR Puram', 'Bengaluru East', 13936260, 41535520, 13663,
    '2022-12-25', 100, 22.65, 2197,
    ARRAY['2BHK', '3.5BHK', '3BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.7, 8.64, 96,
    0.9, 0.73, 12.984, 77.701, '2018-10-07', 'PRM/KA/RERA/1251/446/PR/245082/84733'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Concorde Manhattans',
    (SELECT id FROM builders WHERE name = 'Concorde Group'),
    'Electronic City', 'Bengaluru South', 17216424, 40954752, 17532,
    '2027-08-10', 88, 19.27, 1387,
    ARRAY['3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 3.61, 71,
    1.0, 0.83, 12.9088, 77.7242, '2022-05-12', 'PRM/KA/RERA/1251/446/PR/161190/79942'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'SNN Clermont',
    (SELECT id FROM builders WHERE name = 'SNN Estates'),
    'Hebbal', 'Bengaluru North', 13272165, 43448877, 15523,
    '2027-01-12', 17, 7.7, 739,
    ARRAY['1BHK', '2BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    3.9, 8.28, 95,
    0.9, 0.77, 12.9827, 77.7162, '2023-12-22', 'PRM/KA/RERA/1251/446/PR/500819/33730'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz Leaves and Lives',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'Sarjapur', 'Bengaluru East', 9407841, 38603207, 10019,
    '2026-10-26', 37, 10.35, 879,
    ARRAY['2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 12.05, 84,
    0.8, 0.82, 12.9287, 77.6718, '2022-04-01', 'PRM/KA/RERA/1251/446/PR/892503/82911'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Buena Vista',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Budigere Cross', 'Bengaluru East', 12467485, 39878445, 12505,
    '2024-01-13', 100, 10.65, 745,
    ARRAY['1BHK', '2.5BHK', '2BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.3, 5.08, 69,
    0.9, 0.8, 12.9152, 77.7434, '2021-08-19', 'PRM/KA/RERA/1251/446/PR/692998/26740'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Crescent',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Nandidurga Road', 'Bengaluru East', 18099970, 32463172, 16682,
    '2024-08-20', 100, 36.14, 2204,
    ARRAY['3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 5.17, 60,
    0.8, 0.68, 12.8707, 77.7077, '2020-02-19', 'PRM/KA/RERA/1251/446/PR/100633/29556'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva 270',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'CV Raman Nagar', 'Bengaluru East', 13984200, 24720958, 15538,
    '2022-12-02', 100, 24.66, 1479,
    ARRAY['3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.8, 14.77, 59,
    0.9, 0.93, 12.9344, 77.6697, '2018-01-10', 'PRM/KA/RERA/1251/446/PR/648470/30181'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Season',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'CV Raman Nagar', 'Bengaluru East', 13542495, 48755885, 14515,
    '2022-08-06', 100, 37.68, 3654,
    ARRAY['1BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 10.48, 96,
    1.0, 0.92, 12.9917, 77.7336, '2019-08-14', 'PRM/KA/RERA/1251/446/PR/970321/18198'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Abhee Sunrise',
    (SELECT id FROM builders WHERE name = 'Abhee Ventures'),
    'HSR Layout', 'Bengaluru East', 10839175, 35655525, 13075,
    '2024-04-19', 100, 26.65, 1945,
    ARRAY['2BHK', '3.5BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.3, 1.28, 72,
    0.9, 0.68, 12.942, 77.6781, '2019-09-28', 'PRM/KA/RERA/1251/446/PR/942627/57260'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Concorde Tech Turf',
    (SELECT id FROM builders WHERE name = 'Concorde Group'),
    'Electronic City', 'Bengaluru South', 17610609, 38548247, 17419,
    '2027-01-15', 31, 24.46, 1834,
    ARRAY['1BHK', '2.5BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 11.73, 74,
    1.0, 0.92, 12.8683, 77.7186, '2024-04-12', 'PRM/KA/RERA/1251/446/PR/783782/75917'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Concorde Midway City',
    (SELECT id FROM builders WHERE name = 'Concorde Group'),
    'Hosur Road', 'Bengaluru South', 8690668, 36338113, 10297,
    '2024-10-15', 100, 35.39, 2264,
    ARRAY['2.5BHK', '3.5BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 8.73, 63,
    1.0, 0.81, 12.9921, 77.6674, '2021-05-25', 'PRM/KA/RERA/1251/446/PR/752901/81127'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Radiant White Orchid',
    (SELECT id FROM builders WHERE name = 'Radiant Group'),
    'Sarjapur', 'Bengaluru East', 13146086, 43278954, 11854,
    '2021-06-21', 100, 16.7, 1018,
    ARRAY['2BHK', '3.5BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.7, 1.08, 60,
    0.9, 0.9, 12.8523, 77.7475, '2018-10-10', 'PRM/KA/RERA/1251/446/PR/311845/36009'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Bren Imperia',
    (SELECT id FROM builders WHERE name = 'Bren Corporation'),
    'Harlur', 'Bengaluru East', 11083098, 42595306, 12233,
    '2029-07-25', 59, 20.15, 1672,
    ARRAY['1BHK', '2BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.2, 14.75, 82,
    1.0, 0.67, 12.9235, 77.6855, '2024-05-11', 'PRM/KA/RERA/1251/446/PR/129086/11588'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Bren Edge Waters',
    (SELECT id FROM builders WHERE name = 'Bren Corporation'),
    'Kasavanahalli', 'Bengaluru East', 13073344, 28570656, 11488,
    '2026-08-25', 100, 29.68, 2849,
    ARRAY['1BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.7, 10.31, 95,
    0.9, 0.89, 12.931, 77.6911, '2022-09-12', 'PRM/KA/RERA/1251/446/PR/381047/27710'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Confident Atria',
    (SELECT id FROM builders WHERE name = 'Confident Group'),
    'Sarjapur', 'Bengaluru East', 11347875, 29322909, 10087,
    '2026-03-07', 81, 28.33, 2294,
    ARRAY['2.5BHK', '2BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 13.43, 80,
    0.9, 0.82, 12.964, 77.6805, '2022-08-11', 'PRM/KA/RERA/1251/446/PR/378123/54408'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Somerville',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 13874760, 46814468, 12847,
    '2024-04-11', 100, 16.49, 1269,
    ARRAY['3.5BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.4, 9.28, 76,
    0.9, 0.64, 12.9447, 77.7267, '2021-07-16', 'PRM/KA/RERA/1251/446/PR/690737/81209'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Exotica',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Old Madras Road', 'Bengaluru East', 13985312, 19256336, 11792,
    '2022-04-26', 100, 35.13, 3056,
    ARRAY['2.5BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 2.19, 86,
    0.8, 0.73, 12.9418, 77.703, '2019-12-08', 'PRM/KA/RERA/1251/446/PR/815992/79672'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram O2 Homes',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'Budigere Cross', 'Bengaluru East', 12207108, 33782940, 10284,
    '2024-07-10', 100, 12.58, 779,
    ARRAY['2BHK', '3BHK', '4BHK'], 10, 0, 'Clear title with no encumbrances.',
    3.9, 11.3, 61,
    1.0, 0.81, 12.8685, 77.6618, '2021-07-25', 'PRM/KA/RERA/1251/446/PR/879797/89849'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'HM Tech Park',
    (SELECT id FROM builders WHERE name = 'HM Constructions'),
    'Whitefield', 'Bengaluru East', 13688725, 38294065, 11455,
    '2026-04-10', 80, 37.4, 2356,
    ARRAY['3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 4.14, 62,
    0.9, 0.84, 12.8585, 77.7478, '2022-08-08', 'PRM/KA/RERA/1251/446/PR/179026/72072'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej Woodscapes',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Budigere Cross', 'Bengaluru East', 10805400, 34459830, 11745,
    '2025-11-09', 85, 21.33, 1429,
    ARRAY['1BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 5.06, 66,
    0.9, 0.62, 12.904, 77.7367, '2022-09-18', 'PRM/KA/RERA/1251/446/PR/709565/59739'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige White Meadows',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Whitefield', 'Bengaluru East', 18237594, 27797897, 16981,
    '2027-12-17', 32, 32.81, 2788,
    ARRAY['1BHK', '2.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 10.58, 84,
    1.0, 0.76, 12.9821, 77.7207, '2024-12-12', 'PRM/KA/RERA/1251/446/PR/713070/97680'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Moonstone',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Hebbal', 'Bengaluru North', 13928304, 42155784, 13736,
    '2023-01-12', 100, 10.9, 752,
    ARRAY['2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 10.08, 68,
    0.8, 0.71, 12.914, 77.7286, '2018-06-20', 'PRM/KA/RERA/1251/446/PR/171247/36208'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Habitat Iluminar',
    (SELECT id FROM builders WHERE name = 'Habitat Ventures'),
    'RVCE', 'Bengaluru East', 15685628, 44720410, 14882,
    '2028-08-24', 90, 20.74, 1908,
    ARRAY['1BHK', '3BHK'], 1, 1, 'Clear, marketable title with disclosed litigation.',
    4.7, 11.93, 91,
    0.8, 0.94, 12.9351, 77.656, '2023-03-01', 'PRM/KA/RERA/1251/446/PR/694676/56323'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Raintree Park',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Varthur', 'Bengaluru East', 14107824, 33695088, 13872,
    '2026-12-12', 21, 24.61, 2190,
    ARRAY['1BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 11.98, 88,
    1.0, 0.91, 12.9828, 77.7496, '2021-08-15', 'PRM/KA/RERA/1251/446/PR/142529/54035'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Assetz Marq 3.0',
    (SELECT id FROM builders WHERE name = 'Assetz Property Group'),
    'Whitefield', 'Bengaluru East', 11333166, 18854820, 10137,
    '2028-01-03', 44, 39.53, 2490,
    ARRAY['1BHK', '2.5BHK', '2BHK'], 1, 2, 'Clear, marketable title with disclosed litigation.',
    3.9, 9.77, 62,
    0.9, 0.77, 12.9932, 77.7192, '2024-01-24', 'PRM/KA/RERA/1251/446/PR/513767/27122'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Valmark CityVille',
    (SELECT id FROM builders WHERE name = 'Valmark Developers'),
    'Hulimavu', 'Bengaluru East', 11220716, 25814461, 11357,
    '2024-07-26', 100, 22.04, 1895,
    ARRAY['1BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 7.28, 85,
    0.9, 0.73, 12.9497, 77.7103, '2021-07-24', 'PRM/KA/RERA/1251/446/PR/992739/83126'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Pavani Sarovar',
    (SELECT id FROM builders WHERE name = 'Pavani Builders'),
    'Whitefield', 'Bengaluru East', 11785248, 35247024, 10872,
    '2025-09-04', 54, 35.82, 2973,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 3.79, 82,
    0.9, 0.9, 12.9971, 77.68, '2022-01-16', 'PRM/KA/RERA/1251/446/PR/357313/52836'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DS MAX Sista',
    (SELECT id FROM builders WHERE name = 'DS MAX Properties'),
    'CV Raman Nagar', 'Bengaluru East', 16816920, 35314120, 14120,
    '2025-07-03', 76, 35.93, 3413,
    ARRAY['3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.3, 13.95, 94,
    0.9, 0.65, 12.9562, 77.6859, '2020-04-12', 'PRM/KA/RERA/1251/446/PR/228482/75471'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Bhartiya City Nikoo Homes',
    (SELECT id FROM builders WHERE name = 'Bhartiya City'),
    'Thanisandra', 'Bengaluru North', 12242758, 37646194, 11474,
    '2025-02-11', 29, 32.46, 3181,
    ARRAY['1BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 7.73, 97,
    0.9, 0.94, 12.8604, 77.7198, '2021-05-13', 'PRM/KA/RERA/1251/446/PR/650634/84341'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sumadhura Soham',
    (SELECT id FROM builders WHERE name = 'Sumadhura Group'),
    'Whitefield', 'Bengaluru East', 15176562, 62252904, 16111,
    '2028-08-09', 77, 30.81, 2156,
    ARRAY['2.5BHK', '2BHK', '3.5BHK'], 10, 0, 'Clear title with no encumbrances.',
    4.4, 2.49, 69,
    1.0, 0.74, 12.9999, 77.7199, '2023-12-20', 'PRM/KA/RERA/1251/446/PR/266086/93203'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Amrutha Value',
    (SELECT id FROM builders WHERE name = 'Amrutha Shelters'),
    'Whitefield', 'Bengaluru East', 11963536, 35400950, 13234,
    '2026-10-23', 30, 28.96, 2461,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 9.83, 84,
    1.0, 0.61, 12.9185, 77.7193, '2022-12-08', 'PRM/KA/RERA/1251/446/PR/645103/54374'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha City',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Thanisandra', 'Bengaluru North', 14437376, 52828953, 14099,
    '2026-08-04', 91, 11.92, 739,
    ARRAY['3.5BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.6, 12.45, 61,
    0.4, 0.93, 12.9692, 77.7436, '2023-09-16', 'PRM/KA/RERA/1251/446/PR/521040/92670'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Total Environment In That Quiet Earth',
    (SELECT id FROM builders WHERE name = 'Total Environment'),
    'Hennur', 'Bengaluru North', 13214650, 44378242, 11491,
    '2024-04-19', 100, 35.8, 2541,
    ARRAY['1BHK', '2BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.9, 14.88, 70,
    0.6, 0.75, 12.9602, 77.7485, '2021-11-14', 'PRM/KA/RERA/1251/446/PR/776240/24828'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DSR Lotus Towers',
    (SELECT id FROM builders WHERE name = 'DSR Infraprojects'),
    'Whitefield', 'Bengaluru East', 17119376, 54055016, 14657,
    '2023-06-28', 100, 8.52, 639,
    ARRAY['1BHK', '3.5BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.8, 9.5, 75,
    0.6, 0.86, 12.9033, 77.6568, '2020-06-22', 'PRM/KA/RERA/1251/446/PR/310803/31503'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram Hebbal One',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'Hebbal', 'Bengaluru North', 18125289, 25939991, 17213,
    '2023-10-03', 100, 5.84, 490,
    ARRAY['1BHK', '2.5BHK', '3BHK', '4BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    3.9, 12.82, 83,
    0.6, 0.94, 12.9364, 77.7113, '2018-12-03', 'PRM/KA/RERA/1251/446/PR/334312/39556'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Orchards',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Devanahalli', 'Bengaluru North', 10102212, 48808440, 12612,
    '2024-11-09', 100, 17.35, 1093,
    ARRAY['1BHK', '2.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 6.02, 62,
    0.9, 0.65, 12.9437, 77.6952, '2019-12-23', 'PRM/KA/RERA/1251/446/PR/423005/61235'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Abhee Celestial City',
    (SELECT id FROM builders WHERE name = 'Abhee Ventures'),
    'Sarjapur', 'Bengaluru East', 19614910, 45915915, 17735,
    '2026-10-04', 85, 37.31, 3171,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 3.86, 84,
    1.0, 0.82, 12.8565, 77.7017, '2021-09-14', 'PRM/KA/RERA/1251/446/PR/576428/78163'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Aishwarya Amaze',
    (SELECT id FROM builders WHERE name = 'Aishwarya Group'),
    'KR Puram', 'Bengaluru East', 20167576, 48091912, 17629,
    '2028-11-24', 70, 23.56, 1437,
    ARRAY['2.5BHK', '2BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.8, 2.18, 60,
    1.0, 0.8, 12.8818, 77.7026, '2023-10-28', 'PRM/KA/RERA/1251/446/PR/379937/32766'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Rohan Iksha',
    (SELECT id FROM builders WHERE name = 'Rohan Builders'),
    'Bellandur', 'Bengaluru East', 16434099, 27163800, 15091,
    '2024-02-07', 100, 22.57, 1963,
    ARRAY['2.5BHK', '2BHK', '3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.0, 13.87, 86,
    0.9, 0.75, 12.9553, 77.6942, '2021-06-23', 'PRM/KA/RERA/1251/446/PR/876817/88725'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'DSR Parkway',
    (SELECT id FROM builders WHERE name = 'DSR Infraprojects'),
    'Sarjapur', 'Bengaluru East', 16556097, 32228796, 15231,
    '2029-05-24', 71, 24.69, 1481,
    ARRAY['1BHK', '2BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 7.99, 59,
    0.6, 0.74, 12.86, 77.7129, '2024-06-14', 'PRM/KA/RERA/1251/446/PR/477900/65954'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Maithri Shilpish',
    (SELECT id FROM builders WHERE name = 'Maithri Developers'),
    'Whitefield', 'Bengaluru East', 13648800, 62357955, 17061,
    '2024-02-14', 100, 32.12, 2762,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.5, 14.42, 85,
    0.9, 0.76, 12.905, 77.6554, '2020-01-19', 'PRM/KA/RERA/1251/446/PR/761166/55440'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Rohan Antara',
    (SELECT id FROM builders WHERE name = 'Rohan Builders'),
    'Varthur', 'Bengaluru East', 15691165, 45485080, 14845,
    '2027-03-26', 66, 27.8, 2418,
    ARRAY['3.5BHK', '3BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    3.8, 12.66, 86,
    0.9, 0.73, 12.9635, 77.6882, '2023-10-12', 'PRM/KA/RERA/1251/446/PR/269888/22880'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Mfar Silverline',
    (SELECT id FROM builders WHERE name = 'Mfar Developers'),
    'Whitefield', 'Bengaluru East', 9304274, 23946208, 10466,
    '2026-06-23', 10, 30.72, 2764,
    ARRAY['1BHK', '2.5BHK', '2BHK', '4BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    4.6, 6.37, 89,
    0.8, 0.9, 12.9767, 77.6756, '2022-09-24', 'PRM/KA/RERA/1251/446/PR/196982/38874'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Habitat Eden Heights',
    (SELECT id FROM builders WHERE name = 'Habitat Ventures'),
    'Hoodi', 'Bengaluru East', 18855068, 33884702, 16006,
    '2026-12-04', 18, 18.74, 1780,
    ARRAY['1BHK', '4BHK'], 0, 2, 'Clear, marketable title with disclosed litigation.',
    3.9, 1.59, 94,
    0.6, 0.62, 12.8797, 77.722, '2021-03-19', 'PRM/KA/RERA/1251/446/PR/726119/22979'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Godrej Park Retreat',
    (SELECT id FROM builders WHERE name = 'Godrej Properties'),
    'Sarjapur', 'Bengaluru East', 11688708, 29874864, 11164,
    '2022-11-14', 100, 39.36, 2755,
    ARRAY['2BHK', '3.5BHK', '3BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    3.9, 9.53, 69,
    1.0, 0.63, 12.9268, 77.7081, '2018-01-03', 'PRM/KA/RERA/1251/446/PR/350851/87868'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram Greenfield',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'Budigere Cross', 'Bengaluru East', 12241818, 36817758, 11538,
    '2022-02-08', 100, 23.26, 2046,
    ARRAY['2BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 2.65, 87,
    0.4, 0.77, 12.9167, 77.6591, '2019-09-20', 'PRM/KA/RERA/1251/446/PR/291164/41572'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Rohan Upavan',
    (SELECT id FROM builders WHERE name = 'Rohan Builders'),
    'Off Hennur Road', 'Bengaluru East', 17982984, 33625486, 16838,
    '2026-12-18', 88, 21.47, 1459,
    ARRAY['1BHK', '3.5BHK'], 5, 0, 'Clear title with no encumbrances.',
    4.9, 1.37, 67,
    1.0, 0.69, 12.9607, 77.6523, '2023-02-18', 'PRM/KA/RERA/1251/446/PR/159279/94763'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Goyal Orchid Enclave',
    (SELECT id FROM builders WHERE name = 'Goyal & Co'),
    'Whitefield', 'Bengaluru East', 14212800, 27216000, 12600,
    '2029-02-26', 37, 37.22, 2382,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.5, 8.01, 63,
    1.0, 0.72, 12.8915, 77.7259, '2024-08-02', 'PRM/KA/RERA/1251/446/PR/986163/35998'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Adarsh Sanctuary',
    (SELECT id FROM builders WHERE name = 'Adarsh Developers'),
    'Off Sarjapur Road', 'Bengaluru East', 16372940, 67021470, 16810,
    '2028-01-06', 24, 22.19, 1819,
    ARRAY['1BHK', '3.5BHK', '3BHK'], 2, 1, 'Clear, marketable title with disclosed litigation.',
    4.0, 11.76, 81,
    1.0, 0.89, 12.9792, 77.6621, '2023-10-05', 'PRM/KA/RERA/1251/446/PR/522264/32229'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Vaishnavi Oasis',
    (SELECT id FROM builders WHERE name = 'Vaishnavi Group'),
    'JP Nagar', 'Bengaluru South', 10248428, 19528832, 10522,
    '2022-04-26', 100, 20.37, 1385,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 7.2, 67,
    1.0, 0.93, 12.9155, 77.7067, '2019-03-24', 'PRM/KA/RERA/1251/446/PR/408954/64793'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Concorde Sylvan View',
    (SELECT id FROM builders WHERE name = 'Concorde Group'),
    'Electronic City', 'Bengaluru South', 15659256, 40507776, 15628,
    '2026-05-24', 43, 3.68, 231,
    ARRAY['1BHK', '2.5BHK', '2BHK', '3.5BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 10.24, 62,
    1.0, 0.78, 12.8581, 77.6894, '2022-10-09', 'PRM/KA/RERA/1251/446/PR/526847/28377'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Rohan Avriti',
    (SELECT id FROM builders WHERE name = 'Rohan Builders'),
    'Mahadevapura', 'Bengaluru East', 15947056, 47992000, 13712,
    '2027-03-13', 87, 8.06, 612,
    ARRAY['1BHK', '2.5BHK', '3.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    3.8, 5.09, 75,
    1.0, 0.67, 12.9045, 77.6601, '2022-09-21', 'PRM/KA/RERA/1251/446/PR/823576/17523'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'UKN Belvista',
    (SELECT id FROM builders WHERE name = 'UKN Properties'),
    'Whitefield', 'Bengaluru East', 11474589, 35838927, 11793,
    '2021-01-05', 100, 13.2, 1108,
    ARRAY['2.5BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.7, 14.67, 83,
    1.0, 0.82, 12.857, 77.6526, '2018-09-01', 'PRM/KA/RERA/1251/446/PR/600305/98959'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Salarpuria Sattva Magnolia',
    (SELECT id FROM builders WHERE name = 'Salarpuria Sattva'),
    'Off Sarjapur Road', 'Bengaluru East', 12973632, 38358264, 11032,
    '2024-02-05', 100, 3.22, 322,
    ARRAY['3.5BHK', '4BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    4.6, 9.31, 100,
    0.9, 0.61, 12.9034, 77.7006, '2020-03-02', 'PRM/KA/RERA/1251/446/PR/869529/52627'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Palladian',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Marathahalli', 'Bengaluru East', 18425899, 30754869, 16889,
    '2029-05-26', 88, 9.41, 790,
    ARRAY['1BHK', '2BHK', '3BHK'], 1, 2, 'Clear, marketable title with disclosed litigation.',
    4.6, 1.48, 83,
    0.8, 0.82, 12.9001, 77.7153, '2024-09-03', 'PRM/KA/RERA/1251/446/PR/456592/72115'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sobha Galera',
    (SELECT id FROM builders WHERE name = 'Sobha Limited'),
    'Kannamangala', 'Bengaluru East', 17135960, 41627450, 16166,
    '2025-10-13', 18, 23.75, 2256,
    ARRAY['1BHK', '2.5BHK', '2BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.4, 2.74, 94,
    0.9, 0.74, 12.8633, 77.7409, '2022-04-26', 'PRM/KA/RERA/1251/446/PR/123955/28135'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Whitehall',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Sarjapur', 'Bengaluru East', 16509420, 42388110, 17415,
    '2024-10-10', 100, 7.85, 714,
    ARRAY['1BHK', '3.5BHK', '3BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    3.9, 14.05, 90,
    0.8, 0.79, 12.9067, 77.6591, '2019-11-06', 'PRM/KA/RERA/1251/446/PR/340136/84644'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Purva Skydale',
    (SELECT id FROM builders WHERE name = 'Puravankara'),
    'Sarjapur', 'Bengaluru East', 14214180, 37098420, 14745,
    '2028-09-05', 52, 30.32, 2577,
    ARRAY['2.5BHK', '3.5BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.3, 13.21, 84,
    1.0, 0.6, 12.9755, 77.7196, '2024-07-15', 'PRM/KA/RERA/1251/446/PR/303238/75583'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Century Sports Village',
    (SELECT id FROM builders WHERE name = 'Century Real Estate'),
    'Devanahalli', 'Bengaluru North', 17478812, 54828438, 15634,
    '2022-09-10', 100, 14.25, 1068,
    ARRAY['1BHK', '2.5BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.2, 5.29, 74,
    0.8, 0.71, 12.8543, 77.7372, '2019-08-20', 'PRM/KA/RERA/1251/446/PR/531474/46357'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Birla Alokya',
    (SELECT id FROM builders WHERE name = 'Birla Estates'),
    'Whitefield', 'Bengaluru East', 11900518, 41497330, 10654,
    '2028-04-02', 96, 35.23, 2149,
    ARRAY['3BHK', '4BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.4, 1.34, 60,
    0.8, 0.95, 12.9367, 77.7175, '2023-08-12', 'PRM/KA/RERA/1251/446/PR/358768/10769'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Confident Oxygen',
    (SELECT id FROM builders WHERE name = 'Confident Group'),
    'Sarjapur', 'Bengaluru East', 15404460, 51189935, 17585,
    '2027-03-22', 13, 32.24, 2256,
    ARRAY['2.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.1, 7.05, 69,
    0.9, 0.75, 12.9589, 77.7358, '2022-02-28', 'PRM/KA/RERA/1251/446/PR/239334/21653'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Sumadhura Silver Ripples',
    (SELECT id FROM builders WHERE name = 'Sumadhura Group'),
    'Whitefield', 'Bengaluru East', 17158575, 35751200, 16675,
    '2027-09-24', 62, 17.76, 1367,
    ARRAY['1BHK', '2BHK', '3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.8, 12.77, 76,
    0.9, 0.68, 12.8589, 77.6818, '2023-04-10', 'PRM/KA/RERA/1251/446/PR/288992/23458'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Shriram Blue',
    (SELECT id FROM builders WHERE name = 'Shriram Properties'),
    'KR Puram', 'Bengaluru East', 17521706, 41103897, 15343,
    '2021-04-19', 100, 37.48, 3448,
    ARRAY['1BHK', '3.5BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.4, 8.77, 91,
    0.4, 0.67, 12.9717, 77.7426, '2018-04-04', 'PRM/KA/RERA/1251/446/PR/807934/43186'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Adarsh Palm Meadows',
    (SELECT id FROM builders WHERE name = 'Adarsh Developers'),
    'Whitefield', 'Bengaluru East', 10473987, 29113509, 12279,
    '2022-08-17', 100, 27.98, 2266,
    ARRAY['1BHK', '2BHK', '3.5BHK', '4BHK'], 0, 1, 'Clear, marketable title with disclosed litigation.',
    4.7, 8.69, 80,
    0.8, 0.64, 12.8549, 77.7069, '2018-12-24', 'PRM/KA/RERA/1251/446/PR/181931/10441'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Brigade Caladium',
    (SELECT id FROM builders WHERE name = 'Brigade Enterprises'),
    'Hebbal', 'Bengaluru North', 14644140, 52423560, 17580,
    '2027-12-07', 25, 11.11, 699,
    ARRAY['2.5BHK', '3.5BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.0, 2.68, 62,
    1.0, 0.79, 12.9658, 77.6518, '2023-07-11', 'PRM/KA/RERA/1251/446/PR/277239/25167'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Eaton Park @ The Prestige City',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'Sompura Village', 'Bengaluru East', 15605104, 49872282, 14557,
    '2029-07-18', 47, 7.06, 515,
    ARRAY['2BHK', '3.5BHK', '3BHK', '4BHK'], 2, 0, 'Clear title with no encumbrances.',
    4.7, 2.19, 72,
    1.0, 0.76, 12.9607, 77.6529, '2024-04-24', 'PRM/KA/RERA/1251/446/PR/447261/97479'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Mahindra Windchimes',
    (SELECT id FROM builders WHERE name = 'Mahindra Lifespaces'),
    'Bannerghatta Road', 'Bengaluru South', 15986630, 59654922, 17098,
    '2023-04-25', 100, 38.51, 2695,
    ARRAY['1BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.3, 9.95, 69,
    1.0, 0.72, 12.8579, 77.7188, '2020-04-02', 'PRM/KA/RERA/1251/446/PR/835272/23118'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'UKN Esperanza',
    (SELECT id FROM builders WHERE name = 'UKN Properties'),
    'Whitefield', 'Bengaluru East', 16198240, 36184215, 17455,
    '2027-11-02', 66, 8.6, 645,
    ARRAY['1BHK', '2.5BHK', '2BHK', '3BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.8, 12.6, 75,
    0.6, 0.92, 12.9724, 77.7377, '2024-01-18', 'PRM/KA/RERA/1251/446/PR/569446/18071'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Rohan Upavan Phase 2',
    (SELECT id FROM builders WHERE name = 'Rohan Builders'),
    'Hennur', 'Bengaluru North', 11062195, 32017610, 12305,
    '2025-01-16', 39, 23.57, 1932,
    ARRAY['1BHK', '3BHK', '4BHK'], 1, 0, 'Clear title with no encumbrances.',
    4.8, 6.4, 81,
    0.6, 0.75, 12.9285, 77.7472, '2021-11-26', 'PRM/KA/RERA/1251/446/PR/940440/46685'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Mahaveer Promenade',
    (SELECT id FROM builders WHERE name = 'Mahaveer Group'),
    'Whitefield', 'Bengaluru East', 11572432, 46811436, 11857,
    '2024-04-06', 100, 26.95, 2506,
    ARRAY['3.5BHK', '3BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 3.52, 92,
    1.0, 0.87, 12.9248, 77.6752, '2020-07-03', 'PRM/KA/RERA/1251/446/PR/879187/47820'
);


INSERT INTO projects (
    name, builder_id, locality, area, price_min, price_max, price_per_sft,
    possession_date, construction_progress, land_area_acres, total_units,
    unit_types, complaints, land_litigations, property_title_summary,
    google_reviews_score, distance_from_nearest_office_hub, density,
    timeline_reliability, commute_score, latitude, longitude, start_date, rera_number
) VALUES (
    'Prestige Pine Forest',
    (SELECT id FROM builders WHERE name = 'Prestige Estates'),
    'ECC Road', 'Bengaluru East', 14379408, 44213733, 14733,
    '2022-06-01', 100, 39.01, 2574,
    ARRAY['2.5BHK', '2BHK'], 0, 0, 'Clear title with no encumbrances.',
    4.6, 2.39, 65,
    1.0, 0.79, 12.8526, 77.6986, '2018-04-03', 'PRM/KA/RERA/1251/446/PR/212333/39427'
);
