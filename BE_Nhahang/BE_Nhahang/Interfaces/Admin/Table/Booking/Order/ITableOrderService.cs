using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;

namespace BE_Nhahang.Interfaces.Admin.Table.Booking.Order
{
    public interface ITableOrderService
    {
        Task<ResponseDTO<object>> AddOrdersByFoodIdAsync( AddOrderByFoodIdRequestDTO dTO );

        Task<ResponseDTO<object>> UpdateOrderStatusAsync(UpdateTableOrderStatusDTO dto);
        Task<ResponseDTO<string>> DeleteMultipleOrdersAsync(DeleteOrdersDTO deleteOrdersDTO);
    }
}
