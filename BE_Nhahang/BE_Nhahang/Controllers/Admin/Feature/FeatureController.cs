using BE_Nhahang.DTOS.Admin.Features;
using BE_Nhahang.Interfaces.Admin.Feature;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Feature
{
    [ApiController]
    [Route("features")]
    public class FeatureController : ControllerBase
    {
        private readonly IFeatureService _featureService;

        public FeatureController(IFeatureService featureService)
        {
            _featureService = featureService;
        }


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool isActive = true)
        => Ok(await _featureService.GetPagedAsync(page, pageSize, isActive));

        [HttpGet("client")]
        public async Task<IActionResult> GetActiveList()
       => Ok(await _featureService.GetActiveFeaturesAsync());

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
            => Ok(await _featureService.GetByIdAsync(id));

        [HttpPost("create")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> Create([FromForm] FeaturesDTO dto)
            => Ok(await _featureService.CreateAsync(dto));

        [HttpPut("Update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update([FromQuery] int id, [FromForm] FeaturesDTO dto)
            => Ok(await _featureService.UpdateAsync(id, dto));

        [HttpDelete("delete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(List<int> id)
            => Ok(await _featureService.DeleteMultipleAsync(id));
    }
}
