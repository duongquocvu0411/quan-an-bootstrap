using BE_Nhahang.DTOS.Admin.Contact;
using BE_Nhahang.Interfaces.Admin.Contact.ContactAdmin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE_Nhahang.Controllers.Admin.Contact
{
    [Route("contact-admin")]
    [ApiController]
    public class ContactAdminController : ControllerBase
    {
        private readonly IContactAdminService _contactService;

        public ContactAdminController(IContactAdminService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet("Client")]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _contactService.GetAllActiveAsync();
            return StatusCode(result.code,result);
        }


        [HttpGet("admins")]
        [Authorize]
        public async Task<IActionResult> GetAllContactAdmins([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] bool isactive = true)
        {
            var result = await _contactService.GetAllAsync(page, pageSize, isactive);
            return Ok(result);
        }


        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _contactService.GetByIdAsync(id);
            return StatusCode(result.code, result);
        }

        [HttpPost("create")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> Create([FromForm] ContactAdminDTO dto)
        {
            var result = await _contactService.CreateAsync(dto);
            return StatusCode(result.code, result);
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromForm] ContactAdminDTO dto)
        {
            var result = await _contactService.UpdateAsync(id, dto);
            return StatusCode(result.code, result);
        }

        [HttpDelete("delete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete([FromBody]List<int> id)
        {
            var result = await _contactService.DeleteAsync(id);
            return StatusCode(result.code, result);
        }
    }
}
