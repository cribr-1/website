-- CRIBR Client Spreadsheet Data Seed Migration
-- Source: qubit_project_comparison Final.xlsx
-- Inserts 16 projects, builders, and localities into Supabase PostgreSQL

-- Seed Builders
INSERT INTO public.builders (id, name, grade) VALUES ('builder-urban-excellence-llp', 'Urban Excellence LLP', NULL) ON CONFLICT (name) DO NOTHING;

-- Seed Localities
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-varthur-village-varthur-hobli', 'Varthur Village, Varthur Hobli', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-varthur-hobli', 'Varthur Hobli', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-gunjur-varthur-hobli', 'Gunjur, Varthur Hobli', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-mullur-varthur-hobli', 'Mullur, Varthur Hobli', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-kodathi-varthur-hobli', 'Kodathi, Varthur Hobli', 'Bengaluru South', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-chikkavadera-sarjapura-hobli', 'Chikkavadera, Sarjapura Hobli', 'Anekal', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-varthur', 'Varthur', 'Varthur', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-thigalachodadenahalli-village-sarjapura-hobli', 'Thigalachodadenahalli Village, Sarjapura Hobli', 'Anekal', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-choodasandra-village-sarjapur-hobli', 'Choodasandra Village, Sarjapur Hobli', 'Bengaluru South', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-chikkavaderapura-village-sarjapura-hobli', 'Chikkavaderapura Village, Sarjapura Hobli', 'Anekal', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-sompura-valagere-kalahalli-sarjapur-hobli', 'Sompura/Valagere Kalahalli, Sarjapur Hobli', 'Anekal', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-kodathi-village-varthur-hobli', 'Kodathi Village, Varthur Hobli', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-dommasandra-village-sarjapur-hobli', 'Dommasandra Village, Sarjapur Hobli', 'Anekal', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.localities (id, name, taluk, city) VALUES ('loc-sarjapura-road', 'Sarjapura Road', 'Bengaluru East', 'Bangalore') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-prestige-group', 'Prestige Group', 'A') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-bricks-and-milestones', 'Bricks and Milestones', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-arvind-smarthomes', 'Arvind Smarthomes', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-ramsons-trendsquares', 'Ramsons Trendsquares', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-mana-projects', 'Mana Projects', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-nambiar', 'Nambiar', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-candeur', 'Candeur', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-dsr-infraprojects', 'DSR Infraprojects', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-iinspira-worldcity-projects-pvt-ltd-assetz', 'Iinspira Worldcity Projects Pvt Ltd (Assetz)', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-nexplace-infrastructure-abhee-ventures', 'Nexplace Infrastructure (Abhee Ventures)', 'B') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-brigade-enterprises-ltd', 'Brigade Enterprises Ltd', 'A+') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-prestige-projects-pvt-ltd', 'Prestige Projects Pvt Ltd', 'A+') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-vardhita-properties-pvt-ltd-birla-estates', 'Vardhita Properties Pvt Ltd (Birla Estates)', 'A') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-nambiar-ensembleresidential-projects-llp', 'Nambiar EnsembleResidential Projects LLP', 'A') ON CONFLICT (name) DO NOTHING;
INSERT INTO public.builders (id, name, grade) VALUES ('builder-godrej-properties-limited', 'Godrej Properties Limited', 'A+') ON CONFLICT (name) DO NOTHING;
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-prestige-eaton-park', 'Prestige Eaton Park', 'EATON PARK @ THE PRESTIGE CITY', 'RERA-PENDING-6', 'builder-prestige-projects-pvt-ltd', 'Prestige Projects Pvt Ltd', 'Bangalore', 'Sompura/Valagere Kalahalli, Sarjapur Hobli', 'Anekal',
    12.877615, 77.774327, '2026-04-01', '2030-06-30', 0.0,
    31008.0, 366.0, 0.0, FALSE, ARRAY[]::text[],
    NULL, NULL, NULL, NULL, NULL,
    'ITPL/Whitefield', 10.59, 'A+', NULL, NULL, 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-brigade-sanctuary', 'Brigade Sanctuary', 'BRIGADE SANCTUARY', 'PRM/KA/RERA/1251/446/PR/041123/006372', 'builder-brigade-enterprises-ltd', 'Brigade Enterprises Ltd', 'Bangalore', 'Chikkavaderapura Village, Sarjapura Hobli', 'Bengaluru East',
    12.8950625, 77.7490625, '2023-12-01', '2028-12-31', 62.0,
    60399.0, 1275.0, 3.0, FALSE, ARRAY['3BHK', '4BHK+Maid']::text[],
    16000000.0, 28000000.0, 160.0, 280.0, 11256.0,
    'Kadubeesanahalli', 7.76, 'A+', NULL, NULL, 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-abhee-celestial-city', 'Abhee Celestial City', 'ABHEE CELESTIAL CITY', 'PRM/KA/RERA/1251/308/PR/071123/006380', 'builder-nexplace-infrastructure-abhee-ventures', 'Nexplace Infrastructure (Abhee Ventures)', 'Bangalore', 'Chikkavaderapura Village, Sarjapura Hobli', 'Anekal',
    12.898694, 77.74925, '2023-10-18', '2029-06-30', 45.0,
    19602.0, 399.0, 0.0, FALSE, ARRAY['2BHK', '2.5BHK', '3BHK']::text[],
    15000000.0, 22200000.0, 150.0, 222.0, 11160.0,
    'Kadubeesanahalli', 7.57, 'B', NULL, NULL, 'published'
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
    'Sarjapur Rd', 1.49, 'B', NULL, NULL, 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-dsr-the-address', 'DSR The Address', 'DSR THE ADDRESS', 'PRM/KA/RERA/1251/308/PR/050924/006996', 'builder-dsr-infraprojects', 'DSR Infraprojects', 'Bangalore', 'Thigalachodadenahalli Village, Sarjapura Hobli', 'Anekal',
    12.892282, 77.7492091, '2024-07-25', '2029-06-12', 34.0,
    55341.0, 702.0, 0.0, FALSE, ARRAY['1BHK', '2BHK', '2.5BHK', '4BHK']::text[],
    13200000.0, 31500000.0, 132.0, 315.0, 11527.0,
    'Kadubeesanahalli', 7.932826128, 'B', NULL, NULL, 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-candeur-rise', 'Candeur Rise', 'Candeur Rise', 'PRM/KA/RERA/1251/308/PR/050924/006997', 'builder-candeur', 'Candeur', 'Bangalore', 'Varthur', 'Varthur',
    12.0, 11.0, '2025-02-11', '2030-12-31', 0.0,
    55341.0, 702.0, 0.0, FALSE, ARRAY['1BHK', '2BHK', '2.5BHK', '4BHK']::text[],
    13200000.0, 31500000.0, 132.0, 315.0, 11527.0,
    'Manyata Tech Park', 7211.109505, 'B', NULL, NULL, 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-nambiar-district-25-phase-3', 'Nambiar District 25 Phase 3', 'Nambiar District 25 Phase 3', 'PRM/KA/RERA/1251/308/PR/260526/008686', 'builder-nambiar', 'Nambiar', 'Bangalore', 'Dommasandra Village, Sarjapur Hobli', 'Anekal',
    12.87445, 77.742206, '2026-07-15', '2032-02-29', 0.0,
    46569.0, 1202.0, 0.0, FALSE, ARRAY['2BHK', '3BHK', '4BHK']::text[],
    16900000.0, 40300000.0, 169.0, 403.0, 11160.0,
    'Sarjapur Road', 7.120791424, 'B', 4.5, 'Praised for design, layouts, and sales experience.
