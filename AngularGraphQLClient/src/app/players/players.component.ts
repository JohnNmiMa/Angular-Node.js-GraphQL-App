import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo, QueryRef} from 'apollo-angular';
import { Subscription } from 'rxjs';

import { PlayersSchema } from "./players.schema";

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit, OnDestroy {
    page = 0;
    players: any[] = [];

    private query: QueryRef<any>;
    private querySubscription: Subscription;

    constructor(private apollo: Apollo) {
    }

    ngOnInit() {
        this.query = this.apollo.watchQuery<any>({
            query: PlayersSchema.schema,
            variables: {offset: 10 * this.page}
        });

        this.querySubscription = this.query.valueChanges.subscribe(result => {
            this.players = result.data && result.data.players;
        });
    }

    ngOnDestroy(): void {
        console.log("Hi");

        this.querySubscription.unsubscribe();
    }

    update() {
        this.query.refetch({offset: 10 * this.page});
    }

    nextPage() {
        this.page++;
        this.update();
    }

    prevPage() {
        if (this.page <= 0) return;

        this.page--;
        this.update();
    }
}
