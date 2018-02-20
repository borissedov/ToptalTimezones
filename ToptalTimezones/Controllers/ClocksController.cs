using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ToptalTimezones.Domain;
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
        private readonly IUserService _userService;

        public ClocksController(
            IClockService clockService,
            IMapper mapper,
            IOptions<AppSettings> appSettings,
            IUserService userService)
        {
            _clockService = clockService;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpGet("/api/[controller]")]
        public IEnumerable<ClockDto> Index()
        {
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var currentUser = _userService.GetById(userId);
                var isAdmin = currentUser.Role == Role.Admin;

                if (isAdmin)
                {
                    return _clockService.GetAll().Select(c => _mapper.Map<ClockDto>(c));
                }
                return _clockService.GetAll(userId).Select(c => _mapper.Map<ClockDto>(c));
            }

            return new ClockDto[] { };
        }

        [HttpPost("/api/[controller]")]
        public IActionResult Create([FromBody] ClockDto clockDto)
        {
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var clock = _mapper.Map<Clock>(clockDto);
                clock.UserId = userId;
                return Ok(_clockService.Create(clock));
            }

            return BadRequest();
        }

        [HttpPut("/api/[controller]/{id}")]
        public IActionResult Update([FromBody] ClockDto clockDto)
        {
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var user = _userService.GetById(userId);
                var clock = _clockService.GetById(clockDto.Id);
                if (clock.UserId != userId && user.Role != Role.Admin)
                {
                    return Unauthorized();
                }

                clock = _mapper.Map<Clock>(clockDto);
                clock.UserId = userId;
                _clockService.Update(clock);
                return Ok(clock);
            }

            return BadRequest();
        }

        [HttpDelete("/api/[controller]/{id}")]
        public IActionResult Delete(int id)
        {
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var user = _userService.GetById(userId);
                var clock = _clockService.GetById(id);
                if (clock.UserId != userId && user.Role != Role.Admin)
                {
                    return Unauthorized();
                }

                _clockService.Delete(id);
                return Ok();
            }

            return BadRequest();
        }
    }
}