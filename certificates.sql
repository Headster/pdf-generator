CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `template_id` varchar(50) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `certificate_name` varchar(255) NOT NULL,
  `file_url` text NOT NULL,
  `certificate_image` text DEFAULT NULL,
  `format` varchar(10) NOT NULL,
  `certificate_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;