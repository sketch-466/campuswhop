// Nigerian Universities
export const NIGERIAN_UNIVERSITIES = [
  'Alex Ekwueme Federal University (AE-FUNAI)',
  'University of Lagos (UNILAG)',
  'University of Ibadan (UI)',
  'Obafemi Awolowo University (OAU)',
  'University of Nigeria, Nsukka (UNN)',
  'Ahmadu Bello University (ABU)',
  'University of Benin (UNIBEN)',
  'University of Port Harcourt (UNIPORT)',
  'Federal University of Technology, Akure (FUTA)',
  'Covenant University',
  'Babcock University',
  'University of Ilorin (UNILORIN)',
  'University of Abuja (UNIABUJA)',
  'Nnamdi Azikiwe University (UNIZIK)',
  'Lagos State University (LASU)',
  'University of Calabar (UNICAL)',
  'University of Uyo (UNIUYO)',
  'Federal University of Technology, Minna (FUTMINNA)',
  'University of Jos (UNIJOS)',
  'Rivers State University (RSU)',
] as const

// Faculties
export const FACULTIES = [
  'Arts', 'Science', 'Social Sciences', 'Engineering',
  'Medicine', 'Law', 'Agriculture', 'Education',
  'Management Sciences', 'Environmental Sciences',
] as const

// Levels
export const LEVELS = [
  '100 Level', '200 Level', '300 Level', '400 Level',
  '500 Level', 'Masters', 'PhD',
] as const

// Departments by Faculty
export const DEPARTMENTS: Record<string, string[]> = {
  'Science': ['Computer Science','Mathematics','Physics','Chemistry','Biology','Microbiology','Biochemistry','Statistics'],
  'Arts': ['English','History','Philosophy','Theatre Arts','Linguistics','Religious Studies'],
  'Social Sciences': ['Economics','Political Science','Psychology','Sociology','Mass Communication'],
  'Engineering': ['Computer Engineering','Electrical Engineering','Mechanical Engineering','Civil Engineering','Chemical Engineering'],
  'Medicine': ['Medicine & Surgery','Nursing','Pharmacy','Medical Laboratory Science'],
  'Law': ['Law'],
  'Agriculture': ['Agricultural Economics','Animal Science','Crop Science','Soil Science'],
  'Education': ['Educational Administration','Guidance & Counselling','Curriculum Studies'],
  'Management Sciences': ['Business Administration','Accounting','Marketing','Banking & Finance','Entrepreneurship'],
  'Environmental Sciences': ['Architecture','Estate Management','Urban & Regional Planning'],
}

// Product Categories
export const PRODUCT_CATEGORIES = [
  { id: 'notes', name: 'Class Notes', icon: 'BookOpen', type: 'digital' as const },
  { id: 'tutorials', name: 'Tutorials', icon: 'Video', type: 'digital' as const },
  { id: 'templates', name: 'Templates', icon: 'FileText', type: 'digital' as const },
  { id: 'ebooks', name: 'E-Books', icon: 'Book', type: 'digital' as const },
  { id: 'past-questions', name: 'Past Questions', icon: 'ClipboardList', type: 'digital' as const },
  { id: 'software', name: 'Software/Tools', icon: 'Code', type: 'digital' as const },
  { id: 'wears', name: 'Wears & Fashion', icon: 'Shirt', type: 'physical' as const },
  { id: 'skincare', name: 'Skincare', icon: 'Sparkles', type: 'physical' as const },
  { id: 'footwear', name: 'Footwear', icon: 'Footprints', type: 'physical' as const },
  { id: 'gadgets', name: 'Gadgets', icon: 'Smartphone', type: 'physical' as const },
  { id: 'community', name: 'Communities', icon: 'Users', type: 'community' as const },
]

// Testimonials
export const TESTIMONIALS = [
  { id: '1', name: 'Chidinma Okafor', school: 'University of Lagos', role: 'Creator', content: 'I made N150,000 in my first month selling my 300-level Computer Science notes. CampusWhop changed everything for me.', rating: 5 },
  { id: '2', name: 'Emmanuel Adeyemi', school: 'AE-FUNAI', role: 'Buyer', content: 'Found the exact past questions I needed for my exams. Saved me hours of searching.', rating: 5 },
  { id: '3', name: 'Amina Bello', school: 'Ahmadu Bello University', role: 'Creator', content: 'Started a paid study group. Now I have 200+ members paying N500/month. Best side hustle ever.', rating: 5 },
  { id: '4', name: 'David Nw
