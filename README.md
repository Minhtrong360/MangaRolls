# MangaRolls

## Description

The MangaRolls Web Application is an online platform where users can read a variety of available stories and also create their own stories to share with other users.

## User Stories

The following are the user stories that have been identified for this application:

User Story 1 - As a reader, I want to be able to browse available stories
As a user, I want to be able to browse through a list of available stories on the platform. I should be able to filter stories by genre or search for a specific story by title.

User Story 2 - As a reader, I want to be able to read a story
As a user, I want to be able to click on a story and read it in full. The story should be displayed in a clean and easy-to-read format.

User Story 3 - As a writer, I want to be able to create a new story
As a user, I want to be able to create a new story to share with others. I should be able to enter a title, select a genre, and write the story using a simple and intuitive text editor.

User Story 4 - As a writer, I want to be able to edit and delete my own stories
As a user, I want to be able to edit or delete my own stories. I should be able to access my stories from my account and make changes or delete them entirely.

User Story 5 - As a reader, I want to be able to leave comments on a story
As a user, I want to be able to leave comments on a story that I have read. I should be able to view and reply to other comments as well.

## Technologies Used

The MangaRolls Web Application is built using the following technologies:

HTML
CSS
JavaScript
React
Node.js
Express
MongoDB
Getting Started
To get started with the Reading Stories Web Application, follow these steps:

## API endpoints

### Authentication

\*\* Login with account

- @route POST /auth/login
- @description Log in with username and password
- @body {email, passsword}
- @access Public
  \*/

### User

\*\* Create new account

- @route POST /users
- @description Register new user
- @body {name, email, password}
- @access Public
  \*/

\*\* Get all users (For admin)

- @route GET /users/page=1?&limit=10
- @description Get user with pagination
- @body
- @access Login required
  \*/

\*\* Get a user (For admin)

- @route GET /users/:id
- @description Get user profile
- @body
- @access Login required
  \*/

\*\*

- @route GET /users/me
- @description Get current user info
- @body
- @access Login required
  \*/

\*\*

- @route PUT /users/:id
- @description Update user profile
- @body {Account Name, Cover, Gender, Address, Date of Birth, Phone number, ID}
- @access Login required
  \*/

### Story

\*\*

- @route GET /stories/:genre?page=1&limit=10
- @description Get all stories by genre with pagination
- @body
- @access Public access
  \*/

\*\*

- @route GET /stories/:id
- @description Get a single story
- @body
- @access Public access
  \*/

\*\* Get comments outside the story

- @route GET /stories/:id/comments
- @description Get comments of a story
- @body
- @access Public access
  \*/

\*\* Create story (For writter)

- @route POST /stories
- @description Create a new story
- @body {titles, cover, authors, genres, summaries}
- @access Login reuqired
  \*/

\*\* (Cannot update content here) (For writter)

- @route PUT /stories/:id
- - @description Update a story
- @body {titles, cover, authors, genres, summaries}
- @access Login required
  \*/

  \*\* (For writter)

- @route DELETE /stories/:id
- @description Delete a story
- @body
- @access Login required

### Chapter

\*\*

- @route GET /stories/chapters?page=1&limit=10
- @description Get all chapters of a story with pagination
- @body
- @access Public access
  \*/

\*\*

- @route GET /stories/chapters/:id
- @description Get a single chapter
- @body
- @access Public access
  \*/

\*\* Comments inside a chapter

- @route GET /stories/chapters/:id/comments
- @description Get comments of a chapter
- @body
- @access Public access
  \*/

\*\* Create chapters (For writter)

- @route POST /stories/:id
- @description Create a new chapter of a story
- @body {NO. of Chapter, chapter's name, content}
- @access Login reuqired
  \*/

\*\* (For writter)

- @route PUT /:id?chapter=1
- @description Update a chapter of a story
- @body { chapter's name, content}
- @access Login required
  \*/

\*\* (For writter)

- @route DELETE /stories/:id?chapter=1
- @description Delete a chapter of a story
- @body
- @access Login required

### Comment

\*\* Create comment

- @route POST /comments
- @description Create a new comment
- @body {targetType: 'Story' or 'Chapter', targetId, content}
- @access Login required
  \*/

\*\* Update comment

- @route PUT /comment:id
- @description Update a comment
- @body
- @access Login required
  \*/

\*\* Delete comment

- @route DELETE comments/:id
- @description Delete a comment
- @body
- @access Login required

### Subscription

\*\* Register subscription to be writter

- @route POST subscriptions/user/:id
- @description Register new subscription
- @body {duration : [30days, 90days, 180days, 365days]}
- @access Login required
  \*/

\*\* GET subscription of a user

- @route GET subscriptions/user/:id
- @description Get subscription of a user
- @body
- @access Login required
  \*/

\*\* Update subscription of a user

- @route PUT subscriptions/user/:id
- @description Update subscription of a user
- @body {duration : + [30days, 90days, 180days, 365days]}
- @access Login required
  \*/

\*\* Not extend subscription of a user

- @route DELETE subscriptions/user/:id
- @description Delete subscription of a user
- @body
- @access Login required

## Entity Relationship Diagram

![](https://i.imgur.com/O7WDblx.png)

## Conclusion

The MangaRolls Web Application provides a platform for users to read and share stories. With a clean and intuitive interface, users can easily browse, read, and write stories.