Some complaints about post-sale loan/tripartite support.', 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-forest-province-2-mana-the-right-life', 'Forest Province 2 @ Mana The Right Life', 'Forest Province 2 @ Mana The Right Life', 'PRM/KA/RERA/1251/308/PR/120326/008522', 'builder-mana-projects', 'Mana Projects', 'Bangalore', 'Chikkavadera, Sarjapura Hobli', 'Anekal',
    12.89326, 77.748027, '2026-11-01', '2031-06-30', 0.0,
    22614.0, 526.0, 0.0, FALSE, ARRAY['3BHK', '3BHK+Study', '4BHK', '4.5BHK']::text[],
    19000000.0, 30000000.0, 190.0, 300.0, 10659.0,
    'Kadubeesanahalli', 7.766179405, 'B', 3.9, 'Praised for design, layouts, and construction quality. Some complaints about misleading sales offers during booking.', 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-east-park-residences', 'East Park Residences', 'EAST PARK RESIDENCES', 'PRM/KA/RERA/1251/310/PR/280224/006657', 'builder-ramsons-trendsquares', 'Ramsons Trendsquares', 'Bangalore', 'Kodathi, Varthur Hobli', 'Bengaluru South',
    12.900368, 77.709258, '2024-01-01', '2028-03-31', 67.0,
    26557.0, 497.0, 2.0, FALSE, ARRAY['3BHK', '3.5BHK', '4BHK+Maid']::text[],
    23200000.0, 33100000.0, 232.0, 331.0, 13892.0,
    'Kadubeesanahalli', 4.133547247, 'B', 4.0, 'Praised for location, connectivity, and construction pace. Some serious complaints about construction quality (leakages/cracks) and slow issue resolution.', 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-arvind-sylva', 'Arvind Sylva', 'ARVIND SYLVA', 'PRM/KA/RERA/1251/446/PR/090726/008800', 'builder-arvind-smarthomes', 'Arvind Smarthomes', 'Bangalore', 'Mullur, Varthur Hobli', 'Bengaluru East',
    12.8983, 77.7173, '2026-09-01', '2031-08-31', 0.0,
    19020.0, 374.0, 0.0, FALSE, ARRAY['3BHK', '4BHK']::text[],
    21000000.0, 30900000.0, 210.0, 309.0, 13450.0,
    'Kadubeesanahalli', 4.850213786, 'B', 4.9, 'Project is pre-launch (RERA approved Jul 2026, possession Aug 2031) with no construction/resident reviews yet. All 18 reviews are from site visits/model home tours, praising location, model house design, and amenities planning; no negative reviews found.', 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-the-earthscape-phase-1', 'The Earthscape Phase-1', 'THE EARTHSCAPE PHASE-1', 'PRM/KA/RERA/1251/446/PR/020925/008044', 'builder-bricks-and-milestones', 'Bricks and Milestones', 'Bangalore', 'Gunjur, Varthur Hobli', 'Bengaluru East',
    12.9170587, 77.730999, '2025-09-01', '2030-08-31', 19.0,
    34742.0, 648.0, 0.0, FALSE, ARRAY['2BHK', '3BHK', '3.5BHK']::text[],
    16500000.0, 26500000.0, 165.0, 265.0, 11633.0,
    'Kadubeesanahalli', 4.935301123, 'B', 4.3, 'Praised for helpful sales staff and low-density layout. Some complaints about GST receipt transparency and post-cancellation service.', 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-evergreen-prestige-raintree-park', 'Evergreen @ Prestige Raintree Park', 'Evergreen @ Prestige Raintree Park', 'PRM/KA/RERA/1251/446/PR/010126/008374', 'builder-prestige-group', 'Prestige Group', 'Bangalore', 'Varthur Hobli', 'Bengaluru East',
    12.9546694444, 77.747175, '2026-01-01', '2030-06-30', 8.0,
    100100.0, 2000.0, 0.0, FALSE, ARRAY['1BHK', '2BHK', '3BHK', '4.5BHK']::text[],
    10200000.0, 39000000.0, 102.0, 390.0, 15500.0,
    'ITPL / Whitefield', 1.708157201, 'A', 4.2, 'Praised for prime location near Varthur Lake, value for money and on-time delivery. Some complaints about lack of lake views (vs Phase 1) and rushed, unprofessional sales presentations.', 'published'
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

