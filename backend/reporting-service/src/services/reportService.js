import axios from 'axios';
import { REPORT_TYPES, ERROR_MESSAGES } from '../common/constants.js';

const reportService = {
  fetchRoomData: async () => {
    try {
      console.log("Fetching room data from Room Service at http://localhost:3003/api/rooms");
      const response = await axios.get('http://localhost:3003/api/rooms');
      const data = response.data;
      if (!Array.isArray(data)) {
        console.log("Room data is not an array, received:", data);
        throw new Error("Room data is not an array");
      }
      console.log("Room data fetched successfully:", data.length, "records", "Sample:", data[0]);
      return data;
    } catch (error) {
      console.log("Error fetching room data:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data || 'No response data',
      });
      throw new Error("Không thể lấy dữ liệu phòng từ Room Service: " + error.message);
    }
  },

  fetchBookingData: async () => {
    try {
      console.log("Fetching booking data from Booking Service at http://localhost:3004/api/bookings");
      const response = await axios.get('http://localhost:3004/api/bookings');
      const responseData = response.data;

      if (!responseData || !responseData.data || !Array.isArray(responseData.data)) {
        console.log("Booking data does not contain a valid 'data' array, received:", responseData);
        throw new Error("Booking data does not contain a valid 'data' array");
      }

      const bookings = responseData.data;
      console.log("Booking data fetched successfully:", bookings.length, "records", "Sample:", bookings[0]);
      return bookings;
    } catch (error) {
      console.log("Error fetching booking data:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data || 'No response data',
      });
      throw new Error("Không thể lấy dữ liệu đặt phòng từ Booking Service: " + error.message);
    }
  },

  fetchServiceBookingData: async () => {
    try {
      console.log("Fetching service booking data from Management Service at http://localhost:3002/api/services/bookings");
      const response = await axios.get('http://localhost:3002/api/services/bookings');
      const data = response.data;

      if (!Array.isArray(data)) {
        console.log("Service booking data is not an array, received:", data);
        throw new Error("Service booking data is not an array");
      }
      console.log("Service booking data fetched successfully:", data.length, "records", "Sample:", data[0]);
      return data;
    } catch (error) {
      console.log("Error fetching service booking data:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data || 'No response data',
      });
      throw new Error("Không thể lấy dữ liệu đặt dịch vụ từ Management Service: " + error.message);
    }
  },

  generateRevenueReport: async (period = 'daily', startDate = '2025-05-01', endDate = '2025-05-01') => {
    const bookings = await reportService.fetchBookingData();
    const serviceBookings = await reportService.fetchServiceBookingData();

    // Gom nhóm dữ liệu
    const groupedData = {};

    // Lọc dữ liệu trong khoảng thời gian
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Hàm tính số tuần trong năm
    const getWeekNumber = (date) => {
      const d = new Date(date);
      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const diff = d - startOfYear;
      const oneWeek = 1000 * 60 * 60 * 24 * 7;
      return Math.ceil((diff + startOfYear.getDay() * 1000 * 60 * 60 * 24) / oneWeek);
    };

    // Hàm tính quý
    const getQuarter = (date) => {
      const month = date.getMonth();
      return Math.floor(month / 3) + 1; // Quý 1: tháng 0-2, Quý 2: tháng 3-5, v.v.
    };

    // Xử lý bookings
    bookings.forEach(booking => {
      const checkInDate = new Date(booking.checkIn);
      if (checkInDate >= start && checkInDate <= end) {
        let key;
        if (period === 'daily') {
          const timeKey = checkInDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          key = `${timeKey}`;
        } else if (period === 'weekly') {
          const week = getWeekNumber(checkInDate);
          const year = checkInDate.getFullYear();
          key = `Tuần ${week} - ${year}`;
        } else if (period === 'monthly') {
          const month = checkInDate.toLocaleDateString('vi-VN', { month: 'long' });
          const year = checkInDate.getFullYear();
          key = `Tháng ${month} - ${year}`;
        } else if (period === 'quarterly') {
          const quarter = getQuarter(checkInDate);
          const year = checkInDate.getFullYear();
          key = `Quý ${quarter} - ${year}`;
        } else if (period === 'yearly') {
          const year = checkInDate.getFullYear();
          key = `Năm ${year}`;
        }

        if (!groupedData[key]) {
          groupedData[key] = { revenue: 0, returns: 0 };
        }
        groupedData[key].revenue += booking.totalAmount || 0;
      }
    });

    // Xử lý serviceBookings
    serviceBookings.forEach(sb => {
      const createdAt = new Date(sb.createdAt || new Date());
      if (createdAt >= start && createdAt <= end) {
        let key;
        if (period === 'daily') {
          const timeKey = createdAt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          key = `${timeKey}`;
        } else if (period === 'weekly') {
          const week = getWeekNumber(createdAt);
          const year = createdAt.getFullYear();
          key = `Tuần ${week} - ${year}`;
        } else if (period === 'monthly') {
          const month = createdAt.toLocaleDateString('vi-VN', { month: 'long' });
          const year = createdAt.getFullYear();
          key = `Tháng ${month} - ${year}`;
        } else if (period === 'quarterly') {
          const quarter = getQuarter(createdAt);
          const year = createdAt.getFullYear();
          key = `Quý ${quarter} - ${year}`;
        } else if (period === 'yearly') {
          const year = createdAt.getFullYear();
          key = `Năm ${year}`;
        }

        if (!groupedData[key]) {
          groupedData[key] = { revenue: 0, returns: 0 };
        }
        groupedData[key].revenue += sb.totalPrice || 0;
      }
    });

    // Tính tổng
    const totalRevenue = Object.values(groupedData).reduce((sum, entry) => sum + entry.revenue, 0);
    const totalReturns = 0; // Giá trị trả giả định là 0
    const netRevenue = totalRevenue - totalReturns;

    // Chuẩn bị dữ liệu cho báo cáo
    const reportData = {
      period,
      groupedData,
      totalRevenue,
      totalReturns,
      netRevenue,
      startDate: start.toLocaleDateString('vi-VN'),
      endDate: end.toLocaleDateString('vi-VN'),
      bookings: bookings.map(b => ({
        id: b.id,
        totalAmount: b.totalAmount || 0,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
      })),
      serviceBookings: serviceBookings.map(sb => ({
        id: sb.id,
        totalPrice: sb.totalPrice || 0,
        status: sb.status,
      })),
    };

    return reportData;
  },

  generateRoomStatusReport: async () => {
    const rooms = await reportService.fetchRoomData();
    return rooms.map(room => ({
      id: room.id,
      name: room.name,
      status: room.status,
      isCleaned: room.is_cleaned,
    }));
  },

  generateServiceBookingReport: async () => {
    const serviceBookings = await reportService.fetchServiceBookingData();
    return serviceBookings.map(sb => ({
      id: sb.id,
      serviceName: sb.service?.name || 'Unknown',
      customerId: sb.customerId,
      quantity: sb.quantity,
      totalPrice: sb.totalPrice || 0,
      status: sb.status,
    }));
  },
};

export default reportService;