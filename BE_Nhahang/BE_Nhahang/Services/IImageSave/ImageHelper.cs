using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;
using BE_Nhahang.Services.IImageSave;
using BE_Nhahang.Services.Cloudinary;
using BE_Nhahang.Helpers;

namespace BE_Nhahang.Services.ImageSave
{
    public class ImageHelper : IImageHelper
    {
        private readonly ICloudinaryService _cloudinaryService;
        private readonly ILogger<ImageHelper> _logger;
        public ImageHelper(
            ICloudinaryService cloudinaryService,

            ILogger<ImageHelper> logger)
        {
            _cloudinaryService = cloudinaryService;
            _logger = logger;
        }

        public async Task<string> SaveImageToSubfolders(IFormFile image, string parentFolder)
        {
            // Các phần mở rộng được chấp nhận
            var allowedExtensions = new[]
            {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".tif", ".svg", ".ico"
    };

            var fileExtension = Path.GetExtension(image.FileName).ToLowerInvariant();

            // Kiểm tra phần mở rộng hợp lệ
            if (string.IsNullOrEmpty(fileExtension) || !allowedExtensions.Contains(fileExtension))
            {
                throw new Exception("Loại file không hợp lệ. Vui lòng chọn file hình ảnh.");
            }

            // Tạo thư mục theo ngày
            string subfolderName = DateTime.UtcNow.ToString("yyyy-MM-dd");

            // Mặc định imageType là "main-photo"
            string imageType = "main-photo";
            bool isWebpRequired = true;

            string folder = $"{parentFolder}/{subfolderName}/Original/{imageType}";

            try
            {
                var originalFileName = Path.GetFileNameWithoutExtension(image.FileName);
                var slugFileName = ToSlug(originalFileName);
                var finalFileName = $"{slugFileName}-{Guid.NewGuid():N}{fileExtension}";

                var renamedImage = new FormFile(image.OpenReadStream(), 0, image.Length, image.Name, finalFileName)
                {
                    Headers = image.Headers,
                    ContentType = image.ContentType
                };

                _logger.LogInformation("Uploading image to Cloudinary. Folder: {0}, File: {1}", folder, finalFileName);

                var imageUrl = await _cloudinaryService.UploadImageAsync(renamedImage, folder, isWebpRequired);

                return imageUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Lỗi khi upload ảnh lên Cloudinary.");
                throw new Exception("Không thể upload ảnh lên hệ thống lưu trữ.", ex);
            }
        }



        private string ToSlug(string input)
        {
            input = input.ToLowerInvariant();
            input = Regex.Replace(input, @"\s+", "-"); // khoảng trắng → gạch nối
            input = Regex.Replace(input, @"[^a-z0-9\-]", ""); // bỏ ký tự đặc biệt
            input = Regex.Replace(input, @"-+", "-"); // gộp gạch nối
            return input.Trim('-');
        }
    }
}
