using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Helpers;
using BE_Nhahang.Helpers.Booking;
using BE_Nhahang.Helpers.TemplateEmail;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Interfaces.Admin.Sendmail;
using BE_Nhahang.Models.Entities.Table;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using static System.Net.WebRequestMethods;

namespace BE_Nhahang.Interfaces.Admin.Table.Booking.CreateBooking
{
    public class TableBookingService : ITableBookingService
    {
        private readonly DbConfig _db;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessorService _httpContextAccessorService;
        private readonly ISystemLogService _systemLogService;

        public TableBookingService(DbConfig db, IEmailSender emailSender, IConfiguration config,
            ISystemLogService systemLogService, IHttpContextAccessorService httpContextAccessorService)
        {
            _db = db;
            _emailSender = emailSender;
            _config = config;
            _systemLogService = systemLogService;
            _httpContextAccessorService = httpContextAccessorService;
        }


        public async Task<ResponseDTO<object>> LookupAsync(BookingLookupFilterDTO filter)
        {
            var response = new ResponseDTO<object>();

            var query = _db.TableBookings
                .Include(b => b.Table)
                .AsQueryable();

            // Áp dụng các điều kiện nếu có
            if (!string.IsNullOrWhiteSpace(filter.BookingCode))
                query = query.Where(b => b.BookingCode == filter.BookingCode);

            if (filter.TableId.HasValue)
                query = query.Where(b => b.TableId == filter.TableId);

            if (!string.IsNullOrWhiteSpace(filter.CustomerPhone))
                query = query.Where(b => b.CustomerPhone.Contains(filter.CustomerPhone));

            if (!string.IsNullOrWhiteSpace(filter.CustomerEmail))
                query = query.Where(b => b.CustomerEmail.Contains(filter.CustomerEmail));

            if (!string.IsNullOrWhiteSpace(filter.CustomerName))
                query = query.Where(b => b.CustomerName.Contains(filter.CustomerName));

            // Lấy bản ghi đầu tiên phù hợp
            var booking = await query.FirstOrDefaultAsync();

            if (booking == null)
            {
                response.IsSuccess = false;
                response.code = 404;
                response.Message = "Không tìm thấy đơn đặt bàn theo tiêu chí.";
                return response;
            }

            response.Data = new
            {
                booking.Id,
                booking.BookingCode,
                booking.CustomerName,
                booking.CustomerPhone,
                booking.CustomerEmail,
                booking.Status,
                booking.BookingTime,
                booking.GuestCount,
                booking.Note,
                TableNumber = booking.Table?.TableNumber
            };

            response.code = 200;
            response.Message = "Tra cứu thành công.";
            return response;
        }

        public async Task<ResponseDTO<object>> CreateBookingAsync(TableBookingDTO dto)
        {
            var response = new ResponseDTO<object>();

            await using var tran = await _db.Database.BeginTransactionAsync();
            try
            {
                // 1. Kiểm tra bàn
                var table = await _db.Tables
                    .AsNoTracking()
                    .Where(t => t.Id == dto.TableId && !t.isDeleted)
                    .FirstOrDefaultAsync();

                if (table == null)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 404,
                        Message = "Bàn không tồn tại hoặc đã bị xóa."
                    };
                }

