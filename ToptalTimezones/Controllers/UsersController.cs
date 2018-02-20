using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ToptalTimezones.Services;
using ToptalTimezones.Dtos;
using AutoMapper;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using ToptalTimezones.Helpers;
using Microsoft.Extensions.Options;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using ToptalTimezones.Domain;
using Microsoft.AspNetCore.Authorization;

namespace ToptalTimezones.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;

        public UsersController(
            IUserService userService,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] UserDto userDto)
        {
            var user = _userService.Authenticate(userDto.Username, userDto.Password);

            if (user == null)
                return BadRequest("Username or password is incorrect");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // return basic user info (without password) and token to store client side
            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = tokenString,
                Role = user.Role
            });
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] UserDto userDto)
        {
            bool isAdmin = false;
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var currentUser = _userService.GetById(userId);
                isAdmin = currentUser.Role == Role.Admin;
            }

            // map dto to entity
            var user = _mapper.Map<User>(userDto);
            if (!isAdmin)
            {
                user.Role = Role.Registered;
            }
            
            try
            {
                // save 
                var user1 = _userService.Create(user, userDto.Password);
                return Ok(_mapper.Map<UserDto>(user1));
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var currentUser = _userService.GetById(userId);
                if (currentUser.Role == Role.Admin || currentUser.Role == Role.UserManager)
                {
                    var users = _userService.GetAll();
                    var userDtos = _mapper.Map<IList<UserDto>>(users);
                    return Ok(userDtos);
                }
            }

            return Unauthorized();
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var currentUser = _userService.GetById(userId);
                if (currentUser.Role == Role.Admin || currentUser.Role == Role.UserManager)
                {
                    var user = _userService.GetById(id);
                    var userDto = _mapper.Map<UserDto>(user);
                    return Ok(userDto);
                }
            }

            return Unauthorized();
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UserDto userDto)
        {
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var currentUser = _userService.GetById(userId);
                if (currentUser.Role == Role.Admin || currentUser.Role == Role.UserManager)
                {
                    var oldUser = _userService.GetById(id);
                    
                    // map dto to entity and set id
                    var user = _mapper.Map<User>(userDto);
                    user.Id = id;

                    if (currentUser.Role == Role.UserManager)
                    {
                        user.Role = oldUser.Role;
                    }
                    
                    try
                    {
                        // save 
                        _userService.Update(user, userDto.Password);
                        return Ok(userDto);
                    }
                    catch (AppException ex)
                    {
                        // return error message if there was an exception
                        return BadRequest(ex.Message);
                    }
                }
            }

            return Unauthorized();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var uc = User.Claims.FirstOrDefault();
            if (uc != null && int.TryParse(uc.Value, out var userId))
            {
                var currentUser = _userService.GetById(userId);
                if ((currentUser.Role == Role.Admin || currentUser.Role == Role.UserManager) && currentUser.Id != id)
                {
                    _userService.Delete(id);
                    return Ok();
                }
            }

            return Unauthorized();
        }
    }
}