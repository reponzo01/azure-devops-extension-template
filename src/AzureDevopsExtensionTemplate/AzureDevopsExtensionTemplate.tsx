import './AzureDevopsExtensionTemplate.scss';

import * as React from 'react';
import * as SDK from 'azure-devops-extension-sdk';

import { Header, TitleSize } from 'azure-devops-ui/Header';
import { Page } from 'azure-devops-ui/Page';
import { ZeroData } from 'azure-devops-ui/ZeroData';

import { showRootComponent } from '../Common';

export interface IAzureDevopsExtensionTemplateState {}

export default class AzureDevopsExtensionTemplate extends React.Component<
    {},
    IAzureDevopsExtensionTemplateState
> {
    constructor(props: {}) {
        super(props);

        this.state = {};
    }

    public async componentDidMount(): Promise<void> {
        await this.initializeSdk();
    }

    private async initializeSdk(): Promise<void> {
        await SDK.init();
        await SDK.ready();
    }

    public render(): JSX.Element {
        return (
            <Page className='flex-grow'>
                <Header
                    title='Azure DevOps Extension Template'
                    titleSize={TitleSize.Large}
                />
                <ZeroData
                    primaryText='Nothing to see here.'
                    secondaryText={
                        <span className="test-style">
                            Add some content.
                        </span>
                    }
                    imageAltText='Nothing Here'
                    imagePath={'../static/notfound.png'}
                />
            </Page>
        );
    }
}

showRootComponent(<AzureDevopsExtensionTemplate />);
