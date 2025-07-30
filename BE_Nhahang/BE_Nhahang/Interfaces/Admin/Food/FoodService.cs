using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.FoodDTO;
using BE_Nhahang.DTOS.Common;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Helpers;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities;
using BE_Nhahang.Services.Cloudinary;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BE_Nhahang.Interfaces.Admin.Food
{
    public class FoodService : IFoodService
    {
        private readonly DbConfig _context;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IHttpContextAccessorService _httpContextAccessor;
        private readonly ISystemLogService _systemLogService;

        public FoodService(DbConfig context, ICloudinaryService cloudinaryService, 
            IHttpContextAccessorService httpContextAccessor,ISystemLogService systemLogService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _httpContextAccessor = httpContextAccessor;
            _systemLogService = systemLogService;
        }

        public async Task<ResponseDTO<PagedResult<FoodModel>>> SearchFoodsAsync(SearchFilterDTO filter, int page, int pageSize)
        {
            var query = _context.Foods.AsQueryable();

            // Tìm kiếm gần đúng theo keyword
            if (!string.IsNullOrEmpty(filter.Keyword))
            {
                var lowerKeyword = filter.Keyword.ToLower();
                query = query.Where(f =>
                    f.Name.ToLower().Contains(lowerKeyword) ||
                    f.Description.ToLower().Contains(lowerKeyword));
            }

            // Lọc theo giá
            if (filter.MinPrice.HasValue)
                query = query.Where(f => f.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(f => f.Price <= filter.MaxPrice.Value);

            // Lọc theo ngày
            if (filter.StartDate.HasValue)
                query = query.Where(f => f.CreatedAt >= filter.StartDate.Value);

            if (filter.EndDate.HasValue)
                query = query.Where(f => f.CreatedAt <= filter.EndDate.Value);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var results = await query
                .OrderByDescending(f => f.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new ResponseDTO<PagedResult<FoodModel>>
            {
                IsSuccess = true,
                code = 200,
                Message = "Tìm kiếm thành công",
                Data = new PagedResult<FoodModel>
                {
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = totalPages,
                    Results = results
                }
            };
        }


        public async Task<ResponseDTO<PagedResult<object>>> GetPagedFoodsAsync(int page, int pageSize)
        {
            var query = _context.Foods.Include(f => f.Category).OrderBy(a => a.CreatedAt).AsQueryable();

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var results = await query
             .OrderByDescending(f => f.Id)
             .Skip((page - 1) * pageSize)
             .Take(pageSize)
             .Select(f => new
             {
                 f.Id,
                 f.Name,
                 f.Description,
                 f.Price,
                 f.ImageUrl,
                 f.CategoryId,
                
                 CategoryName = f.Category.Name,
                 f.CreatedAt,
                 f.CreatedBy,
                 f.UpdatedAt,
                 f.UpdatedBy
             })
             .ToListAsync();

            return new ResponseDTO<PagedResult<object>>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy danh sách món ăn thành công",
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

        public async Task<ResponseDTO<object>> GetFoodByIdAsync(int id)
        {
            var food = await _context.Foods
                .Include(f => f.Category)
                .Include(f => f.FoodDetail)
                .Include(f => f.FoodImages)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (food == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy món ăn"
                };
            }

            var additionalImages = food.FoodImages?
                .OrderBy(i => i.Id) // sắp xếp theo yêu cầu
                .Select(i => i.ImageUrl)
                .ToList();

            var detail = food.FoodDetail;

            var result = new
            {
                Id = food.Id,
                Name = food.Name,
                Description = food.Description,
                Price = food.Price,
                ImageUrl = food.ImageUrl,
                //AdditionalImages = additionalImages,
                CategoryId = food.CategoryId,
                CategoryName = food.Category?.Name,
                CreatedAt = food.CreatedAt,
                CreatedBy = food.CreatedBy,
                UpdatedAt = food.UpdatedAt,
                UpdatedBy = food.UpdatedBy,
                FoodImages = additionalImages == null ? null : new
                {
                    additionalImages
                },
                Detail = detail == null ? null : new
                {
                    detail.Description,
                    detail.Ingredients,
                    detail.CookingMethod,
                    detail.Calories,
                    detail.PreparationTimeMinutes
                }
            };

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = "Lấy thông tin món ăn thành công",
                Data = result
            };
        }


        public async Task<ResponseDTO<object>> CreateFoodAsync(FoodDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var category = await _context.FoodCategories.FindAsync(dto.CategoryId);
                if (category == null)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = "Danh mục không tồn tại"
                    };
                }

                // Upload ảnh chính (ảnh đại diện món ăn)
                var imageUrl = await _cloudinaryService.UploadImageAsync(dto.ImageUrl, "foods", true);

                var food = new FoodModel
                {
                    CategoryId = dto.CategoryId,
                    Name = dto.Name,
                    Description = dto.Description,
                    Price = dto.Price,
                    ImageUrl = imageUrl,
                    CreatedBy = _httpContextAccessor.GetAdminId(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Foods.Add(food);
                await _context.SaveChangesAsync(); // cần để có FoodId

                // Tạo chi tiết món ăn
                var detail = new FoodDetailModel
                {
                    FoodId = food.Id,
                    Description = dto.DetailDescription,
                    Ingredients = dto.Ingredients,
                    CookingMethod = dto.CookingMethod,
                    Calories = dto.Calories,
                    PreparationTimeMinutes = dto.PreparationTimeMinutes,
                    
                };
                _context.FoodDetails.Add(detail);

                // Upload ảnh phụ song song nếu có
                if (dto.AdditionalImages != null && dto.AdditionalImages.Any())
                {
                    var uploadTasks = dto.AdditionalImages
                        .Where(f => f.Length > 0)
                        .Select(async file =>
                        {
                            var url = await _cloudinaryService.UploadImageAsync(file, "foods", true);
                            return new FoodImageModel
                            {
                                FoodId = food.Id,
                                ImageUrl = url
                            };
                        }).ToList();

                    var additionalImages = await Task.WhenAll(uploadTasks);
                    _context.FoodImages.AddRange(additionalImages);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var result = new
                {
                    category = category.Name,
                    FoodName = food.Name,
                    Descriptions = food.Description,
                    Price = food.Price,
                    ImageUrl = food.ImageUrl,
                    Detail = new
                    {
                        detail.Description,
                        detail.Ingredients,
                        detail.CookingMethod,
                        detail.Calories,
                        detail.PreparationTimeMinutes
                    }
                };

                await _systemLogService.LogAsync("Create", "Food", food.Id.ToString(), $"Tạo món ăn: {food.Name}");

                return new ResponseDTO<object>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Tạo món ăn thành công",
                    Data = result
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Đã xảy ra lỗi khi tạo món ăn: {ex.Message}"
                };
            }
        }



        public async Task<ResponseDTO<object>> UpdateFoodAsync(int id, FoodDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var food = await _context.Foods.FindAsync(id);
                if (food == null)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 404,
                        Message = "Món ăn không tồn tại"
                    };
                }

                var category = await _context.FoodCategories.FindAsync(dto.CategoryId);
                if (category == null)
                {
                    return new ResponseDTO<object>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = "Danh mục không tồn tại"
                    };
                }

                // Cập nhật ảnh đại diện nếu có
                if (dto.ImageUrl != null && dto.ImageUrl.Length > 0)
                {
                    food.ImageUrl = await _cloudinaryService.UploadImageAsync(dto.ImageUrl, "foods", true);
                }

                food.Name = dto.Name;
                food.Description = dto.Description;
                food.Price = dto.Price;
                food.CategoryId = dto.CategoryId;
                food.UpdatedBy = _httpContextAccessor.GetAdminId();
                food.UpdatedAt = DateTime.UtcNow;

                // Cập nhật hoặc thêm mới chi tiết món ăn
                var foodDetail = await _context.FoodDetails.FirstOrDefaultAsync(d => d.FoodId == food.Id);
                if (foodDetail != null)
                {
                    foodDetail.Description = dto.DetailDescription;
                    foodDetail.Ingredients = dto.Ingredients;
                    foodDetail.CookingMethod = dto.CookingMethod;
                    foodDetail.Calories = dto.Calories;
                    foodDetail.PreparationTimeMinutes = dto.PreparationTimeMinutes;
                    
                }
                else
                {
                    _context.FoodDetails.Add(new FoodDetailModel
                    {
                        FoodId = food.Id,
                        Description = dto.DetailDescription,
                        Ingredients = dto.Ingredients,
                        CookingMethod = dto.CookingMethod,
                        Calories = dto.Calories,
                        PreparationTimeMinutes = dto.PreparationTimeMinutes,
                       
                    });
                }

                // Xử lý ảnh phụ
                var existingImages = await _context.FoodImages
                    .Where(x => x.FoodId == food.Id)
                    .OrderBy(x => x.Id)
                    .ToListAsync();

                if (dto.AdditionalImages == null || dto.AdditionalImages.Count == 0)
                {
                    // Không gửi hoặc gửi rỗng → xóa toàn bộ ảnh phụ
                    if (existingImages.Any())
                    {
                        _context.FoodImages.RemoveRange(existingImages);
                    }
                }
                else
                {
                    // Gửi ảnh → cập nhật theo thứ tự
                    var uploadTasks = dto.AdditionalImages
                        .Select(async (file, index) =>
                        {
                            if (file == null || file.Length == 0)
                                return (Index: index, Url: (string?)null);

                            var url = await _cloudinaryService.UploadImageAsync(file, "foods", true);
                            return (Index: index, Url: url);
                        })
                        .ToList();

                    var uploadResults = await Task.WhenAll(uploadTasks);
                    var updatedImageIds = new List<int>();

                    foreach (var result in uploadResults)
                    {
                        if (string.IsNullOrEmpty(result.Url)) continue;

                        if (result.Index < existingImages.Count)
                        {
                            existingImages[result.Index].ImageUrl = result.Url;
                            updatedImageIds.Add(existingImages[result.Index].Id);
                        }
                        else
                        {
                            var newImage = new FoodImageModel
                            {
                                FoodId = food.Id,
                                ImageUrl = result.Url
                            };
                            _context.FoodImages.Add(newImage);
                        }
                    }

                    // Xoá các ảnh dư không còn giữ lại
                    var redundantImages = existingImages
                        .Where(img => !updatedImageIds.Contains(img.Id))
                        .ToList();

                    if (redundantImages.Any())
                    {
                        _context.FoodImages.RemoveRange(redundantImages);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var results = new
                {
                    category = category.Name,
                    foodName = food.Name,
                    description = food.Description,
                    price = food.Price,
                    imageUrl = food.ImageUrl
                };

                await _systemLogService.LogAsync("Update", "Food", food.Id.ToString(), $"Cập nhật món ăn: {food.Name}");

                return new ResponseDTO<object>
                {
                    IsSuccess = true,
                    code = 200,
                    Message = "Cập nhật món ăn thành công",
                    Data = results
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = $"Đã xảy ra lỗi khi cập nhật món ăn: {ex.Message}"
                };
            }
        }



        public async Task<ResponseDTO<string>> DeleteFoodAsync(DeleteIds ids)
        {
            var foods = await _context.Foods
                        .Where(f => ids.Ids.Contains(f.Id)) 
                        .ToListAsync();

            if (foods == null || !foods.Any())
            {
                return new ResponseDTO<string>
                {
                    IsSuccess = false,
                    Message = "Không tìm thấy món ăn nào để xoá",
                    code = 404
                };
            }

            _context.Foods.RemoveRange(foods);
            await _context.SaveChangesAsync();

            foreach (var food in foods)
            {
                await _systemLogService.LogAsync(
                    "Delete",
                    "Food",
                    food.Id.ToString(),
                    $"Xóa món ăn: {food.Name}"
                );
            }

            return new ResponseDTO<string>
            {
                IsSuccess = true,
                code = 200,
                Message = $"Đã xóa {foods.Count} món ăn thành công"
            };
        }



        public async Task<ResponseDTO<object>> DeleteImagesAsync(List<int> imageIds)
        {
            if (imageIds == null || !imageIds.Any())
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Danh sách ảnh không hợp lệ"
                };
            }

            var images = await _context.FoodImages
                .Where(img => imageIds.Contains(img.Id))
                .ToListAsync();

            if (!images.Any())
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy ảnh nào phù hợp"
                };
            }

            _context.FoodImages.RemoveRange(images);
            await _context.SaveChangesAsync();

            return new ResponseDTO<object>
            {
                IsSuccess = true,
                code = 200,
                Message = $"Đã xoá {images.Count} ảnh phụ thành công"
            };
        }

    }
}

