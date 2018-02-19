using AutoMapper;
using ToptalTimezones.Domain;
using ToptalTimezones.Dtos;

namespace ToptalTimezones.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            
            CreateMap<Clock, ClockDto>();
            CreateMap<ClockDto, Clock>();
        }
    }
}