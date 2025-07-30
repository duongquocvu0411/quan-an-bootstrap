namespace BE_Nhahang.Services.IImageSave
{
    public interface IImageHelper
    {
        Task<string> SaveImageToSubfolders(IFormFile image, string parentFolder);
    }
}