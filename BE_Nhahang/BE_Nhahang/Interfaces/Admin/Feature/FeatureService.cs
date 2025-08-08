using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Features;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.About;
using BE_Nhahang.Services.Cloudinary;
using Microsoft.EntityFrameworkCore;
using System;

namespace BE_Nhahang.Interfaces.Admin.Feature
{
    public class FeatureService : IFeatureService
    {
        private readonly DbConfig _context;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IHttpContextAccessorService _httpContextAccessor;
        private readonly ISystemLogService _systemLogService;

        public FeatureService(DbConfig context, ICloudinaryService cloudinaryService, IHttpContextAccessorService httpContextAccessor, ISystemLogService systemLogService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _httpContextAccessor = httpContextAccessor;
            _systemLogService = systemLogService;
        }

        public async Task<ResponseDTO<PagedResult<object>>> GetPagedAsync(int page, int pageSize, bool isActive = true)
        {
            var query = _context.Features.Where(f => f.isActive == isActive).OrderBy(f => f.DisplayOrder);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var results = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
               .ToListAsync();

            return new ResponseDTO<PagedResult<object>>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy danh sách thành công",
                Data = new PagedResult<object>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Results = results
                }
            };
        }

        public async Task<ResponseDTO<object>> GetActiveFeaturesAsync()
        {
            var features = await _context.Features
                .Where(f => f.isActive)
                .OrderBy(f => f.DisplayOrder)
               .ToListAsync();

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Danh sách đặc trưng đang hoạt động",
                Data = features
            };
        }


        public async Task<ResponseDTO<object>> GetByIdAsync(int id)
        {
            var feature = await _context.Features.FindAsync(id);
            if (feature == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy tính năng"
                };
            }

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Thành công",
                Data = feature
            };
        }

        public async Task<ResponseDTO<object>> CreateAsync(FeaturesDTO dto)
        {
            if (await _context.Features.AnyAsync(f => f.DisplayOrder == dto.DisplayOrder))
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
                imageUrl = await _cloudinaryService.UploadImageAsync(dto.ImageFile, "features", true);
            }

            var model = new FeaturesModel
            {
                Title = dto.Title,
                Description = dto.Description,
                link = dto.Link,
                image = imageUrl,
                DisplayOrder = dto.DisplayOrder,
                isActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = _httpContextAccessor.GetAdminId()
            };

            _context.Features.Add(model);
            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("Create", "Feature", model.Id.ToString(), $"Tạo Feature: {model.Title}");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tạo tính năng thành công",
                Data = model
            };
        }

        public async Task<ResponseDTO<object>> UpdateAsync(int id, FeaturesDTO dto)
        {
            var feature = await _context.Features.FindAsync(id);
            if (feature == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy tính năng"
                };
            }

            if (feature.DisplayOrder != dto.DisplayOrder)
            {
                bool isDuplicateOrder = await _context.Features.AnyAsync(f => f.DisplayOrder == dto.DisplayOrder && f.Id != id);
                if (isDuplicateOrder)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = "DisplayOrder đã tồn tại"
                    };
                }
            }

            if (dto.ImageFile != null)
            {
                feature.image = await _cloudinaryService.UploadImageAsync(dto.ImageFile, "features", true);
            }

            feature.Title = dto.Title;
            feature.Description = dto.Description;
            feature.link = dto.Link;
            feature.DisplayOrder = dto.DisplayOrder;
            feature.isActive = dto.IsActive;
            feature.UpdatedAt = DateTime.UtcNow;
            feature.UpdatedBy = _httpContextAccessor.GetAdminId();

            await _context.SaveChangesAsync();

            await _systemLogService.LogAsync("Update", "Feature", id.ToString(), $"Cập nhật Feature: {feature.Title}");

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Cập nhật tính năng thành công",
                Data = feature
            };
        }

        public async Task<ResponseDTO<object>> DeleteMultipleAsync(List<int> ids)
        {
            var features = await _context.Features.Where(f => ids.Contains(f.Id)).ToListAsync();

            if (!features.Any())
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy tính năng nào để xóa"
                };
            }

            _context.Features.RemoveRange(features);
            await _context.SaveChangesAsync();

            foreach (var f in features)
            {
                await _systemLogService.LogAsync("Delete", "Feature", f.Id.ToString(), $"Xóa Feature: {f.Title}");
            }

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = $"Đã xóa thành công {features.Count} tính năng"
            };
        }
    }
}

