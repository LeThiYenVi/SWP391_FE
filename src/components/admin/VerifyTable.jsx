import React, { useEffect, useState } from 'react';
import {
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead,
    TableRow, 
    Paper, 
    Pagination, 
    Button
} from '@mui/material';
import { getAwaitingDesignersAPI, applicationResultAPI } from '../../services/UsersSevices';

const VerifyTable = ({ searchTerm }) => {
    const [designers, setDesigners] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchData(page, pageSize);
    }, [page]);

    const fetchData = async (pageNumber, pageSize) => {
        try {
            const response = await getAwaitingDesignersAPI(pageNumber, pageSize);
            const items = response.items?.map(item => ({
                ...item,
                decision: null
            })) || [];
            const totalCount = response.totalCount || 0;

            setDesigners(items);
            setTotalPages(Math.ceil(totalCount / pageSize));
        } catch (err) {
            console.error('Error fetching awaiting designers:', err);
        }
    };

    const handleDecision = async (email, isApproved) => {
        try {
            await applicationResultAPI(email, isApproved);
            setDesigners(prev =>
                prev.map(designer =>
                    designer.email === email ? { ...designer, decision: isApproved } : designer
                )
            );
        } catch (err) {
            console.error('Error submitting application result:', err);
        }
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const filteredDesigners = designers.filter(designer =>
        designer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#3B6774' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#f5f5f5' }}>STT</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Họ tên</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }}>Email</TableCell>
                            <TableCell sx={{ color: '#f5f5f5' }} align="center">Quản lí</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDesigners.map((designer, index) => (
                            <TableRow key={designer.id}>
                                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                                <TableCell>{designer.name}</TableCell>
                                <TableCell>{designer.email}</TableCell>
                                <TableCell align="center">
                                    {designer.decision === null ? (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                sx={{ mr: 1 }}
                                                onClick={() => handleDecision(designer.email, true)}
                                            >
                                                Chấp nhận
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDecision(designer.email, false)}
                                            >
                                                Từ chối
                                            </Button>
                                        </>
                                    ) : (
                                        <span style={{
                                            color: designer.decision ? 'green' : 'red',
                                            fontWeight: 'bold'
                                        }}>
                                            {designer.decision ? 'Đã chấp nhận' : 'Đã từ chối'}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={handleChangePage} />
            </Box>
        </Box>
    );
};


export default VerifyTable;
