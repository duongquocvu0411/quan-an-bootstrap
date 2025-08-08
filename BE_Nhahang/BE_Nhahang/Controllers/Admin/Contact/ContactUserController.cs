using BE_Nhahang.DTOS.Admin.Contact;
using BE_Nhahang.Interfaces.Admin.Contact;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_Nhahang.Controllers.Admin.Contact
{
    [Route("contact-user")]
    [ApiController]
    public class ContactUserController : ControllerBase
    {
        private readonly IContactUserService _service;

        public ContactUserController(IContactUserService service)
        {
            _service = service;
        }

        [HttpGet("paged")]
        [Authorize]
        public async Task<IActionResult> GetPaged(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isReplied = false 
        )
        {
            var result = await _service.GetPagedAsync(pageNumber, pageSize, isReplied);
            return Ok(result);
        }


        [HttpGet("{id}")]
        [Authorize] 
        public async Task<IActionResult> GetById(int id) => Ok(await _service.GetByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContactUserDTO dto) => Ok(await _service.CreateAsync(dto));



        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMany([FromBody] List<int> ids)
        {
            return Ok(await _service.DeleteAsync(ids));
        }


        /// <summary>
        /// Api phản hồi  liên hệ 
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        [HttpPost("reply")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> ReplyToContact([FromBody] ContactUserReplyDTO dto)
        {
            var result = await _service.ReplyToContactAsync(dto);
            return Ok(result);
        }
    }
}
