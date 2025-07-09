/**
 * Mock data cho tính năng tìm kiếm
 */

export const searchData = {
  // Dữ liệu tư vấn viên
  counselors: [
    {
      id: 1,
      type: 'counselor',
      name: 'Dr. Nguyễn Thị Hoa',
      specialty: 'Sản phụ khoa',
      rating: 4.8,
      reviews: 245,
      experience: '15 năm',
      location: 'TP.HCM',
      price: '300,000đ',
      available: true,
      avatar: 'https://www.hoilhpn.org.vn/documents/20182/3458479/28_Feb_2022_115842_GMTbsi_thuhien.jpg/c04e15ea-fbe4-415f-bacc-4e5d4cc0204d',
      tags: ['tư vấn', 'sản phụ khoa', 'chuyên gia'],
      description: 'Bác sĩ chuyên khoa Sản phụ khoa với hơn 15 năm kinh nghiệm trong tư vấn và điều trị các vấn đề sức khỏe phụ nữ.',
      education: 'Đại học Y Hà Nội',
      certifications: ['Chứng chỉ Siêu âm sản phụ khoa', 'Chứng chỉ Nội soi phụ khoa']
    },
    {
      id: 2,
      type: 'counselor',
      name: 'Dr. Lê Văn Minh',
      specialty: 'Nội tiết',
      rating: 4.9,
      reviews: 198,
      experience: '12 năm',
      location: 'Hà Nội',
      price: '250,000đ',
      available: true,
      avatar: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/06/anh-bac-si-27.jpg.webp',
      tags: ['nội tiết', 'hormone', 'chu kỳ'],
      description: 'Bác sĩ chuyên khoa Nội tiết có kinh nghiệm trong điều trị các vấn đề về nội tiết tố và hormone ở phụ nữ.',
      education: 'Đại học Y Hà Nội',
      certifications: ['Chứng chỉ Nội tiết học', 'Thành viên Hiệp hội Nội tiết Việt Nam']
    },
    {
      id: 3,
      type: 'counselor',
      name: 'Dr. Phạm Thị Mai',
      specialty: 'Tư vấn sức khỏe sinh sản',
      rating: 4.7,
      reviews: 156,
      experience: '10 năm',
      location: 'Đà Nẵng',
      price: '280,000đ',
      available: false,
      avatar: 'https://www.hoilhpn.org.vn/documents/20182/3653964/5_May_2022_100351_GMTbs_dophamnguyetthanh.jpg/a744c0f6-07dd-457c-9075-3ec3ff26b384',
      tags: ['tư vấn', 'sức khỏe sinh sản', 'kế hoạch hóa gia đình'],
      description: 'Bác sĩ chuyên về tư vấn sức khỏe sinh sản và kế hoạch hóa gia đình, với kinh nghiệm tư vấn cho hàng nghìn phụ nữ.',
      education: 'Đại học Y dược TP.HCM',
      certifications: ['Chứng chỉ Tư vấn Sức khỏe sinh sản', 'Thành viên Hiệp hội Y học sinh sản']
    }
  ],

  // Dịch vụ
  services: [
    {
      id: 1,
      type: 'service',
      name: 'Tư vấn chu kỳ kinh nguyệt',
      description: 'Tư vấn về các vấn đề liên quan đến chu kỳ kinh nguyệt',
      category: 'Tư vấn',
      price: '200,000đ',
      duration: '45 phút',
      rating: 4.7,
      reviews: 156,
      tags: ['chu kỳ', 'kinh nguyệt', 'tư vấn'],
      details: 'Dịch vụ tư vấn chuyên sâu về các vấn đề liên quan đến chu kỳ kinh nguyệt: chu kỳ không đều, đau bụng kinh, rối loạn kinh nguyệt, vv.',
      image: 'https://example.com/image1.jpg'
    },
    {
      id: 2,
      type: 'service',
      name: 'Xét nghiệm STI toàn diện',
      description: 'Gói xét nghiệm đầy đủ các bệnh lây truyền qua đường tình dục',
      category: 'Xét nghiệm',
      price: '1,200,000đ',
      duration: '2 giờ',
      rating: 4.9,
      reviews: 89,
      tags: ['xét nghiệm', 'STI', 'sức khỏe'],
      details: 'Gói xét nghiệm toàn diện bao gồm các bệnh lây truyền qua đường tình dục phổ biến như HIV, HPV, Chlamydia, Gonorrhea, Syphilis và Herpes.',
      image: 'https://example.com/image2.jpg'
    },
    {
      id: 3,
      type: 'service',
      name: 'Tư vấn sức khỏe tình dục',
      description: 'Tư vấn về các vấn đề liên quan đến sức khỏe tình dục',
      category: 'Tư vấn',
      price: '250,000đ',
      duration: '60 phút',
      rating: 4.8,
      reviews: 120,
      tags: ['sức khỏe tình dục', 'tư vấn', 'kế hoạch hóa'],
      details: 'Dịch vụ tư vấn về sức khỏe tình dục, bao gồm các biện pháp tránh thai, tư vấn về quan hệ tình dục an toàn và các vấn đề khác liên quan.',
      image: 'https://example.com/image3.jpg'
    }
  ],

  // Bài viết
  articles: [
    {
      id: 1,
      type: 'article',
      title: 'Chu kỳ kinh nguyệt không đều: Nguyên nhân và cách điều trị',
      excerpt: 'Tìm hiểu về các nguyên nhân gây chu kỳ kinh nguyệt không đều...',
      author: 'Dr. Nguyễn Thị Hoa',
      publishDate: '2024-01-15',
      readTime: '5 phút',
      category: 'Sức khỏe sinh sản',
      tags: ['chu kỳ', 'kinh nguyệt', 'điều trị'],
      image: 'https://example.com/article1.jpg',
      content: 'Nội dung chi tiết về chu kỳ kinh nguyệt không đều, các nguyên nhân và phương pháp điều trị.'
    },
    {
      id: 2,
      type: 'article',
      title: 'Các phương pháp tránh thai hiện đại và hiệu quả',
      excerpt: 'Tìm hiểu về các phương pháp tránh thai hiện đại, ưu nhược điểm và độ hiệu quả...',
      author: 'Dr. Phạm Thị Mai',
      publishDate: '2024-02-20',
      readTime: '8 phút',
      category: 'Kế hoạch hóa',
      tags: ['tránh thai', 'kế hoạch hóa', 'sức khỏe'],
      image: 'https://example.com/article2.jpg',
      content: 'Chi tiết về các phương pháp tránh thai hiện đại và hiệu quả.'
    },
    {
      id: 3,
      type: 'article',
      title: 'Mất cân bằng nội tiết tố: Dấu hiệu và cách khắc phục',
      excerpt: 'Những dấu hiệu cho thấy bạn đang gặp vấn đề về nội tiết tố và cách khắc phục...',
      author: 'Dr. Lê Văn Minh',
      publishDate: '2024-03-10',
      readTime: '6 phút',
      category: 'Nội tiết',
      tags: ['nội tiết tố', 'hormone', 'sức khỏe'],
      image: 'https://example.com/article3.jpg',
      content: 'Nội dung chi tiết về các dấu hiệu mất cân bằng nội tiết tố và cách khắc phục.'
    }
  ]
};

