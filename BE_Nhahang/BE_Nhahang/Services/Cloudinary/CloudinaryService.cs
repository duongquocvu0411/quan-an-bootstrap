using BE_Nhahang.Helpers;
using BE_Nhahang.Services.Cloudinary;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

public class CloudinaryService : ICloudinaryService
{
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<CloudinaryService> _logger;

    public CloudinaryService(IConfiguration configuration, ILogger<CloudinaryService> logger)
    {
        var cloudName = configuration["CLOUDINARY:CloudName"];
        var apiKey = configuration["CLOUDINARY:ApiKey"];
        var apiSecret = configuration["CLOUDINARY:ApiSecret"];

        if (string.IsNullOrWhiteSpace(cloudName) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(apiSecret))
            throw new Exception("Thiếu cấu hình Cloudinary trong appsettings.json");

        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account) { Api = { Secure = true } };
        _logger = logger;
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folder, bool isWebpRequired = true)
    {
        try
        {
            var cleanFileName = TextHelper.RemoveVietnameseSigns(Path.GetFileNameWithoutExtension(file.FileName));
            var fileExt = Path.GetExtension(file.FileName);
            var finalFileName = $"{cleanFileName}{fileExt}";

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(finalFileName, stream),
                Folder = folder,
                UseFilename = true,
                UniqueFilename = false,
                Overwrite = false,
                Transformation = isWebpRequired
                    ? new Transformation().FetchFormat("webp") //  Bắt buộc chuyển thành webp
                    : null
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.StatusCode != System.Net.HttpStatusCode.OK)
                throw new Exception($"Upload thất bại: {result.Error?.Message}");

            return result.SecureUrl.ToString(); // URL đã sẵn sàng dùng
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi upload ảnh lên Cloudinary");
            throw new Exception("Lỗi khi upload ảnh lên Cloudinary.", ex);
        }
    }

}
