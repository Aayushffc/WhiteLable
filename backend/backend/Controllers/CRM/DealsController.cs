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
    public class DealsController : ControllerBase
    {
        private readonly IDealService _dealService;

        public DealsController(IDealService dealService)
        {
            _dealService = dealService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DealDto>>> GetDeals()
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var deals = await _dealService.GetAllDealsAsync(tenantId);
            return Ok(deals);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<DealDto>>> GetDealsByCustomer(Guid customerId)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var deals = await _dealService.GetDealsByCustomerAsync(customerId, tenantId);
            return Ok(deals);
        }

        [HttpGet("stage/{stage}")]
        public async Task<ActionResult<IEnumerable<DealDto>>> GetDealsByStage(DealStage stage)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var deals = await _dealService.GetDealsByStageAsync(stage, tenantId);
            return Ok(deals);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DealDto>> GetDeal(Guid id)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                var deal = await _dealService.GetDealByIdAsync(id, tenantId);
                return Ok(deal);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<ActionResult<DealDto>> CreateDeal(CreateDealDto dealDto)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            var deal = await _dealService.CreateDealAsync(dealDto, tenantId);
            return CreatedAtAction(nameof(GetDeal), new { id = deal.Id }, deal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDeal(Guid id, UpdateDealDto dealDto)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                await _dealService.UpdateDealAsync(id, dealDto, tenantId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeal(Guid id)
        {
            var tenantIdClaim = User.FindFirst("TenantId")?.Value;
            if (string.IsNullOrEmpty(tenantIdClaim))
                return Unauthorized();

            var tenantId = Guid.Parse(tenantIdClaim);
            try
            {
                await _dealService.DeleteDealAsync(id, tenantId);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
