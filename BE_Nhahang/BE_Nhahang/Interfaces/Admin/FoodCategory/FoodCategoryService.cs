using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.CategoryFood;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BE_Nhahang.Interfaces.Admin.FoodCategory
{
    public class FoodCategoryService : IFoodCategoryService
    {
        private readonly DbConfig _context;
        private readonly IHttpContextAccessorService _accessor;
        private readonly ISystemLogService _log;

        public FoodCategoryService(DbConfig context, IHttpContextAccessorService accessor, ISystemLogService log)
        {
            _context = context;
            _accessor = accessor;
            _log = log;
        }

        public async Task<ResponseDTO<object>> CreateAsync(FoodCategoryDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return new ResponseDTO<object> { IsSuccess = false, code = 400, Message = "Tên danh mục không được để trống" };

            var exists = await _context.FoodCategories.AnyAsync(x => x.Name.ToLower() == dto.Name.ToLower());
            if (exists)
                return new ResponseDTO<object> { IsSuccess = false, code = 409, Message = "Tên danh mục đã tồn tại" };

            var entity = new FoodCategoryModel
            {
                Name = dto.Name.Trim(),
                CreatedAt = DateTime.UtcNow,
                CreatedBy = _accessor.GetAdminId()
            };

            _context.FoodCategories.Add(entity);
            await _context.SaveChangesAsync();

            await _log.LogAsync("Create", "FoodCategory", entity.Id.ToString(), $"Tạo danh mục: {entity.Name}");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tạo danh mục thành công",
                Data = entity
            };
        }

        public async Task<ResponseDTO<object>> UpdateAsync(int id, FoodCategoryDTO dto)
        {
            var entity = await _context.FoodCategories.FindAsync(id);
            if (entity == null)
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Không tìm thấy danh mục" };

            var trimmedName = dto.Name.Trim();

            // Kiểm tra trùng tên (trừ chính mình)
            bool isDuplicate = await _context.FoodCategories
                .AnyAsync(x => x.Name.ToLower() == trimmedName.ToLower() && x.Id != id);

            if (isDuplicate)
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Tên danh mục đã tồn tại"
                };

            entity.Name = trimmedName;
            entity.UpdatedAt = DateTime.UtcNow;
            entity.UpdatedBy = _accessor.GetAdminId();

            await _context.SaveChangesAsync();
            await _log.LogAsync("Update", "FoodCategory", id.ToString(), $"Cập nhật danh mục: {dto.Name}");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Cập nhật danh mục thành công"
            };
        }


        public async Task<ResponseDTO<object>> DeleteAsync(int id)
        {
            var entity = await _context.FoodCategories.FindAsync(id);
            if (entity == null)
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Không tìm thấy danh mục" };

            _context.FoodCategories.Remove(entity);
            await _context.SaveChangesAsync();
            await _log.LogAsync("Delete", "FoodCategory", id.ToString(), $"Xoá danh mục: {entity.Name}");

            return new ResponseDTO<object> { IsSuccess = true, code = 200, Message = "Xoá danh mục thành công" };
        }

        public async Task<ResponseDTO<object>> GetAllAsync()
        {
            var list = await _context.FoodCategories
                            .OrderByDescending(x => x.CreatedAt)
                            .ToListAsync();
            return new ResponseDTO<object> { IsSuccess = true, code = 200, Data = list };
        }

        public async Task<ResponseDTO<object>> GetPagedAsync(int page, int pageSize)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0 || pageSize > 100) pageSize = 10;

            var query = _context.FoodCategories.OrderByDescending(x => x.CreatedAt);

            var total = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            var result = new PagedResult<FoodCategoryModel>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = total,
                TotalPages = (int)Math.Ceiling((double)total / pageSize),
                Results = items
            };

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy danh sách phân trang thành công",
                Data = result
            };
        }


        public async Task<ResponseDTO<object>> GetByIdAsync(int id, int page, int pageSize)
        {
            var category = await _context.FoodCategories.FindAsync(id);
            if (category == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy danh mục"
                };
            }

            var query = _context.Foods
                .Where(f => f.CategoryId == id)
                .OrderByDescending(f => f.CreatedAt);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var foodList = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Price,
                    f.Description,
                    f.ImageUrl
                })
                .ToListAsync();

            var result = new PagedResult<object>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Results = new List<object>
        {
            new
            {
                category = new
                {
                    category.Id,
                    category.Name,
                   
                },
                foods = foodList
            }
        }
            };

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Data = result
            };
        }

    }
}