                if (table.Status != "Available")
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = $"Bàn hiện tại đang ở trạng thái '{table.Status}'."
                    };
                }

                if (dto.GuestCount > table.Capacity)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = $"Bàn số {table.TableNumber} chỉ chứa tối đa {table.Capacity} khách."
                    };
                }

                // 2. Tạo mã booking & entity
                var bookingCode = await BookingCodeGenerator.GenerateAsync(_db);
                var booking = new TableBookingModel
                {
                    TableId = dto.TableId,
                    BookingCode = bookingCode,
                    CustomerName = dto.CustomerName,
                    CustomerEmail = dto.CustomerEmail,
                    CustomerPhone = dto.CustomerPhone,
                    BookingTime = dto.BookingTime,
                    GuestCount = dto.GuestCount,
                    Note = dto.Note,
                    Status = "Booked",
                    CreatedAt = DateTime.Now,
                    CreatedBy = dto.CustomerName
                };

                await _db.TableBookings.AddAsync(booking);

                // 3. Cập nhật trạng thái bàn
                _db.Entry(new TableModel { Id = table.Id, Status = "Reserved" })
                    .Property(x => x.Status).IsModified = true;

                // 4. Lưu database & commit
                await _db.SaveChangesAsync();
              
                await tran.CommitAsync();
                await _systemLogService.LogAsyncs(Userid: dto.CustomerName,
                                      action: "Create",
                                      entityName: "TableBooking",
                                      entityId: booking.Id.ToString(),
                                       $"Khách hàng {booking.CustomerName} đã đặt bàn #{booking.TableId} với mã {booking.BookingCode}"
                                  );

                // 5. Gửi email (sau khi commit, không ảnh hưởng transaction)
                var subjectCustomer = "Xác nhận đặt bàn tại Nhà Hàng";
                var htmlCustomer = EmailTemplateGenerator.GenerateForCustomer(dto, bookingCode);
                _ = _emailSender.SendEmailAsync(dto.CustomerEmail, subjectCustomer, htmlCustomer);

                var systemEmail = _config["Smtp:Username"];
                var subjectSystem = $"[New Booking] {dto.CustomerName} đã đặt bàn";
                var htmlSystem = EmailTemplateGenerator.GenerateForSystem(dto, bookingCode);
                _ = _emailSender.SendEmailAsync(systemEmail, subjectSystem, htmlSystem);

                response.Data = new { booking.Id, bookingCode };
                response.code = 200;
                response.Message = "Đặt bàn thành công.";
                return response;
            }
            catch (Exception ex)
            {
                if (tran?.GetDbTransaction()?.Connection != null)
                {
                    await tran.RollbackAsync();
                }

                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = "Lỗi khi đặt bàn: " + ex.Message
                };
            }

        }


        public async Task<ResponseDTO<object>> UpdateStatusAsync(UpdateBookingStatusDTO dto)
        {
            var response = new ResponseDTO<object>();

            var booking = await _db.TableBookings.Include(b => b.Table).FirstOrDefaultAsync(b => b.Id == dto.BookingId);
            if (booking == null)
            {
                response.IsSuccess = false;
                response.code = 404;
                response.Message = "Không tìm thấy đơn đặt bàn.";
                return response;
            }

            // 1. Kiểm tra trạng thái hiện tại có được phép cập nhật không
            if (!BookingStatusHelper.CanUpdate(booking.Status))
            {
                response.IsSuccess = false;
                response.code = 400;
                response.Message = $"Trạng thái hiện tại ({booking.Status}) không cho phép cập nhật.";
                return response;
            }

            // 2. Kiểm tra trạng thái mới có hợp lệ không
            var allowedStatuses = new[] { "CheckedIn", "Completed", "Canceled" };
            if (!allowedStatuses.Contains(dto.NewStatus))
            {
                response.IsSuccess = false;
                response.code = 400;
                response.Message = "Trạng thái mới không hợp lệ.";
                return response;
            }

            // 3. Cập nhật trạng thái đơn đặt bàn
            booking.Status = dto.NewStatus;
            booking.UpdatedAt = DateTime.Now;
            booking.UpdatedBy = _httpContextAccessorService.GetAdminId();

            // 4. Ghi log hệ thống (chỉnh lại mô tả log)
            await _systemLogService.LogAsync(
                "Update",
                "TableBooking",
                booking.Id.ToString(),
                $"Cập nhật trạng thái booking thành {dto.NewStatus}"
            );

            // 5. Cập nhật trạng thái bàn nếu cần
            var newTableStatus = BookingStatusHelper.GetUpdatedTableStatus(dto.NewStatus);
            if (newTableStatus != null)
            {
                booking.Table!.Status = newTableStatus;
                booking.Table.UpdatedAt = DateTime.Now;
                booking.Table.UpdatedBy = _httpContextAccessorService.GetAdminId();
            }

            await _db.SaveChangesAsync();

            response.code = 200;
            response.Message = $"Cập nhật trạng thái thành công: {dto.NewStatus}";
            response.Data = booking.Status;
            return response;
        }


        public async Task<ResponseDTO<object>> DeleteAsync(int bookingId)
        {
            var response = new ResponseDTO<object>();

            var booking = await _db.TableBookings.Include(b => b.Table)
                                                 .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
            {
                response.IsSuccess = false;
                response.code = 404;
                response.Message = "Không tìm thấy đơn đặt bàn.";
                return response;
            }

            if (booking.Status == "CheckedIn" || booking.Status == "Completed")
            {
                response.IsSuccess = false;
                response.code = 400;
                response.Message = "Không thể xóa đơn đã hoàn thành hoặc đã check-in.";
                return response;
            }

            // Cập nhật trạng thái bàn nếu đơn đang giữ bàn
            if (booking.Status == "Booked" && booking.Table != null)
            {
                booking.Table.Status = "Available";
                booking.Table.UpdatedAt = DateTime.Now;
                booking.Table.UpdatedBy = _httpContextAccessorService.GetAdminId();
            }

            _db.TableBookings.Remove(booking);
            await _db.SaveChangesAsync();

            response.code = 200;
            response.Message = "Xóa đơn đặt bàn thành công.";
            return response;
        }
    }
}