using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ToptalTimezones.Dtos;
using ToptalTimezones.Helpers;
using ToptalTimezones.Services;

namespace ToptalTimezones.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class ClocksController : Controller
    {
        private readonly IClockService _clockService;
        private readonly IMapper _mapper;

        public ClocksController(
            IClockService clockService,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _clockService = clockService;
            _mapper = mapper;
        }

        [HttpGet("[action]")]
        public IEnumerable<ClockDto> Index()
        {
            var uc = User.Claims.FirstOrDefault();
            int userId;
            if (uc != null && int.TryParse(uc.Value, out userId))
            {
                return _clockService.GetAll(userId).Select(c => _mapper.Map<ClockDto>(c));
            }
            
            return new ClockDto[]{};
        }
    }
}