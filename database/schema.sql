-- Add an image column to the movieinfo table for storing image URLs or paths

ALTER TABLE movieinfo
ADD COLUMN movie_image VARCHAR(500) DEFAULT NULL;

CREATE TABLE `movieinfo` (
  `m_id` int NOT NULL AUTO_INCREMENT,
  `movie_title` varchar(500) DEFAULT NULL,
  `movie_mapping_name` varchar(500) DEFAULT NULL,
  `movie_desc` varchar(800) DEFAULT NULL,
  `movie_category` varchar(400) DEFAULT NULL,
  `movie_director_name` varchar(100) DEFAULT NULL,
  `movie_actor_1` varchar(100) DEFAULT NULL,
  `movie_actor_2` varchar(100) DEFAULT NULL,
  `movie_actor_3` varchar(100) DEFAULT NULL,
  `movie_language` varchar(200) DEFAULT NULL,
  `movie_type` varchar(100) DEFAULT NULL,
  `movie_trailer_link` varchar(1000) DEFAULT NULL,
  `movie_watch_link` varchar(1000) DEFAULT NULL,
  `movie_budget` varchar(200) DEFAULT NULL,
  `movie_release_date` date DEFAULT NULL,
  `movie_country` varchar(120) DEFAULT NULL,
  `movie_image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`m_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
