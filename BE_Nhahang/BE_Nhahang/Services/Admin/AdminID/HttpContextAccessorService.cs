
using BE_Nhahang.Interfaces.Admin.AdminId;
using DeviceDetectorNET;
using Newtonsoft.Json;
using System.Net.Http;
using System.Security.Claims;

namespace BE_Mentoring.Services.AdminID
{
    public class HttpContextAccessorService : IHttpContextAccessorService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly string _apiKey;
        private readonly string _IPV4;
        private readonly string _IPV6;


        public HttpContextAccessorService(IHttpContextAccessor httpContextAccessor, HttpClient httpClient)
        {
            _httpContextAccessor = httpContextAccessor;
            _httpClient = httpClient;
            _baseUrl = Environment.GetEnvironmentVariable("BIGDATACLOUD_BASE_URL") ?? "";
            _apiKey = Environment.GetEnvironmentVariable("BIGDATACLOUD_API_KEY") ?? "";
            _IPV4 = Environment.GetEnvironmentVariable("BIGDATACLOUD_IPV4") ?? "";
            _IPV6 = Environment.GetEnvironmentVariable("BIGDATACLOUD_IPV6") ?? "";
        }


        private async Task<(string Ip, string City)> TryGetGeoFromIp(string ip)
        {
            try
            {
                var url = $"{_baseUrl}?ip={ip}&localityLanguage=vi&key={_apiKey}";
                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                    return (ip, "");

                var json = await response.Content.ReadAsStringAsync();
                dynamic data = JsonConvert.DeserializeObject(json);
                string? city = data?.location?.city;

                return (ip, city ?? "");
            }
            catch
            {
                return (ip, "");
            }
        }


        public async Task<string?> GetMostAccuratePublicIpAsync()
        {
            string? ipv6 = null;
            string? ipv4 = null;

            try { ipv6 = await _httpClient.GetStringAsync($"{_IPV6}"); } catch { }
            try { ipv4 = await _httpClient.GetStringAsync($"{_IPV4}"); } catch { }

            var ipv6Info = string.IsNullOrWhiteSpace(ipv6) ? (Ip: "", City: "") : await TryGetGeoFromIp(ipv6.Trim());
            var ipv4Info = string.IsNullOrWhiteSpace(ipv4) ? (Ip: "", City: "") : await TryGetGeoFromIp(ipv4.Trim());

            // Ưu tiên IP có city rõ hơn
            if (!string.IsNullOrWhiteSpace(ipv6Info.City))
                return ipv6Info.Ip;
            if (!string.IsNullOrWhiteSpace(ipv4Info.City))
                return ipv4Info.Ip;

            // Nếu cả hai đều không có city, ưu tiên trả IP nào còn lại
            return !string.IsNullOrWhiteSpace(ipv6Info.Ip) ? ipv6Info.Ip :
                   !string.IsNullOrWhiteSpace(ipv4Info.Ip) ? ipv4Info.Ip : null;
        }
    



        public string? GetAdminId()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        public string? GetAdminRole()
        {
            return _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);
        }


        public string? GetClientIpAddress()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            string? ipAddress = httpContext?.Connection?.RemoteIpAddress?.ToString();

            if (httpContext != null && httpContext.Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                ipAddress = httpContext.Request.Headers["X-Forwarded-For"].ToString();
            }

            return ipAddress;
        }

        public string? GetNameAdmin()
        {
            var name = _httpContextAccessor.HttpContext?.User;
            string? fullname = name?.FindFirstValue(ClaimTypes.GivenName);
            return fullname;
        }
        //public string? GetUserAgent() // Triển khai method này
        //{
        //    return _httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].ToString();
        //}

        public string? GetUserAgent()
        {
            var userAgent = _httpContextAccessor.HttpContext?.Request?.Headers["User-Agent"].ToString();

            if (string.IsNullOrWhiteSpace(userAgent))
                return null;

            var dd = new DeviceDetector(userAgent);
            dd.Parse();

            var client = dd.GetClient(); // Trình duyệt
            var os = dd.GetOs();         // Hệ điều hành

            string browser = client.Match?.Name ?? "Trình duyệt không xác định";
            string browserVersion = client.Match?.Version ?? "";
            string osName = os.Match?.Name ?? "Hệ điều hành không xác định";
            string osVersion = os.Match?.Version ?? "";

            return $"{browser} {browserVersion} trên {osName} {osVersion}".Trim();
        }

        public string? GetAdminInfo()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            string? adminId = user?.FindFirstValue(ClaimTypes.NameIdentifier);
            string? fullName = user?.FindFirstValue(ClaimTypes.GivenName);

            // Xử lý trường hợp null hoặc rỗng
            string adminInfo = string.IsNullOrEmpty(fullName) ? "N/A" : fullName;
            adminInfo += " - ";
            adminInfo += string.IsNullOrEmpty(adminId) ? "N/A" : adminId;

            return adminInfo;
        }

    }
}
