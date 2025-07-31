namespace BE_Nhahang.Interfaces.Admin.Log
{
    public interface ISystemLogService
    {
        Task LogAsync(string action, string entityName, string entityId = null, string message = null);
        Task LogAsyncs(string Userid,string action, string entityName, string entityId = null, string message = null);
    }
}
