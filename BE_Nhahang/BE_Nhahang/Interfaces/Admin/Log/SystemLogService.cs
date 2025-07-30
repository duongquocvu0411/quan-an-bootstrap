using BE_Nhahang.Config;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Models.Entities;
using System.Security.Claims;

namespace BE_Nhahang.Interfaces.Admin.Log
{
    public class SystemLogService : ISystemLogService
    {
        private readonly DbConfig _context;
  
        private readonly IHttpContextAccessorService _httpContextAccessor;

        public SystemLogService(DbConfig context, IHttpContextAccessorService httpContextAccessorService )
        {
            _context = context;
            _httpContextAccessor = httpContextAccessorService;

        }

        public async Task LogAsync(string action, string entityName, string entityId = null, string message = null)
        {
            
            var log = new SystemLogModel
            {
                UserId = _httpContextAccessor.GetAdminId(),
                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                Message = message,
                CreatedAt = DateTime.UtcNow
            };

            _context.SystemLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}

