export interface MCNService {
  id: number;
  name: string;
  price: number;
  duration: number; // minutes
  description?: string;
  thumbnail?: string;
  category_id?: number;
  is_book_service: number;
  mcn_id: string;
  doctor_id?: string | number;
  doctor_name?: string;
  channel_id?: string;
}

export interface MCNDoctor {
  id: string | number;
  mcn_id: string;
  mcn_name: string;
  full_name: string;
  avatar: string;
  position: string; // 'Bác sĩ CKII', 'Điều dưỡng trưởng'
  specialization: string; // 'Chấn thương - Chỉnh hình', 'Nhi khoa'
  rating: number;
  total_reviews: number;
  work_area: string;
  phone?: string;
  experience_years?: number;
  hasServices: boolean;
  services: MCNService[];
}

export interface MCNHospital {
  id: string; // mcn_id
  name: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  distanceKm: number;
  avatar: string;
  coverImage?: string;
  rating: number;
  totalReviews: number;
  description: string;
  workingHours: string;
  doctors: MCNDoctor[];
  latitude?: number;
  longitude?: number;
}

/**
 * Danh sách MCN (Bệnh viện & Phòng khám đối tác)
 * Khởi tạo theo dữ liệu mockup người dùng yêu cầu:
 * 1. Bệnh Viện Vĩnh Đức Đà Nẵng (email: chauthoanguyen300199@gmail.com)
 * 2. Bệnh viện Nhi Hà Nội (email: thaopham.ctxh@nhihanoi.vn)
 * 3. PK Đa khoa 102 (email: ta6562660@gmail.com)
 */
