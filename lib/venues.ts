// ── Venue Database ────────────────────────────────────────────────────────────
// Curated list of notable venues worldwide for artist profile.
// Each venue has id, name, city, state, country, capacity range, and type.

export interface Venue {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  capacity: string;
  type: "club" | "theater" | "arena" | "festival" | "stadium";
  knownFor?: string[];
}

export const VENUES: Venue[] = [
  // NEW YORK
  { id: "ny-msg", name: "Madison Square Garden", city: "New York", state: "NY", country: "US", capacity: "20,000", type: "arena" },
  { id: "ny-bk-steel", name: "Brooklyn Steel", city: "Brooklyn", state: "NY", country: "US", capacity: "1,800", type: "club" },
  { id: "ny- bowery", name: "Bowery Ballroom", city: "New York", state: "NY", country: "US", capacity: "575", type: "club" },
  { id: "ny-webster", name: "Webster Hall", city: "New York", state: "NY", country: "US", capacity: "1,500", type: "club" },
  { id: "ny-radio-city", name: "Radio City Music Hall", city: "New York", state: "NY", country: "US", capacity: "6,000", type: "theater" },
  { id: "ny-barclays", name: "Barclays Center", city: "Brooklyn", state: "NY", country: "US", capacity: "19,000", type: "arena" },
  { id: "ny-apollo", name: "Apollo Theater", city: "New York", state: "NY", country: "US", capacity: "1,500", type: "theater", knownFor: ["Historic", "Amateur Night"] },

  // LOS ANGELES
  { id: "la-greek", name: "Greek Theatre", city: "Los Angeles", state: "CA", country: "US", capacity: "5,900", type: "theater" },
  { id: "la-hollywood-bowl", name: "Hollywood Bowl", city: "Los Angeles", state: "CA", country: "US", capacity: "17,500", type: "theater" },
  { id: "la-staples", name: "Crypto.com Arena", city: "Los Angeles", state: "CA", country: "US", capacity: "20,000", type: "arena" },
  { id: "la-troubadour", name: "The Troubadour", city: "West Hollywood", state: "CA", country: "US", capacity: "500", type: "club" },
  { id: "la-roxy", name: "The Roxy Theatre", city: "West Hollywood", state: "CA", country: "US", capacity: "500", type: "club" },
  { id: "la-whisky", name: "Whisky a Go Go", city: "West Hollywood", state: "CA", country: "US", capacity: "500", type: "club", knownFor: ["Historic Rock Venue"] },
  { id: "la-hollywood-palladium", name: "Hollywood Palladium", city: "Los Angeles", state: "CA", country: "US", capacity: "4,000", type: "theater" },

  // CHICAGO
  { id: "chi-metro", name: "Metro", city: "Chicago", state: "IL", country: "US", capacity: "1,100", type: "club" },
  { id: "chi-house-of-blues", name: "House of Blues Chicago", city: "Chicago", state: "IL", country: "US", capacity: "1,300", type: "club" },
  { id: "chi-ari", name: "Aragon Ballroom", city: "Chicago", state: "IL", country: "US", capacity: "5,000", type: "theater" },
  { id: "chi-united-center", name: "United Center", city: "Chicago", state: "IL", country: "US", capacity: "23,500", type: "arena" },
  { id: "chi-riot-fest", name: "Riot Fest", city: "Chicago", state: "IL", country: "US", capacity: "40,000", type: "festival" },

  // NASHVILLE
  { id: "nv-ryman", name: "Ryman Auditorium", city: "Nashville", state: "TN", country: "US", capacity: "2,362", type: "theater", knownFor: ["Historic", "Grand Ole Opry"] },
  { id: "nv-budlight", name: "Ascend Amphitheater", city: "Nashville", state: "TN", country: "US", capacity: "6,800", type: "theater" },
  { id: "nv-bridgestone", name: "Bridgestone Arena", city: "Nashville", state: "TN", country: "US", capacity: "20,000", type: "arena" },
  { id: "nv-bluebird", name: "Bluebird Cafe", city: "Nashville", state: "TN", country: "US", capacity: "90", type: "club", knownFor: ["Songwriter Showcases"] },

  // AUSTIN
  { id: "atx-sxsw", name: "SXSW", city: "Austin", state: "TX", country: "US", capacity: "Varies", type: "festival", knownFor: ["Music Tech Film Conference"] },
  { id: "atx-acl", name: "Austin City Limits", city: "Austin", state: "TX", country: "US", capacity: "75,000", type: "festival" },
  { id: "atx-moody", name: "Moody Center", city: "Austin", state: "TX", country: "US", capacity: "15,000", type: "arena" },
  { id: "atx-stubbs", name: "Stubb's Bar-B-Q", city: "Austin", state: "TX", country: "US", capacity: "2,000", type: "club" },

  // ATLANTA
  { id: "atl-tabernacle", name: "Tabernacle", city: "Atlanta", state: "GA", country: "US", capacity: "2,600", type: "theater" },
  { id: "atl-state-farm", name: "State Farm Arena", city: "Atlanta", state: "GA", country: "US", capacity: "21,000", type: "arena" },
  { id: "atl-masq", name: "The Masquerade", city: "Atlanta", state: "GA", country: "US", capacity: "1,000", type: "club" },
  { id: "atl-ravine", name: "Ravine Club at Piedmont Park", city: "Atlanta", state: "GA", country: "US", capacity: "Varies", type: "festival" },

  // MIAMI
  { id: "mia-fll", name: "III Points Festival", city: "Miami", state: "FL", country: "US", capacity: "30,000", type: "festival" },
  { id: "mia-filmore", name: "The Fillmore Miami Beach", city: "Miami Beach", state: "FL", country: "US", capacity: "2,800", type: "theater" },
  { id: "mia-bayfront", name: "Bayfront Park Amphitheater", city: "Miami", state: "FL", country: "US", capacity: "10,000", type: "theater" },

  // SAN FRANCISCO
  { id: "sf-fillmore", name: "The Fillmore", city: "San Francisco", state: "CA", country: "US", capacity: "1,200", type: "club", knownFor: ["Historic Rock Venue"] },
  { id: "sf-warfield", name: "The Warfield", city: "San Francisco", state: "CA", country: "US", capacity: "2,300", type: "theater" },
  { id: "sf-outside-lands", name: "Outside Lands", city: "San Francisco", state: "CA", country: "US", capacity: "75,000", type: "festival" },
  { id: "sf-chase", name: "Chase Center", city: "San Francisco", state: "CA", country: "US", capacity: "18,000", type: "arena" },

  // SEATTLE
  { id: "sea-paramount", name: "Paramount Theatre", city: "Seattle", state: "WA", country: "US", capacity: "2,800", type: "theater" },
  { id: "sea-showbox", name: "Showbox SoDo", city: "Seattle", state: "WA", country: "US", capacity: "1,500", type: "club" },
  { id: "sea-neumos", name: "Neumos", city: "Seattle", state: "WA", country: "US", capacity: "800", type: "club" },
  { id: "sea-climate-pledge", name: "Climate Pledge Arena", city: "Seattle", state: "WA", country: "US", capacity: "17,000", type: "arena" },

  // PORTLAND
  { id: "pdx-crystal", name: "Crystal Ballroom", city: "Portland", state: "OR", country: "US", capacity: "1,500", type: "club", knownFor: ["Floating Dance Floor"] },
  { id: "pdx-mcmenamins", name: "McMenamins Crystal Hotel", city: "Portland", state: "OR", country: "US", capacity: "200", type: "club" },

  // DENVER
  { id: "den-red-rocks", name: "Red Rocks Amphitheatre", city: "Morrison", state: "CO", country: "US", capacity: "9,500", type: "theater", knownFor: ["Natural Acoustics", "Iconic Venue"] },
  { id: "den-mission", name: "Mission Ballroom", city: "Denver", state: "CO", country: "US", capacity: "3,900", type: "theater" },
  { id: "den-ball-arena", name: "Ball Arena", city: "Denver", state: "CO", country: "US", capacity: "20,000", type: "arena" },

  // NEW ORLEANS
  { id: "no-jazzfest", name: "New Orleans Jazz & Heritage Festival", city: "New Orleans", state: "LA", country: "US", capacity: "400,000", type: "festival" },
  { id: "no-tipitinas", name: "Tipitina's", city: "New Orleans", state: "LA", country: "US", capacity: "800", type: "club" },
  { id: "no-house-of-blues", name: "House of Blues New Orleans", city: "New Orleans", state: "LA", country: "US", capacity: "1,000", type: "club" },

  // LAS VEGAS
  { id: "lv-t-mobile", name: "T-Mobile Arena", city: "Las Vegas", state: "NV", country: "US", capacity: "20,000", type: "arena" },
  { id: "lv-caesars", name: "Caesars Palace Colosseum", city: "Las Vegas", state: "NV", country: "US", capacity: "4,300", type: "theater" },
  { id: "lv-encore", name: "Encore Theater", city: "Las Vegas", state: "NV", country: "US", capacity: "1,480", type: "theater" },
  { id: "lv-life-is-beautiful", name: "Life Is Beautiful", city: "Las Vegas", state: "NV", country: "US", capacity: "100,000", type: "festival" },

  // US FESTIVALS
  { id: "fest-coachella", name: "Coachella Valley Music and Arts Festival", city: "Indio", state: "CA", country: "US", capacity: "125,000", type: "festival" },
  { id: "fest-lollapalooza", name: "Lollapalooza", city: "Chicago", state: "IL", country: "US", capacity: "100,000", type: "festival" },
  { id: "fest-governors-ball", name: "Governors Ball", city: "New York", state: "NY", country: "US", capacity: "50,000", type: "festival" },
  { id: "fest-bonnaroo", name: "Bonnaroo Music & Arts Festival", city: "Manchester", state: "TN", country: "US", capacity: "80,000", type: "festival" },
  { id: "fest-firefly", name: "Firefly Music Festival", city: "Dover", state: "DE", country: "US", capacity: "90,000", type: "festival" },
  { id: "fest-electric-daisy", name: "Electric Daisy Carnival (EDC)", city: "Las Vegas", state: "NV", country: "US", capacity: "150,000", type: "festival" },
  { id: "fest-ultra", name: "Ultra Music Festival", city: "Miami", state: "FL", country: "US", capacity: "60,000", type: "festival", knownFor: ["Electronic Music"] },
  { id: "fest-rolling-loud", name: "Rolling Loud", city: "Miami", state: "FL", country: "US", capacity: "75,000", type: "festival", knownFor: ["Hip-Hop"] },

  // UK / EUROPE
  { id: "uk-o2", name: "The O2 Arena", city: "London", state: "", country: "UK", capacity: "20,000", type: "arena" },
  { id: "uk-brixton", name: "O2 Academy Brixton", city: "London", state: "", country: "UK", capacity: "4,900", type: "theater" },
  { id: "uk-glastonbury", name: "Glastonbury Festival", city: "Pilton", state: "", country: "UK", capacity: "200,000", type: "festival" },
  { id: "uk-reading", name: "Reading and Leeds Festivals", city: "Reading", state: "", country: "UK", capacity: "100,000", type: "festival" },
  { id: "fr-paris-accor", name: "Accor Arena", city: "Paris", state: "", country: "FR", capacity: "20,000", type: "arena" },
  { id: "fr-olympia", name: "L'Olympia", city: "Paris", state: "", country: "FR", capacity: "2,000", type: "theater", knownFor: ["Historic Paris Venue"] },
  { id: "nl-amsterdam-ziggo", name: "Ziggo Dome", city: "Amsterdam", state: "", country: "NL", capacity: "17,000", type: "arena" },
  { id: "de-berlin-waldbuhne", name: "Waldbühne Berlin", city: "Berlin", state: "", country: "DE", capacity: "22,000", type: "theater" },
  { id: "de-berghain", name: "Berghain", city: "Berlin", state: "", country: "DE", capacity: "1,500", type: "club", knownFor: ["Techno", "Kunsthalle"] },
  { id: "es-barcelona-sonar", name: "Sónar", city: "Barcelona", state: "", country: "ES", capacity: "40,000", type: "festival" },
  { id: "es-primavera", name: "Primavera Sound", city: "Barcelona", state: "", country: "ES", capacity: "60,000", type: "festival" },
  { id: "it-milan-mediolanum", name: "Mediolanum Forum", city: "Milan", state: "", country: "IT", capacity: "12,000", type: "arena" },

  // CANADA
  { id: "ca-toronto-scotiabank", name: "Scotiabank Arena", city: "Toronto", state: "ON", country: "CA", capacity: "19,800", type: "arena" },
  { id: "ca-toronto-danforth", name: "Danforth Music Hall", city: "Toronto", state: "ON", country: "CA", capacity: "1,500", type: "theater" },
  { id: "ca-montreal-bell", name: "Bell Centre", city: "Montreal", state: "QC", country: "CA", capacity: "21,000", type: "arena" },
  { id: "ca-vancouver-rogers", name: "Rogers Arena", city: "Vancouver", state: "BC", country: "CA", capacity: "18,000", type: "arena" },

  // AUSTRALIA / ASIA
  { id: "au-syd-opera", name: "Sydney Opera House", city: "Sydney", state: "NSW", country: "AU", capacity: "2,679", type: "theater", knownFor: ["UNESCO World Heritage"] },
  { id: "au-syd-qudos", name: "Qudos Bank Arena", city: "Sydney", state: "NSW", country: "AU", capacity: "18,000", type: "arena" },
  { id: "au-melbourne-rod-laver", name: "Rod Laver Arena", city: "Melbourne", state: "VIC", country: "AU", capacity: "15,000", type: "arena" },
  { id: "jp-tokyo-budokan", name: "Nippon Budokan", city: "Tokyo", state: "", country: "JP", capacity: "14,000", type: "arena", knownFor: ["Historic Tokyo Venue"] },
  { id: "jp-tokyo-dome", name: "Tokyo Dome", city: "Tokyo", state: "", country: "JP", capacity: "55,000", type: "stadium" },
  { id: "kr-seoul-olympic", name: "Olympic Park Gymnastics Arena", city: "Seoul", state: "", country: "KR", capacity: "15,000", type: "arena" },
  { id: "sg-singapore-indoor", name: "Singapore Indoor Stadium", city: "Singapore", state: "", country: "SG", capacity: "12,000", type: "arena" },
];

export function getVenuesByCity(city: string): Venue[] {
  return VENUES.filter((v) => v.city.toLowerCase().includes(city.toLowerCase()));
}

export function searchVenues(query: string): Venue[] {
  const q = query.toLowerCase();
  return VENUES.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.state.toLowerCase().includes(q) ||
      v.country.toLowerCase().includes(q)
  );
}

export function getVenue(id: string): Venue | undefined {
  return VENUES.find((v) => v.id === id);
}
