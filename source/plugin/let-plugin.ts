/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/rxjs-spy
 */

import { merge, NEVER, Observable } from "rxjs";
import { Match, matches, toString as matchToString } from "../match";
import { SubscriptionRef } from "../subscription-ref";
import { BasePlugin } from "./plugin";

export class LetPlugin extends BasePlugin {

    private match_: Match;
    private select_: (source: Observable<any>) => Observable<any>;

    constructor(
        match: Match,
        select: (source: Observable<any>) => Observable<any>,
        { complete = true }: { complete?: boolean } = {}
    ) {

        super(`let(${matchToString(match)})`);

        this.match_ = match;
        this.select_ = complete ? select : source => merge(NEVER, select(source));
    }

    select(ref: SubscriptionRef): ((source: Observable<any>) => Observable<any>) | undefined {

        const { match_, select_ } = this;

        if (matches(ref, match_)) {
            return select_;
        }
        return undefined;
    }
}
