using BE_Nhahang.DTOS.Response;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text.Json;

namespace BE_Nhahang.Middleware
{
    public static class JwtEventsHandler
    {
        public static JwtBearerEvents GetEvents()
        {
            return new JwtBearerEvents
            {
                OnAuthenticationFailed = async context =>
                {
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";

                    var response = new ResponseDTO<string>
                    {
                        IsSuccess = false,
                        code = 401,
                        Message = "Token không hợp lệ hoặc đã hết hạn",
                        Data = null
                    };

                    await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                },
                OnChallenge = async context =>
                {
                    context.HandleResponse();
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";

                    var response = new ResponseDTO<string>
                    {
                        IsSuccess = false,
                        code = 401,
                        Message = "Bạn chưa đăng nhập hoặc token không hợp lệ",
                        Data = null
                    };

                    await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                },
                OnForbidden = async context =>
                {
                    context.Response.StatusCode = 403;
                    context.Response.ContentType = "application/json";

                    var response = new ResponseDTO<string>
                    {
                        IsSuccess = false,
                        code = 403,
                        Message = "Bạn không có quyền truy cập tài nguyên này",
                        Data = null
                    };

                    await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                }
            };
        }
    }
}