export const MOCK_MCN_LIST: MCNHospital[] = [
  {
    id: 'mcn_vinh_duc',
    name: 'Bệnh Viện Vĩnh Đức Đà Nẵng',
    email: 'chauthoanguyen300199@gmail.com',
    phone: '+84 235 3767 555',
    address: 'QL1A, P. Điện Nam Trung, TX. Điện Bàn, Đà Nẵng / Quảng Nam',
    district: 'Điện Bàn',
    city: 'Đà Nẵng',
    distanceKm: 1.2,
    latitude: 15.9084,
    longitude: 108.2831,
    avatar: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    rating: 4.9,
    totalReviews: 128,
    description: 'Bệnh viện đa khoa chuẩn quốc tế với hệ thống trang thiết bị hiện đại, đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm kết nối chăm sóc sức khỏe tại nhà.',
    workingHours: '07:00 - 20:00 (Thứ 2 - Chủ Nhật)',
    doctors: [
      {
        id: 'dr_vd_01',
        mcn_id: 'mcn_vinh_duc',
        mcn_name: 'Bệnh Viện Vĩnh Đức Đà Nẵng',
        full_name: 'BS. CKII Nguyễn Thanh Trí',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
        position: 'Bác sĩ Chuyên khoa II',
        specialization: 'Chấn thương - Chỉnh hình & Tâm lý',
        rating: 5.0,
        total_reviews: 46,
        work_area: 'Đà Nẵng, Quảng Nam',
        phone: '+84775905614',
        experience_years: 12,
        hasServices: true,
        services: [
          {
            id: 201,
            name: 'Khám & Phục hồi chức năng khớp gối tại nhà',
            price: 350000,
            duration: 45,
            description: 'Khám kiểm tra mức độ phục hồi chức năng vận động, hướng dẫn bài tập vật lý trị liệu tại nhà.',
            category_id: 1,
            is_book_service: 1,
            mcn_id: 'mcn_vinh_duc',
            doctor_id: 'dr_vd_01',
            doctor_name: 'BS. CKII Nguyễn Thanh Trí',
            channel_id: 'channel_vd_01',
          },
          {
            id: 202,
            name: 'Tư vấn sức khỏe tâm lý & giảm stress',
            price: 250000,
            duration: 30,
            description: 'Tư vấn trực tiếp hoặc online về rối loạn giấc ngủ, căng thẳng tâm lý học tập và làm việc.',
            category_id: 2,
            is_book_service: 1,
            mcn_id: 'mcn_vinh_duc',
            doctor_id: 'dr_vd_01',
            doctor_name: 'BS. CKII Nguyễn Thanh Trí',
            channel_id: 'channel_vd_01',
          },
        ],
      },
      {
        id: 'dr_vd_02',
        mcn_id: 'mcn_vinh_duc',
        mcn_name: 'Bệnh Viện Vĩnh Đức Đà Nẵng',
        full_name: 'ĐD. Trần Thị Mỹ Linh',
        avatar: 'https://images.unsplash.com/photo-1594824813576-a05e267d32c9?w=400&q=80',
        position: 'Điều dưỡng trưởng',
        specialization: 'Chăm sóc vết thương hậu phẫu & Thay băng',
        rating: 4.8,
        total_reviews: 32,
        work_area: 'Quận Ngũ Hành Sơn, Hải Châu',
        experience_years: 8,
        hasServices: true,
        services: [
          {
            id: 203,
            name: 'Thay băng & Cắt chỉ vết mổ chuẩn y khoa',
            price: 180000,
            duration: 30,
            description: 'Quy trình vô khuẩn tuyệt đối, giảm đau tối đa và theo dõi tiến trình hồi phục của mô.',
            category_id: 1,
            is_book_service: 1,
            mcn_id: 'mcn_vinh_duc',
            doctor_id: 'dr_vd_02',
            doctor_name: 'ĐD. Trần Thị Mỹ Linh',
            channel_id: 'channel_vd_02',
          },
        ],
      },
      {
        id: 'dr_vd_03',
        mcn_id: 'mcn_vinh_duc',
        mcn_name: 'Bệnh Viện Vĩnh Đức Đà Nẵng',
        full_name: 'BS. Lê Hoàng Nam',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80',
        position: 'Bác sĩ Nội tổng quát',
        specialization: 'Nội khoa & Tim mạch',
        rating: 4.9,
        total_reviews: 58,
        work_area: 'Đà Nẵng',
        experience_years: 15,
        hasServices: true,
        services: [
          {
            id: 204,
            name: 'Khám sức khỏe tổng quát & Đo điện tim tại nhà',
            price: 450000,
            duration: 60,
            description: 'Kiểm tra huyết áp, đo ECG tim, tư vấn điều trị cao huyết áp và đái tháo đường.',
            category_id: 3,
            is_book_service: 1,
            mcn_id: 'mcn_vinh_duc',
            doctor_id: 'dr_vd_03',
            doctor_name: 'BS. Lê Hoàng Nam',
            channel_id: 'channel_vd_03',
          },
        ],
      },
    ],
  },
  {
    id: 'mcn_nhi_hn',
    name: 'Bệnh viện Nhi Hà Nội',
    email: 'thaopham.ctxh@nhihanoi.vn',
    phone: '+84 24 3834 3700',
    address: 'Đường Nguyễn Trãi, Q. Thanh Xuân, TP. Hà Nội',
    district: 'Thanh Xuân',
    city: 'Hà Nội',
    distanceKm: 2.5,
    latitude: 20.9781,
    longitude: 105.7483,
    avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    rating: 4.95,
    totalReviews: 215,
    description: 'Bệnh viện chuyên khoa Nhi đầu ngành, cung cấp các gói chăm sóc mẹ và bé sơ sinh, tầm soát sức khỏe nhi khoa tại nhà đạt chuẩn Bộ Y tế.',
    workingHours: '07:30 - 21:00 (Hàng ngày)',
    doctors: [
      {
        id: 'dr_nh_01',
        mcn_id: 'mcn_nhi_hn',
        mcn_name: 'Bệnh viện Nhi Hà Nội',
        full_name: 'ThS. BS Phạm Thảo Nguyên',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
        position: 'Thạc sĩ - Bác sĩ Nhi khoa',
        specialization: 'Dinh dưỡng & Bệnh lý Nhi khoa',
        rating: 5.0,
        total_reviews: 84,
        work_area: 'Hà Nội (Thanh Xuân, Cầu Giấy, Đống Đa)',
        experience_years: 10,
        hasServices: true,
        services: [
          {
            id: 205,
            name: 'Khám & Tư vấn dinh dưỡng biếng ăn cho bé',
            price: 300000,
            duration: 40,
            description: 'Đánh giá biểu đồ tăng trưởng, tư vấn phác đồ dinh dưỡng cải thiện cân nặng và tiêu hóa cho trẻ.',
            category_id: 4,
            is_book_service: 1,
            mcn_id: 'mcn_nhi_hn',
            doctor_id: 'dr_nh_01',
            doctor_name: 'ThS. BS Phạm Thảo Nguyên',
            channel_id: 'channel_nh_01',
          },
          {
            id: 206,
            name: 'Khám hô hấp & Khò khè sơ sinh tại nhà',
            price: 350000,
            duration: 45,
            description: 'Khám tai mũi họng, nghe tim phổi, hướng dẫn hút mũi và vệ sinh đường thở đúng cách.',
            category_id: 4,
            is_book_service: 1,
            mcn_id: 'mcn_nhi_hn',
            doctor_id: 'dr_nh_01',
            doctor_name: 'ThS. BS Phạm Thảo Nguyên',
            channel_id: 'channel_nh_01',
          },
        ],
      },
      {
        id: 'dr_nh_02',
        mcn_id: 'mcn_nhi_hn',
        mcn_name: 'Bệnh viện Nhi Hà Nội',
        full_name: 'ĐD. Lê Thị Mai Hoa',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        position: 'Cử nhân Điều dưỡng Nhi',
        specialization: 'Tắm bé sơ sinh & Massage mẹ sau sinh',
        rating: 4.9,
        total_reviews: 67,
        work_area: 'Hà Nội',
        experience_years: 7,
        hasServices: true,
        services: [
          {
            id: 207,
            name: 'Gói tắm bé sơ sinh chuẩn y khoa & Chăm sóc rốn',
            price: 150000,
            duration: 45,
            description: 'Tắm bé, vệ sinh mắt mũi miệng, chăm sóc cuống rốn vô khuẩn và massage thư giãn cho bé.',
            category_id: 4,
            is_book_service: 1,
            mcn_id: 'mcn_nhi_hn',
            doctor_id: 'dr_nh_02',
            doctor_name: 'ĐD. Lê Thị Mai Hoa',
            channel_id: 'channel_nh_02',
          },
        ],
      },
    ],
  },
  {
    id: 'mcn_pk_102',
    name: 'PK Đa khoa 102',
    email: 'ta6562660@gmail.com',
    phone: '+84 236 3899 102',
    address: '102 Trần Phú, P. Hải Châu 1, Q. Hải Châu, TP. Đà Nẵng',
    district: 'Hải Châu',
    city: 'Đà Nẵng',
    distanceKm: 3.8,
    latitude: 16.068,
    longitude: 108.223,
    avatar: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    rating: 4.8,
    totalReviews: 94,
    description: 'Phòng khám đa khoa hiện đại, cung cấp dịch vụ lấy mẫu xét nghiệm tận nơi, chăm sóc người cao tuổi và phục hồi chức năng.',
    workingHours: '06:30 - 19:30 (Thứ 2 - Thứ 7)',
    doctors: [
      {
        id: 'dr_pk_01',
        mcn_id: 'mcn_pk_102',
        mcn_name: 'PK Đa khoa 102',
        full_name: 'BS. Tạ Văn Quân',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
        position: 'Bác sĩ Trưởng phòng khám',
        specialization: 'Nội tiết & Lão khoa',
        rating: 4.85,
        total_reviews: 41,
        work_area: 'Hải Châu, Thanh Khê, Sơn Trà',
        experience_years: 18,
        hasServices: true,
        services: [
          {
            id: 208,
            name: 'Gói lấy mẫu xét nghiệm máu & Nước tiểu tại nhà',
            price: 220000,
            duration: 20,
            description: 'Kỹ thuật viên đến tận nhà lấy mẫu an toàn, trả kết quả online kèm bác sĩ tư vấn kết quả.',
            category_id: 3,
            is_book_service: 1,
            mcn_id: 'mcn_pk_102',
            doctor_id: 'dr_pk_01',
            doctor_name: 'BS. Tạ Văn Quân',
            channel_id: 'channel_pk_01',
          },
          {
            id: 209,
            name: 'Chăm sóc & Quản lý bệnh mạn tính cho người cao tuổi',
            price: 400000,
            duration: 60,
            description: 'Khám định kỳ, kiểm tra đường huyết, điều chỉnh đơn thuốc và chế độ sinh hoạt.',
            category_id: 3,
            is_book_service: 1,
            mcn_id: 'mcn_pk_102',
            doctor_id: 'dr_pk_01',
            doctor_name: 'BS. Tạ Văn Quân',
            channel_id: 'channel_pk_01',
          },
        ],
      },
    ],
  },
];

