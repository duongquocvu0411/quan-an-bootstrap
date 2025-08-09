using BE_Mentoring.Services.AdminID;
using BE_Nhahang.Interfaces.Admin.About;
using BE_Nhahang.Interfaces.Admin.AdminId;
using BE_Nhahang.Interfaces.Admin.Auth;
using BE_Nhahang.Interfaces.Admin.Auth.Account;
using BE_Nhahang.Interfaces.Admin.Chefs;
using BE_Nhahang.Interfaces.Admin.Contact;
using BE_Nhahang.Interfaces.Admin.Contact.ContactAdmin;
using BE_Nhahang.Interfaces.Admin.Feature;
using BE_Nhahang.Interfaces.Admin.Food;
using BE_Nhahang.Interfaces.Admin.FoodCategory;
using BE_Nhahang.Interfaces.Admin.Log;
using BE_Nhahang.Interfaces.Admin.Payment;
using BE_Nhahang.Interfaces.Admin.Payment.Settings;
using BE_Nhahang.Interfaces.Admin.Sendmail;
using BE_Nhahang.Interfaces.Admin.Table;
using BE_Nhahang.Interfaces.Admin.Table.Booking;
using BE_Nhahang.Interfaces.Admin.Table.Booking.CreateBooking;
using BE_Nhahang.Interfaces.Admin.Table.Booking.Order;
using BE_Nhahang.Interfaces.Jwt;
using BE_Nhahang.Services.Admin.Auth;
using BE_Nhahang.Services.Admin.Auth.Account;

using BE_Nhahang.Services.Admin.Sendmail;
using BE_Nhahang.Services.Cloudinary;
using BE_Nhahang.Services.IImageSave;
using BE_Nhahang.Services.ImageSave;
using BE_Nhahang.Services.Jwt;
using BE_Nhahang.Test.Inteface;
namespace BE_Nhahang.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCustomServices(this IServiceCollection services)
        {
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddScoped<IAuthService,AuthService>();
            services.AddScoped<ISystemLogService, SystemLogService>();
            services.AddScoped<IFoodCategoryService, FoodCategoryService>();
            services.AddScoped<IFoodService, FoodService>();
            services.AddScoped<ITableService, TableService>();
            services.AddScoped<ITableSuggestionService, TableSuggestionService>();
            services.AddScoped<ITableBookingService, TableBookingService>();
            services.AddScoped<ITableOrderService, TableOrderService>();
            services.AddScoped<IVietQrService, VietQrService>();
            services.AddScoped<IPaymentQrService, PaymentQrService>();
            services.AddScoped<IPaymentQrBankAccountService, PaymentQrBankAccountService>();
            services.AddScoped<IContactUserService, ContactUserService>();
            services.AddScoped<IContactAdminService, ContactAdminService>();
            services.AddScoped<IAboutService, AboutService>();
            services.AddScoped<IFeatureService, FeatureService>();
            services.AddScoped<IChefsService, ChefsService>();

            // thêm các service khác ở đây
            services.AddScoped<IHttpContextAccessorService, HttpContextAccessorService>();
            services.AddScoped<ICloudinaryService, CloudinaryService>();
            services.AddScoped<IImageHelper, ImageHelper>();
            return services;
        }
    }
}
