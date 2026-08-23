-- CRIBR Client Spreadsheet Data Seed Migration
-- Source: qubit_project_comparison Final.xlsx
-- Inserts 7 projects, builders, and localities into Supabase PostgreSQL

-- Seed Builders
INSERT INTO public.builders (id, name, grade) VALUES ('builder-godrej-properties-limited', 'Godrej Properties Limited', 'A+') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-nambiar-ensembleresidential-projects-llp', 'Nambiar EnsembleResidential Projects LLP', 'A') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-vardhita-properties-pvt-ltd-birla-estates', 'Vardhita Properties Pvt Ltd (Birla Estates)', 'A') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-prestige-projects-pvt-ltd', 'Prestige Projects Pvt Ltd', 'A+') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-brigade-enterprises-ltd', 'Brigade Enterprises Ltd', 'A+') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-nexplace-infrastructure-abhee-ventures', 'Nexplace Infrastructure (Abhee Ventures)', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-iinspira-worldcity-projects-pvt-ltd-assetz', 'Iinspira Worldcity Projects Pvt Ltd (Assetz)', 'B') ON CONFLICT (name) DO NOTHING;

-- Seed Localities
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-sarjapura-road', 'Sarjapura Road', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-dommasandra-village-sarjapur-hobli', 'Dommasandra Village, Sarjapur Hobli', 'Anekal', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-kodathi-village-varthur-hobli', 'Kodathi Village, Varthur Hobli', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-sompura-valagere-kalahalli-sarjapur-hobli', 'Sompura/Valagere Kalahalli, Sarjapur Hobli', 'Anekal', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-chikkavaderapura-village-sarjapura-hobli', 'Chikkavaderapura Village, Sarjapura Hobli', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-choodasandra-village-sarjapur-hobli', 'Choodasandra Village, Sarjapur Hobli', 'Bengaluru South', 'Bangalore') ON CONFLICT (name) DO NOTHING;

-- Project 1: Godrej Lakeside Orchard
INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-godrej-lakeside-orchard', 'Godrej Lakeside Orchard', 'GODREJ LAKESIDE ORCHARD', 'PRM/KA/RERA/1251/446/PR/300924/007105', 'builder-godrej-properties-limited', 'Godrej Properties Limited', 'Bangalore', 'Sarjapura Road', 'Bengaluru East',
    12.88946, 77.705805, '2024-11-01', '2030-09-30', 21.0,
    48829.0, 698.0, 2.0, TRUE, ARRAY['2BHK', '3BHK', '3.5BHK']::text[],
    15000000.0, 27900000.0, 150.0, 279.0, 12362.0,
    'Sarjapur Rd', 3.43, 'A+', 3.6, NULL, 'published'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_project_name = EXCLUDED.rera_project_name,
    rera_number = EXCLUDED.rera_number,
    builder_name = EXCLUDED.builder_name,
    locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    min_price = EXCLUDED.min_price,
    max_price = EXCLUDED.max_price,
    price_per_sqft = EXCLUDED.price_per_sqft,
    status = 'published';

-- Project 2: Nambiar District 25 Ph.1
INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-nambiar-district-25-ph-1', 'Nambiar District 25 Ph.1', 'NAMBIAR DISTRICT 25 PHASE 1', 'RERA-PENDING-4', 'builder-nambiar-ensembleresidential-projects-llp', 'Nambiar EnsembleResidential Projects LLP', 'Bangalore', 'Dommasandra Village, Sarjapur Hobli', 'Anekal',
    12.87807, 77.75428, '2025-01-25', '2030-01-26', 20.0,
    35471.0, 796.0, 0.0, FALSE, ARRAY['2BHK', '2.5BHK', '3BHK', '3.5BHK', '4BHK']::text[],
    17200000.0, 34600000.0, 172.0, 346.0, 13850.0,
    'Sarjapur Rd', 8.42, 'A', NULL, NULL, 'published'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_project_name = EXCLUDED.rera_project_name,
    rera_number = EXCLUDED.rera_number,
    builder_name = EXCLUDED.builder_name,
    locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    min_price = EXCLUDED.min_price,
    max_price = EXCLUDED.max_price,
    price_per_sqft = EXCLUDED.price_per_sqft,
    status = 'published';

-- Project 3: Birla Evara
INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-birla-evara', 'Birla Evara', 'BIRLA EVARA', 'RERA-PENDING-5', 'builder-vardhita-properties-pvt-ltd-birla-estates', 'Vardhita Properties Pvt Ltd (Birla Estates)', 'Bangalore', 'Kodathi Village, Varthur Hobli', 'Bengaluru East',
    12.885231, 77.703123, '2025-05-25', '2031-12-25', 4.0,
    104053.0, 1594.0, 0.0, FALSE, ARRAY['1BHK', '2BHK', '3BHK', '4BHK']::text[],
    9320000.0, 33600000.0, 93.2, 336.0, 13054.0,
    'Sarjapur Rd', 2.99, 'A', NULL, NULL, 'published'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_project_name = EXCLUDED.rera_project_name,
    rera_number = EXCLUDED.rera_number,
    builder_name = EXCLUDED.builder_name,
    locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    min_price = EXCLUDED.min_price,
    max_price = EXCLUDED.max_price,
    price_per_sqft = EXCLUDED.price_per_sqft,
    status = 'published';

