using System.Linq;
using AutoMapper;
using UserApp.API.Dtos;
using UserApp.API.Models;

namespace UserApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PictureUrl, opt => 
                    opt.MapFrom(src => src.Pictures.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt => 
                    opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<User, UserForDetailsDto>()
                .ForMember(dest => dest.PictureUrl, opt => 
                    opt.MapFrom(src => src.Pictures.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt => 
                    opt.MapFrom(src => src.DateOfBirth.CalculateAge()));
            CreateMap<Picture, PicturesForDetailsDto>();
        }
    }
}