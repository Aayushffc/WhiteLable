using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs.CRM;
using backend.Models.CRM;
using backend.Services.CRM;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.CRM
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var customers = await _customerService.GetAllCustomersAsync(tenantId);
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetCustomer(Guid id)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                var customer = await _customerService.GetCustomerByIdAsync(id, tenantId);
                return Ok(customer);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> CreateCustomer(CreateCustomerDto customerDto)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var customer = await _customerService.CreateCustomerAsync(customerDto, tenantId);
            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(Guid id, UpdateCustomerDto customerDto)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                await _customerService.UpdateCustomerAsync(id, customerDto, tenantId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(Guid id)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                await _customerService.DeleteCustomerAsync(id, tenantId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomersByStatus(
            CustomerStatus status
        )
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var customers = await _customerService.GetCustomersByStatusAsync(status, tenantId);
            return Ok(customers);
        }
    }
}
