const { buildSchema } = require('graphql');

// GraphQL Schema
function getTennisSchema() {

    return buildSchema(`
      type Query {
        players(offset:Int = 0, limit:Int = 10): [Player]
        player(id:ID!): Player
        rankings(rank:Int!): [Ranking]
        player_ranking(id:ID!) : [Ranking]
      }

      type Player {
        id: ID
        first_name: String
        last_name: String
        hand: String
        birthday: Int
        country: String
      }

      type Ranking {
        date: Int
        rank: Int
        player: Player
        points: Int
      }
    `);

}

module.exports = getTennisSchema;
