namespace BE_Nhahang.Services.Cloudinary
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(IFormFile file, string folder, bool isWebpRequired = true);
    }
}
