using AutoMapper;
using backend.DBContext;
using backend.DTOs.CRM;
using backend.Models.CRM;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.CRM
{
    public class DealService : BaseCRMService, IDealService
    {
        public DealService(TenantDbContext context, IMapper mapper)
            : base(context, mapper) { }

        public async Task<IEnumerable<DealDto>> GetAllDealsAsync(Guid tenantId)
        {
            var deals = await _context.Deals.Where(d => d.TenantId == tenantId).ToListAsync();

            return _mapper.Map<IEnumerable<DealDto>>(deals);
        }

        public async Task<IEnumerable<DealDto>> GetDealsByCustomerAsync(
            Guid customerId,
            Guid tenantId
        )
        {
            var deals = await _context
                .Deals.Where(d => d.CustomerId == customerId && d.TenantId == tenantId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<DealDto>>(deals);
        }

        public async Task<IEnumerable<DealDto>> GetDealsByStageAsync(DealStage stage, Guid tenantId)
        {
            var deals = await _context
                .Deals.Where(d => d.Stage == stage && d.TenantId == tenantId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<DealDto>>(deals);
        }

        public async Task<DealDto> GetDealByIdAsync(Guid id, Guid tenantId)
        {
            var deal = await _context.Deals.FirstOrDefaultAsync(d =>
                d.Id == id && d.TenantId == tenantId
            );

            if (deal == null)
                throw new KeyNotFoundException($"Deal with ID {id} not found");

            return _mapper.Map<DealDto>(deal);
        }

        public async Task<DealDto> CreateDealAsync(CreateDealDto dealDto, Guid tenantId)
        {
            var deal = _mapper.Map<Deal>(dealDto);
            deal.Id = Guid.NewGuid();
            deal.TenantId = tenantId;
            deal.CreatedAt = DateTime.UtcNow;

            _context.Deals.Add(deal);
            await _context.SaveChangesAsync();

            return _mapper.Map<DealDto>(deal);
        }

        public async Task<DealDto> UpdateDealAsync(Guid id, UpdateDealDto dealDto, Guid tenantId)
        {
            var deal = await _context.Deals.FirstOrDefaultAsync(d =>
                d.Id == id && d.TenantId == tenantId
            );

            if (deal == null)
                throw new KeyNotFoundException($"Deal with ID {id} not found");

            _mapper.Map(dealDto, deal);
            deal.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<DealDto>(deal);
        }

        public async Task DeleteDealAsync(Guid id, Guid tenantId)
        {
            var deal = await _context.Deals.FirstOrDefaultAsync(d =>
                d.Id == id && d.TenantId == tenantId
            );

            if (deal == null)
                throw new KeyNotFoundException($"Deal with ID {id} not found");

            _context.Deals.Remove(deal);
            await _context.SaveChangesAsync();
        }
    }
}
