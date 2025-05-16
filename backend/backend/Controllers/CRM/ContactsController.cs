using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs.CRM;
using backend.Services.CRM;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.CRM
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactsController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactDto>>> GetContacts()
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var contacts = await _contactService.GetAllContactsAsync(tenantId);
            return Ok(contacts);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<ContactDto>>> GetContactsByCustomer(
            Guid customerId
        )
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var contacts = await _contactService.GetContactsByCustomerAsync(customerId, tenantId);
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDto>> GetContact(Guid id)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                var contact = await _contactService.GetContactByIdAsync(id, tenantId);
                return Ok(contact);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult<ContactDto>> CreateContact(CreateContactDto contactDto)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var contact = await _contactService.CreateContactAsync(contactDto, tenantId);
            return CreatedAtAction(nameof(GetContact), new { id = contact.Id }, contact);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(Guid id, UpdateContactDto contactDto)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                await _contactService.UpdateContactAsync(id, contactDto, tenantId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(Guid id)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                await _contactService.DeleteContactAsync(id, tenantId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
