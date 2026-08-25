-- CRIBR Database Synchronization Migration
-- Sourced directly from qubit_project_comparison Final.xlsx
-- Idempotent, transaction-safe project data sync

BEGIN;

INSERT INTO public.builders (id, name, grade) VALUES ('builder-nambiar', 'Nambiar', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-nambiar-district-25-phase-3', 'Nambiar District 25 Phase 3', 'PRM/KA/RERA/1251/308/PR/260526/008686', 'builder-nambiar', 'Bangalore', 'Dommasandra Village, Sarjapur Hobli', 'Anekal', 'published',
    '2026-07-15', '2032-02-29', 0,
    169.0, 403.0, 11160.0, '₹1.69 Cr - ₹4.03 Cr',
    1202.0, 'B', 4.5, 0,
    'Sarjapur Road', 7.120791424, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/308/PR/260526/008686) with zero adverse title encumbrances or litigation records on municipal filings.', 'Praised for design, layouts, and sales experience.
Some complaints about post-sale loan/tripartite support.'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-mana-projects', 'Mana Projects', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-forest-province-2-mana-the-right-life', 'Forest Province 2 @ Mana The Right Life', 'PRM/KA/RERA/1251/308/PR/120326/008522', 'builder-mana-projects', 'Bangalore', 'Chikkavadera, Sarjapura Hobli', 'Anekal', 'published',
    '2026-11-01', '2031-06-30', 0,
    190.0, 300.0, 10659.0, '₹1.90 Cr - ₹3.00 Cr',
    526.0, 'B', 3.9, 0,
    'Kadubeesanahalli', 7.766179405, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/308/PR/120326/008522) with zero adverse title encumbrances or litigation records on municipal filings.', 'Praised for design, layouts, and construction quality. Some complaints about misleading sales offers during booking.'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-ramsons-trendsquares', 'Ramsons Trendsquares', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-east-park-residences', 'East Park Residences', 'PRM/KA/RERA/1251/310/PR/280224/006657', 'builder-ramsons-trendsquares', 'Bangalore', 'Kodathi, Varthur Hobli', 'Bengaluru South', 'published',
    '2024-01-01', '2028-03-31', 67,
    232.0, 331.0, 13892.0, '₹2.32 Cr - ₹3.31 Cr',
    497.0, 'B', 4.0, 2,
    'Kadubeesanahalli', 4.133547247, FALSE,
    '✓ Verified Title Deed: Registered under RERA (PRM/KA/RERA/1251/310/PR/280224/006657) with zero adverse title encumbrances. 2 active consumer complaint(s) under regulatory tribunal review.', 'Praised for location, connectivity, and construction pace. Some serious complaints about construction quality (leakages/cracks) and slow issue resolution.'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-arvind-smarthomes', 'Arvind Smarthomes', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-arvind-sylva', 'Arvind Sylva', 'PRM/KA/RERA/1251/446/PR/090726/008800', 'builder-arvind-smarthomes', 'Bangalore', 'Mullur, Varthur Hobli', 'Bengaluru East', 'published',
    '2026-09-01', '2031-08-31', 0,
    210.0, 309.0, 13450.0, '₹2.10 Cr - ₹3.09 Cr',
    374.0, 'B', 4.9, 0,
    'Kadubeesanahalli', 4.850213786, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/446/PR/090726/008800) with zero adverse title encumbrances or litigation records on municipal filings.', 'Project is pre-launch (RERA approved Jul 2026, possession Aug 2031) with no construction/resident reviews yet. All 18 reviews are from site visits/model home tours, praising location, model house design, and amenities planning; no negative reviews found.'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-bricks-and-milestones', 'Bricks and Milestones', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-the-earthscape-phase-1', 'The Earthscape Phase-1', 'PRM/KA/RERA/1251/446/PR/020925/008044', 'builder-bricks-and-milestones', 'Bangalore', 'Gunjur, Varthur Hobli', 'Bengaluru East', 'published',
    '2025-09-01', '2030-08-31', 19,
    165.0, 265.0, 11633.0, '₹1.65 Cr - ₹2.65 Cr',
    648.0, 'B', 4.3, 0,
    'Kadubeesanahalli', 4.935301123, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/446/PR/020925/008044) with zero adverse title encumbrances or litigation records on municipal filings.', 'Praised for helpful sales staff and low-density layout. Some complaints about GST receipt transparency and post-cancellation service.'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-prestige-group', 'Prestige Group', 'A') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-evergreen-prestige-raintree-park', 'Evergreen @ Prestige Raintree Park', 'PRM/KA/RERA/1251/446/PR/010126/008374', 'builder-prestige-group', 'Bangalore', 'Varthur Hobli', 'Bengaluru East', 'published',
    '2026-01-01', '2030-06-30', 8,
    102.0, 390.0, 15500.0, '₹1.02 Cr - ₹3.90 Cr',
    2000.0, 'A', 4.2, 0,
    'ITPL / Whitefield', 1.708157201, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/446/PR/010126/008374) with zero adverse title encumbrances or litigation records on municipal filings.', 'Praised for prime location near Varthur Lake, value for money and on-time delivery. Some complaints about lack of lake views (vs Phase 1) and rushed, unprofessional sales presentations.'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-urban-excellence-llp', 'Urban Excellence LLP', 'Not Found') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-poetry-of-earth', 'Poetry Of Earth', 'PRM/KA/RERA/1251/446/PR/281024/007183', 'builder-urban-excellence-llp', 'Bangalore', 'Varthur Village, Varthur Hobli', 'Bengaluru East', 'published',
    '2024-07-15', '2028-12-31', 48,
    141.0, 422.0, 10600.0, '₹1.41 Cr - ₹4.22 Cr',
    312.0, 'Not Found', 4.2, 0,
    'ITPL / Whitefield', 3.791924129, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/446/PR/281024/007183) with zero adverse title encumbrances or litigation records on municipal filings.', 'Praised for thoughtful design, solid construction, and fair pricing, though some cite cramped layouts and overly dense high-rise concerns.'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-godrej-properties-limited', 'Godrej Properties Limited', 'A+') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-godrej-lakeside-orchard', 'Godrej Lakeside Orchard', 'PRM/KA/RERA/1251/446/PR/300924/007105', 'builder-godrej-properties-limited', 'Bangalore', 'Sarjapura Road', 'Bengaluru East', 'published',
    '01-11-2024', '30-09-2030', 21,
    150.0, 279.0, 12362.0, '₹1.50 Cr - ₹2.79 Cr',
    698.0, 'A+', 3.6, 2,
    'Sarjapur Rd', 3.43, TRUE,
    '⚠️ Active Land Litigation Flagged: Title due diligence advisory recommends verifying survey boundary dispute documentation and pending court filings prior to token reservation.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-nambiar-ensembleresidential-projects-llp', 'Nambiar EnsembleResidential Projects LLP', 'A') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-nambiar-district-25-ph1', 'Nambiar District 25 Ph.1', 'Registration in Progress / Under Filing', 'builder-nambiar-ensembleresidential-projects-llp', 'Bangalore', 'Dommasandra Village, Sarjapur Hobli', 'Anekal', 'published',
    '25-01-2025', '26-01-2030', 20,
    172.0, 346.0, 13850.0, '₹1.72 Cr - ₹3.46 Cr',
    796.0, 'A', 4.2, 0,
    'Sarjapur Rd', 8.42, FALSE,
    'Title due diligence: Clear preliminary land ownership documentation with zero active court litigation orders recorded.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-vardhita-properties-pvt-ltd-birla-estates', 'Vardhita Properties Pvt Ltd (Birla Estates)', 'A') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-birla-evara', 'Birla Evara', 'Registration in Progress / Under Filing', 'builder-vardhita-properties-pvt-ltd-birla-estates', 'Bangalore', 'Kodathi Village, Varthur Hobli', 'Bengaluru East', 'published',
    '25-05-2025', '25-12-2031', 4,
    93.2, 336.0, 13054.0, '₹93.2 L - ₹3.36 Cr',
    1594.0, 'A', 4.2, 0,
    'Sarjapur Rd', 2.99, FALSE,
    'Title due diligence: Clear preliminary land ownership documentation with zero active court litigation orders recorded.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-prestige-projects-pvt-ltd', 'Prestige Projects Pvt Ltd', 'A+') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-prestige-eaton-park', 'Prestige Eaton Park', 'Registration in Progress / Under Filing', 'builder-prestige-projects-pvt-ltd', 'Bangalore', 'Sompura/Valagere Kalahalli, Sarjapur Hobli', 'Anekal', 'published',
    '01-04-2026', '30-06-2030', 0,
    0.0, 0.0, NULL, 'Price on Request',
    366.0, 'A+', 4.2, 0,
    'ITPL/Whitefield', 10.59, FALSE,
    'Title due diligence: Clear preliminary land ownership documentation with zero active court litigation orders recorded.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-brigade-enterprises-ltd', 'Brigade Enterprises Ltd', 'A+') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-brigade-sanctuary', 'Brigade Sanctuary', 'PRM/KA/RERA/1251/446/PR/041123/006372', 'builder-brigade-enterprises-ltd', 'Bangalore', 'Chikkavaderapura Village, Sarjapura Hobli', 'Bengaluru East', 'published',
    '01-12-2023', '31-12-2028', 62,
    160.0, 280.0, 11256.0, '₹1.60 Cr - ₹2.80 Cr',
    1275.0, 'A+', 4.2, 3,
    'Kadubeesanahalli', 7.76, FALSE,
    '✓ Verified Title Deed: Registered under RERA (PRM/KA/RERA/1251/446/PR/041123/006372) with zero adverse title encumbrances. 3 active consumer complaint(s) under regulatory tribunal review.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-nexplace-infrastructure-abhee-ventures', 'Nexplace Infrastructure (Abhee Ventures)', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-abhee-celestial-city', 'Abhee Celestial City', 'PRM/KA/RERA/1251/308/PR/071123/006380', 'builder-nexplace-infrastructure-abhee-ventures', 'Bangalore', 'Chikkavaderapura Village, Sarjapura Hobli', 'Anekal', 'published',
    '18-10-2023', '30-06-2029', 45,
    150.0, 222.0, 11160.0, '₹1.50 Cr - ₹2.22 Cr',
    399.0, 'B', 4.2, 0,
    'Kadubeesanahalli', 7.57, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/308/PR/071123/006380) with zero adverse title encumbrances or litigation records on municipal filings.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-iinspira-worldcity-projects-pvt-ltd-assetz', 'Iinspira Worldcity Projects Pvt Ltd (Assetz)', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-assetz-melodies-of-life', 'Assetz Melodies of Life', 'PRM/KA/RERA/1251/310/PR/061225/008321', 'builder-iinspira-worldcity-projects-pvt-ltd-assetz', 'Bangalore', 'Choodasandra Village, Sarjapur Hobli', 'Bengaluru South', 'published',
    '01-12-2025', '30-11-2030', 14,
    96.0, 336.0, 15567.0, '₹96.0 L - ₹3.36 Cr',
    204.0, 'B', 4.2, 0,
    'Sarjapur Rd', 1.49, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/310/PR/061225/008321) with zero adverse title encumbrances or litigation records on municipal filings.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-dsr-infraprojects', 'DSR Infraprojects', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-dsr-the-address', 'DSR The Address', 'PRM/KA/RERA/1251/308/PR/050924/006996', 'builder-dsr-infraprojects', 'Bangalore', 'Thigalachodadenahalli Village, Sarjapura Hobli', 'Anekal', 'published',
    '25-07-2024', '12-06-2029', 34,
    132.0, 315.0, 11527.0, '₹1.32 Cr - ₹3.15 Cr',
    702.0, 'B', 4.2, 0,
    'Kadubeesanahalli', 7.932826128, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/308/PR/050924/006996) with zero adverse title encumbrances or litigation records on municipal filings.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

