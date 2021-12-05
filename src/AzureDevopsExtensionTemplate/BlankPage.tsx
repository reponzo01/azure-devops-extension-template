import * as React from 'react';
import axios from 'axios';
import * as SDK from 'azure-devops-extension-sdk';

import { Button } from 'azure-devops-ui/Button';
import { Page } from 'azure-devops-ui/Page';

export default class BlankPage extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
    }

    private async makeRestCall(): Promise<void> {
        const token: string = await SDK.getAccessToken();
        const organization: string = SDK.getHost().name;
        axios
            .get(
                `https://dev.azure.com/${organization}/_apis/projects?api-version=6.1-preview.4`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((result: any) => {
                alert(JSON.stringify(result.data.value));
            })
            .catch((error: any) => {
                console.error(error);
            });
    }

    public render(): JSX.Element {
        return (
            <Page className='flex-grow single-layer-details'>
                <Page className='page-content page-content-top'>
                    <Button
                        text='Sample REST call'
                        primary={true}
                        onClick={async () => this.makeRestCall()}
                    />
                </Page>
            </Page>
        );
    }
}
