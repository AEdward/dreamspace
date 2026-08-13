CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  site_name VARCHAR(255) NOT NULL DEFAULT 'Dreamspace Realty',
  hero_headline VARCHAR(255) NOT NULL,
  hero_subheadline VARCHAR(255),
  hero_image_url VARCHAR(500),
  logo_url VARCHAR(500),
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  secondary_email VARCHAR(255),
  register_cta_label VARCHAR(255) DEFAULT 'Register from home!',
  appointment_cta_label VARCHAR(255) DEFAULT 'Make an appointment now!',
  popup_enabled BOOLEAN NOT NULL DEFAULT 1,
  popup_headline VARCHAR(255) DEFAULT 'We are running a limited time registration. Hurry up!',
  footer_credit VARCHAR(255) DEFAULT 'buildwithanahom',
  footer_credit_url VARCHAR(500),
  stats_enabled BOOLEAN NOT NULL DEFAULT 1,
  stat1_value VARCHAR(50) DEFAULT '10,000',
  stat1_label VARCHAR(255) DEFAULT 'Total subscribers',
  stat2_value VARCHAR(50) DEFAULT '10 years',
  stat2_label VARCHAR(255) DEFAULT 'When all members become homeowners',
  stat3_value VARCHAR(50) DEFAULT 'Birr 3,790',
  stat3_label VARCHAR(255) DEFAULT 'Monthly savings starting from',
  stat4_value VARCHAR(50) DEFAULT 'Birr 139,000',
  stat4_label VARCHAR(255) DEFAULT 'Advance payment starting from',
  maintenance_mode BOOLEAN NOT NULL DEFAULT 0,
  about_heading VARCHAR(255),
  about_body TEXT,
  contact_heading VARCHAR(255) DEFAULT 'Contact us',
  contact_intro TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_credit_url VARCHAR(500);
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_heading VARCHAR(255);
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_body TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_heading VARCHAR(255) DEFAULT 'Contact us';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_intro TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stats_enabled BOOLEAN NOT NULL DEFAULT 1;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat1_value VARCHAR(50) DEFAULT '10,000';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat1_label VARCHAR(255) DEFAULT 'Total subscribers';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat2_value VARCHAR(50) DEFAULT '10 years';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat2_label VARCHAR(255) DEFAULT 'When all members become homeowners';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat3_value VARCHAR(50) DEFAULT 'Birr 3,790';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat3_label VARCHAR(255) DEFAULT 'Monthly savings starting from';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat4_value VARCHAR(50) DEFAULT 'Birr 139,000';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS stat4_label VARCHAR(255) DEFAULT 'Advance payment starting from';

CREATE TABLE IF NOT EXISTS value_props (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS unit_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  sqm DECIMAL(10,2) NOT NULL,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  down_payment DECIMAL(14,2) NOT NULL,
  service_fee DECIMAL(14,2) NOT NULL,
  monthly_savings DECIMAL(14,2) NOT NULL,
  monthly_service_fee DECIMAL(14,2) NOT NULL,
  final_service_fee_after_draw DECIMAL(14,2) NOT NULL,
  total_construction_cost DECIMAL(14,2) NOT NULL,
  currency VARCHAR(20) NOT NULL DEFAULT 'Birr',
  image_url VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS offices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  address TEXT NOT NULL,
  is_construction_site BOOLEAN NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS office_phones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  office_id INT NOT NULL,
  label VARCHAR(100),
  number VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS partners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  logo_url VARCHAR(500),
  url VARCHAR(500)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT NOT NULL,
  cover_image_url VARCHAR(500),
  author VARCHAR(255) NOT NULL DEFAULT 'admin',
  category VARCHAR(100) NOT NULL DEFAULT 'Uncategorized',
  published_date DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  source VARCHAR(20) NOT NULL DEFAULT 'booking',
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bank_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bank_name VARCHAR(255) NOT NULL,
  registration_account VARCHAR(100) NOT NULL,
  price_account VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
