import * as React from 'react';
import { getClient } from 'azure-devops-extension-api';
import {
    CoreRestClient,
    TeamProjectReference,
} from 'azure-devops-extension-api/Core';
import {
    GitRef,
    GitRepository,
    GitRestClient,
} from 'azure-devops-extension-api/Git';
import {
    ObservableArray,
    ObservableValue,
} from 'azure-devops-ui/Core/Observable';
import { bindSelectionToObservable } from 'azure-devops-ui/MasterDetailsContext';
import { Observer } from 'azure-devops-ui/Observer';
import {
    Splitter,
    SplitterDirection,
    SplitterElementPosition,
} from 'azure-devops-ui/Splitter';
import { Spinner } from 'azure-devops-ui/Spinner';
import { Tooltip } from 'azure-devops-ui/TooltipEx';
import { ZeroData } from 'azure-devops-ui/ZeroData';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import {
    IListItemDetails,
    List,
    ListItem,
    ListSelection,
} from 'azure-devops-ui/List';
import { Link } from 'azure-devops-ui/Link';
import { Page } from 'azure-devops-ui/Page';
import { ITableColumn, SimpleTableCell, Table } from 'azure-devops-ui/Table';
import { Card } from 'azure-devops-ui/Card';
import { Icon } from 'azure-devops-ui/Icon';
import { VssPersona } from 'azure-devops-ui/VssPersona';

export interface IBranchCreatorsPageState {
    repositories: ArrayItemProvider<GitRepository>;
    repositoryBranches: ObservableArray<GitRef>;
    repositoryListSelection: ListSelection;
    repositoryListSelectedItemObservable: ObservableValue<GitRepository>;
}

// TODO: Make this an Observable Number and initialize it to 0
const totalRepositoriesToProcessObservable = 0;

// Column width observables
const nameColumnWidthObservable: ObservableValue<number> =
    new ObservableValue<number>(-30);
const latestCommitColumnWidthObservable: ObservableValue<number> =
    new ObservableValue<number>(-30);
const branchCreatorColumnWidthObservable: ObservableValue<number> =
    new ObservableValue<number>(-40);

export default class BranchCreatorsPage extends React.Component<
    {
        userName: string;
        organizationName: string;
    },
    IBranchCreatorsPageState
