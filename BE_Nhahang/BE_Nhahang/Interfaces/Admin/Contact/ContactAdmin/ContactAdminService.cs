using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Contact;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Helpers;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Contact;
using Microsoft.EntityFrameworkCore;

namespace BE_Nhahang.Interfaces.Admin.Contact.ContactAdmin
{
    public class ContactAdminService : IContactAdminService
    {
        private readonly DbConfig _context;
        private readonly ISystemLogService _systemLogService;
        private readonly IHttpContextAccessorService _httpContextAccessorService;

        public ContactAdminService(DbConfig context, ISystemLogService systemLogService,IHttpContextAccessorService httpContextAccessorService)
        {
            _context = context;
            _systemLogService = systemLogService;
            _httpContextAccessorService = httpContextAccessorService;
        }

        public async Task<ResponseDTO<PagedResult<ContactAdminModel>>> GetAllAsync(int page, int pageSize, bool isactive = true)
        {
            var query = _context.ContactAdmins
                                .Where(c => c.IsActive == isactive);

            var totalCount = await query.CountAsync();

            var results = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var pagedResult = new PagedResult<ContactAdminModel>
            {
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize),
                Results = results
            };

            return new ResponseDTO<PagedResult<ContactAdminModel>>
            {
                code = 200,
                IsSuccess = true,
                Message = "Lấy danh sách thành công",
                Data = pagedResult
            };
        }

        public async Task<ResponseDTO<List<ContactAdminModel>>> GetAllActiveAsync()
        {
            var data = await _context.ContactAdmins
                .Where(x => x.IsActive)
                .Select(x => new ContactAdminModel
                {
                    Id = x.Id,
                    Location = x.Location,
                    PhoneNumber = x.PhoneNumber,
                    EmailAddress = x.EmailAddress,
                    OpenHours = x.OpenHours,
                    IsActive = x.IsActive,
                    CreatedAt = x.CreatedAt,
                    CreatedBy = x.CreatedBy,
                    UpdatedAt = x.UpdatedAt,
                    UpdatedBy = x.UpdatedBy,
                    Mapurl = HtmlHelper.ExtractSrcFromHtml(x.Mapurl)
                })
                .ToListAsync();

            return new ResponseDTO<List<ContactAdminModel>>
            {
                IsSuccess = true,
                Message = "Lấy danh sách active thành công",
                Data = data
            };
        }




        public async Task<ResponseDTO<ContactAdminModel>> GetByIdAsync(int id)
        {
            var entity = await _context.ContactAdmins.FindAsync(id);
            if (entity == null)
                return new ResponseDTO<ContactAdminModel> { IsSuccess = false, code = 404, Message = "Not found" };

            return new ResponseDTO<ContactAdminModel> { Data = entity };
        }

        public async Task<ResponseDTO<ContactAdminModel>> CreateAsync(ContactAdminDTO dto)
        {
            
            if (dto.IsActive)
            {
                var actives = await _context.ContactAdmins
                    .Where(x => x.IsActive)
                    .ToListAsync();

                foreach (var item in actives)
                {
                    item.IsActive = false;
                }
            }

            var entity = new ContactAdminModel
            {
                Location = dto.Location,
                PhoneNumber = dto.PhoneNumber,
                EmailAddress = dto.EmailAddress,
                OpenHours = dto.OpenHours,
                Mapurl = dto.Mapurl,
                IsActive = dto.IsActive,
                CreatedBy = _httpContextAccessorService.GetAdminId(),
                CreatedAt = DateTime.UtcNow
            };

            _context.ContactAdmins.Add(entity);
            await _context.SaveChangesAsync();

            await _systemLogService.LogAsyncs(
                Userid: _httpContextAccessorService.GetAdminId(),
                action: "Create",
                entityName: "ContactAdmin",
                entityId: entity.Id.ToString(),
                 $"Tạo liên hệ admin: {entity.Location}"
            );

            return new ResponseDTO<ContactAdminModel> { Data = entity };
        }




        public async Task<ResponseDTO<ContactAdminModel>> UpdateAsync(int id, ContactAdminDTO dto)
        {
            var entity = await _context.ContactAdmins.FindAsync(id);
            if (entity == null)
            {
                return new ResponseDTO<ContactAdminModel>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Not found"
                };
            }

            // Nếu đang là true và yêu cầu chuyển thành false
            if (entity.IsActive && !dto.IsActive)
            {
                // Kiểm tra xem còn bản ghi nào khác đang active không
                bool hasOtherActive = await _context.ContactAdmins
                    .AnyAsync(x => x.IsActive && x.Id != entity.Id);

                if (!hasOtherActive)
                {
                    return new ResponseDTO<ContactAdminModel>
                    {
                        IsSuccess = false,
                        code = 400,
                        Message = "Phải có ít nhất một liên hệ admin đang hoạt động."
                    };
                }
            }

            // Nếu đang là false và yêu cầu chuyển thành true
            if (!entity.IsActive && dto.IsActive)
            {
                // Set tất cả các bản ghi khác về false
                await _context.ContactAdmins
                    .Where(x => x.IsActive && x.Id != entity.Id)
                    .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.IsActive, false));
            }

            // Cập nhật các giá trị còn lại
            entity.Location = dto.Location;
            entity.PhoneNumber = dto.PhoneNumber;
            entity.EmailAddress = dto.EmailAddress;
            entity.OpenHours = dto.OpenHours;
            entity.Mapurl = dto.Mapurl;
            entity.IsActive = dto.IsActive;
            entity.UpdatedBy = _httpContextAccessorService.GetAdminId();
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _systemLogService.LogAsyncs(
                Userid: _httpContextAccessorService.GetAdminId(),
                action: "Update",
                entityName: "ContactAdmin",
                entityId: entity.Id.ToString(),
                $"Cập nhật liên hệ admin: {entity.Location}"
            );

            return new ResponseDTO<ContactAdminModel>
            {
                Data = entity
            };
        }




        public async Task<ResponseDTO<object>> DeleteAsync(List<int> ids)
        {
            // Lấy tất cả bản ghi tồn tại theo ids
            var allItems = await _context.ContactAdmins
                .Where(c => ids.Contains(c.Id))
                .ToListAsync();

            if (!allItems.Any())
            {
                return new ResponseDTO<object>
                {
                    code = 404,
                    IsSuccess = false,
                    Message = "Không tìm thấy bản ghi nào phù hợp với danh sách ID được cung cấp.",
                    Data = null
                };
            }

            // Phân loại: có thể xóa (IsActive == false) và không thể xóa (IsActive == true)
            var deletableItems = allItems.Where(c => c.IsActive == false).ToList();
            var nonDeletableItems = allItems.Where(c => c.IsActive == true).ToList();

            // Tiến hành xóa những bản ghi hợp lệ
            if (deletableItems.Any())
            {
                _context.ContactAdmins.RemoveRange(deletableItems);
                await _context.SaveChangesAsync();
            }

            // Trả về thông tin chi tiết
            return new ResponseDTO<object>
            {
                code = 200,
                IsSuccess = true,
                Message = $"Đã xóa {deletableItems.Count} bản ghi. " +
                          (nonDeletableItems.Any()
                              ? $"Bỏ qua {nonDeletableItems.Count} bản ghi đang hoạt động (IsActive = true)."
                              : ""),
                Data = new
                {
                    DeletedIds = deletableItems.Select(c => c.Id).ToList(),
                    SkippedIds = nonDeletableItems.Select(c => c.Id).ToList()
                }
            };
        }


    }
}
