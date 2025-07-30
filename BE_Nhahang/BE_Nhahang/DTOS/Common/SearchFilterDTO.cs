namespace BE_Nhahang.DTOS.Common
{
    public class SearchFilterDTO
    {
        public string? Keyword { get; set; }          
        public decimal? MinPrice { get; set; }        
        public decimal? MaxPrice { get; set; }       
        public DateTime? StartDate { get; set; }     
        public DateTime? EndDate { get; set; }        

    }
}
