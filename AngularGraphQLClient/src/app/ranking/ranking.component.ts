import {Component, OnDestroy, OnInit} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {Subscription} from "rxjs";

import { RankingsSchema } from './ranking.schema';

@Component({
    selector: 'app-ranking',
    templateUrl: './ranking.component.html',
    styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit, OnDestroy {
    rank: number = 1;
    rankings: any[];
    private query: QueryRef<any>;
    private querySubscription: Subscription;

    constructor(private apollo: Apollo) {}

    ngOnInit() {
        this.query = this.apollo.watchQuery({
            query: RankingsSchema.schema,
            variables: { rank: Math.round(this.rank) }
        });

        this.querySubscription = this.query.valueChanges.subscribe(result => {
            this.rankings = result.data && result.data.rankings;
        });
    }

    ngOnDestroy(): void {
        this.querySubscription.unsubscribe();
    }

    incr() {
        this.rank++;
        this.update();
    }

    decr() {
        if(this.rank <= 1) return;
        this.rank--;
        this.update();
    }

    update() {
        return this.query.refetch({ rank: Math.round(this.rank) });
    }
}
