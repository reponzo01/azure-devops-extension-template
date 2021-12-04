import { ZeroData } from 'azure-devops-ui/ZeroData';
import * as React from 'react';

export interface IBranchCreatorsPageState {}

export default class BranchCreatorsPage extends React.Component<{
    userName: string;
    organizationName: string;
}> {
    private userName: string;
    private organizationName: string;
    constructor(props: { userName: string; organizationName: string }) {
        super(props);

        this.state = {};

        this.userName = props.userName;
        this.organizationName = props.organizationName;
    }

    public render(): JSX.Element {
        return (
            <div>
                <ZeroData
                    primaryText='Branch Creators Page! Nothing to see here.'
                    secondaryText={<span>{this.userName} - {this.organizationName}</span>}
                    imageAltText='Nothing Here'
                    imagePath={'../static/notfound.png'}
                />
            </div>
        );
    }
}
