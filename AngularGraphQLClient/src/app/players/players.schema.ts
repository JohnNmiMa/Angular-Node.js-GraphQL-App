import gql from 'graphql-tag';

export class PlayersSchema {
    static schema = gql`
        query players($offset: Int) {
            players(offset: $offset, limit: 10) {
               id
               first_name
               last_name
               hand
               birthday
               country
             }
        }
    `;
}
