# Adopt Don't shop

an app for pet lovers to give a pet a new home, for people to browse cute pets around the country, or find organizations in their area.

[link to my deployed website](https://han-adoption-app.herokuapp.com/)

## What it includes

* create your own profile
* search a huge database of available pets by type
* search for organizations by state

## What it uses

this app uses the [Pet Finder API](https://www.petfinder.com/developers/v2/docs) and makes 3 different calls:
* a call to find a certain type of pet
* a call with the id of that specific pet
* a call to find organizations by state

## How to use

create a user profile for yourself on the signup page. it'll ask for your name, username, email, and password.
all passwords are sent through a hash before being stored in any database.

after a successful signup or login, you'll be taken to your profile page. here you can edit your bio section and add 
anything you like. as of right now, no other user will be able to see your profile or user information.

press the "search" tab at the top, this will bring you to a page where you see animal icons and a search box at the bottom.
click whatever type of animal you would like to search for, then you'll be redirected to the results.

or type in the name of a state into the bottom search bar to find organizations and resources near you.

both of those searches will show a list, and you can save individual items to your own tables. the tables connect to the 
individual users so users can access their saved data. this is seen at the top of the page under 
"saved animals" and "saved resources".

## To run on your machine
run `npm i` in your terminal to install dependencies 


# Models

### User Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| name | String | Must be provided |
| username | String | Must be provided |
| email | String | Must be unique / used for login |
| password | String | Stored as a hash |
| bio | Text | Can be updated later |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Pet Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| petId | Integer | ID from API used to get details |
| name | String | Must be provided |
| type | String | Must be provided |
| userId | Integer | FK used to assocaite with user model |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Resource Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| orgId | Integer | ID from API used to get details |
| name | String | Must be provided |
| userId | Integer | FK used to associate with user model |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### User_Pets Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| userId | Integer | FK from user model |
| petId | String | FK from pet model |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |


# Routes

### Default Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | server.js | Home page |
| GET | /search | server.js | Search form |

### Auth Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates User |
| GET | /auth/logout | auth.js | Removes session info |

### Animals Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | /animals/show | animals.js | Show animal search results |
| GET | /animals/details/:id | animals.js | Show detail page for specific animal |
| POST | /animals/saved | animals.js | Save animal to pet table |
| GET | /animals/saved | animals.js | Retrieve all saved pets for user |
| DELETE | /animals/saved | animals.js | Delete pet from pet table |

### Resources Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | /organizations | orgs.js | Show search results with save button |
| POST | /organizations/kept | orgs.js | Save to resources table |
| GET | /organizations/kept | orgs.js | Show resources table |

### Profile Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | /profile/view | profile.js | Show user profile |
| GET | /profile/edit | profile.js | Show edit page |
| PUT | /profile/view | profile.js | Update user table with new bio |


// I don't know if it's just a personal preference but I'd like to see something personal around here, at the end. Just a few sentences talking about victories struggles, an explanation of some intricate snippets or interesting tech.
Other than that, seems pretty thorough and easily read.


