using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.About;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Helpers;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.About;
using BE_Nhahang.Services.Cloudinary;
using Microsoft.EntityFrameworkCore;
using System;

namespace BE_Nhahang.Interfaces.Admin.About
{
    public class AboutService : IAboutService
    {
        private readonly DbConfig _context;
        private readonly ICloudinaryService _cloudinary;
        private readonly IHttpContextAccessorService _http;
        private readonly ISystemLogService _log;

        public AboutService(DbConfig context, ICloudinaryService cloudinary, IHttpContextAccessorService http, ISystemLogService log)
        {
            _context = context;
            _cloudinary = cloudinary;
            _http = http;
            _log = log;
        }

        public async Task<ResponseDTO<PagedResult<object>>> GetPagedAboutsAsync(int page, int pageSize, bool? isActive)
        {
            var query = _context.Abouts.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(a => a.IsActive == isActive.Value);
            }

            var totalCount = await query.CountAsync();

            var results = await query
                .OrderByDescending(a => a.DisplayOrder)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    a.Id,
                    Descriptions = HtmlHelper.TruncateText(HtmlHelper.RemoveHtmlTags(a.Descriptions), 50),
                    a.IsActive,
                    a.CreatedAt,
                    a.CreatedBy,
                    a.UpdatedAt,
                    a.UpdatedBy
                })
                .ToListAsync();

            var paged = new PagedResult<object>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Results = results
            };

            return new ResponseDTO<PagedResult<object>>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy danh sách thành công",
                Data = paged
            };
        }


        public async Task<ResponseDTO<object>> GetByIdAsync(int id)
        {
            var about = await _context.Abouts
                .Include(a => a.Images)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (about == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy thông tin giới thiệu"
                };
            }

            var result = new
            {
                about.Id,
                about.Descriptions,
                about.IsActive,
                about.DisplayOrder,
                about.CreatedAt,
                about.CreatedBy,
                about.UpdatedAt,
                about.UpdatedBy,
                Images = about.Images.Select(i => new
                {
                    i.Id,
                    i.url,
                    i.displayOrder
                }).ToList()
            };

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy chi tiết thành công",
                Data = result
            };
        }

        public async Task<ResponseDTO<IEnumerable<object>>> GetAllActiveAsync()
        {
            var result = await _context.Abouts
                .Include(a => a.Images)
                .Where(a => a.IsActive)
                .OrderBy(a => a.DisplayOrder)
                .Select(a => new
                {
                    a.Id,
                    a.Descriptions,
                    a.IsActive,
                    a.DisplayOrder,
                    Images = a.Images
                    .OrderBy(i => i.displayOrder)
                    .Select(i => new
                    {
                        i.Id,
                        i.url,
                        i.displayOrder
                    }).ToList()
                })
                .ToListAsync();

            return new ResponseDTO<IEnumerable<object>>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy danh sách thành công",
                Data = result
            };
        }

        public async Task<ResponseDTO<object>> CreateAboutAsync(AboutDTO dto)
        {
            using var tran = await _context.Database.BeginTransactionAsync();

            try
            {
                if (dto.AboutDisplayOrder <= 0)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = "DisplayOrder không hợp lệ"
                    };
                }


                // Kiểm tra AboutDisplayOrder không trùng
                var isDuplicateOrder = await _context.Abouts
                    .AnyAsync(a => a.DisplayOrder == dto.AboutDisplayOrder);

                if (isDuplicateOrder)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 409,
                        Message = $"DisplayOrder {dto.AboutDisplayOrder} đã tồn tại, vui lòng chọn giá trị khác"
                    };
                }

                var about = new AboutModel
                {
                    Descriptions = dto.Descriptions,
                    IsActive = dto.IsActive,
                    DisplayOrder = dto.AboutDisplayOrder,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = _http.GetAdminId()
                };

                _context.Abouts.Add(about);
                await _context.SaveChangesAsync(); // cần Id để tạo ảnh

                // Validate ảnh
                if (dto.Images != null && dto.Images.Any())
                {
                    if (dto.DisplayOrders == null || dto.DisplayOrders.Count != dto.Images.Count)
                    {
                        return new ResponseDTO<object>
                        {
                            IsSuccess = false,
                            code = 400,
                            Message = "Số lượng ảnh và DisplayOrder không khớp"
                        };
                    }

                    var isDuplicated = dto.DisplayOrders.GroupBy(x => x).Any(g => g.Count() > 1);
                    if (isDuplicated)
                    {
                        return new ResponseDTO<object>
                        {
                            IsSuccess = false,
                            code = 400,
                            Message = "DisplayOrder ảnh bị trùng"
                        };
                    }

                    var uploadTasks = dto.Images.Select((img, index) => Task.Run(async () =>
                    {
                        var url = await _cloudinary.UploadImageAsync(img, "abouts", true);
                        return new AboutImageModel
                        {
                            AboutId = about.Id,
                            url = url,
                            displayOrder = dto.DisplayOrders[index]
                        };
                    })).ToList();

                    var images = await Task.WhenAll(uploadTasks);
                    _context.AboutImages.AddRange(images);
                }

                await _context.SaveChangesAsync();
                await tran.CommitAsync();

                await _log.LogAsync("Create", "About", about.Id.ToString(), $"Tạo giới thiệu: {about.Descriptions}");

                return new ResponseDTO<object>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Tạo thông tin giới thiệu thành công"
                };
            }
            catch (Exception ex)
            {
                await tran.RollbackAsync();
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Lỗi khi tạo About: {ex.Message}"
                };
            }
        }


        public async Task<ResponseDTO<object>> UpdateAboutAsync(int id, AboutDTO dto)
        {
            using var tran = await _context.Database.BeginTransactionAsync();

            try
            {


                var about = await _context.Abouts.FindAsync(id);
                if (about == null)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 404,
                        Message = "Không tìm thấy thông tin giới thiệu"
                    };
                }
                if (dto.AboutDisplayOrder <= 0)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = "DisplayOrder không hợp lệ"
                    };
                }

                // Kiểm tra AboutDisplayOrder không trùng (ngoại trừ chính nó)
                var isDuplicateOrder = await _context.Abouts
                    .AnyAsync(a => a.DisplayOrder == dto.AboutDisplayOrder && a.Id != id);
                if (isDuplicateOrder)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 409,
                        Message = $"DisplayOrder {dto.AboutDisplayOrder} đã tồn tại, vui lòng chọn giá trị khác"
                    };
                }

                about.Descriptions = dto.Descriptions;
                about.IsActive = dto.IsActive;
                about.DisplayOrder = dto.AboutDisplayOrder;
                about.UpdatedBy = _http.GetAdminId();
                about.UpdatedAt = DateTime.UtcNow;

                var existingImages = await _context.AboutImages
                    .Where(i => i.AboutId == about.Id)
                    .OrderBy(i => i.Id)
                    .ToListAsync();

                // Xử lý ảnh
                if (dto.Images == null || dto.Images.Count == 0)
                {
                    _context.AboutImages.RemoveRange(existingImages);
                }
                else
                {
                    if (dto.DisplayOrders == null || dto.DisplayOrders.Count != dto.Images.Count)
                    {
                        return new ResponseDTO<object>
                        {
                            IsSuccess = false,
                            code = 400,
                            Message = "Số lượng ảnh và DisplayOrder không khớp"
                        };
                    }

                    var isDuplicated = dto.DisplayOrders.GroupBy(x => x).Any(g => g.Count() > 1);
                    if (isDuplicated)
                    {
                        return new ResponseDTO<object>
                        {
                            IsSuccess = false,
                            code = 400,
                            Message = "DisplayOrder ảnh bị trùng"
                        };
                    }

                    var uploadTasks = dto.Images.Select((file, index) => Task.Run(async () =>
                    {
                        if (file == null || file.Length == 0)
                            return (index, url: (string?)null);

                        var url = await _cloudinary.UploadImageAsync(file, "abouts", true);
                        return (index, url);
                    })).ToList();

                    var results = await Task.WhenAll(uploadTasks);
                    var updatedIds = new List<int>();

                    foreach (var result in results)
                    {
                        if (string.IsNullOrEmpty(result.url)) continue;

                        if (result.index < existingImages.Count)
                        {
                            existingImages[result.index].url = result.url;
                            existingImages[result.index].displayOrder = dto.DisplayOrders[result.index];
                            updatedIds.Add(existingImages[result.index].Id);
                        }
                        else
                        {
                            _context.AboutImages.Add(new AboutImageModel
                            {
                                AboutId = about.Id,
                                url = result.url,
                                displayOrder = dto.DisplayOrders[result.index]
                            });
                        }
                    }

                    var removeImages = existingImages
                        .Where(i => !updatedIds.Contains(i.Id))
                        .ToList();

                    if (removeImages.Any())
                    {
                        _context.AboutImages.RemoveRange(removeImages);
                    }
                }

                await _context.SaveChangesAsync();
                await tran.CommitAsync();

                await _log.LogAsync("Update", "About", about.Id.ToString(), $"Cập nhật giới thiệu: {about.Descriptions}");

                return new ResponseDTO<object>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Cập nhật thành công"
                };
            }
            catch (Exception ex)
            {
                await tran.RollbackAsync();
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Lỗi khi cập nhật About: {ex.Message}"
                };
            }
        }



        public async Task<ResponseDTO<object>> DeleteAsync(List<int> ids)
        {
            var abouts = await _context.Abouts
                .Where(a => ids.Contains(a.Id))
                .Include(a => a.Images)
                .ToListAsync();

            if (!abouts.Any())
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy bản ghi cần xoá"
                };
            }

            _context.AboutImages.RemoveRange(abouts.SelectMany(a => a.Images));
            _context.Abouts.RemoveRange(abouts);
            await _context.SaveChangesAsync();

            foreach (var about in abouts)
            {
                await _log.LogAsync("Delete", "About", about.Id.ToString(), $"Xoá giới thiệu: {about.Descriptions}");
            }

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = $"Đã xoá {abouts.Count} bản ghi"
            };
        }


    }

}