// Từ khóa phổ biến
export const popularSearchTerms = [
  'chu kỳ kinh nguyệt',
  'xét nghiệm STI',
  'tư vấn sức khỏe',
  'thuốc tránh thai',
  'chăm sóc vùng kín',
  'mang thai',
  'nội tiết tố',
  'sức khỏe sinh sản',
  'tư vấn tình dục',
  'rối loạn hormone'
];

// Hàm helper để tìm kiếm trong dữ liệu
export const searchHelper = {
  search: (query, filters = {}) => {
    const searchTerm = query.toLowerCase();
    let results = [];
    
    // Hàm lọc theo danh mục
    const filterByCategory = (item) => {
      if (!filters.category || filters.category === 'all') return true;
      return item.type === filters.category.slice(0, -1); // Remove 's' from end
    };
    
    // Hàm lọc theo location
    const filterByLocation = (item) => {
      if (!filters.location) return true;
      if (!item.location) return false;
      return item.location === filters.location;
    };
    
    // Hàm lọc theo rating
    const filterByRating = (item) => {
      if (!filters.rating || filters.rating === 'all') return true;
      return item.rating >= parseFloat(filters.rating);
    };
    
    // Tìm kiếm trong tư vấn viên
    if (!filters.category || filters.category === 'all' || filters.category === 'counselors') {
      const counselorResults = searchData.counselors.filter(item => 
        (item.name.toLowerCase().includes(searchTerm) || 
        item.specialty.toLowerCase().includes(searchTerm) || 
        item.tags.some(tag => tag.includes(searchTerm))) && 
        filterByCategory(item) && 
        filterByLocation(item) && 
        filterByRating(item)
      );
      results.push(...counselorResults);
    }
    
    // Tìm kiếm trong dịch vụ
    if (!filters.category || filters.category === 'all' || filters.category === 'services') {
      const serviceResults = searchData.services.filter(item => 
        (item.name.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm) || 
        item.tags.some(tag => tag.includes(searchTerm))) &&
        filterByCategory(item) &&
        filterByRating(item)
      );
      results.push(...serviceResults);
    }
    
    // Tìm kiếm trong bài viết
    if (!filters.category || filters.category === 'all' || filters.category === 'articles') {
      const articleResults = searchData.articles.filter(item => 
        (item.title.toLowerCase().includes(searchTerm) || 
        item.excerpt.toLowerCase().includes(searchTerm) || 
        item.tags.some(tag => tag.includes(searchTerm))) &&
        filterByCategory(item)
      );
      results.push(...articleResults);
    }
    
    // Sắp xếp kết quả
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'price_low':
          results.sort((a, b) => {
            const priceA = parseInt(a.price?.replace(/\D/g, '') || '0');
            const priceB = parseInt(b.price?.replace(/\D/g, '') || '0');
            return priceA - priceB;
          });
          break;
        case 'price_high':
          results.sort((a, b) => {
            const priceA = parseInt(a.price?.replace(/\D/g, '') || '0');
            const priceB = parseInt(b.price?.replace(/\D/g, '') || '0');
            return priceB - priceA;
          });
          break;
        case 'relevance':
        default:
          // Mặc định là độ liên quan, không cần sắp xếp thêm
          break;
      }
    }
    
    return results;
  }
}; 