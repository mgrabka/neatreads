INSERT INTO "auth"."users" ("id") VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'), ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'), ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'), ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16');;
INSERT INTO profiles ("user_id", "username") VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'johndoe'), ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'janedoe'), ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'johndoejr'), ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'janedoejr'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'johndoeiii'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'janedoeiii');;

INSERT INTO ratings (book_id, user_id, rating, created_at, updated_at) VALUES
('zaRoX10_UsMC', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, NOW(), NOW()),
('RJxWIQOvoZUC', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 5, NOW(), NOW()),
('gueZIor5UXYCC', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 3, NOW(), NOW()),
('gueZIor5UXYC', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 5, NOW(), NOW()),
('gueZIor5UXYC', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 4, NOW(), NOW()),
('gueZIor5UXYC', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 3.5, NOW(), NOW()),
('gueZIor5UXYC', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4.5, NOW(), NOW()),
('gueZIor5UXYC', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 2, NOW(), NOW());

INSERT INTO reviews (rating_id, body, created_at, updated_at) VALUES
(1, 'Great book. I really enjoyed it!', NOW(), NOW()),
(2, 'Fantastic read. Highly recommended!', NOW(), NOW()),
(3, 'It was okay. Not my favorite.', NOW(), NOW()),
(4, 'One of the best books I have ever read. Outstanding!', NOW(), NOW()),
(5, 'Very insightful. Gave me a new perspective.', NOW(), NOW()),
(6, 'The content was good but the writing style wasn’t for me.', NOW(), NOW()),
(7, 'Could not put it down! A must-read.', NOW(), NOW()),
(8, 'Decent read. Some chapters felt a bit prolonged.', NOW(), NOW());

INSERT INTO follows (follower_id, followed_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14');
