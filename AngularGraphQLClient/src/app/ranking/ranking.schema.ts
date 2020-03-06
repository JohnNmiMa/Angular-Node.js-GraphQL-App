import gql from 'graphql-tag';

export class RankingsSchema {
    static schema = gql`
      query rankings($rank: Int!) {
        rankings(rank: $rank) {
          date
          rank
          points
          player {
            first_name
            last_name
            country
          }
        }
      }
    `;
}

