import React, { Fragment } from 'react';
import { entry } from './types';

interface IProps {
    id: string;
    entry: entry;
}

export default function RequestEntry({ id, entry }: IProps) {
    return (
        <tr>
            <td>{id.substring(0, 5)}</td>
            <td>{entry.requestBeta ? 'Yes' : 'No'}</td>
            <td>{entry.ageRating}</td>
            <td>{entry.archiveWarnings?.join(', ')}</td>
            <td>{entry.characters.join(', ')}</td>
            <td>{entry.pairings.map(p => { return [p.a, p.b].join(' x '); }).map((pair, i) => {
                return (
                    <Fragment key={i}>
                        {pair}
                        {i < entry.pairings.length - 1 && <br />}
                    </Fragment>
                );
            })}</td>
            <td>{entry.tags.join(', ')}</td>
            <td><p>
                {entry.summary}
            </p></td>
            <td>{entry.tier}</td>
            <td>{entry.authorWarnings}</td>
        </tr>
    );
}
