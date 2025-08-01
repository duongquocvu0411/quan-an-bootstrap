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

    }
}
