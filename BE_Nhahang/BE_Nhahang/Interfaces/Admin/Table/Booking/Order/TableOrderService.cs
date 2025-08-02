using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Models.Entities.Table;
using Microsoft.EntityFrameworkCore;

namespace BE_Nhahang.Interfaces.Admin.Table.Booking.Order
{
    public class TableOrderService : ITableOrderService
    {
        private readonly DbConfig _context;
        private readonly IHttpContextAccessorService _httpContextAccessorService;

        public TableOrderService(DbConfig context, IHttpContextAccessorService httpContextAccessorService)
        {
            _context = context;
            _httpContextAccessorService = httpContextAccessorService;
        }

        public async Task<ResponseDTO<object>> AddOrdersByFoodIdAsync(AddOrderByFoodIdRequestDTO request)
        {
            // Bắt đầu transaction
            await using var tran = await _context.Database.BeginTransactionAsync();
            try
            {
                var booking = await _context.TableBookings.FindAsync(request.BookingId);
                if (booking == null)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 404,
                        Message = "Booking không tồn tại."
                    };
                }

                // Lấy thông tin món ăn từ DB
                var foodIds = request.Items.Select(i => i.FoodId).Distinct().ToList();
                var foodMap = await _context.Foods
                    .Where(f => foodIds.Contains(f.Id))
                    .ToDictionaryAsync(f => f.Id, f => new { f.Name, f.Price });

                var invalidFoodIds = foodIds.Except(foodMap.Keys).ToList();
                if (invalidFoodIds.Any())
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = $"Món ăn không tồn tại: {string.Join(", ", invalidFoodIds)}"
                    };
                }

                var now = DateTime.UtcNow;
                var createdBy = _httpContextAccessorService.GetAdminId(); // hoặc lấy từ Claims

                var orders = request.Items.Select(item =>
                {
                    var food = foodMap[item.FoodId];
                    var total = food.Price * item.Quantity;

                    return new TableOrderModel
                    {
                        BookingId = request.BookingId,
                        FoodName = food.Name,           // lấy tên từ FoodModel
                        Quantity = item.Quantity,
                        PriceAtOrder = food.Price,       // lấy giá từ FoodModel
                        TotalPrice = total,             // = price * quantity
                        Note = item.note,
                        Status = "Ordered",
                        CreatedAt = now,
                        CreatedBy = createdBy
                    };
                }).ToList();

                await _context.TableOrders.AddRangeAsync(orders);
                await _context.SaveChangesAsync();

                // Commit khi mọi thứ OK
                await tran.CommitAsync();

                return new ResponseDTO<object>
                {
                    IsSuccess = true,
                    code = 201,
                    Message = "Gọi món thành công.",
                    Data = new { OrderIds = orders.Select(o => o.Id).ToList() }
                };
            }
            catch (DbUpdateException ex)
            {
                await tran.RollbackAsync();
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Lỗi lưu dữ liệu: {ex.GetBaseException().Message}"
                };
            }
            catch (Exception ex)
            {
                await tran.RollbackAsync();
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Lỗi không xác định: {ex.Message}"
                };
            }
        }



        public async Task<ResponseDTO<object>> UpdateOrderStatusAsync(UpdateTableOrderStatusDTO dto)
        {
            var order = await _context.TableOrders.FindAsync(dto.Id);
            if (order == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Order not found."
                };
            }

            order.Status = dto.Status;  // Cập nhật trạng thái món ăn
            order.UpdatedAt = DateTime.UtcNow;
            order.UpdatedBy = _httpContextAccessorService.GetAdminId();
            _context.TableOrders.Update(order);
            await _context.SaveChangesAsync();

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Order status updated successfully.",
                Data = order.Status
            };
        }


        public async Task<ResponseDTO<string>> DeleteMultipleOrdersAsync(DeleteOrdersDTO dto)
        {
            if (dto?.OrderIds == null || dto.OrderIds.Count == 0)
            {
                return new ResponseDTO<string>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Không có đơn hàng nào được chọn để xóa"
                };
            }

            var requestedIds = dto.OrderIds.Distinct().ToHashSet();

            // Lấy mỏng: chỉ Id, Status để quyết định xoá (nhanh hơn)
            var found = await _context.TableOrders
                .AsNoTracking()
                .Where(o => requestedIds.Contains(o.Id))
                .Select(o => new { o.Id, o.Status })
                .ToListAsync();

            if (found.Count == 0)
            {
                return new ResponseDTO<string>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy đơn hàng nào để xóa"
                };
            }

            static bool IsServed(string? s) =>
                string.Equals(s?.Trim(), "Served", StringComparison.OrdinalIgnoreCase);

            var servedIds = found.Where(x => IsServed(x.Status)).Select(x => x.Id).ToList();
            var deletableIds = found.Where(x => !IsServed(x.Status)).Select(x => x.Id).ToList();
            var notFoundIds = requestedIds.Except(found.Select(x => x.Id)).ToList();

            if (deletableIds.Count == 0)
            {
                var msgNone =
                    $"Không xoá được đơn hàng nào. Đã yêu cầu: {requestedIds.Count}. " +
                    (servedIds.Count > 0 ? $"Bị chặn (Served): [{string.Join(", ", servedIds)}]. " : "") +
                    (notFoundIds.Count > 0 ? $"Không tồn tại: [{string.Join(", ", notFoundIds)}]." : "");

                return new ResponseDTO<string>
                {
                    IsSuccess = false,
                    code = 409,
                    Message = msgNone
                };
            }

            // EF Core 8: bulk delete trực tiếp tại DB (nhanh, không load entity)
            var affected = await _context.TableOrders
                .Where(o => deletableIds.Contains(o.Id))
                .ExecuteDeleteAsync();

            var skipped = servedIds.Concat(notFoundIds).ToList();

            var msg =
                $"Yêu cầu: {requestedIds.Count}. Đã xoá: {affected}. " +
                (skipped.Count > 0
                    ? $"Bị bỏ qua: [{string.Join(", ", skipped)}] (Served hoặc không tồn tại)."
                    : "Không có bản ghi bị bỏ qua.");

            return new ResponseDTO<string>
            {
                IsSuccess = true,
                code = 200,
                Message = msg
            };
        }

    }
}