INSERT INTO public.projects (
    id, name, rera_project_name, rera_number, builder_id, builder_name, city, locality, taluk,
    latitude, longitude, project_start_date, possession_date, construction_progress,
    land_area_sqm, total_units, complaints_count, land_litigation, unit_types,
    min_price, max_price, min_price_lakhs, max_price_lakhs, price_per_sqft,
    nearest_office_hub, distance_to_hub_km, builder_grade, google_rating, google_review_summary, status
) VALUES (
    'proj-poetry-of-earth', 'Poetry Of Earth', 'Poetry Of Earth', 'PRM/KA/RERA/1251/446/PR/281024/007183', 'builder-urban-excellence-llp', 'Urban Excellence LLP', 'Bangalore', 'Varthur Village, Varthur Hobli', 'Bengaluru East',
    12.93618, 77.74404, '2024-07-15', '2028-12-31', 48.0,
    9488.0, 312.0, 0.0, FALSE, ARRAY['2BHK', '3BHK', 'Penthouse']::text[],
    14100000.0, 42200000.0, 141.0, 422.0, 10600.0,
    'ITPL / Whitefield', 3.791924129, NULL, 4.2, 'Praised for thoughtful design, solid construction, and fair pricing, though some cite cramped layouts and overly dense high-rise concerns.', 'published'
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