-- Project 4: Prestige Eaton Park
INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-prestige-eaton-park', 'Prestige Eaton Park', 'PRESTIGE EATON PARK', 'RERA-PENDING-6', 'builder-prestige-projects-pvt-ltd', 'Prestige Projects Pvt Ltd', 'Bangalore', 'Sompura/Valagere Kalahalli, Sarjapur Hobli', 'Anekal',
    12.86894, 77.77708, '2026-04-01', '2030-06-30', 0.0,
    31008.0, 366.0, 0.0, FALSE, ARRAY['2BHK', '3BHK']::text[],
    14500000.0, 29000000.0, 145.0, 290.0, 12100.0,
    'ITPL / Whitefield', 10.59, 'A+', NULL, NULL, 'published'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_project_name = EXCLUDED.rera_project_name,
    rera_number = EXCLUDED.rera_number,
    builder_name = EXCLUDED.builder_name,
    locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    min_price = EXCLUDED.min_price,
    max_price = EXCLUDED.max_price,
    price_per_sqft = EXCLUDED.price_per_sqft,
    status = 'published';

-- Project 5: Brigade Sanctuary
INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-brigade-sanctuary', 'Brigade Sanctuary', 'BRIGADE SANCTUARY', 'PRM/KA/RERA/1251/446/PR/041123/006372', 'builder-brigade-enterprises-ltd', 'Brigade Enterprises Ltd', 'Bangalore', 'Chikkavaderapura Village, Sarjapura Hobli', 'Bengaluru East',
    12.89437, 77.74797, '2023-12-01', '2028-12-31', 62.0,
    60399.0, 1275.0, 3.0, FALSE, ARRAY['3BHK', '4BHK+Maid']::text[],
    16000000.0, 28000000.0, 160.0, 280.0, 11256.0,
    'Kadubeesanahalli', 7.76, 'A+', 4.5, NULL, 'published'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_project_name = EXCLUDED.rera_project_name,
    rera_number = EXCLUDED.rera_number,
    builder_name = EXCLUDED.builder_name,
    locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    min_price = EXCLUDED.min_price,
    max_price = EXCLUDED.max_price,
    price_per_sqft = EXCLUDED.price_per_sqft,
    status = 'published';

-- Project 6: Abhee Celestial City
INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-abhee-celestial-city', 'Abhee Celestial City', 'ABHEE CELESTIAL CITY', 'PRM/KA/RERA/1251/308/PR/071123/006380', 'builder-nexplace-infrastructure-abhee-ventures', 'Nexplace Infrastructure (Abhee Ventures)', 'Bangalore', 'Chikkavaderapura Village, Sarjapura Hobli', 'Anekal',
    12.89437, 77.74797, '2023-10-18', '2029-06-30', 45.0,
    19602.0, 399.0, 0.0, FALSE, ARRAY['2BHK', '2.5BHK', '3BHK']::text[],
    15000000.0, 22200000.0, 150.0, 222.0, 11160.0,
    'Kadubeesanahalli', 7.57, 'B', 4.1, NULL, 'published'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_project_name = EXCLUDED.rera_project_name,
    rera_number = EXCLUDED.rera_number,
    builder_name = EXCLUDED.builder_name,
    locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    min_price = EXCLUDED.min_price,
    max_price = EXCLUDED.max_price,
    price_per_sqft = EXCLUDED.price_per_sqft,
    status = 'published';

-- Project 7: Assetz Melodies of Life
INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-assetz-melodies-of-life', 'Assetz Melodies of Life', 'ASSETZ INSPIRA MELODIES OF LIFE APTS', 'PRM/KA/RERA/1251/310/PR/061225/008321', 'builder-iinspira-worldcity-projects-pvt-ltd-assetz', 'Iinspira Worldcity Projects Pvt Ltd (Assetz)', 'Bangalore', 'Choodasandra Village, Sarjapur Hobli', 'Bengaluru South',
    12.8875, 77.686, '2025-12-01', '2030-11-30', 14.0,
    13833.0, 204.0, 0.0, FALSE, ARRAY['3BHK only (2 towers)', 'Propsoch: PLOTTED 600–2400sqft']::text[],
    9600000.0, 33600000.0, 96.0, 336.0, 15567.0,
    'Sarjapur Rd', 1.49, 'B', 4.3, NULL, 'published'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_project_name = EXCLUDED.rera_project_name,
    rera_number = EXCLUDED.rera_number,
    builder_name = EXCLUDED.builder_name,
    locality = EXCLUDED.locality,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    min_price = EXCLUDED.min_price,
    max_price = EXCLUDED.max_price,
    price_per_sqft = EXCLUDED.price_per_sqft,
    status = 'published';
