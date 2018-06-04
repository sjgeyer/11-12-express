# Documentation

This app uses MongoDB/mongoose to post, get, put, and delete Cat instances from the database.

## Starting and Stopping the Server
`startServer` : Connects to the MongoDB URI via mongoose and starts the server listening.

`stopServer` : Disconnects from mongoose and closes the server.

## Routing functions
`Router.post(/api/cats, json, callback)` : Creates a new Cat and posts it to the /api/cats route. Will check to see if the request includes all necessary keys.
  - Successful post: 200 status
  - No name/color/favoriteFood/age passed: 400 status
  
  Example return of single id (Router.post, Router.put, Router.get when no id passed):
   
       { _id: '5ae8e7786d6b20f575862544',
         name: 'Bulah',
         color: 'black',
         favoriteFood: 'Tuna',
         age: 5,
         __v: 0 }
  
`Router.get(/api/cats/:id?, callback)` : If no id is passed, retrieves all the cats currently in the database. If id is passed, looks for cat at the id specified in the request parameters. Checks that a defined cat has been returned from the request.
  - Successful retrieval of all cats: 200 status
  - Server error: 500 status
  - Successful retrieval of one cat: 200 status
  - Cat returned but undefined: 404 status
  - No cat found at id: 404 status

 Example return from Router.get() when no id is passed:
 
     [
         { _id: '5ae8e7786d6b20f575862544',
           name: 'Bulah',
           color: 'black',
           favoriteFood: 'Tuna',
           age: 5,
           __v: 0 },
       
         { _id: '5ae8e839cc6c98f5c93e31bd',
           name: 'Margaret',
           color: 'white',
           favoriteFood: 'Chicken',
           age: 6,
           __v: 0 }
     ]


`Router.put(/api/cats/:id?, json, callback)` : Updates the Cat at the specified id and returns updated cat. Checks that id has been passed in.
  - Successful update: 200 status
  - No id passed: 400 status
  - Invalid id passed: 404 status
  
`Router.delete(/api/cats/:id?, callback)` : Looks for a cat at the specified id and deletes it. Will check that id has been passed.
  - No id passed: 400 status
  - Successful deletion: 204 status
  - No cat found at id: 404 status
  
## Cat Schema
Requires name (string, unique), color (string), favoriteFood (string), and age (number).

## Testing

To test, run the following commands in your terminal:

`npm run dbon` (Turns on MongoDB)<br/>`npm run test` (Initiates testing)<br/> 

When finished, run:

`npm run dboff` (Turns off MongoDB)
