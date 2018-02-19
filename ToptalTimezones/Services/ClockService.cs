using System;
using System.Collections.Generic;
using System.Linq;
using ToptalTimezones.Domain;
using ToptalTimezones.Helpers;

namespace ToptalTimezones.Services
{
    public interface IClockService
    {
        IEnumerable<Clock> GetAll(int userId = 0);
        Clock GetById(int id);
        Clock Create(Clock clock);
        void Update(Clock clock);
        void Delete(int id);
    }
    
    public class ClockService: IClockService
    {
        private DataContext _context;

        public ClockService(DataContext context)
        {
            _context = context;
        }

        public IEnumerable<Clock> GetAll(int userId = 0)
        {
            var table = _context.Clocks.AsQueryable();

            if (userId != 0)
            {
                table = table.Where(c => c.UserId == userId);
            }
            return table;
        }

        public Clock GetById(int id)
        {
            return _context.Clocks.Find(id);
        }

        public Clock Create(Clock clock)
        {
            _context.Clocks.Add(clock);
            _context.SaveChanges();

            return clock;
        }

        public void Update(Clock clockParam)
        {
            var clock = _context.Clocks.Find(clockParam.Id);

            if (clock == null)
                throw new AppException("Clock not found");

            // update clock properties
            clock.Name = clockParam.Name;
            clock.CityName = clockParam.CityName;
            clock.Timezone = clockParam.Timezone;

            _context.Clocks.Update(clock);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var clock = _context.Clocks.Find(id);
            if (clock != null)
            {
                _context.Clocks.Remove(clock);
                _context.SaveChanges();
            }
        }
    }
}