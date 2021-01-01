import React, {useEffect, useState} from 'react';
import {
    useHistory,
    useLocation
} from "react-router-dom";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {pink500, grey200, grey500} from 'material-ui/styles/colors';
import DataService from '../../utils/data.service';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Button} from "@material-ui/core";

const Users = () => {
    const styles = {
        marginTable: {
            margin: 50
        },
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

    const history = useHistory();
    const profileUser = (ID) => {
        const path_url = `/users/${ID}`
        history.push(path_url);

    }

    return (
            <div style = {styles.margin}>
                <MuiThemeProvider >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.ID}>ID</TableHeaderColumn>
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
                                <TableRowColumn style={styles.columns.ID}>{item.ID}</TableRowColumn>
                                <TableRowColumn style={styles.columns.username}>{item.username}</TableRowColumn>
                                <TableRowColumn style={styles.columns.email}>{item.email}</TableRowColumn>
                                <TableRowColumn style={styles.columns.score}>{item.score}</TableRowColumn>
                                <TableRowColumn style={styles.columns.status}>{convertStatus(item.status.data)}</TableRowColumn>
                                <TableRowColumn style={styles.columns.permission}>{typeAccount(item.permission)}</TableRowColumn>
                                <TableRowColumn style={styles.columns.edit}>
                                    <Button onClick={() => profileUser(item.ID)}>
                                        <FloatingActionButton zDepth={0}
                                                              mini={true}
                                                              backgroundColor={grey200}
                                                              iconStyle={styles.editButton}>
                                            <ContentCreate/>
                                        </FloatingActionButton>
                                    </Button>
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
