using BE_Nhahang.Config;
using BE_Nhahang.DTOS.Admin.Contact;
using BE_Nhahang.DTOS.Response;
using BE_Nhahang.Helpers.TemplateEmail;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Interfaces.Admin.Sendmail;
using BE_Nhahang.Models;
using BE_Nhahang.Models.Entities.Contact;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

namespace BE_Nhahang.Interfaces.Admin.Contact
{
    public class ContactUserService : IContactUserService
    {
        private readonly DbConfig _context;
        private readonly ISystemLogService _systemLogService;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessorService _contextAccessorService;

        public ContactUserService(DbConfig context, ISystemLogService systemLogService,
            IEmailSender emailSender, IConfiguration config, IHttpContextAccessorService httpContextAccessorService)
        {
            _context = context;
            _systemLogService = systemLogService;
            _emailSender = emailSender;
            _config = config;
            _contextAccessorService = httpContextAccessorService;
        }


        public async Task<ResponseDTO<PagedResult<ContactUserModel>>> GetPagedAsync(int pageNumber, int pageSize, bool? isReplied = false)
        {
            var query = _context.ContactUsers
                                .Where(x => !isReplied.HasValue || x.IsReplied == isReplied.Value)
                                .OrderByDescending(x => x.CreatedAt);

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var items = await query.Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync();

            var pagedResult = new PagedResult<ContactUserModel>
            {
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                Results = items
            };

            return new ResponseDTO<PagedResult<ContactUserModel>>
            {
                code = 200,
                IsSuccess = true,
                Data = pagedResult
            };
        }



        public async Task<ResponseDTO<ContactUserModel>> GetByIdAsync(int id)
            {
                var contact = await _context.ContactUsers
                    .Include(c => c.ContactUserReply) 
                    .FirstOrDefaultAsync(c => c.id == id);

                if (contact == null)
                {
                    return new ResponseDTO<ContactUserModel>
                    {
                        IsSuccess = false,
                        code = 404,
                        Message = "Không tìm thấy liên hệ"
                    };
                }

                return new ResponseDTO<ContactUserModel>
                {
                    IsSuccess = true,
                    code = 200,
                    Data = contact
                };
            }


    public async Task<ResponseDTO<object>> CreateAsync(ContactUserDTO dto)
        {
            var response = new ResponseDTO<object>();

            try
            {
                // Tạo model từ DTO
                var model = new ContactUserModel
                {
                    YourName = dto.YourName,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Subject = dto.Subject,
                    Message = dto.Message,
                    CreatedAt = DateTime.UtcNow
                };

                // Lưu vào DB
                _context.ContactUsers.Add(model);
                await _context.SaveChangesAsync();

                // Ghi log hệ thống
                await _systemLogService.LogAsyncs(
                    Userid: model.YourName,
                    action: "Create",
                    entityName: "ContactUser",
                    entityId: model.id.ToString(),
                     $"Tạo liên hệ từ: {model.YourName}"
                );

                // Gửi email tới hệ thống
                var systemEmail = _config["Smtp:Username"];
                var subject = $"[Liên hệ mới] {model.YourName} đã gửi tin nhắn";
                var html = EmailTemplateGenerator.GenerateForSystem(model);
                _ = _emailSender.SendEmailAsync(systemEmail, subject, html);

                response.code = 200;
                response.Message = "Tạo liên hệ thành công";
                return response;
            }
            catch (Exception ex)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 500,
                    Message = "Lỗi khi tạo liên hệ: " + ex.Message
                };
            }
        }


        public async Task<ResponseDTO<object>> DeleteAsync(List<int> ids)
        {
            var contacts = await _context.ContactUsers
                .Where(c => ids.Contains(c.id))
                .ToListAsync();

            if (!contacts.Any())
                return new ResponseDTO<object> { IsSuccess = false, code = 404, Message = "Không tìm thấy liên hệ nào để xoá" };

            _context.ContactUsers.RemoveRange(contacts);
            await _context.SaveChangesAsync();

            foreach (var contact in contacts)
            {
                await _systemLogService.LogAsync("Delete", "ContactUser", contact.id.ToString(), $"Xoá liên hệ: {contact.YourName}");
            }

            return new ResponseDTO<object> { Message = $"Đã xoá {contacts.Count} liên hệ thành công" };
        }



        public async Task<ResponseDTO<object>> ReplyToContactAsync(ContactUserReplyDTO dto)
        {
            var contact = await _context.ContactUsers.FindAsync(dto.ContactUserId);
            if (contact == null)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 404,
                    Message = "Không tìm thấy liên hệ"
                };
            }

            if (contact.IsReplied)
            {
                return new ResponseDTO<object>
                {
                    IsSuccess = false,
                    code = 400,
                    Message = "Liên hệ này đã được phản hồi trước đó"
                };
            }

            var adminId = _contextAccessorService.GetAdminId();

            // Thêm nội dung phản hồi
            var reply = new ContactUserReplyModel
            {
                ContactUserId = dto.ContactUserId,
                ReplyMessage = dto.ReplyMessage,
                CreatedBy = adminId
            };
            _context.ContactUserReplies.Add(reply);

            // Cập nhật trạng thái liên hệ
            contact.IsReplied = true;
            contact.RepliedBy = adminId;
            contact.RepliedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Gửi mail cho user (không blocking)
            Task.Run(() =>
            {
                try
                {
                    var subjectUser = $"[Phản hồi liên hệ] {contact.Subject}";
                    var htmlUser = EmailTemplateGenerator.GenerateReplyForUser(contact, dto.ReplyMessage);
                    _emailSender.SendEmailAsync(contact.Email, subjectUser, htmlUser);
                }
                catch (Exception ex)
                {
                    // Ghi log nếu cần
                    Console.WriteLine($"Lỗi gửi mail cho user: {ex.Message}");
                }
            });

            // Gửi mail cho hệ thống (không blocking)
            Task.Run(() =>
            {
                try
                {
                    var systemEmail = _config["Smtp:Username"];
                    var subjectSystem = $"[Đã phản hồi] {contact.YourName}";
                    var htmlSystem = EmailTemplateGenerator.GenerateReplyForSystem(contact, dto.ReplyMessage);
                    _emailSender.SendEmailAsync(systemEmail, subjectSystem, htmlSystem);
                }
                catch (Exception ex)
                {
                    // Ghi log nếu cần
                    Console.WriteLine($"Lỗi gửi mail cho hệ thống: {ex.Message}");
                }
            });

            // Ghi log hệ thống
            await _systemLogService.LogAsync(
                action: "Reply",
                entityName: "ContactUser",
                entityId: contact.id.ToString(),
                $"Phản hồi liên hệ từ admin: {adminId} - Người dùng: {contact.YourName}"
            );

            return new ResponseDTO<object>
            {
                code = 200,
                Message = "Phản hồi thành công"
            };
        }

    }
}
