import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {pink500, grey200, grey500} from 'material-ui/styles/colors';
import DataService from '../../utils/data.service';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const Users = () => {
    const styles = {
        floatingActionButton: {
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
        },
        editButton: {
            fill: grey500
        },
        columns: {
            id: {
                width: '10%'
            },
            name: {
                width: '40%'
            },
            price: {
                width: '20%'
            },
            category: {
                width: '20%'
            },
            edit: {
                width: '10%'
            }
        }
    };

    const [users, setUsers] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await DataService.getUsers();
                console.log(res.data);
                setUsers(res.data);
            }
            catch (error) {
            }
        }
        fetchData();
        console.log(users.data);
    }, [])

    const typeAccount = (type) => {
        if(type === 1)
            return "ADMIN";
        return "USER"
    }

    const convertStatus = (type) =>{
        if(type == 1)
            return "ACTIVE";
        return "INACTIVE";
    }

    return (
            <div>
                {/*<Link to="/form">*/}

                {/*</Link>*/}
                <MuiThemeProvider>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.id}>ID</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.username}>Username</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.email}>Email</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.score}>Score</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.status}>Status</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.permission}>Permission</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.edit}>Edit</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(item =>
                            <TableRow key={item.id}>
                                <TableRowColumn style={styles.columns.id}>{item.id}</TableRowColumn>
                                <TableRowColumn style={styles.columns.username}>{item.username}</TableRowColumn>
                                <TableRowColumn style={styles.columns.email}>{item.email}</TableRowColumn>
                                <TableRowColumn style={styles.columns.score}>{item.score}</TableRowColumn>
                                <TableRowColumn style={styles.columns.status}>{convertStatus(item.status.data)}</TableRowColumn>
                                <TableRowColumn style={styles.columns.permission}>{typeAccount(item.permission)}</TableRowColumn>
                                <TableRowColumn style={styles.columns.edit}> ABCDE
                                    <Link className="button" to="/admin/users/{item.id}">
                                        <FloatingActionButton zDepth={0}
                                                              mini={true}
                                                              backgroundColor={grey200}
                                                              iconStyle={styles.editButton}>
                                            <ContentCreate/>
                                        </FloatingActionButton>
                                    </Link>
                                </TableRowColumn>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                </MuiThemeProvider>
            </div>
    );
};

export default Users;
