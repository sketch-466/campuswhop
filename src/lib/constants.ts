export const APP_NAME = "CampusWhop";
export const APP_DESCRIPTION = "The creator marketplace for Nigerian university students";

export const NIGERIAN_UNIVERSITIES = [
  { id: "unilag", name: "University of Lagos", state: "Lagos", abbr: "UNILAG" },
  { id: "ui", name: "University of Ibadan", state: "Oyo", abbr: "UI" },
  { id: "oau", name: "Obafemi Awolowo University", state: "Osun", abbr: "OAU" },
  { id: "uniben", name: "University of Benin", state: "Edo", abbr: "UNIBEN" },
  { id: "unn", name: "University of Nigeria, Nsukka", state: "Enugu", abbr: "UNN" },
  { id: "abu", name: "Ahmadu Bello University", state: "Kaduna", abbr: "ABU" },
  { id: "unilorin", name: "University of Ilorin", state: "Kwara", abbr: "UNILORIN" },
  { id: "lautech", name: "Ladoke Akintola University", state: "Oyo", abbr: "LAUTECH" },
  { id: "futa", name: "Federal University of Technology Akure", state: "Ondo", abbr: "FUTA" },
  { id: "covenant", name: "Covenant University", state: "Ogun", abbr: "CU" },
  { id: "babcock", name: "Babcock University", state: "Ogun", abbr: "BU" },
  { id: "unizik", name: "Nnamdi Azikiwe University", state: "Anambra", abbr: "UNIZIK" },
  { id: "futo", name: "Federal University of Technology Owerri", state: "Imo", abbr: "FUTO" },
  { id: "unical", name: "University of Calabar", state: "Cross River", abbr: "UNICAL" },
  { id: "uniport", name: "University of Port Harcourt", state: "Rivers", abbr: "UNIPORT" },
  { id: "biu", name: "Benson Idahosa University", state: "Edo", abbr: "BIU" },
  { id: "eksu", name: "Ekiti State University", state: "Ekiti", abbr: "EKSU" },
  { id: "tasued", name: "Tai Solarin University", state: "Ogun", abbr: "TASUED" },
  { id: "run", name: "Redeemer's University", state: "Osun", abbr: "RUN" },
  { id: "aau", name: "Ambrose Alli University", state: "Edo", abbr: "AAU" },
  { id: "funai", name: "Federal University Ndufu-Alike Ikwo", state: "Ebonyi", abbr: "FUNAI" },
] as const;

export const PRODUCT_CATEGORIES = [
  // Digital Products
  "Notes & PDFs",
  "Tutorials",
  "Templates",
  "Mini-Courses",
  "Study Guides",
  "Past Questions",
  "Project Materials",
  "Design Assets",
  "E-Books",
  "Software & Tools",
  // Physical Products
  "Wears & Clothing",
  "Skincare & Beauty",
  "Footwear",
  "Accessories",
  "Gadgets & Electronics",
  "Food & Snacks",
  "Handmade Crafts",
  "Art & Prints",
  "Event Tickets",
  "Services",
] as const;

export const COMMUNITY_TYPES = [
  "Study Group",
  "Course Community",
  "Skill Hub",
  "Campus Life",
  "Career Network",
  "Buy & Sell",
  "Hostel & Accommodation",
  "Event & Entertainment",
] as const;

export const MOCK_PAYMENT_STATUS = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
} as const;