INSERT INTO public.builders (id, name, grade) VALUES ('builder-candeur', 'Candeur', 'B') ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
INSERT INTO public.projects (
    id, name, rera_number, builder_id, city, location, taluk, status,
    project_start_date, possession_date, construction_progress,
    min_price_lakhs, max_price_lakhs, price_per_sqft, price_range,
    total_units, builder_grade, google_rating, complaints_count,
    nearest_office_hub, distance_to_hub_km, land_litigation,
    verification_title_audit_note, google_review_summary
) VALUES (
    'proj-candeur-rise', 'Candeur Rise', 'PRM/KA/RERA/1251/308/PR/050924/006997', 'builder-candeur', 'Bangalore', 'Varthur', 'Varthur', 'published',
    '45699.0', '47848.0', 0,
    132.0, 315.0, 11527.0, '₹1.32 Cr - ₹3.15 Cr',
    702.0, 'B', 4.2, 0,
    'Manyata Tech Park', 5.0, FALSE,
    '✓ 100% Clean Title Deed: Verified registration under RERA (PRM/KA/RERA/1251/308/PR/050924/006997) with zero adverse title encumbrances or litigation records on municipal filings.', ''
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    rera_number = EXCLUDED.rera_number,
    builder_id = EXCLUDED.builder_id,
    location = EXCLUDED.location,
    taluk = EXCLUDED.taluk,
    project_start_date = EXCLUDED.project_start_date,
    possession_date = EXCLUDED.possession_date,
    construction_progress = EXCLUDED.construction_progress,
    min_price_lakhs = EXCLUDED.min_price_lakhs,
    max_price_lakhs = EXCLUDED.max_price_lakhs,
    price_per_sqft = EXCLUDED.price_per_sqft,
    price_range = EXCLUDED.price_range,
    total_units = EXCLUDED.total_units,
    builder_grade = EXCLUDED.builder_grade,
    google_rating = EXCLUDED.google_rating,
    complaints_count = EXCLUDED.complaints_count,
    nearest_office_hub = EXCLUDED.nearest_office_hub,
    distance_to_hub_km = EXCLUDED.distance_to_hub_km,
    land_litigation = EXCLUDED.land_litigation,
    verification_title_audit_note = EXCLUDED.verification_title_audit_note,
    google_review_summary = EXCLUDED.google_review_summary,
    status = 'published';

COMMIT;