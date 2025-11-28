// Industries list - synchronized across employer and candidate portals
export const INDUSTRIES = [
  "Information Technology",
  "AI & Machine Learning",
  "Software Development",
  "Web Development",
  "Mobile Development",
  "Cloud Computing",
  "Cybersecurity",
  "Data Science & Analytics",
  "DevOps",
  "Blockchain",
  "E-commerce",
  "Fintech",
  "Healthcare",
  "Education",
  "Telecommunications",
  "Banking & Finance",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Media & Entertainment",
  "Marketing & Advertising",
  "Consulting",
  "Logistics & Supply Chain",
  "Automotive",
  "Energy",
  "Agriculture",
  "Hospitality & Tourism",
  "Fashion & Apparel",
  "Food & Beverage",
  "Non-profit & NGO",
  "Government",
  "Legal Services",
  "Pharmaceuticals",
  "Construction",
  "Insurance",
  "Other",
];

// Vietnam cities list
export const VIETNAM_CITIES = [
  "Hà Nội",
  "TP Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Biên Hòa",
  "Nha Trang",
  "Huế",
  "Vũng Tàu",
  "Buôn Ma Thuột",
  "Quy Nhơn",
  "Thái Nguyên",
  "Nam Định",
  "Vinh",
  "Bắc Ninh",
  "Thái Bình",
  "Hạ Long",
  "Long Xuyên",
  "Mỹ Tho",
  "Rạch Giá",
];

// Job types (for display)
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

// Job type mapping for API (backend uses: fulltime, parttime, contract, internship)
export const JOB_TYPE_MAP = {
  "Full-time": "fulltime",
  "Part-time": "parttime",
  Contract: "contract",
  Internship: "internship",
};

// Reverse mapping for display
export const JOB_TYPE_DISPLAY = {
  fulltime: "Full-time",
  parttime: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

// Work modes (for display)
export const WORK_MODES = ["On-site", "Remote", "Hybrid"];

// Work mode mapping for API (backend uses: onsite, remote, hybrid)
export const WORK_MODE_MAP = {
  "On-site": "onsite",
  Remote: "remote",
  Hybrid: "hybrid",
};

// Reverse mapping for display
export const WORK_MODE_DISPLAY = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

// Experience levels (for display)
export const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Executive",
];

// Experience level mapping for API (backend uses: entry, mid, senior, lead, executive)
export const EXPERIENCE_LEVEL_MAP = {
  "Entry Level": "entry",
  Junior: "mid", // Junior maps to mid
  "Mid-Level": "mid",
  Senior: "senior",
  Lead: "lead",
  Executive: "executive",
};

// Reverse mapping for display
export const EXPERIENCE_LEVEL_DISPLAY = {
  entry: "Entry Level",
  mid: "Mid-Level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

// Education levels
export const EDUCATION_LEVELS = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Professional Certification",
];

// Company sizes
export const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];

// Salary ranges (in million VND per month)
export const SALARY_RANGES = [
  { label: "Under 10M", min: 0, max: 10 },
  { label: "10M - 20M", min: 10, max: 20 },
  { label: "20M - 30M", min: 20, max: 30 },
  { label: "30M - 40M", min: 30, max: 40 },
  { label: "40M - 50M", min: 40, max: 50 },
  { label: "50M+", min: 50, max: 999 },
];

// Application statuses
export const APPLICATION_STATUSES = [
  "pending",
  "reviewing",
  "interview",
  "offered",
  "rejected",
  "withdrawn",
  "accepted",
];

// Job statuses
export const JOB_STATUSES = ["open", "closed", "draft"];
