using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Tables;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Table;
using BE_Nhahang.Services.Cloudinary;
using Microsoft.EntityFrameworkCore;

namespace BE_Nhahang.Interfaces.Admin.Table
{
    public class TableService : ITableService
    {
        private readonly DbConfig _context;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IHttpContextAccessorService _httpContext;
        private readonly ISystemLogService _systemLogService;

        public TableService(DbConfig context, ICloudinaryService cloudinaryService, 
            IHttpContextAccessorService httpContext, ISystemLogService systemLogService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _httpContext = httpContext;
            _systemLogService = systemLogService;
        }

        public async Task<ResponseDTO<PagedResult<object>>> GetAllTablesAsync(int page, int pageSize, bool? isDeleted)
        {
            try
            {
                bool filterDeleted = isDeleted ?? false;

                var query = _context.Tables
                    .AsNoTracking()
                    .Where(t => t.isDeleted == filterDeleted);

                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

                var tables = await query
                    .OrderByDescending(t => t.TableNumber)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return new ResponseDTO<PagedResult<object>>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Lấy danh sách bàn thành công",
                    Data = new PagedResult<object>
                    {
                        CurrentPage = page,
                        PageSize = pageSize,
                        TotalCount = totalCount,
                        TotalPages = totalPages,
                        Results = tables
                    }
                };
            }
            catch (Exception ex)
            {
                return new ResponseDTO<PagedResult<object>>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Lỗi khi truy vấn danh sách bàn: {ex.Message}"
                };
            }
        }


        public async Task<ResponseDTO<object>> GetTableDetailAsync(int id, int page, int pageSize)
        {
            var table = await _context.Tables
                .Include(t => t.TableImages)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (table == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Bàn ăn không tồn tại"
                };
            }

            // Lấy danh sách booking của bàn đó, có phân trang
            var query = _context.TableBookings
                .Where(b => b.TableId == id)
                .OrderByDescending(b => b.Status == "Booked"); // ưu tiên theo thời gian đặt

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var bookings = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new
                {
                    b.Id,
                    b.BookingCode,
                    b.CustomerName,
                    b.CustomerEmail,
                    b.CustomerPhone,
                    b.BookingTime,
                    b.GuestCount,
                    b.Status,
                    b.Note,
                    b.CreatedAt,
                    b.CreatedBy,
                    b.UpdatedAt,
                    b.UpdatedBy,
                })
                .ToListAsync();

            var result = new
            {
                Table = new
                {
                    table.Id,
                    table.TableNumber,
                    table.Capacity,
                    table.Status,
                    table.Location,
                    table.CreatedAt,
                    table.CreatedBy,
                    table.UpdatedAt,
                    table.UpdatedBy,
                    table.isDeleted,
                    Images = table.TableImages?.Select(i => i.ImageUrl).ToList()
                },
                Bookings = new PagedResult<object>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Results = bookings
                }
            };

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy chi tiết bàn thành công",
                Data = result
            };
        }



        public async Task<ResponseDTO<object>> GetTableDetailForClientAsync(int id)
        {
            var table = await _context.Tables
                .Include(t => t.TableImages)
                .FirstOrDefaultAsync(t => t.Id == id && t.isDeleted == false);

            if (table == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Bàn ăn không tồn tại"
                };
            }

            var result = new
            {
                table.Id,
                table.TableNumber,
                table.Capacity,
                table.Status,
                table.Location,
                table.CreatedAt,
                table.CreatedBy,
                table.UpdatedAt,
                table.UpdatedBy,
                Images = table.TableImages?.Select(img => img.ImageUrl).ToList()
            };

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy chi tiết bàn thành công",
                Data = result
            };
        }


        public async Task<ResponseDTO<object>> GetBookingOrderDetailAsync(int bookingId, int page, int pageSize)
        {
            var booking = await _context.TableBookings
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Thông tin đặt bàn không tồn tại"
                };
            }

            var totalOrders = await _context.TableOrders
                .Where(o => o.BookingId == bookingId)
                .CountAsync();

            var totalPages = (int)Math.Ceiling((double)totalOrders / pageSize);

            var orders = await _context.TableOrders
                .Where(o => o.BookingId == bookingId)
                .OrderBy(o => o.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new
                {
                    o.Id,
                    o.FoodName,
                    o.Quantity,
                    o.PriceAtOrder,
                    o.Note,
                    o.Status,
                    o.CreatedAt,
                    o.CreatedBy,
                    o.UpdatedAt,
                    o.UpdatedBy
                })
                .ToListAsync();

            var result = new
            {
                Booking = new
                {
                    booking.Id,
                    booking.TableId,
                    booking.CustomerName,
                    booking.CustomerEmail,
                    booking.CustomerPhone,
                    booking.BookingTime,
                    booking.GuestCount,
                    booking.Status,
                    booking.Note,
                    booking.CreatedAt,
                    booking.CreatedBy,
                    booking.UpdatedAt,
                    booking.UpdatedBy
                },
                Orders = new PagedResult<object>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalCount = totalOrders,
                    TotalPages = totalPages,
                    Results = orders
                }
            };

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy chi tiết booking và đơn gọi món thành công",
                Data = result
            };
        }




        public async Task<ResponseDTO<object>> CreateTableAsync(TableDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var table = new TableModel
                {
                    TableNumber = dto.TableNumber,
                    Capacity = dto.Capacity,
                    Status = dto.Status,
                    Location = dto.Location,
                    isDeleted = false,
                    CreatedBy = _httpContext.GetAdminId(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Tables.Add(table);
                await _context.SaveChangesAsync(); 

                // Xử lý ảnh nếu có
                if (dto.Images != null && dto.Images.Any())
                {
                    var uploadTasks = dto.Images
                        .Where(f => f.Length > 0)
                        .Select(async file =>
                        {
                            var url = await _cloudinaryService.UploadImageAsync(file, "tables", true);
                            return new TableImageModel
                            {
                                TableId = table.Id,
                                ImageUrl = url,
                                CreatedBy = _httpContext.GetAdminId(),
                            };
                        }).ToList();

                    var images = await Task.WhenAll(uploadTasks);
                    _context.TableImages.AddRange(images);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                await _systemLogService.LogAsync(
                                            "Create",
                                            "Table",
                                            table.Id.ToString(),
                                            $"Tạo bàn ăn: {table.TableNumber}"
);

                return new ResponseDTO<object>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Tạo bàn ăn thành công",
                    Data = new
                    {
                        table.Id,
                        table.TableNumber,
                        table.Capacity,
                        table.Status,
                        table.Location,
                        Images = table.TableImages?.Select(img => new {
                            img.Id,
                            img.ImageUrl
                        }).ToList()
                    }
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Lỗi khi tạo bàn ăn: {ex.Message}"
                };
            }
        }



        public async Task<ResponseDTO<object>> UpdateTableAsync(int id, TableDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var table = await _context.Tables.FindAsync(id);
                if (table == null)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 404,
                        Message = "Bàn ăn không tồn tại"
                    };
                }

                // Cập nhật thông tin bàn
                table.TableNumber = dto.TableNumber;
                table.Capacity = dto.Capacity;
                table.Status = dto.Status;
                table.Location = dto.Location;
                table.UpdatedBy = _httpContext.GetAdminId();
                table.UpdatedAt = DateTime.UtcNow;

                // Xử lý ảnh phụ
                var existingImages = await _context.TableImages
                    .Where(x => x.TableId == table.Id)
                    .OrderBy(x => x.Id)
                    .ToListAsync();

                if (dto.Images == null || dto.Images.Count == 0)
                {
                    // Xoá hết ảnh cũ nếu không gửi ảnh mới
                    if (existingImages.Any())
                    {
                        _context.TableImages.RemoveRange(existingImages);
                    }
                }
                else
                {
                    var uploadTasks = dto.Images
                        .Select(async (file, index) =>
                        {
                            if (file == null || file.Length == 0)
                                return (Index: index, Url: (string?)null);

                            var url = await _cloudinaryService.UploadImageAsync(file, "tables", true);
                            return (Index: index, Url: url);
                        }).ToList();

                    var uploadResults = await Task.WhenAll(uploadTasks);
                    var updatedImageIds = new List<int>();

                    foreach (var result in uploadResults)
                    {
                        if (string.IsNullOrEmpty(result.Url)) continue;

                        if (result.Index < existingImages.Count)
                        {
                            existingImages[result.Index].ImageUrl = result.Url;
                            existingImages[result.Index].UpdatedBy = _httpContext.GetAdminId();
                            existingImages[result.Index].UpdatedAt = DateTime.UtcNow;
                            updatedImageIds.Add(existingImages[result.Index].Id);
                        }
                        else
                        {
                            var newImg = new TableImageModel
                            {
                                TableId = table.Id,
                                ImageUrl = result.Url,
                                CreatedBy = _httpContext.GetAdminId()
                            };
                            _context.TableImages.Add(newImg);
                        }
                    }

                    // Xoá các ảnh dư thừa
                    var redundant = existingImages
                        .Where(img => !updatedImageIds.Contains(img.Id))
                        .ToList();

                    if (redundant.Any())
                    {
                        _context.TableImages.RemoveRange(redundant);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await _systemLogService.LogAsync("Update", "Table", table.Id.ToString(), $"Cập nhật bàn ăn: {table.TableNumber}");

                return new ResponseDTO<object>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Cập nhật bàn ăn thành công",
                    Data = new
                    {
                        table.Id,
                        table.TableNumber,
                        table.Capacity,
                        table.Status,
                        table.Location
                    }
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Đã xảy ra lỗi khi cập nhật bàn ăn: {ex.Message}"
                };
            }
        }


        public async Task<ResponseDTO<object>> SoftDeleteTableAsync(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Bàn ăn không tồn tại" };
            }

            if (table.isDeleted)
            {
                return new ResponseDTO<object> { IsSuccess = false, code = 400, Message = "Bàn đã bị xoá mềm rồi" };
            }

            table.isDeleted = true;
            table.UpdatedBy = _httpContext.GetAdminId();
            table.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("SoftDelete", "Table", id.ToString(), $"Xoá mềm bàn ăn: {table.TableNumber}");

            return new ResponseDTO<object> { IsSuccess = true, code = 200, Message = "Xoá mềm thành công" };
        }



        public async Task<ResponseDTO<object>> RestoreTableAsync(int id)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Bàn ăn không tồn tại" };
            }

            if (!table.isDeleted)
            {
                return new ResponseDTO<object> { IsSuccess = false, code = 400, Message = "Bàn không bị xoá mềm" };
            }

            table.isDeleted = false;
            table.UpdatedBy = _httpContext.GetAdminId();
            table.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("Restore", "Table", id.ToString(), $"Khôi phục bàn ăn: {table.TableNumber}");

            return new ResponseDTO<object> { IsSuccess = true, code = 200, Message = "Khôi phục thành công" };
        }




        public async Task<ResponseDTO<object>> DeleteTablePermanentlyAsync(int id)
        {
            var table = await _context.Tables
                .Include(t => t.TableImages)
                .Include(t => t.Bookings)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (table == null)
            {
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Bàn ăn không tồn tại" };
            }

            _context.TableImages.RemoveRange(table.TableImages ?? []);
            _context.TableBookings.RemoveRange(table.Bookings ?? []);
            _context.Tables.Remove(table);

            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("Delete", "Table", id.ToString(), $"Xoá vĩnh viễn bàn ăn: {table.TableNumber}");

            return new ResponseDTO<object> { IsSuccess = true, code = 200, Message = "Xoá vĩnh viễn thành công" };
        }


    }
}

