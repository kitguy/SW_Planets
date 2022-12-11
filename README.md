# SW_Planets

## Pre requisites

- Mongo DB is needed for this application

### install docker & run mongoDB on it
if you are in a debian like operational system:
`sudo apt install docker`

You can run it with Docker using this:
`docker run -d --name test-mongo mongo:4.0.4`

## Set up
- Install node.js: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

- Install project dependencies
`npm install`

## Running
run it with npm:
`npm start`

## Usage

### Filling up the local database
Call
`POST http://localhost:8080/planet/initialize`
To load all planets into the local database

It should return a 200 with a message as body:
`"Loaded X planets from Open Star Wars API"`
### Get planet by id
`GET http://localhost:8080/planet/<ID>`

If the planet by the ID is presented in the local database, you should get a 200 with the body like:
```
{
    "name": "Alderaan",
    "climate": "temperate",
    "terrain": "grasslands, mountains",
    "films": [
        {
            "title": "A New Hope",
            "director": "George Lucas",
            "release_date": "1977-05-25"
        },
        {
            "title": "Revenge of the Sith",
            "director": "George Lucas",
            "release_date": "2005-05-19"
        }
    ]
}
```

if not, you should get a 404 http status code with no body.

### Get planet by name
Call replacing PLANET_NAME for the planet name you want to search for:
`http://localhost:8080/planet?name=<PLANET_NAME>`

You'll be replied with a 200 http status code and an array of planets matching the planet name. Example for `Tatooine`:
```
[
    {
        "name": "Tatooine",
        "climate": "arid",
        "terrain": "desert",
        "films": [
            {
                "title": "A New Hope",
                "director": "George Lucas",
                "release_date": "1977-05-25"
            },
            {
                "title": "Return of the Jedi",
                "director": "Richard Marquand",
                "release_date": "1983-05-25"
            },
            {
                "title": "The Phantom Menace",
                "director": "George Lucas",
                "release_date": "1999-05-19"
            },
            {
                "title": "Attack of the Clones",
                "director": "George Lucas",
                "release_date": "2002-05-16"
            },
            {
                "title": "Revenge of the Sith",
                "director": "George Lucas",
                "release_date": "2005-05-19"
            }
        ]
    }
]
```
Or a 404 http status code with no body if no planets matching the name were found.

### Get All Planets
Call `GET http://localhost:8080/planet`

and you'll be replied with a 200 http status and an array of all planets in the local database:
```
[
    {
        "name": "Tatooine",
        "climate": "arid",
        "terrain": "desert",
        "films": [
            {
                "title": "A New Hope",
                "director": "George Lucas",
                "release_date": "1977-05-25"
            },
            {
                "title": "Return of the Jedi",
                "director": "Richard Marquand",
                "release_date": "1983-05-25"
            },
            {
                "title": "The Phantom Menace",
                "director": "George Lucas",
                "release_date": "1999-05-19"
            },
            {
                "title": "Attack of the Clones",
                "director": "George Lucas",
                "release_date": "2002-05-16"
            },
            {
                "title": "Revenge of the Sith",
                "director": "George Lucas",
                "release_date": "2005-05-19"
            }
        ]
    },
    ...
]
```

if the local database was not filled in the `Filling up the local database` step. You'll receive a 200 http status with an empty array.

### Remove planet
Call `DELETE http://localhost:8080/planet/<PLANET_ID>` replacing `PLANET_ID` for the Planet id you want to remove from the local database.

If the Planet was found you'll receive a 200 http status code and a `"ok"` string as body; otherwise you'll receive a 404 http status instead.


## Load planet back into the local database
Call `POST http://localhost:8080/planet/load/<PLANET_ID>` replacing the PLANET_ID for the planet id you want to save into the local database from the Open Star Wars API.

You'll receive a 200 http status code with a message `"Loaded Planet to Local DB. Id: X"` (being X the planet ID) as body.

If you try to call it with an PLANET_ID from a planet already in the local database, you'll receive a 409 (Conflict) http status code and a message `"Planet with Id X already Exists"` as body.

## Delete all planets from the local database
Call `DELETE http://localhost:8080/planet/all` and all records will be removed from the local database and you'll receive a 200 http status code. If no records are there to be removed, you'll receive a 404 http status code with a `"No planets were deleted"` string message as body.