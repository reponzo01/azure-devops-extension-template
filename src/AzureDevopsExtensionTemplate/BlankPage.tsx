import { ZeroData } from 'azure-devops-ui/ZeroData';
import * as React from 'react';

export default class BlankPage extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div>
                <ZeroData
                    primaryText='Blank Page! Nothing to see here.'
                    secondaryText={<span>Add some content.</span>}
                    imageAltText='Nothing Here'
                    imagePath={'../static/notfound.png'}
                />
            </div>
        );
    }
}
