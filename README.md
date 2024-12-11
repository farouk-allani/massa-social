# Decentralized Social Network on Massa Blockchain

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Features](#features)
   - [1. User Management](#1-user-management)
   - [2. Page Management](#2-page-management)
   - [3. Friends Management](#3-friends-management)
   - [4. Feed Management](#4-feed-management)
   - [5. Post Management](#5-post-management)
   - [6. Likes, Reposts, and Comments](#6-likes-reposts-and-comments)
   - [7. Moderation](#7-moderation)
   - [8. Privacy Settings](#8-privacy-settings)
   - [9. Profile Details](#9-profile-details)
4. [Data Structures](#data-structures)
   - [1. User](#1-user)
   - [2. Page](#2-page)
   - [3. Post](#3-post)
   - [4. Follow](#4-follow)
   - [5. Like](#5-like)
   - [6. Repost](#6-repost)
   - [7. Comment](#7-comment)
   - [8. Moderator](#8-moderator)
5. [Smart Contract Interactions](#smart-contract-interactions)
   - [1. User Functions](#1-user-functions)
   - [2. Page Functions](#2-page-functions)
   - [3. Friend Functions](#3-friend-functions)
   - [4. Feed Functions](#4-feed-functions)
   - [5. Post Functions](#5-post-functions)
   - [6. Interaction Functions](#6-interaction-functions)
   - [7. Moderation Functions](#7-moderation-functions)
6. [Security Considerations](#security-considerations)
7. [Best Practices](#best-practices)
8. [Conclusion](#conclusion)

---

## Introduction

This document provides a comprehensive overview of the decentralized social network being developed on the Massa blockchain. It outlines the project's features, detailed data structures, and specifications for smart contract interactions using AssemblyScript. This documentation is intended to guide developers, particularly those working on smart contracts, to understand and implement the necessary functionalities effectively.

## Project Overview

The decentralized social network on the Massa blockchain aims to provide users with a platform to create and manage pages, follow other pages, add friends via wallet addresses, and engage with content through posts, likes, reposts, and comments. The platform emphasizes privacy and moderation, offering both public and private pages, with mechanisms for approval-based follows and moderator controls.

**Key Objectives:**

- **Decentralization:** Leveraging Massa's blockchain capabilities to ensure data integrity and user control.
- **User Empowerment:** Allowing users to create and manage their own pages and content.
- **Engagement:** Facilitating interactions through likes, reposts, and comments.
- **Privacy and Moderation:** Providing options for public and private pages with robust moderation tools.
- **Scalability:** Implementing efficient data fetching and pagination for feeds and friend lists.

## Features

### 1. User Management

- **Registration & Authentication:**
  - Users register and authenticate using their wallet addresses.
  - Profile setup includes name, avatar, country, city, and social profiles (e.g., X, Telegram).

- **Profile Information:**
  - Users can view and edit their profiles.
  - Display metrics such as the number of friends and pages followed.

### 2. Page Management

- **Create Pages:**
  - Users can create new pages by providing attributes like name, description, category, image, privacy setting (public/private), and optional moderators.

- **Follow Pages:**
  - Users can follow pages. For private pages, follows require approval from admins or moderators.

- **Page Types:**
  - **Public Pages:** Open for any user to follow without approval.
  - **Private Pages:** Require approval for new followers.

### 3. Friends Management

- **Add Friends:**
  - Users can add friends by entering their wallet addresses.

- **Friends List:**
  - Users can view their friends list, which fetches friends in batches of 10 with a "Load More" button for pagination.

### 4. Feed Management

- **Personal Feeds:**
  - Users see their own posts on their profile pages.

- **Combined Feeds:**
  - On the main feeds page, users see posts from themselves, pages they follow, and their friends.

- **Pagination:**
  - Feeds are fetched in batches of 10 posts. Users can load more posts incrementally.

### 5. Post Management

- **Creating Posts:**
  - Users can create posts containing text and optionally an image.

- **Post Attributes:**
  - Each post includes metadata such as the author, timestamp, and associated page (if any).

### 6. Likes, Reposts, and Comments

- **Likes:**
  - Users can like posts.

- **Reposts:**
  - Users can repost existing posts. Reposted posts display information about the original author.

- **Comments:**
  - Users can comment on posts, fostering discussions.

### 7. Moderation

- **Moderators:**
  - Page creators can assign moderators by their wallet addresses during page creation.
  - Moderators have permissions to delete posts and remove users from the page.

### 8. Privacy Settings

- **Public vs. Private Pages:**
  - **Public Pages:** Open to all users for following and content viewing.
  - **Private Pages:** Require approval for new followers. Content is accessible only to approved followers.

### 9. Profile Details

- **User Profiles:**
  - Display user's name, avatar, country, city.
  - Show metrics like the number of friends, pages followed.
  - List of pages the user follows.
  - Links to social profiles (e.g., X, Telegram).

---

## Data Structures

The following data structures are essential for the smart contracts on the Massa blockchain. Each structure is designed to encapsulate the necessary information for users, pages, posts, and interactions within the platform. The data structures are defined using AssemblyScript, which resembles TypeScript.

### 1. User

```typescript
// src/contracts/models/User.ts

export class SocialProfiles {
  x: string | null;       // X (formerly Twitter) handle or URL
  telegram: string | null;// Telegram handle or URL

  constructor(x: string | null = null, telegram: string | null = null) {
    this.x = x;
    this.telegram = telegram;
  }
}

export class User {
  walletAddress: string;          // Unique identifier (e.g., "0xABC123...")
  name: string;                   // User's display name
  avatar: string | null;          // URL or IPFS hash of the avatar image
  country: string;                // User's country
  city: string;                   // User's city
  friends: string[];              // List of friends' wallet addresses
  followedPages: string[];        // List of followed pages' IDs
  socialProfiles: SocialProfiles; // Links to social profiles

  constructor(
    walletAddress: string,
    name: string,
    country: string,
    city: string,
    avatar: string | null = null,
    socialProfiles: SocialProfiles = new SocialProfiles()
  ) {
    this.walletAddress = walletAddress;
    this.name = name;
    this.avatar = avatar;
    this.country = country;
    this.city = city;
    this.friends = [];
    this.followedPages = [];
    this.socialProfiles = socialProfiles;
  }
}
```

**Notes:**

- `walletAddress` serves as the primary key for users.
- `avatar` base64.
- `friends` and `followedPages` reference other users and pages by their wallet addresses and page IDs, respectively.

### 2. Page

```typescript
// src/contracts/models/Page.ts

export enum Category {
  Technology = "Technology",
  Art = "Art",
  Gaming = "Gaming",
  Music = "Music",
  Education = "Education",
  Business = "Business",
  Health = "Health",
  Lifestyle = "Lifestyle",
  Other = "Other",
}

export enum PrivacySetting {
  Public = "Public",
  Private = "Private",
}

export class Page {
  pageId: string;                // Unique identifier for the page
  name: string;                  // Page name
  description: string;           // Page description
  category: Category;            // Page category
  image: string | null;          // URL or IPFS hash of the page image
  privacy: PrivacySetting;       // Public or Private
  owner: string;                 // Wallet address of the page creator
  moderators: string[];          // List of moderators' wallet addresses
  followers: string[];           // List of followers' wallet addresses

  constructor(
    pageId: string,
    name: string,
    description: string,
    category: Category,
    owner: string,
    privacy: PrivacySetting,
    image: string | null = null,
    moderators: string[] = []
  ) {
    this.pageId = pageId;
    this.name = name;
    this.description = description;
    this.category = category;
    this.owner = owner;
    this.privacy = privacy;
    this.image = image;
    this.moderators = moderators;
    this.followers = [];
  }
}
```

**Notes:**

- `pageId` uniquely identifies each page, which can be generated using a combination of creator's wallet address and a timestamp or a unique counter.
- `moderators` have elevated permissions on the page, such as deleting posts or removing users.

### 3. Post

```typescript
// src/contracts/models/Post.ts

export class Comment {
  commentId: string;  // Unique identifier for the comment
  author: string;     // Wallet address of the commenter
  content: string;    // Text content of the comment
  timestamp: u64;     // Unix timestamp of comment creation

  constructor(commentId: string, author: string, content: string, timestamp: u64) {
    this.commentId = commentId;
    this.author = author;
    this.content = content;
    this.timestamp = timestamp;
  }
}

export class Post {
  postId: string;               // Unique identifier for the post
  author: string;               // Wallet address of the author
  pageId: string | null;        // Associated page ID if posted on a page
  content: string;              // Text content of the post
  image: string | null;         // URL or IPFS hash of the image
  timestamp: u64;               // Unix timestamp of post creation
  likes: string[];              // List of wallet addresses who liked the post
  reposts: string[];            // List of wallet addresses who reposted the post
  comments: Comment[];          // List of comments on the post
  originalAuthor: string | null; // If reposted, the original author's wallet address

  constructor(
    postId: string,
    author: string,
    content: string,
    timestamp: u64,
    pageId: string | null = null,
    image: string | null = null,
    originalAuthor: string | null = null
  ) {
    this.postId = postId;
    this.author = author;
    this.content = content;
    this.timestamp = timestamp;
    this.pageId = pageId;
    this.image = image;
    this.likes = [];
    this.reposts = [];
    this.comments = [];
    this.originalAuthor = originalAuthor;
  }
}
```

**Notes:**

- `pageId` is optional; posts can be personal or associated with a page.
- Each post maintains its own list of likes, reposts, and comments for easy access and management.
- `originalAuthor` is used to reference the original author when a post is reposted.

### 4. Follow

```typescript
// src/contracts/models/Follow.ts

export class Follow {
  follower: string;   // Wallet address of the follower
  followed: string;   // Wallet address of the user being followed or page ID
  timestamp: u64;     // Unix timestamp of when the follow occurred
  approved: bool;     // Approval status for private pages

  constructor(follower: string, followed: string, timestamp: u64, approved: bool) {
    this.follower = follower;
    this.followed = followed;
    this.timestamp = timestamp;
    this.approved = approved;
  }
}
```

**Notes:**

- For public pages, `approved` is always `true`.
- For private pages, `approved` is set by the page owner or moderators.

### 5. Like

```typescript
// src/contracts/models/Like.ts

export class Like {
  user: string;      // Wallet address of the user who liked the post
  postId: string;    // ID of the liked post
  timestamp: u64;    // Unix timestamp of the like action

  constructor(user: string, postId: string, timestamp: u64) {
    this.user = user;
    this.postId = postId;
    this.timestamp = timestamp;
  }
}
```

**Notes:**

- Facilitates tracking of which users have liked a particular post.

### 6. Repost

```typescript
// src/contracts/models/Repost.ts

export class Repost {
  user: string;             // Wallet address of the user who reposted
  originalPostId: string;   // ID of the original post
  newPostId: string;        // ID of the reposted post
  timestamp: u64;           // Unix timestamp of the repost action

  constructor(user: string, originalPostId: string, newPostId: string, timestamp: u64) {
    this.user = user;
    this.originalPostId = originalPostId;
    this.newPostId = newPostId;
    this.timestamp = timestamp;
  }
}
```

**Notes:**

- Maintains a link between the original post and the reposted version.

### 7. Comment

```typescript
// src/contracts/models/Comment.ts

export class Comment {
  commentId: string;   // Unique identifier for the comment
  author: string;      // Wallet address of the commenter
  postId: string;      // ID of the post being commented on
  content: string;     // Text content of the comment
  timestamp: u64;      // Unix timestamp of the comment

  constructor(commentId: string, author: string, postId: string, content: string, timestamp: u64) {
    this.commentId = commentId;
    this.author = author;
    this.postId = postId;
    this.content = content;
    this.timestamp = timestamp;
  }
}
```

**Notes:**

- Enables users to engage in discussions on posts.

### 8. Moderator

Moderators are integrated within the `Page` structure and do not require a separate data structure.

**Permissions:**

- Delete posts within the page.
- Remove users from the page.

**Implementation:**

- Managed through the `moderators` array in the `Page` class.

---

## Smart Contract Interactions

The smart contracts will handle all backend logic, data storage, and interactions on the Massa blockchain. Below are the key functions and their specifications, categorized by their purpose. The smart contracts are written in AssemblyScript, which resembles TypeScript, to align with Massa's development environment.

### 1. User Functions

#### a. Register User

```typescript
// src/contracts/UserContract.ts

import { SmartContract, Context, storage, ContractPromise } from "massa-sc-std";
import { User, SocialProfiles } from "./models/User";

export class UserContract extends SmartContract {
  constructor() {
    super();
  }

  // Registers a new user
  registerUser(
    walletAddress: string,
    name: string,
    avatar: string | null,
    country: string,
    city: string,
    socialProfiles: SocialProfiles
  ): void {
    // Check if user already exists
    if (storage.exists(walletAddress)) {
      Context.revert("User already exists.");
    }

    // Create and store new user
    const newUser = new User(walletAddress, name, country, city, avatar, socialProfiles);
    storage.set(walletAddress, newUser);
  }

  // Updates an existing user's profile
  updateUserProfile(
    walletAddress: string,
    name: string | null,
    avatar: string | null,
    country: string | null,
    city: string | null,
    socialProfiles: SocialProfiles | null
  ): void {
    // Ensure user exists
    if (!storage.exists(walletAddress)) {
      Context.revert("User not found.");
    }

    // Ensure the caller is the user
    const caller = Context.caller();
    if (caller !== walletAddress) {
      Context.revert("Unauthorized action.");
    }

    // Retrieve existing user
    let user = storage.get<User>(walletAddress)!;

    // Update fields if provided
    if (name !== null) user.name = name;
    if (avatar !== null) user.avatar = avatar;
    if (country !== null) user.country = country;
    if (city !== null) user.city = city;
    if (socialProfiles !== null) user.socialProfiles = socialProfiles;

    // Store updated user
    storage.set(walletAddress, user);
  }

  // Retrieves a user's profile
  getUser(walletAddress: string): User | null {
    if (!storage.exists(walletAddress)) {
      return null;
    }
    return storage.get<User>(walletAddress)!;
  }
}
```

**Description:**

- **registerUser:** Registers a new user with the provided details. It ensures that the `walletAddress` is unique before creating a new `User` instance and storing it.
  
- **updateUserProfile:** Allows users to update their profile information. It verifies that the caller is the user themselves before updating any fields.
  
- **getUser:** Retrieves a user's profile information based on their wallet address.

**Notes:**

- **Access Control:** Only the user can update their profile.
- **Error Handling:** Uses `Context.revert` to handle errors, providing clear messages for failure scenarios.

#### b. Additional User Functions (Optional)

Depending on the project's requirements, additional functions such as retrieving a list of friends, managing social profiles, etc., can be added.

### 2. Page Functions

#### a. Create Page

```typescript
// src/contracts/PageContract.ts

import { SmartContract, Context, storage, ContractPromise } from "massa-sc-std";
import { Page, Category, PrivacySetting } from "./models/Page";

export class PageContract extends SmartContract {
  constructor() {
    super();
  }

  // Creates a new page
  createPage(
    pageId: string,
    name: string,
    description: string,
    category: Category,
    image: string | null,
    privacy: PrivacySetting,
    moderators: string[]
  ): void {
    // Check if page already exists
    if (storage.exists(pageId)) {
      Context.revert("Page ID already exists.");
    }

    // Ensure the caller is creating the page
    const owner = Context.caller();

    // Validate category
    if (!Object.values(Category).includes(category)) {
      Context.revert("Invalid category.");
    }

    // Validate moderators (optional: ensure they are registered users)
    moderators.forEach((mod) => {
      if (!storage.exists(mod)) {
        Context.revert(`Moderator ${mod} not found.`);
      }
    });

    // Create and store new page
    const newPage = new Page(pageId, name, description, category, owner, privacy, image, moderators);
    storage.set(pageId, newPage);
  }

  // Updates page details
  updatePage(
    pageId: string,
    name: string | null,
    description: string | null,
    category: Category | null,
    image: string | null,
    privacy: PrivacySetting | null,
    moderators: string[] | null
  ): void {
    // Ensure page exists
    if (!storage.exists(pageId)) {
      Context.revert("Page not found.");
    }

    const caller = Context.caller();
    const page = storage.get<Page>(pageId)!;

    // Only owner or moderators can update the page
    if (caller !== page.owner && !page.moderators.includes(caller)) {
      Context.revert("Unauthorized action.");
    }

    // Update fields if provided
    if (name !== null) page.name = name;
    if (description !== null) page.description = description;
    if (category !== null) {
      if (!Object.values(Category).includes(category)) {
        Context.revert("Invalid category.");
      }
      page.category = category;
    }
    if (image !== null) page.image = image;
    if (privacy !== null) page.privacy = privacy;
    if (moderators !== null) {
      // Validate new moderators
      moderators.forEach((mod) => {
        if (!storage.exists(mod)) {
          Context.revert(`Moderator ${mod} not found.`);
        }
      });
      page.moderators = moderators;
    }

    // Store updated page
    storage.set(pageId, page);
  }

  // Retrieves a page's details
  getPage(pageId: string): Page | null {
    if (!storage.exists(pageId)) {
      return null;
    }
    return storage.get<Page>(pageId)!;
  }

  // Follows a page
  followPage(follower: string, pageId: string): void {
    // Ensure page exists
    if (!storage.exists(pageId)) {
      Context.revert("Page not found.");
    }

    const page = storage.get<Page>(pageId)!;

    // Check if already following
    if (page.followers.includes(follower)) {
      Context.revert("Already following the page.");
    }

    // For private pages, set approved to false
    const approved = page.privacy === PrivacySetting.Public;

    // Add follower
    page.followers.push(follower);
    storage.set(pageId, page);

    // If private, additional logic can be implemented to handle approval
    if (!approved) {
      // Logic for approval can be handled via another function
      // For simplicity, we're setting it as not approved here
      // In practice, you might have a separate storage or status
      // Or emit an event for moderators to handle
    }
  }

  // Approves a follower for a private page
  approveFollower(pageId: string, follower: string): void {
    // Ensure page exists
    if (!storage.exists(pageId)) {
      Context.revert("Page not found.");
    }

    const page = storage.get<Page>(pageId)!;
    const caller = Context.caller();

    // Only owner or moderators can approve
    if (caller !== page.owner && !page.moderators.includes(caller)) {
      Context.revert("Unauthorized action.");
    }

    // Check if follower exists in followers list
    const index = page.followers.indexOf(follower);
    if (index === -1) {
      Context.revert("Follow request not found.");
    }

    // For simplicity, assuming all followers in the list are approved
    // Implementing approval logic would require additional structures
    // such as mapping of pending approvals
    // Here, we simply confirm the follower is part of the list
  }

  // Unfollows a page
  unfollowPage(follower: string, pageId: string): void {
    // Ensure page exists
    if (!storage.exists(pageId)) {
      Context.revert("Page not found.");
    }

    const page = storage.get<Page>(pageId)!;

    // Check if following
    const index = page.followers.indexOf(follower);
    if (index === -1) {
      Context.revert("Not following the page.");
    }

    // Remove follower
    page.followers.splice(index, 1);
    storage.set(pageId, page);
  }
}
```

**Description:**

- **createPage:** Creates a new page with the specified attributes. It ensures that the `pageId` is unique and validates the `category`. It also verifies that all moderators are registered users.
  
- **updatePage:** Updates page details. Only the page owner or assigned moderators can perform updates. It validates any provided fields before updating.
  
- **getPage:** Retrieves a page's details based on its `pageId`.
  
- **followPage:** Allows a user to follow a page. For public pages, the follow is automatically approved. For private pages, additional logic for approval is hinted but not fully implemented.
  
- **approveFollower:** Approves a user's follow request for a private page. Only the page owner or moderators can perform this action.
  
- **unfollowPage:** Allows a user to unfollow a page.

**Notes:**

- **Access Control:** Ensures that only authorized users can perform certain actions, such as updating page details or approving followers.
- **Error Handling:** Utilizes `Context.revert` to handle errors with descriptive messages.
- **Approval Logic:** For private pages, additional structures (e.g., pending approvals) might be necessary for full implementation.

#### b. Additional Page Functions (Optional)

Depending on project requirements, functions like retrieving followers, listing pages by category, etc., can be added.

### 3. Friend Functions

#### a. Add Friend

```typescript
// src/contracts/FriendContract.ts

import { SmartContract, Context, storage, ContractPromise } from "massa-sc-std";
import { User } from "./models/User";

export class FriendContract extends SmartContract {
  constructor() {
    super();
  }

  // Adds a mutual friendship between two users
  addFriend(user: string, friend: string): void {
    // Prevent adding self
    if (user === friend) {
      Context.revert("Cannot add self as friend.");
    }

    // Ensure both users exist
    if (!storage.exists(user) || !storage.exists(friend)) {
      Context.revert("One or both users not found.");
    }

    const userData = storage.get<User>(user)!;
    const friendData = storage.get<User>(friend)!;

    // Check if already friends
    if (userData.friends.includes(friend) || friendData.friends.includes(user)) {
      Context.revert("Already friends.");
    }

    // Add each other as friends
    userData.friends.push(friend);
    friendData.friends.push(user);

    storage.set(user, userData);
    storage.set(friend, friendData);
  }

  // Removes a mutual friendship between two users
  removeFriend(user: string, friend: string): void {
    // Ensure both users exist
    if (!storage.exists(user) || !storage.exists(friend)) {
      Context.revert("One or both users not found.");
    }

    const userData = storage.get<User>(user)!;
    const friendData = storage.get<User>(friend)!;

    // Check if they are friends
    const userIndex = userData.friends.indexOf(friend);
    const friendIndex = friendData.friends.indexOf(user);

    if (userIndex === -1 || friendIndex === -1) {
      Context.revert("Friendship does not exist.");
    }

    // Remove each other as friends
    userData.friends.splice(userIndex, 1);
    friendData.friends.splice(friendIndex, 1);

    storage.set(user, userData);
    storage.set(friend, friendData);
  }

  // Retrieves a user's friends list with pagination
  getFriends(user: string, offset: u64, limit: u64): string[] {
    if (!storage.exists(user)) {
      Context.revert("User not found.");
    }

    const userData = storage.get<User>(user)!;
    const friends = userData.friends.slice(offset, offset + limit);
    return friends;
  }
}
```

**Description:**

- **addFriend:** Establishes a mutual friendship between two users by adding each other's wallet addresses to their respective `friends` arrays. It ensures that users cannot add themselves or create duplicate friendships.
  
- **removeFriend:** Removes the mutual friendship between two users by deleting each other's wallet addresses from their `friends` arrays.
  
- **getFriends:** Retrieves a user's friends list with pagination support, fetching a specified number of friends starting from an offset.

**Notes:**

- **Access Control:** Ensures that only existing users can add or remove friends.
- **Pagination:** Facilitates fetching friends in batches of 10 using `offset` and `limit`.

### 4. Feed Functions

#### a. Fetch Feeds

```typescript
// src/contracts/FeedContract.ts

import { SmartContract, Context, storage, ContractPromise } from "massa-sc-std";
import { Post } from "./models/Post";
import { User } from "./models/User";
import { Page } from "./models/Page";

export class FeedContract extends SmartContract {
  constructor() {
    super();
  }

  // Retrieves a batch of posts for a user's feed
  fetchFeeds(user: string, offset: u64, limit: u64): Post[] {
    // Ensure user exists
    if (!storage.exists(user)) {
      Context.revert("User not found.");
    }

    const userData = storage.get<User>(user)!;
    const followedPages = userData.followedPages;
    const friends = userData.friends;

    let combinedPosts: Post[] = [];

    // Fetch user's own posts
    combinedPosts = combinedPosts.concat(this.getUserPosts(user));

    // Fetch posts from followed pages
    followedPages.forEach((pageId) => {
      combinedPosts = combinedPosts.concat(this.getPagePosts(pageId));
    });

    // Fetch posts from friends
    friends.forEach((friend) => {
      combinedPosts = combinedPosts.concat(this.getUserPosts(friend));
    });

    // Sort posts by timestamp descending
    combinedPosts.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    const paginatedPosts = combinedPosts.slice(offset, offset + limit);
    return paginatedPosts;
  }

  // Helper function to get user's own posts
  private getUserPosts(user: string): Post[] {
    const allPosts = storage.find<Post>((key, value) => value.author === user);
    return allPosts;
  }

  // Helper function to get posts from a page
  private getPagePosts(pageId: string): Post[] {
    const allPosts = storage.find<Post>((key, value) => value.pageId === pageId);
    return allPosts;
  }
}
```

**Description:**

- **fetchFeeds:** Aggregates posts from the user’s own posts, followed pages, and friends. It sorts the combined posts by timestamp in descending order and applies pagination based on the provided `offset` and `limit`.

**Notes:**

- **Helper Functions:** `getUserPosts` and `getPagePosts` are utility functions to retrieve posts authored by a user or associated with a page, respectively.
- **Pagination:** Efficiently handles fetching posts in batches of 10 using `offset` and `limit`.

### 5. Post Functions

#### a. Create Post

```typescript
// src/contracts/PostContract.ts

import { SmartContract, Context, storage, ContractPromise } from "massa-sc-std";
import { Post } from "./models/Post";
import { Page } from "./models/Page";
import { User } from "./models/User";

export class PostContract extends SmartContract {
  constructor() {
    super();
  }

  // Creates a new post
  createPost(
    postId: string,
    author: string,
    content: string,
    timestamp: u64,
    pageId: string | null = null,
    image: string | null = null,
    originalAuthor: string | null = null
  ): void {
    // Check if post ID already exists
    if (storage.exists(postId)) {
      Context.revert("Post ID already exists.");
    }

    // Ensure author exists
    if (!storage.exists(author)) {
      Context.revert("Author not found.");
    }

    // If pageId is provided, ensure page exists and author is a follower
    if (pageId !== null) {
      if (!storage.exists(pageId)) {
        Context.revert("Page not found.");
      }
      const page = storage.get<Page>(pageId)!;
      if (!page.followers.includes(author)) {
        Context.revert("Author is not a follower of the page.");
      }
    }

    // Validate content length (e.g., max 500 characters)
    if (content.length > 500) {
      Context.revert("Content too long.");
    }

    // Create and store new post
    const newPost = new Post(postId, author, content, timestamp, pageId, image, originalAuthor);
    storage.set(postId, newPost);
  }

  // Deletes a post
  deletePost(postId: string, user: string): void {
    // Ensure post exists
    if (!storage.exists(postId)) {
      Context.revert("Post not found.");
    }

    const post = storage.get<Post>(postId)!;

    // Retrieve page if the post is associated with one
    let page: Page | null = null;
    if (post.pageId !== null) {
      if (!storage.exists(post.pageId)) {
        Context.revert("Associated page not found.");
      }
      page = storage.get<Page>(post.pageId)!;
    }

    // Check if the user is the author or a moderator of the page
    if (user !== post.author) {
      if (page === null || !page.moderators.includes(user)) {
        Context.revert("Unauthorized action.");
      }
    }

    // Remove post
    storage.remove(postId);
  }

  // Retrieves a post
  getPost(postId: string): Post | null {
    if (!storage.exists(postId)) {
      return null;
    }
    return storage.get<Post>(postId)!;
  }
}
```

**Description:**

- **createPost:** Allows a user to create a new post with optional association to a page. It validates the uniqueness of `postId`, ensures the author exists, checks if the author is a follower of the page (if applicable), and enforces content length constraints.
  
- **deletePost:** Enables the deletion of a post by either the author or a page moderator. It verifies the existence of the post and associated page before allowing deletion.

- **getPost:** Retrieves the details of a specific post by its `postId`.

**Notes:**

- **Access Control:** Only the post's author or a page moderator can delete the post.
- **Validation:** Ensures that content length is within acceptable limits and that associations are valid.

#### b. Additional Post Functions (Optional)

Functions such as updating a post, fetching posts by category, etc., can be added as needed.

### 6. Interaction Functions

#### a. Like Post

```typescript
// src/contracts/InteractionContract.ts

import { SmartContract, Context, storage, ContractPromise } from "massa-sc-std";
import { Post } from "./models/Post";
import { Like } from "./models/Like";

export class InteractionContract extends SmartContract {
  constructor() {
    super();
  }

  // Likes a post
  likePost(user: string, postId: string): void {
    // Ensure post exists
    if (!storage.exists(postId)) {
      Context.revert("Post not found.");
    }

    const post = storage.get<Post>(postId)!;

    // Prevent duplicate likes
    if (post.likes.includes(user)) {
      Context.revert("Already liked the post.");
    }

    // Add like
    post.likes.push(user);
    storage.set(postId, post);
  }

  // Unlikes a post
  unlikePost(user: string, postId: string): void {
    // Ensure post exists
    if (!storage.exists(postId)) {
      Context.revert("Post not found.");
    }

    const post = storage.get<Post>(postId)!;

    // Check if user has liked the post
    const index = post.likes.indexOf(user);
    if (index === -1) {
      Context.revert("Like does not exist.");
    }

    // Remove like
    post.likes.splice(index, 1);
    storage.set(postId, post);
  }

  // Reposts a post
  repost(user: string, originalPostId: string, newPostId: string, timestamp: u64): void {
    // Ensure original post exists
    if (!storage.exists(originalPostId)) {
      Context.revert("Original post not found.");
    }

    const originalPost = storage.get<Post>(originalPostId)!;

    // Ensure new post ID is unique
    if (storage.exists(newPostId)) {
      Context.revert("New post ID already exists.");
    }

    // Create repost with reference to original author
    const repost = new Post(
      newPostId,
      user,
      originalPost.content,
      timestamp,
      originalPost.pageId,
      originalPost.image,
      originalPost.author
    );

    storage.set(newPostId, repost);

    // Add to reposts list
    originalPost.reposts.push(user);
    storage.set(originalPostId, originalPost);
  }

  // Comments on a post
  commentPost(
    commentId: string,
    author: string,
    postId: string,
    content: string,
    timestamp: u64
  ): void {
    // Ensure post exists
    if (!storage.exists(postId)) {
      Context.revert("Post not found.");
    }

    const post = storage.get<Post>(postId)!;

    // Validate content length (e.g., max 200 characters)
    if (content.length > 200) {
      Context.revert("Content too long.");
    }

    // Create comment
    const comment = new Comment(commentId, author, content, timestamp);

    // Add comment to post
    post.comments.push(comment);
    storage.set(postId, post);
  }
}
```

**Description:**

- **likePost:** Allows a user to like a post, ensuring that the user hasn't already liked it.
  
- **unlikePost:** Enables a user to remove their like from a post if it exists.
  
- **repost:** Allows a user to repost an existing post, creating a new post that references the original author.
  
- **commentPost:** Enables users to add comments to posts, enforcing content length constraints.

**Notes:**

- **Access Control:** While liking and commenting are open to users, reposting ensures uniqueness of the new post ID.
- **Validation:** Enforces constraints such as preventing duplicate likes and limiting comment length.

### 7. Moderation Functions

#### a. Assign Moderator

```typescript
// src/contracts/ModerationContract.ts

import { SmartContract, Context, storage, ContractPromise } from "massa-sc-std";
import { Page } from "./models/Page";

export class ModerationContract extends SmartContract {
  constructor() {
    super();
  }

  // Assigns a new moderator to a page
  assignModerator(pageId: string, moderator: string): void {
    // Ensure page exists
    if (!storage.exists(pageId)) {
      Context.revert("Page not found.");
    }

    const page = storage.get<Page>(pageId)!;
    const caller = Context.caller();

    // Only the page owner can assign moderators
    if (caller !== page.owner) {
      Context.revert("Unauthorized action.");
    }

    // Ensure moderator exists
    if (!storage.exists(moderator)) {
      Context.revert("Moderator not found.");
    }

    // Prevent duplicate moderators
    if (page.moderators.includes(moderator)) {
      Context.revert("User is already a moderator.");
    }

    // Assign moderator
    page.moderators.push(moderator);
    storage.set(pageId, page);
  }

  // Removes a moderator from a page
  removeModerator(pageId: string, moderator: string): void {
    // Ensure page exists
    if (!storage.exists(pageId)) {
      Context.revert("Page not found.");
    }

    const page = storage.get<Page>(pageId)!;
    const caller = Context.caller();

    // Only the page owner can remove moderators
    if (caller !== page.owner) {
      Context.revert("Unauthorized action.");
    }

    // Check if moderator exists
    const index = page.moderators.indexOf(moderator);
    if (index === -1) {
      Context.revert("Moderator not found.");
    }

    // Remove moderator
    page.moderators.splice(index, 1);
    storage.set(pageId, page);
  }

  // Removes a user from a page
  removeUserFromPage(pageId: string, user: string): void {
    // Ensure page exists
    if (!storage.exists(pageId)) {
      Context.revert("Page not found.");
    }

    const page = storage.get<Page>(pageId)!;
    const caller = Context.caller();

    // Only moderators or the page owner can remove users
    if (caller !== page.owner && !page.moderators.includes(caller)) {
      Context.revert("Unauthorized action.");
    }

    // Check if user is a follower
    const index = page.followers.indexOf(user);
    if (index === -1) {
      Context.revert("User not found in followers.");
    }

    // Remove user from followers
    page.followers.splice(index, 1);
    storage.set(pageId, page);
  }
}
```

**Description:**

- **assignModerator:** Allows the page owner to assign a new moderator by their wallet address. It ensures that the moderator exists and isn't already assigned.
  
- **removeModerator:** Enables the page owner to remove an existing moderator.
  
- **removeUserFromPage:** Allows moderators or the page owner to remove a user from the page's followers.

**Notes:**

- **Access Control:** Strictly enforces that only authorized users (owners or moderators) can perform moderation actions.
- **Validation:** Ensures that users and moderators exist before performing actions.

---













