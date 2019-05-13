# [Motion Picture](https://motion-picture.herokuapp.com/)

### Introduction
This application is created using Nodejs as a simple mimic for IMDB.

### Simple Features

#### [Search](https://motion-picture.herokuapp.com/media/search?title=avengers&type=movie)
Pretty basic search that looks for only movies and tv shows.

#### [User Account](https://motion-picture.herokuapp.com/register)
This was the starting point where I wanted to make my first auth-based project.
Any user account is saved in the database following the schema in the user model.
Passwords are hashed so they're not accessible in anyway.

#### [Lists](https://motion-picture.herokuapp.com/users/moha.khamis/lists/2)
This is the main feature that I focused on in this application. 
Simply a user can create a list with the access level that he wants whether public or private.

#### Seen
Each user has a list of his seen media. This helps when you navigate through another 
user's list and you want to know what you marked as seen, a simple progress bar that evaluate the percentage of seen media.

### Why Motion Picture
Since I've started learning Nodejs I have published two applications
1. [Finemusic](https://github.com/Mohammed-Farid/finemusic)
2. [Egyptian Metro Guide](https://github.com/Mohammed-Farid/metro-routing)

And I thought that my third one has to be different with a new challenge as a young ninja step.
1. In finemusic my challenge was to create a site that gets data from API, forms it in a proper way that user-friendly
2. In the Egyptian Metro Guide my challenge was to create a site that simulate the metro stops and their directions using Graph Algorithm

and here my main objective is a site that
1. Has authentication
2. Has multiple access level [public, private]
3. and always keep it user-friendly

I think I've done a pretty good job in those three points so far.

#### Implemention
You need
1. MongoDB as a database
2. TMDB API Key
3. JWT Secret Key
4. Token Expiration date

and pass them as global variables that goes with names of
1. `MONGODB_URL`
2. `TMDB_API_KEY`
3. `JWT_SECRET`
4. `EXP_DATE`

#### What I have gained
In about two weeks this project was almost done. In that period I have increased my code clarity by learning
about functional programming which I may not have implemented to the fullest but I will use it excessively in the upcoming projects.
Making better routes as my routes has changed multiple times to make it the most sensible.