> {
    private userName: string;
    private organizationName: string;
    private columns: any = [];
    private repositoryHeadsFilter: string = 'heads/';
    constructor(props: { userName: string; organizationName: string }) {
        super(props);

        this.onSize = this.onSize.bind(this);
        this.renderRepositoryMasterPageList =
            this.renderRepositoryMasterPageList.bind(this);
        this.renderDetailPageContent = this.renderDetailPageContent.bind(this);
        this.renderRepositoryListItem =
            this.renderRepositoryListItem.bind(this);
        // TODO: Bind renderNameCell and renderLatestCommitCell to this

        this.columns = [
            // TODO: Add columns for Branch Name and Latest Commit
            {
                id: 'creator',
                name: 'Branch Creator',
                onSize: this.onSize,
                renderCell: this.renderBranchCreatorCell,
                width: branchCreatorColumnWidthObservable,
            },
        ];

        this.state = {
            repositories: new ArrayItemProvider<GitRepository>([]),
            repositoryBranches: new ObservableArray<GitRef>([]),
            repositoryListSelection: new ListSelection({
                selectOnFocus: false,
            }),
            repositoryListSelectedItemObservable: new ObservableValue<any>({}),
        };

        this.userName = props.userName;
        this.organizationName = props.organizationName;
    }

    public async componentDidMount(): Promise<void> {
        await this.initializeComponent();
    }

    private async initializeComponent(): Promise<void> {
        const projects: TeamProjectReference[] = await getClient(
            CoreRestClient
        ).getProjects();

        let repositories: GitRepository[] = [];
        // TODO: For each project get the list of repositories

        totalRepositoriesToProcessObservable.value = repositories.length;

        this.setState({
            repositories: new ArrayItemProvider(repositories),
        });

        bindSelectionToObservable(
            this.state.repositoryListSelection,
            this.state.repositories,
            this.state
                .repositoryListSelectedItemObservable as ObservableValue<GitRepository>
        );
    }

    private renderRepositoryMasterPageList(): JSX.Element {
        return !this.state.repositories ||
            this.state.repositories.length === 0 ? (
            <div className='page-content-top'>
                <Spinner label='loading' />
            </div>
        ) : (
            <List
                ariaLabel={'Repositories'}
                itemProvider={this.state.repositories}
                selection={this.state.repositoryListSelection}
                renderRow={this.renderRepositoryListItem}
                width='100%'
                singleClickActivation={true}
                onSelect={async () => {
                    await this.selectRepository();
                }}
            />
        );
    }

    private renderDetailPageContent(): JSX.Element {
        return (
            <Observer
                selectedItem={this.state.repositoryListSelectedItemObservable}
            >
                {(observerProps: { selectedItem: GitRepository }) => (
                    <Page className='flex-grow single-layer-details'>
                        {this.state.repositoryListSelection.selectedCount ===
                            0 && (
                            <Page className='page-content page-content-top'>
                                <Card className='flex-grow bolt-card-white'>
                                    Welcome {this.organizationName}:{' '}
                                    {this.userName}! Select a repository on the
                                    right to see its branch creators.
                                </Card>
                            </Page>
                        )}
                        {observerProps.selectedItem &&
                            this.state.repositoryListSelection.selectedCount >
                                0 && (
                                <Page>
                                    <div className='page-content page-content-top'>
                                        <Card className='bolt-table-card bolt-card-white'>
                                            {/* TODO: Drop in a Table component using our columns and the state repositoryBranches as the item provider*/}
                                        </Card>
                                    </div>
                                </Page>
                            )}
                    </Page>
                )}
            </Observer>
        );
    }

    private renderRepositoryListItem(
        index: number,
        item: GitRepository,
        details: IListItemDetails<GitRepository>,
        key?: string
    ): JSX.Element {
        return (
            <ListItem
                className='master-row border-bottom'
                key={key || 'list-item' + index}
                index={index}
                details={details}
            >
                <div className='master-row-content flex-row flex-center h-scroll-hidden'>
                    <div className='flex-column text-ellipsis'>
                        <Tooltip overflowOnly={true}>
                            <div className='primary-text text-ellipsis'>
                                <Link
                                    excludeTabStop
                                    href={item.webUrl + '/branches'}
                                    subtle={true}
                                    target='_blank'
                                    className='font-size-1'
                                >
                                    <u>{item.name}</u>
                                </Link>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </ListItem>
        );
    }

    private renderNameCell(
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<GitRef>,
        tableItem: GitRef
    ): JSX.Element {
        const branchName: string = tableItem.name.split('refs/heads/')[1];
        return (
            <SimpleTableCell
                key={'col-' + columnIndex}
                columnIndex={columnIndex}
                tableColumn={tableColumn}
                children={
                    <>
                        {/* TODO: Drop in an Icon component here. Hint, the icon names are from a subset of the Office UI Fabric Icons (https://uifabricicons.azurewebsites.net/) */}
                        <u>
                            <Link
                                key={columnIndex.toString()}
                                excludeTabStop
                                href={
                                    this.state
                                        .repositoryListSelectedItemObservable
                                        .value.webUrl +
                                    '?version=GB' +
                                    encodeURI(branchName)
                                }
                                target='_blank'
                                className='bolt-table-link bolt-table-inline-link'
                            >
                                {/* TODO: Show the branch name here */}
                            </Link>
                        </u>
                    </>
                }
            ></SimpleTableCell>
        );
    }

    private renderLatestCommitCell(
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<GitRef>,
        tableItem: GitRef
    ): JSX.Element {
        return (
            <SimpleTableCell
                key={'col-' + columnIndex}
                columnIndex={columnIndex}
                tableColumn={tableColumn}
                children={
                    <Link
                        excludeTabStop
                        href={
                            this.state.repositoryListSelectedItemObservable
                                .value.webUrl +
                            '/commit/' +
                            tableItem.objectId
                        }
                        subtle={true}
                        target='_blank'
                        className='bolt-table-link bolt-table-inline-link'
                    >
                        {/* TODO: Show only the first 8 characters of the commit ID */}
                    </Link>
                }
            ></SimpleTableCell>
        );
    }

    private renderBranchCreatorCell(
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<GitRef>,
        tableItem: GitRef
    ): JSX.Element {
        return (
            <SimpleTableCell
                key={'col-' + columnIndex}
                columnIndex={columnIndex}
                tableColumn={tableColumn}
                children={
                    <>
                        {/* TODO: Find an appropriate component to display a person's identity */}

                        {/* HINT: Look at the Master-detail component to see the example the following was modeled from */}
                        <div className='flex-column text-ellipsis'>
                            <Tooltip overflowOnly={true}>
                                <div className='primary-text text-ellipsis'>
                                    {tableItem.creator.displayName}
                                </div>
                            </Tooltip>
                            <Tooltip overflowOnly={true}>
                                <div className='primary-text text-ellipsis'>
                                    <Link
                                        excludeTabStop
                                        href={
                                            'mailto:' +
                                            tableItem.creator.uniqueName
                                        }
                                        subtle={false}
                                        target='_blank'
                                    >
                                        {tableItem.creator.uniqueName}
                                    </Link>
                                </div>
                            </Tooltip>
                        </div>
                    </>
                }
            ></SimpleTableCell>
        );
    }

    private async selectRepository(): Promise<void> {
        const repositoryInfo: GitRepository =
            this.state.repositoryListSelectedItemObservable.value;
        const repositoryBranches: GitRef[] = await getClient(
            GitRestClient
        ).getRefs(
            repositoryInfo.id,
            undefined,
            this.repositoryHeadsFilter,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        );

        // TODO: Console log repositoryBranches to inspect it
        this.setState({
            repositoryBranches: new ObservableArray<GitRef>(repositoryBranches),
        });
    }

    private onSize(event: MouseEvent, index: number, width: number): void {
        (this.columns[index].width as ObservableValue<number>).value = width;
    }

    public render(): JSX.Element {
        return (
            <Observer
                // TODO: Set the appropriate property to observe. HINT: We want to know of there are any repositories to process
            >
                {(props: { totalRepositoriesToProcess: number }) => {
                    if (props.totalRepositoriesToProcess > 0) {
                        return (
                            <div
                                className='flex-grow'
                                style={{
                                    display: 'flex',
                                    height: '0%',
                                }}
                            >
                                <Splitter
                                    fixedElement={SplitterElementPosition.Near}
                                    splitterDirection={
                                        SplitterDirection.Vertical
                                    }
                                    initialFixedSize={450}
                                    minFixedSize={100}
                                    nearElementClassName='v-scroll-auto custom-scrollbar'
                                    farElementClassName='v-scroll-auto custom-scrollbar'
                                    onRenderNearElement={
                                        this.renderRepositoryMasterPageList
                                    }
                                    onRenderFarElement={
                                        this.renderDetailPageContent
                                    }
                                />
                            </div>
                        );
                    }
                    return (
                        <ZeroData
                            primaryText='No repositories.'
                            imageAltText='No repositories.'
                            imagePath={'../static/notfound.png'}
                        />
                    );
                }}
            </Observer>
        );
    }
}
