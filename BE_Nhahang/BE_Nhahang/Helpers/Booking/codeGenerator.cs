using BE_Nhahang;
using BE_Nhahang.Config;
using BE_Nhahang.Helpers;
using BE_Nhahang.Helpers.Booking;
using Microsoft.EntityFrameworkCore;
using System;

namespace BE_Nhahang.Helpers.Booking
{
    public static class BookingCodeGenerator
    {
        public static async Task<string> GenerateAsync(DbConfig db)
        {
            string code;
            int retry = 0;

            do
            {
                var now = DateTime.UtcNow;
                var random = Guid.NewGuid().ToString("N")[..6].ToUpper(); // 6 ký tự
                code = $"BK-{now:yyyyMMdd}-{random}";
                retry++;

                // Kiểm tra trong DB
                bool exists = await db.TableBookings.AnyAsync(x => x.BookingCode == code);
                if (!exists) return code;

            } while (retry < 5);

            throw new Exception("Không thể tạo mã booking duy nhất sau nhiều lần thử.");
        }
    }

}
