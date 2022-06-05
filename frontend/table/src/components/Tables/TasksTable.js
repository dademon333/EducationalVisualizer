import React, { Component } from "react";
import { Grid, Table, TableHeaderRow, TableSelection, SearchPanel, Toolbar } from '@devexpress/dx-react-grid-bootstrap4';
import { SelectionState, IntegratedSelection, SearchState, IntegratedFiltering, SortingState, IntegratedSorting } from '@devexpress/dx-react-grid';
import { getChilds, getItems, wrapName, addLabels } from '../../services/services';
import withData from "../withData";
import './tables.css';

class TasksTable extends Component {
    state = {
        query: "",
        columns: [
            { name: 'id', title: ' ' },
            { name: 'task', title: 'Тема' },
            { name: 'add', title: <span className="add" /> }
        ],
        selection: [],
        tableColumnExtensions: [
            { columnName: 'id', width: '50px' },
            { columnName: 'task', width: '600px' },
            { columnName: 'add', width: '65px' }
        ]
    }

    setRows = () => {
        const {data} = this.props;
        const {query} = this.state;
        const rows = Object.entries(data.entities)
            .filter(entity => entity[1] !== undefined && entity[1].type === 'task')
            .filter(entity => {
                if (query === "") {
                    return entity; 
                } else if (entity[1].name.toLowerCase().trim().includes(query.toLowerCase().trim())) {
                    return entity;
                } else {
                    return null;
                }
            })
            .map((entity, index) => {
                const row = {};
                row.id = <div className="id">{index + 1}</div>;
                row.task = wrapName(entity[1].name, 'taskName');
                return row;
        });
        addLabels();
        return rows;
    }

    render() {
        const {columns, selection, tableColumnExtensions} = this.state;
        const rows = this.setRows();
        return (
            <div className='table_container taskTable'>
                <div className="toolbar">
                    <div className="search">
                        <img src="icons/search.svg" alt="search" />
                        <input 
                            placeholder="Поиск" 
                            onChange={event => this.setState({ query: event.target.value })}
                        />
                    </div>
                </div> 
                <Grid
                    rows={rows}
                    columns={columns}
                >
                    <SelectionState 
                        selection={selection}
                        onSelectionChange={selected => this.setState({ selection: selected })}
                    />
                    <IntegratedSelection />
                    <Table columnExtensions={tableColumnExtensions} />
                    <TableHeaderRow />
                    <TableSelection selectionColumnWidth={0} />
                </Grid>
            </div>
        );
    }
}

export default withData(TasksTable);