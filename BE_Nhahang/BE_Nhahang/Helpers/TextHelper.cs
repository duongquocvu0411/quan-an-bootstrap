using System.Text;
using System.Text.RegularExpressions;

namespace BE_Nhahang.Helpers
{
    public class TextHelper
    {
        public static string RemoveVietnameseSigns(string input)
        {
            if (string.IsNullOrEmpty(input)) return string.Empty;

            string normalized = input.Normalize(NormalizationForm.FormD);
            Regex regex = new Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string result = regex.Replace(normalized, "")
                                 .Replace('đ', 'd')
                                 .Replace('Đ', 'D');

            // Loại bỏ ký tự đặc biệt, giữ lại a-z, A-Z, 0-9, dấu gạch dưới và gạch ngang
            result = Regex.Replace(result, @"[^a-zA-Z0-9_-]", "");

            return result;
        }
    }
}
