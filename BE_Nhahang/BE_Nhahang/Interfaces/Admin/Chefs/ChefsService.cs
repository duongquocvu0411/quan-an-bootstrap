using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Chefs;
using BE_Nhahang.Services.Cloudinary;
using Microsoft.EntityFrameworkCore;
using static BE_Nhahang.DTOS.Admin.Chefs.ChefsDTO;

namespace BE_Nhahang.Interfaces.Admin.Chefs
{
    public class ChefsService : IChefsService
    {
        private readonly DbConfig _context;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IHttpContextAccessorService _httpContextAccessor;
        private readonly ISystemLogService _systemLogService;

        public ChefsService(DbConfig context, ICloudinaryService cloudinaryService,
            IHttpContextAccessorService httpContextAccessor, ISystemLogService systemLogService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _httpContextAccessor = httpContextAccessor;
            _systemLogService = systemLogService;
        }

        public async Task<ResponseDTO<PagedResult<ChefsModel>>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isActive = true)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;

            var query = _context.Chefs
                .Where(c => c.IsActive == isActive) // lọc trạng thái
                .OrderBy(c => c.DisplayOrder)
                .AsQueryable();

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var data = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var pagedResult = new PagedResult<ChefsModel>
            {
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Results = data
            };

            return new ResponseDTO<PagedResult<ChefsModel>>
            {
                IsSuccess = true,
                code = 200,
                Data = pagedResult,
                Message = "Lấy danh sách Chef thành công"
            };
        }



        public async Task<ResponseDTO<object>> GetAllClientAsync()
        {
            var data = await _context.Chefs
                .Where(c => c.IsActive == true)
                .OrderBy(c => c.DisplayOrder).ToListAsync();
            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Data = data
            };
        }

        public async Task<ResponseDTO<object>> GetByIdAsync(int id)
        {
            var chef = await _context.Chefs.FindAsync(id);
            if (chef == null)
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Chef không tồn tại" };

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Data = chef
            };
        }

        public async Task<ResponseDTO<object>> CreateAsync(ChefsCreateDTO dto)
        {
            if (await _context.Chefs.AnyAsync(c => c.DisplayOrder == dto.DisplayOrder))
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "DisplayOrder đã tồn tại"
                };
            }

            string imageUrl = null;
            if (dto.ImageFile != null)
            {
                imageUrl = await _cloudinaryService.UploadImageAsync(dto.ImageFile, "chefs", true);
            }

            var model = new ChefsModel
            {
                Name = dto.Name,
                Role = dto.Role,
                DisplayOrder = dto.DisplayOrder,
                ImageUrl = imageUrl,
                TwitterLink = dto.TwitterLink,
                FacebookLink = dto.FacebookLink,
                instagramLink = dto.InstagramLink,
                LinkedinLink = dto.LinkedinLink,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = _httpContextAccessor.GetAdminId()
            };

            _context.Chefs.Add(model);
            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("Create", "Chefs", model.Id.ToString(), $"Tạo Chef: {model.Name}");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tạo Chef thành công",
                Data = model
            };
        }

        public async Task<ResponseDTO<object>> UpdateAsync(ChefsUpdateDTO dto)
        {
            var chef = await _context.Chefs.FindAsync(dto.Id);
            if (chef == null)
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Chef không tồn tại" };

            // Nếu đổi DisplayOrder thì kiểm tra trùng
            if (chef.DisplayOrder != dto.DisplayOrder && await _context.Chefs.AnyAsync(c => c.DisplayOrder == dto.DisplayOrder))
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "DisplayOrder đã tồn tại"
                };
            }

            chef.Name = dto.Name;
            chef.Role = dto.Role;
            chef.DisplayOrder = dto.DisplayOrder;
            chef.TwitterLink = dto.TwitterLink;
            chef.FacebookLink = dto.FacebookLink;
            chef.instagramLink = dto.InstagramLink;
            chef.LinkedinLink = dto.LinkedinLink;
            chef.IsActive = dto.IsActive;
            chef.UpdatedAt = DateTime.UtcNow;
            chef.UpdatedBy = _httpContextAccessor.GetAdminId();

            // Nếu có ảnh mới thì upload
            if (dto.ImageFile != null)
            {
                chef.ImageUrl = await _cloudinaryService.UploadImageAsync(dto.ImageFile, "chefs", true);
            }

            await _context.SaveChangesAsync();
            await _systemLogService.LogAsync("Update", "Chefs", chef.Id.ToString(), $"Cập nhật Chef: {chef.Name}");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Cập nhật Chef thành công",
                Data = chef
            };
        }

        public async Task<ResponseDTO<object>> DeleteAsync(List<int> ids)
        {
            var chefs = await _context.Chefs.Where(c => ids.Contains(c.Id)).ToListAsync();
            if (!chefs.Any())
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Không tìm thấy Chef để xóa" };

            _context.Chefs.RemoveRange(chefs);
            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("Delete", "Chefs", string.Join(",", ids), $"Đã xóa {chefs.Count} Chef");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = $"Đã xóa {chefs.Count} bản ghi Chef"
            };
        }
    }
}
