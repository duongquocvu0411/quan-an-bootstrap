namespace BE_Nhahang.DTOS.Response
{
    public class ResponseDTO<T>
    {
        public bool IsSuccess { get; set; } = true;
        public int code { get; set; } = 200;
        public string? Message { get; set; } = string.Empty;
        public T? Data { get; set; } 
    }
}
