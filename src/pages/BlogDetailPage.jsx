import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Eye, MessageCircle, Heart, Home } from 'lucide-react';
import BlogService from '../services/BlogService';
import { toast } from 'react-toastify';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    loadBlogPost();
  }, [id]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      // Thử load từ API trước
      try {
        const response = await BlogService.getBlogPostById(id);
        
        // Kiểm tra và xử lý response
        if (response) {
          setBlogPost(response);
        } else {
          // Fallback to mock data
          setBlogPost(getMockBlogPost(id));
        }
      } catch (error) {
        console.error('Error loading blog post from API:', error);
        // Fallback to mock data
        setBlogPost(getMockBlogPost(id));
      }
      
      // Load related posts
      loadRelatedPosts();
    } catch (error) {
      console.error('Error loading blog post:', error);
      toast.error('Không thể tải bài viết');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedPosts = async () => {
    try {
      const response = await BlogService.getAllBlogPosts(1, 3);
      
      // Kiểm tra và xử lý response
      if (response && response.content && Array.isArray(response.content)) {
        setRelatedPosts(response.content.slice(0, 3));
      } else if (response && Array.isArray(response)) {
        // Nếu response là array trực tiếp
        setRelatedPosts(response.slice(0, 3));
      } else {
        // Fallback to mock related posts
        setRelatedPosts([
          {
            id: 1,
            title: 'Hướng dẫn cách chăm sóc sức khỏe phụ nữ hiệu quả',
            content: 'Chăm sóc sức khỏe phụ nữ đòi hỏi sự quan tâm đặc biệt...',
            author: { name: 'Dr. Lê Văn Minh' },
            createdAt: '2024-01-14T14:20:00',
            categories: [{ name: 'Chăm sóc sức khỏe' }]
          },
          {
            id: 2,
            title: 'Tầm quan trọng của việc xét nghiệm STI định kỳ',
            content: 'Xét nghiệm STI định kỳ là một phần quan trọng...',
            author: { name: 'Dr. Đỗ Phạm Nguyệt Thanh' },
            createdAt: '2024-01-13T09:15:00',
            categories: [{ name: 'STIs' }]
          },
          {
            id: 3,
            title: 'Lời khuyên từ chuyên gia về sức khỏe sinh sản',
            content: 'Sức khỏe sinh sản là một vấn đề quan trọng...',
            author: { name: 'Dr. Vũ Thị Thu Hiền' },
            createdAt: '2024-01-12T16:45:00',
            categories: [{ name: 'Tư vấn sức khỏe' }]
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading related posts:', error);
      // Fallback to mock related posts
      setRelatedPosts([
        {
          id: 1,
          title: 'Hướng dẫn cách chăm sóc sức khỏe phụ nữ hiệu quả',
          content: 'Chăm sóc sức khỏe phụ nữ đòi hỏi sự quan tâm đặc biệt...',
          author: { name: 'Dr. Lê Văn Minh' },
          createdAt: '2024-01-14T14:20:00',
          categories: [{ name: 'Chăm sóc sức khỏe' }]
        },
        {
          id: 2,
          title: 'Tầm quan trọng của việc xét nghiệm STI định kỳ',
          content: 'Xét nghiệm STI định kỳ là một phần quan trọng...',
          author: { name: 'Dr. Đỗ Phạm Nguyệt Thanh' },
          createdAt: '2024-01-13T09:15:00',
          categories: [{ name: 'STIs' }]
        },
        {
          id: 3,
          title: 'Lời khuyên từ chuyên gia về sức khỏe sinh sản',
          content: 'Sức khỏe sinh sản là một vấn đề quan trọng...',
          author: { name: 'Dr. Vũ Thị Thu Hiền' },
          createdAt: '2024-01-12T16:45:00',
          categories: [{ name: 'Tư vấn sức khỏe' }]
        }
      ]);
    }
  };

  const getMockBlogPost = (postId) => {
    const mockPosts = {
      1: {
        id: 1,
        title: 'Những điều cần biết về chu kỳ kinh nguyệt của phụ nữ',
        content: `
          <h2>Chu kỳ kinh nguyệt là gì?</h2>
          <p>Chu kỳ kinh nguyệt là một hiện tượng sinh lý bình thường của cơ thể phụ nữ, xảy ra hàng tháng từ tuổi dậy thì cho đến mãn kinh. Đây là quá trình cơ thể chuẩn bị cho việc mang thai.</p>
          
          <h2>Chu kỳ kinh nguyệt bình thường kéo dài bao lâu?</h2>
          <p>Một chu kỳ kinh nguyệt bình thường thường kéo dài từ 21 đến 35 ngày, với trung bình là 28 ngày. Thời gian hành kinh thường từ 3 đến 7 ngày.</p>
          
          <h2>Các giai đoạn của chu kỳ kinh nguyệt</h2>
          <h3>1. Giai đoạn hành kinh (Ngày 1-5)</h3>
          <p>Đây là giai đoạn máu kinh chảy ra ngoài. Lớp niêm mạc tử cung bong tróc và được đào thải ra ngoài cùng với máu.</p>
          
          <h3>2. Giai đoạn nang trứng (Ngày 6-14)</h3>
          <p>Trong giai đoạn này, hormone FSH kích thích các nang trứng phát triển. Một nang trứng sẽ trưởng thành và rụng trứng.</p>
          
          <h3>3. Giai đoạn rụng trứng (Ngày 14)</h3>
          <p>Trứng được giải phóng từ buồng trứng và di chuyển vào ống dẫn trứng, sẵn sàng để thụ tinh.</p>
          
          <h3>4. Giai đoạn hoàng thể (Ngày 15-28)</h3>
          <p>Nếu trứng không được thụ tinh, hoàng thể sẽ thoái hóa, dẫn đến giảm hormone và bắt đầu chu kỳ mới.</p>
          
          <h2>Dấu hiệu bất thường cần lưu ý</h2>
          <ul>
            <li>Chu kỳ không đều (dưới 21 ngày hoặc trên 35 ngày)</li>
            <li>Lượng máu kinh quá nhiều hoặc quá ít</li>
            <li>Đau bụng dữ dội trong kỳ kinh</li>
            <li>Chảy máu giữa chu kỳ</li>
            <li>Mất kinh đột ngột</li>
          </ul>
          
          <h2>Cách theo dõi chu kỳ kinh nguyệt</h2>
          <p>Việc theo dõi chu kỳ kinh nguyệt giúp bạn hiểu rõ cơ thể mình và phát hiện sớm các bất thường. Bạn có thể:</p>
          <ul>
            <li>Ghi chép ngày bắt đầu và kết thúc kỳ kinh</li>
            <li>Theo dõi các triệu chứng trong chu kỳ</li>
            <li>Sử dụng ứng dụng theo dõi chu kỳ</li>
            <li>Khám phụ khoa định kỳ</li>
          </ul>
          
          <h2>Kết luận</h2>
          <p>Chu kỳ kinh nguyệt là một phần quan trọng của sức khỏe sinh sản nữ giới. Hiểu rõ về chu kỳ kinh nguyệt giúp bạn chăm sóc sức khỏe tốt hơn và phát hiện sớm các vấn đề bất thường.</p>
        `,
        author: { name: 'Dr. Vũ Thị Thu Hiền' },
        createdAt: '2024-01-15T10:30:00',
        categories: [{ name: 'Sức khỏe sinh sản' }],
        views: 1250,
        likes: 89,
        comments: 23
      },
      2: {
        id: 2,
        title: 'Hướng dẫn cách chăm sóc sức khỏe phụ nữ hiệu quả',
        content: `
          <h2>Tầm quan trọng của việc chăm sóc sức khỏe phụ nữ</h2>
          <p>Chăm sóc sức khỏe phụ nữ đòi hỏi sự quan tâm đặc biệt và kiến thức chuyên môn. Phụ nữ có những nhu cầu sức khỏe riêng biệt cần được đáp ứng.</p>
          
          <h2>Các khía cạnh chăm sóc sức khỏe phụ nữ</h2>
          
          <h3>1. Chăm sóc sức khỏe sinh sản</h3>
          <p>Bao gồm việc khám phụ khoa định kỳ, theo dõi chu kỳ kinh nguyệt, và tầm soát các bệnh phụ khoa.</p>
          
          <h3>2. Dinh dưỡng hợp lý</h3>
          <p>Chế độ ăn uống cân bằng với đầy đủ vitamin và khoáng chất, đặc biệt là sắt, canxi và axit folic.</p>
          
          <h3>3. Tập luyện thể thao</h3>
          <p>Vận động thường xuyên giúp tăng cường sức khỏe tim mạch, xương khớp và tinh thần.</p>
          
          <h3>4. Chăm sóc tinh thần</h3>
          <p>Quản lý stress, ngủ đủ giấc và duy trì các mối quan hệ lành mạnh.</p>
          
          <h2>Lời khuyên từ chuyên gia</h2>
          <ul>
            <li>Khám sức khỏe định kỳ ít nhất 1 lần/năm</li>
            <li>Tiêm phòng đầy đủ các loại vaccine cần thiết</li>
            <li>Duy trì cân nặng hợp lý</li>
            <li>Hạn chế rượu bia và thuốc lá</li>
            <li>Bảo vệ da khỏi tác hại của ánh nắng mặt trời</li>
          </ul>
        `,
        author: { name: 'Dr. Lê Văn Minh' },
        createdAt: '2024-01-14T14:20:00',
        categories: [{ name: 'Chăm sóc sức khỏe' }],
        views: 980,
        likes: 67,
        comments: 18
      },
      3: {
        id: 3,
        title: 'Tầm quan trọng của việc xét nghiệm STI định kỳ',
        content: `
          <h2>STI là gì?</h2>
          <p>STI (Sexually Transmitted Infections) là các bệnh lây truyền qua đường tình dục. Đây là những bệnh nhiễm trùng có thể lây từ người này sang người khác qua quan hệ tình dục.</p>
          
          <h2>Tại sao cần xét nghiệm STI định kỳ?</h2>
          <p>Nhiều bệnh STI không có triệu chứng rõ ràng trong giai đoạn đầu, khiến người bệnh không biết mình đã mắc bệnh. Xét nghiệm định kỳ giúp:</p>
          <ul>
            <li>Phát hiện sớm bệnh</li>
            <li>Điều trị kịp thời</li>
            <li>Ngăn ngừa biến chứng</li>
            <li>Bảo vệ sức khỏe của bạn và đối tác</li>
          </ul>
          
          <h2>Các loại xét nghiệm STI phổ biến</h2>
          
          <h3>1. Xét nghiệm HIV</h3>
          <p>Xét nghiệm máu để phát hiện virus HIV gây bệnh AIDS.</p>
          
          <h3>2. Xét nghiệm Chlamydia và Gonorrhea</h3>
          <p>Xét nghiệm nước tiểu hoặc dịch âm đạo để phát hiện vi khuẩn gây bệnh.</p>
          
          <h3>3. Xét nghiệm HPV</h3>
          <p>Xét nghiệm Pap smear để phát hiện virus HPV và tế bào bất thường.</p>
          
          <h3>4. Xét nghiệm Herpes</h3>
          <p>Xét nghiệm máu để phát hiện virus Herpes simplex.</p>
          
          <h2>Khi nào nên xét nghiệm STI?</h2>
          <ul>
            <li>Trước khi bắt đầu quan hệ với đối tác mới</li>
            <li>Sau khi quan hệ không an toàn</li>
            <li>Khi có triệu chứng bất thường</li>
            <li>Định kỳ 6-12 tháng/lần nếu có quan hệ tình dục</li>
          </ul>
          
          <h2>Lưu ý khi xét nghiệm</h2>
          <p>Xét nghiệm STI được thực hiện một cách bảo mật và kín đáo. Kết quả chỉ được chia sẻ với bạn và bác sĩ điều trị.</p>
        `,
        author: { name: 'Dr. Đỗ Phạm Nguyệt Thanh' },
        createdAt: '2024-01-13T09:15:00',
        categories: [{ name: 'STIs' }],
        views: 1560,
        likes: 112,
        comments: 34
      },
      4: {
        id: 4,
        title: 'Lời khuyên từ chuyên gia về sức khỏe sinh sản',
        content: `
          <h2>Sức khỏe sinh sản là gì?</h2>
          <p>Sức khỏe sinh sản là trạng thái hoàn toàn khỏe mạnh về thể chất, tinh thần và xã hội trong tất cả các vấn đề liên quan đến hệ thống sinh sản.</p>
          
          <h2>Những vấn đề sức khỏe sinh sản phổ biến</h2>
          
          <h3>1. Rối loạn kinh nguyệt</h3>
          <p>Bao gồm kinh nguyệt không đều, đau bụng kinh, rong kinh, thiểu kinh.</p>
          
          <h3>2. Bệnh phụ khoa</h3>
          <p>Viêm âm đạo, viêm cổ tử cung, u xơ tử cung, lạc nội mạc tử cung.</p>
          
          <h3>3. Vấn đề sinh sản</h3>
          <p>Khó thụ thai, sảy thai, sinh non.</p>
          
          <h2>Lời khuyên từ chuyên gia</h2>
          
          <h3>1. Khám phụ khoa định kỳ</h3>
          <p>Phụ nữ nên khám phụ khoa ít nhất 1 lần/năm, ngay cả khi không có triệu chứng bất thường.</p>
          
          <h3>2. Theo dõi chu kỳ kinh nguyệt</h3>
          <p>Ghi chép và theo dõi chu kỳ kinh nguyệt để phát hiện sớm các bất thường.</p>
          
          <h3>3. Duy trì lối sống lành mạnh</h3>
          <p>Ăn uống cân bằng, tập luyện thường xuyên, ngủ đủ giấc, quản lý stress.</p>
          
          <h3>4. Bảo vệ khi quan hệ tình dục</h3>
          <p>Sử dụng bao cao su và các biện pháp bảo vệ khác để ngăn ngừa STI.</p>
          
          <h3>5. Không tự ý dùng thuốc</h3>
          <p>Luôn tham khảo ý kiến bác sĩ trước khi sử dụng bất kỳ loại thuốc nào.</p>
          
          <h2>Khi nào cần gặp bác sĩ?</h2>
          <ul>
            <li>Chu kỳ kinh nguyệt bất thường</li>
            <li>Đau bụng dữ dội</li>
            <li>Chảy máu bất thường</li>
            <li>Khí hư bất thường</li>
            <li>Đau khi quan hệ tình dục</li>
            <li>Khó thụ thai sau 1 năm cố gắng</li>
          </ul>
          
          <h2>Kết luận</h2>
          <p>Sức khỏe sinh sản là vấn đề quan trọng mà mọi phụ nữ cần quan tâm. Việc chăm sóc sức khỏe sinh sản đúng cách giúp phòng ngừa bệnh tật và duy trì chất lượng cuộc sống tốt.</p>
        `,
        author: { name: 'Dr. Vũ Thị Thu Hiền' },
        createdAt: '2024-01-12T16:45:00',
        categories: [{ name: 'Tư vấn sức khỏe' }],
        views: 890,
        likes: 56,
        comments: 15
      }
    };
    
    return mockPosts[postId] || mockPosts[1];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fafdfe'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #e1e5e9',
            borderTop: '4px solid #3a99b7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666' }}>Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#fafdfe'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#666', marginBottom: '20px' }}>Không tìm thấy bài viết</h2>
          <Link 
            to="/blog" 
            style={{
              color: '#3a99b7',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ← Quay lại trang blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafdfe' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #3a99b7 0%, #2d7a91 100%)',
        color: 'white',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Navigation buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <Home size={18} />
              Trang chủ
            </Link>
            
            <Link 
              to="/blog"
              style={{
                color: 'white',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <ArrowLeft size={18} />
              Quay lại trang blog
            </Link>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            {blogPost.categories?.map(category => (
              <span 
                key={category.id} 
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  marginRight: '10px',
                  marginBottom: '10px'
                }}
              >
                {category.name}
              </span>
            ))}
          </div>
          
          <h1 style={{ 
            fontSize: '36px', 
            marginBottom: '20px', 
            lineHeight: '1.3',
            fontWeight: 'bold'
          }}>
            {blogPost.title}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} />
              <span>{blogPost.author?.name || 'Gynexa'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} />
              <span>{formatDate(blogPost.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={16} />
              <span>{blogPost.views || Math.floor(Math.random() * 1000) + 500}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 300px',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Article Content */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div 
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
              style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#333'
              }}
            />
            
            {/* Article Footer */}
            <div style={{ 
              marginTop: '40px',
              paddingTop: '30px',
              borderTop: '1px solid #e1e5e9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  border: '1px solid #3a99b7',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#3a99b7',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  <Heart size={16} />
                  Thích ({blogPost.likes || Math.floor(Math.random() * 100) + 20})
                </button>
                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  border: '1px solid #3a99b7',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#3a99b7',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  <MessageCircle size={16} />
                  Bình luận ({blogPost.comments || Math.floor(Math.random() * 50) + 10})
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Chia sẻ:</span>
                <button style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#1877f2',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Facebook
                </button>
                <button style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#1da1f2',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Twitter
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h3 style={{ 
              fontSize: '20px', 
              marginBottom: '20px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Bài viết liên quan
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    padding: '15px',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#3a99b7';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e1e5e9';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <h4 style={{ 
                    fontSize: '16px', 
                    marginBottom: '8px',
                    color: '#333',
                    lineHeight: '1.4'
                  }}>
                    {post.title}
                  </h4>
                                     <p style={{ 
                     fontSize: '14px', 
                     color: '#666',
                     marginBottom: '8px',
                     lineHeight: '1.5'
                   }}>
                     {post.content?.replace(/<[^>]*>/g, '').substring(0, 80)}...
                   </p>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <User size={12} />
                    {post.author?.name || 'Gynexa'}
                  </div>
                </Link>
              ))}
            </div>
            
            <div style={{ 
              marginTop: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, #3a99b7 0%, #2d7a91 100%)',
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h4 style={{ marginBottom: '10px' }}>Cần tư vấn?</h4>
              <p style={{ fontSize: '14px', marginBottom: '15px' }}>
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn
              </p>
              <Link
                to="/tu-van"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: 'white',
                  color: '#3a99b7',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Tư vấn ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        h2 {
          color: #3a99b7;
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 24px;
        }
        
        h3 {
          color: #2d7a91;
          margin-top: 25px;
          margin-bottom: 12px;
          font-size: 20px;
        }
        
        p {
          margin-bottom: 15px;
        }
        
        ul {
          margin-bottom: 15px;
          padding-left: 20px;
        }
        
        li {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailPage; 