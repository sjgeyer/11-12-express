# Documentation

This app uses MongoDB/mongoose to post, get, and delete Cat instances from the database.

## Starting and Stopping the Server
`startServer` : Connects to the MongoDB URI via mongoose and starts the server listening.

`stopServer` : Disconnects from mongoose and closes the server.

## Routing functions
`Router.post(/api/cats, json, callback)` : Creates a new Cat and posts it to the /api/cats route. Will check to see if the request includes a name.
  - Successful post: 200 status
  - No name passed: 400 status
  - Server error: 500 status
  
`Router.get(/api/cats, callback)` : Retrieves all the cats currently in the database.
  - Successful retrieval: 200 status
  - Server error: 500 status
  
`Router.get(/api/cats/:id, callback)` : Looks for a cat at the id specified in the request parameters. Checks that a cat has been returned from the request
  - Successful retrieval: 200 status
  - Cat returned but undefined: 404 status
  - No cat found at id: 404 status
  - Server error: 500 status
  
`Router.delete(/api/cats/:id?, callback)` : Looks for a cat at the specified id and deletes it. Will check that id has been passed.
  - No id passed: 400 status
  - Successful deletion: 204 status
  - No cat found at id: 404 status
  - Server error: 500 status
  
## Cat Schema
Requires name (string, unique), color (string), favoriteFood (string), and age (number).
