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
 * Collection ID: chatconversations
 * Interface for ChatConversations
 */
export interface ChatConversations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  participantOneId?: string;
  /** @wixFieldType text */
  participantTwoId?: string;
  /** @wixFieldType text */
  matchId?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
  /** @wixFieldType datetime */
  lastMessageAt?: Date | string;
  /** @wixFieldType boolean */
  participantOneContactShared?: boolean;
  /** @wixFieldType boolean */
  participantTwoContactShared?: boolean;
}


/**
 * Collection ID: chatmessages
 * Interface for ChatMessages
 */
export interface ChatMessages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  threadId?: string;
  /** @wixFieldType text */
  authorId?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType text */
  messageType?: string;
  /** @wixFieldType boolean */
  isRead?: boolean;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
}


/**
 * Collection ID: contactexchangerequests
 * Interface for ContactExchangeRequests
 */
export interface ContactExchangeRequests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  conversationId?: string;
  /** @wixFieldType text */
  requesterId?: string;
  /** @wixFieldType text */
  recipientId?: string;
  /** @wixFieldType text */
  contactTypeRequested?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
  /** @wixFieldType datetime */
  respondedAt?: Date | string;
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


/**
 * Collection ID: chatconversations
 * Interface for ChatConversations
 */
export interface ChatConversations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  participantOneId?: string;
  /** @wixFieldType text */
  participantTwoId?: string;
  /** @wixFieldType text */
  matchId?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
  /** @wixFieldType datetime */
  lastMessageAt?: Date | string;
  /** @wixFieldType boolean */
  participantOneContactShared?: boolean;
  /** @wixFieldType boolean */
  participantTwoContactShared?: boolean;
}


/**
 * Collection ID: chatmessages
 * Interface for ChatMessages
 */
export interface ChatMessages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  threadId?: string;
  /** @wixFieldType text */
  authorId?: string;
  /** @wixFieldType text */
  content?: string;
  /** @wixFieldType text */
  messageType?: string;
  /** @wixFieldType boolean */
  isRead?: boolean;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
}


/**
 * Collection ID: contactexchangerequests
 * Interface for ContactExchangeRequests
 */
export interface ContactExchangeRequests {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  conversationId?: string;
  /** @wixFieldType text */
  requesterId?: string;
  /** @wixFieldType text */
  recipientId?: string;
  /** @wixFieldType text */
  contactTypeRequested?: string;
  /** @wixFieldType text */
  status?: string;
  /** @wixFieldType datetime */
  createdAt?: Date | string;
  /** @wixFieldType datetime */
  respondedAt?: Date | string;
}
