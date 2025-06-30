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
import { getNewProductsAPI, createNewProductAPI } from '../../services/UsersSevices';

const WaitingTable = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getNewProductsAPI();
      const items = res?.items?.map(item => ({
        ...item,
        name: item?.name ?? '',
        decision: null
      })) || [];

      setProducts(items);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleDecision = async (id, isApproved) => {
    if (isApproved) {
      try {
        await createNewProductAPI(id);
        setProducts(prev =>
          prev.map(product =>
            product.id === id ? { ...product, decision: true } : product
          )
        );
      } catch (err) {
        console.error('Error approving product:', err);
      }
    } else {
      // Từ chối: chỉ cập nhật giao diện, chưa có API
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? { ...product, decision: false } : product
        )
      );
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const filteredProducts = products.filter(product => {
    const productName = product?.name ?? '';
    const search = searchTerm?.toLowerCase() ?? '';
    return productName.toLowerCase().includes(search);
  });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#3B6774' }}>
            <TableRow>
              <TableCell sx={{ color: '#f5f5f5' }}>STT</TableCell>
              <TableCell sx={{ color: '#f5f5f5' }}>Hình ảnh</TableCell>
              <TableCell sx={{ color: '#f5f5f5' }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ color: '#f5f5f5' }}>Giá</TableCell>
              <TableCell sx={{ color: '#f5f5f5' }} align="center">Quản lý</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={item?.primaryImage?.imageSource || 'img'}
                    alt={item.name}
                    sx={{
                      width: 70,
                      height: 70,
                      objectFit: 'contain',
                      borderRadius: 1,
                      display: 'block',
                    }}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price.toLocaleString()}đ</TableCell>
                <TableCell align="center">
                  {item.decision === null ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleDecision(item.id, true)}
                      >
                        Chấp nhận
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDecision(item.id, false)}
                      >
                        Từ chối
                      </Button>
                    </>
                  ) : (
                    <span style={{
                      color: item.decision ? 'green' : 'red',
                      fontWeight: 'bold'
                    }}>
                      {item.decision ? 'Đã chấp nhận' : 'Đã từ chối'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={Math.ceil(filteredProducts.length / pageSize)} page={page} onChange={handleChangePage} />
      </Box>
    </Box>
  );
};

export default WaitingTable;
