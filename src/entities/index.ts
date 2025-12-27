/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: aiskillmatches
 * Interface for AISkillMatches
 */
export interface AISkillMatches {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  matchTitle?: string;
  /** @wixFieldType text */
  userOneDisplayName?: string;
  /** @wixFieldType image */
  userOneProfilePicture?: string;
  /** @wixFieldType text */
  userTwoDisplayName?: string;
  /** @wixFieldType image */
  userTwoProfilePicture?: string;
  /** @wixFieldType text */
  offeredSkillName?: string;
  /** @wixFieldType text */
  requestedSkillName?: string;
  /** @wixFieldType number */
  matchConfidenceScore?: number;
  /** @wixFieldType text */
  matchExplanation?: string;
  /** @wixFieldType datetime */
  matchGenerationDate?: Date | string;
}


/**
 * Collection ID: contactsubmissions
 * Interface for ContactSubmissions
 */
export interface ContactSubmissions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  senderName?: string;
  /** @wixFieldType text */
  senderEmail?: string;
  /** @wixFieldType text */
  subject?: string;
  /** @wixFieldType text */
  messageContent?: string;
  /** @wixFieldType datetime */
  submissionDateTime?: Date | string;
  /** @wixFieldType text */
  status?: string;
}


/**
 * Collection ID: locations
 * Interface for Locations
 */
export interface Locations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  locationName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType number */
  latitude?: number;
  /** @wixFieldType number */
  longitude?: number;
  /** @wixFieldType text */
  city?: string;
  /** @wixFieldType text */
  stateProvince?: string;
  /** @wixFieldType text */
  country?: string;
  /** @wixFieldType image */
  locationImage?: string;
}


/**
 * Collection ID: skilllistings
 * Interface for SkillListings
 */
export interface SkillListings {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  skillTitle?: string;
  /** @wixFieldType text */
  listingType?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
  /** @wixFieldType text */
  preferredAvailability?: string;
  /** @wixFieldType text */
  exchangeFormat?: string;
}


/**
 * Collection ID: skills
 * Interface for Skills
 */
export interface Skills {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  skillName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  difficultyLevel?: string;
  /** @wixFieldType image */
  skillImage?: string;
  /** @wixFieldType text */
  keywords?: string;
}


/**
 * Collection ID: userprofiles
 * Interface for UserProfiles
 */
export interface UserProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userName?: string;
  /** @wixFieldType image */
  profilePicture?: string;
  /** @wixFieldType text */
  bio?: string;
  /** @wixFieldType text */
  city?: string;
  /** @wixFieldType text */
  region?: string;
  /** @wixFieldType text */
  offeredSkillsSummary?: string;
  /** @wixFieldType text */
  requestedSkillsSummary?: string;
  /** @wixFieldType boolean */
  isAvailable?: boolean;
}
