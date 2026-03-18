CREATE TABLE IF NOT EXISTS participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cohort TEXT NOT NULL CHECK (cohort IN ('pre_k_k3', 'k4_k7')),
  points INTEGER NOT NULL DEFAULT 0,
  rank TEXT NOT NULL DEFAULT 'غير مصنف',
  state TEXT NOT NULL DEFAULT '',
  excluded_all INTEGER NOT NULL DEFAULT 0,
  excluded_pre_k_k3 INTEGER NOT NULL DEFAULT 0,
  excluded_k4_k7 INTEGER NOT NULL DEFAULT 0,
  excluded_by_mode TEXT CHECK (excluded_by_mode IN ('all', 'pre_k_k3', 'k4_k7')),
  excluded_reason TEXT,
  excluded_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS draw_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id INTEGER NOT NULL,
  participant_name TEXT NOT NULL,
  cohort TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('all', 'pre_k_k3', 'k4_k7')),
  variant TEXT NOT NULL CHECK (variant IN ('normal', 'fast')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(participant_id) REFERENCES participants(id)
);

CREATE INDEX IF NOT EXISTS idx_participants_excluded_all ON participants(excluded_all);
CREATE INDEX IF NOT EXISTS idx_participants_cohort ON participants(cohort);
CREATE INDEX IF NOT EXISTS idx_participants_state ON participants(state);
CREATE INDEX IF NOT EXISTS idx_participants_mode_exclusion ON participants(excluded_by_mode);
CREATE INDEX IF NOT EXISTS idx_draw_events_mode ON draw_events(mode);
CREATE INDEX IF NOT EXISTS idx_draw_events_created_at ON draw_events(created_at DESC);


-- Original 24 students (K1T3)
INSERT INTO participants (id, name, points, rank, state) VALUES
(1,  'حسين محمود سعيد',              80, 'الأول',          'K1T3'),
(2,  'سامي محمود سعيد',              80, 'الأول',          'K1T3'),
(3,  'حسين محمد منصور عبدالعباس',   80, 'الأول',          'K1T3'),
(4,  'عبدالله علي قنمبر',            80, 'الأول',          'K1T3'),
(5,  'أحمد مازن أحمد',               80, 'الأول',          'K1T3'),
(6,  'ياسين حسن عبدالله',            80, 'الأول',          'K1T3'),
(7,  'ناصر عبدالله',                 80, 'الأول',          'K1T3'),
(8,  'علي يوسف أحمد',               75, 'الأول',          'K1T3'),
(9,  'حسين ناصر الغتم',             75, 'الأول',          'K1T3'),
(10, 'مهدي هاني',                    75, 'الأول',          'K1T3'),
(11, 'سالم حسن طاهر',               75, 'الأول',          'K1T3'),
(12, 'حسين هاني شاكر',              80, 'الأول - مكرر',   'K1T3'),
(13, 'حبيب مظاهر',                   80, 'الأول - مكرر',   'K1T3'),
(14, 'حسين عمار',                    75, 'الأول - مكرر',   'K1T3'),
(15, 'طه حسن عبدالله',               80, 'الأول - مكرر',   'K1T3'),
(16, 'علي عبد الإله عبدالله',        70, 'الثاني',         'K1T3'),
(17, 'أحمد ياسر المؤمن',            70, 'الثاني',         'K1T3'),
(18, 'محمد جاسم أحمد عبدالله',      65, 'الثاني',         'K1T3'),
(19, 'عبدالعزيز محمد عبدالعزيز',    65, 'الثاني',         'K1T3'),
(20, 'علي حسين ربيع',               60, 'الثالث',         'K1T3'),
(21, 'كرار محمد علي',               55, 'الثالث',         'K1T3'),
(22, 'محمد عباس خليفة',             50, 'الرابع',         'K1T3'),
(23, 'رضا طه عباس الدقاق',          40, 'الرابع',         'K1T3'),
(24, 'علي عزيز الشمالن',            34, 'الرابع',         'K1T3'),

-- New 16 students from second PDF (K4T7)
(25, 'حسن علي جواد',                100, 'الأول',         'K4T7'),
(26, 'علي حسن أحمد المؤمن',        100, 'الأول',         'K4T7'),
(27, 'علي حسن علي المؤمن',         100, 'الأول',         'K4T7'),
(28, 'علي حسين سعيد',              100, 'الأول',         'K4T7'),
(29, 'عباس محمد منصور',            100, 'الأول',         'K4T7'),
(30, 'عمار ياسر المؤمن',            95, 'الأول',         'K4T7'),
(31, 'علي حسين السرحاني',           95, 'الأول',         'K4T7'),
(32, 'محمد محمود المؤمن',           95, 'الأول',         'K4T7'),
(33, 'سجاد أحمد طاهر',             95, 'الأول',         'K4T7'),
(34, 'محمد رضا جاسم',              95, 'الأول',         'K4T7'),
(35, 'أحمد علي أحمد خليفة',        100, 'الأول - مكرر',  'K4T7'),
(36, 'علي هاني شاكر',              100, 'الأول - مكرر',  'K4T7'),
(37, 'عمار ياسر سعيد',             100, 'الأول - مكرر',  'K4T7'),
(38, 'علي حسين إبراهيم الدقاق',    100, 'الأول - مكرر',  'K4T7'),
(39, 'محمود محمد طاهر',             95, 'الأول - مكرر',  'K4T7'),
(40, 'كرار يوسف أحمد',             95, 'الثاني',        'K4T7');