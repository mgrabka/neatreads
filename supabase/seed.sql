INSERT INTO "auth"."users" ("id") VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'), ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'), ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13');

INSERT INTO ratings (book_id, user_id, rating, created_at, updated_at) VALUES
('zaRoX10_UsMC', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, NOW(), NOW()),
('RJxWIQOvoZUC', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 5, NOW(), NOW()),
('_ojXNuzgHRcC', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 3, NOW(), NOW());

INSERT INTO comments (rating_id, body, created_at, updated_at) VALUES
(1, 'Great book. I really enjoyed it!', NOW(), NOW()),
(2, 'Fantastic read. Highly recommended!', NOW(), NOW()),
(3, 'It was okay. Not my favorite.', NOW(), NOW());
