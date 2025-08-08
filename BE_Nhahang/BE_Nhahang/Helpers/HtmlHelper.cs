using System.Text.RegularExpressions;

namespace BE_Nhahang.Helpers
{
    public class HtmlHelper
    {
        public static string ExtractSrcFromHtml(string iframeHtml)
        {
            if (string.IsNullOrEmpty(iframeHtml)) return string.Empty;

            var srcMatch = Regex.Match(iframeHtml, "src\\s*=\\s*\"([^\"]+)\"", RegexOptions.IgnoreCase);
            return srcMatch.Success ? srcMatch.Groups[1].Value : string.Empty;
        }

        /// <summary>
        /// Cắt chuỗi nếu dài quá maxLength, thêm dấu "..." vào cuối
        /// </summary>
        public static string TruncateText(string input, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;

            return input.Length > maxLength
                ? input.Substring(0, maxLength) + "..."
                : input;
        }

        /// <summary>
        /// Loại bỏ toàn bộ thẻ HTML (tag) khỏi chuỗi
        /// </summary>
        public static string RemoveHtmlTags(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;

            return Regex.Replace(input, "<.*?>", string.Empty);
        }
    }
}
