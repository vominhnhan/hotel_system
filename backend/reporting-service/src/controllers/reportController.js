import reportService from "../services/reportService.js";
import { REPORT_TYPES, ERROR_MESSAGES } from "../common/constants.js";

const reportController = {
  generateReport: async (req, res) => {
    console.log("Generating report with query:", req.query); // Debug
    const { type, period, startDate, endDate } = req.query;
    try {
      let reportData;
      switch (type) {
        case REPORT_TYPES.REVENUE:
          reportData = await reportService.generateRevenueReport(period, startDate, endDate);
          break;
        case REPORT_TYPES.ROOM_STATUS:
          reportData = await reportService.generateRoomStatusReport();
          break;
        case REPORT_TYPES.SERVICE_BOOKING:
          reportData = await reportService.generateServiceBookingReport();
          break;
        default:
          return res.status(400).json({ error: ERROR_MESSAGES.INVALID_REPORT_TYPE });
      }
      res.status(200).json(reportData);
    } catch (error) {
      console.log("Error in generateReport:", error.message); // Debug
      res.status(500).json({ error: error.message });
    }
  },
};

export default reportController;
