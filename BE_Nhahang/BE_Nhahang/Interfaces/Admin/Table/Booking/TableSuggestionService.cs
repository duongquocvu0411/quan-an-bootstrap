using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Tables.Booking;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Table;
using Microsoft.EntityFrameworkCore;

namespace BE_Nhahang.Interfaces.Admin.Table.Booking
{
    public class TableSuggestionService : ITableSuggestionService
    {
        private readonly DbConfig _context;

        public TableSuggestionService(DbConfig context)
        {
            _context = context;
        }

        public async Task<ResponseDTO<PagedResult<TableModel>>> SuggestTablesAsync(SuggestTableDTO dto, int pageNumber, int pageSize)
        {
            if (dto.GuestCount <= 0)
            {
                return new ResponseDTO<PagedResult<TableModel>>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Số lượng khách không hợp lệ"
                };
            }

            var query = _context.Tables
                .Where(t => !t.isDeleted && t.Capacity >= dto.GuestCount)
                .OrderBy(t => t.Capacity);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var results = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            if (!results.Any())
            {
                return new ResponseDTO<PagedResult<TableModel>>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy bàn phù hợp"
                };
            }

            var pagedResult = new PagedResult<TableModel>
            {
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Results = results
            };

            return new ResponseDTO<PagedResult<TableModel>>
            {
                IsSuccess = true,
                code = 200,
                Message = "Danh sách bàn phù hợp",
                Data = pagedResult
            };
        }

    }
}
