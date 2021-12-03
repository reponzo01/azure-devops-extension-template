import './AzureDevopsExtensionTemplate.scss';

import * as React from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { showRootComponent } from '../Common';

import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { Observer } from 'azure-devops-ui/Observer';
import { Page } from 'azure-devops-ui/Page';
import { Tab, TabBar, TabSize } from 'azure-devops-ui/Tabs';

import BlankPage from './BlankPage';

const tabBranchCreatorsKey: string = 'branch-creators';
const tabBranchCreatorsName: string = 'Branch Creators';
const tabBlankTabKey: string = 'blank-tab';
const tabBlankTabName: string = 'Blank Tab';

const selectedTabIdObservable: ObservableValue<string> =
    new ObservableValue<string>('');

export interface IAzureDevopsExtensionTemplateState {}

export default class AzureDevopsExtensionTemplate extends React.Component<
    {},
    IAzureDevopsExtensionTemplateState
> {
    private userName: string = '';
    private organizationName: string = '';

    constructor(props: {}) {
        super(props);

        this.state = {};
    }

    // The SDK must be initialized
    public async componentDidMount(): Promise<void> {
        await this.initializeSdk();
        await this.initializeComponent();
    }

    private async initializeSdk(): Promise<void> {
        await SDK.init();
        await SDK.ready();
    }

    private async initializeComponent(): Promise<void> {
        this.userName = SDK.getUser().name;
        this.organizationName = SDK.getHost().name;
    }

    private onSelectedTabChanged(newTabId: string): void {
        selectedTabIdObservable.value = newTabId;
    }

    private renderTabBar(): JSX.Element {
        return (
            <TabBar
                onSelectedTabChanged={this.onSelectedTabChanged}
                selectedTabId={selectedTabIdObservable}
                tabSize={TabSize.Tall}
            >
                <Tab name={tabBranchCreatorsName} id={tabBranchCreatorsKey} />
                <Tab name={tabBlankTabName} id={tabBlankTabKey} />
            </TabBar>
        );
    }

    private renderSelectedTabPage(): JSX.Element {
        switch (selectedTabIdObservable.value) {
            case tabBranchCreatorsKey:
                return (
                    <></>
                );
            case tabBlankTabKey:
                return (
                    <BlankPage />
                );
            default:
                return <></>;
        }
    }

    public render(): JSX.Element {
        return (
            <Page className='flex-grow'>
                <Header
                    title='Azure DevOps Extension Template'
                    titleSize={TitleSize.Large}
                    description='This is a template to help you get started developing Azure DevOps extensions'
                />
                {this.renderTabBar()}
                <Observer selectedTabId={selectedTabIdObservable}>
                    {(props: { selectedTabId: string }) => {
                        if (props.selectedTabId) {
                            return this.renderSelectedTabPage();
                        }
                        return <></>;
                    }}
                </Observer>
            </Page>
        );
    }
}

showRootComponent(<AzureDevopsExtensionTemplate />);
