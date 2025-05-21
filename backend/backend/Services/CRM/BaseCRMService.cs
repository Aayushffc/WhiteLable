using AutoMapper;
using backend.DBContext;

namespace backend.Services.CRM
{
    public abstract class BaseCRMService
    {
        protected readonly TenantDbContext _context;
        protected readonly IMapper _mapper;

        protected BaseCRMService(TenantDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public static MapperConfiguration CreateMapperConfiguration()
        {
            return new MapperConfiguration(cfg =>
            {
                // Customer mappings
                cfg.CreateMap<Models.CRM.Customer, DTOs.CRM.CustomerDto>();
                cfg.CreateMap<DTOs.CRM.CreateCustomerDto, Models.CRM.Customer>();
                cfg.CreateMap<DTOs.CRM.UpdateCustomerDto, Models.CRM.Customer>()
                    .ForAllMembers(opts =>
                        opts.Condition((src, dest, srcMember) => srcMember != null)
                    );

                // Contact mappings
                cfg.CreateMap<Models.CRM.Contact, DTOs.CRM.ContactDto>();
                cfg.CreateMap<DTOs.CRM.CreateContactDto, Models.CRM.Contact>();
                cfg.CreateMap<DTOs.CRM.UpdateContactDto, Models.CRM.Contact>()
                    .ForAllMembers(opts =>
                        opts.Condition((src, dest, srcMember) => srcMember != null)
                    );

                // Deal mappings
                cfg.CreateMap<Models.CRM.Deal, DTOs.CRM.DealDto>();
                cfg.CreateMap<DTOs.CRM.CreateDealDto, Models.CRM.Deal>();
                cfg.CreateMap<DTOs.CRM.UpdateDealDto, Models.CRM.Deal>()
                    .ForAllMembers(opts =>
                        opts.Condition((src, dest, srcMember) => srcMember != null)
                    );
            });
        }
    }
}
