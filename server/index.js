//////////////////////////////////////////////////////////////////////////////////
// Training class at OKTA
// https://developer.okta.com/blog/2018/11/30/web-app-with-express-angular-graphql
//////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const cors = require('cors');

const app = express().use(cors());

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('tennis.db');

const graphqlHTTP = require('express-graphql');
const tennisSchema = require('./tennis.schema');
const schema = tennisSchema();

function query(sql, single) {
    return new Promise((resolve, reject) => {
        var callback = (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        };

        if (single) db.get(sql, callback);
        else db.all(sql, callback);
    });
}


const root = {
    players: args => {
        return query(
            `SELECT * FROM players LIMIT ${args.offset}, ${args.limit}`,
            false
        );
    },
    player: args => {
        return query(`SELECT * FROM players WHERE id='${args.id}'`, true);
    },
    rankings: args => {
        return query(
       `SELECT r.date, r.rank, r.points, p.id, p.first_name, p.last_name, p.hand, p.birthday, p.country
            FROM players AS p
            LEFT JOIN rankings AS r
            ON p.id=r.player
            WHERE r.rank=${args.rank}`,
     false
        ).then(rows =>
            rows.map(result => {
                return {
                    date: result.date,
                    points: result.points,
                    rank: result.rank,
                    player: {
                        id: result.id,
                        first_name: result.first_name,
                        last_name: result.last_name,
                        hand: result.hand,
                        birthday: result.birthday,
                        country: result.country
                    }
                };
            })
        );
    },
    player_ranking: args => {
        return query(
            `SELECT r.date, r.rank, r.points, p.id, p.first_name, p.last_name, p.hand, p.birthday, p.country
            FROM players AS p
            LEFT JOIN rankings AS r
            ON p.id=r.player
            WHERE p.id=${args.id}`,
            false
        ).then(rows =>
            rows.map(result => {
                console.log(result);
                return {
                    date: result.date,
                    points: result.points,
                    rank: result.rank,
                    player: {
                        id: result.id,
                        first_name: result.first_name,
                        last_name: result.last_name,
                        hand: result.hand,
                        birthday: result.birthday,
                        country: result.country
                    }
                };
            })
        );
    }
};

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        rootValue: root,
        graphiql: true
    })
);

app.listen(4201, err => {
    if (err) {
        return console.log(err);
    }
    return console.log('My Express App listening on port 4201');
});