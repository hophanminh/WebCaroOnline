import React, {useEffect, useState} from 'react';
import {
    useHistory,
    useParams
} from "react-router-dom";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import {pink500, grey200, grey500} from 'material-ui/styles/colors';
import DataService from '../../utils/data.service';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Button, Card} from "@material-ui/core";

const MatchesByUserID = ({userId}) => {
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

    const [matches, setMatches] = useState([]);
    const ID = useParams().ID;

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await DataService.getMatchesByUserID(userId);
                console.log(res.data);
                setMatches(res.data);
            }
            catch (error) {
            }
        }
        fetchData();
        console.log(matches.data);
    }, [])

    // const typeAccount = (type) => {
    //     if(type === 1)
    //         return "ADMIN";
    //     return "USER"
    // }
    //
    const convertStatus = (type) =>{
        if(type == 1)
            return "DONE";
        return "HAVE NOT DONE";
    }

    const history = useHistory();
    const match = (ID) => {
        const path_url = `/match/${ID}`
        history.push(path_url);

    }

    return (
            <MuiThemeProvider >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn style={styles.columns.ID}>ID</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.idUser1}>User 1</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.idUser2}>User 2</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.winner}>Winner</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.status}>Status</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.dateCreate}>Date</TableHeaderColumn>
                            <TableHeaderColumn style={styles.columns.edit}>Edit</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matches.map(item =>
                            <TableRow key={item.id}>
                                <TableRowColumn style={styles.columns.ID}>{item.ID}</TableRowColumn>
                                <TableRowColumn style={styles.columns.idUser1}>{item.idUser1}</TableRowColumn>
                                <TableRowColumn style={styles.columns.idUser2}>{item.idUser2}</TableRowColumn>
                                <TableRowColumn style={styles.columns.winner}>{item.winner}</TableRowColumn>
                                <TableRowColumn style={styles.columns.status}>{convertStatus(item.status.data)}</TableRowColumn>
                                <TableRowColumn style={styles.columns.dateCreated}>{item.dateCreate}</TableRowColumn>
                                <TableRowColumn style={styles.columns.edit}>
                                    <Button onClick={() => match(item.ID)}>
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
    );
};

export default MatchesByUserID;