/**
 * Lấy tất cả bác sĩ từ các MCN
 */
export const getAllDoctorsFromMCN = (): MCNDoctor[] => {
  const doctors: MCNDoctor[] = [];
  MOCK_MCN_LIST.forEach(hospital => {
    doctors.push(...hospital.doctors);
  });
  return doctors;
};

/**
 * Lấy tất cả dịch vụ từ các MCN
 */
export const getAllServicesFromMCN = (): MCNService[] => {
  const services: MCNService[] = [];
  MOCK_MCN_LIST.forEach(hospital => {
    hospital.doctors.forEach(doc => {
      services.push(...doc.services);
    });
  });
  return services;
};

/**
 * Danh sách dịch vụ hot gợi ý khi tìm kiếm không có kết quả
 */
export const POPULAR_SUGGESTED_SERVICES = [
  {
    id: 101,
    name: 'Tắm bé sơ sinh & Massage chuẩn y khoa',
    price: 150000,
    rating: '5.0',
    total_ratings: 86,
    is_hot: true,
    nurse_name: 'ĐD. Lê Thị Mai Hoa',
    thumbnail: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&q=80',
    mcn_name: 'Bệnh viện Nhi Hà Nội',
  },
  {
    id: 102,
    name: 'Thay băng & Cắt chỉ vết thương tại nhà',
    price: 180000,
    rating: '4.9',
    total_ratings: 64,
    is_hot: true,
    nurse_name: 'ĐD. Trần Thị Mỹ Linh',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80',
    mcn_name: 'Bệnh Viện Vĩnh Đức Đà Nẵng',
  },
  {
    id: 103,
    name: 'Khám & Phục hồi chức năng khớp gối tại nhà',
    price: 350000,
    rating: '5.0',
    total_ratings: 46,
    is_hot: true,
    nurse_name: 'BS. CKII Nguyễn Thanh Trí',
    thumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80',
    mcn_name: 'Bệnh Viện Vĩnh Đức Đà Nẵng',
  },
  {
    id: 104,
    name: 'Lấy mẫu xét nghiệm máu tận nơi',
    price: 220000,
    rating: '4.8',
    total_ratings: 52,
    is_hot: false,
    nurse_name: 'PK Đa khoa 102',
    thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80',
    mcn_name: 'PK Đa khoa 102',
  },
];
