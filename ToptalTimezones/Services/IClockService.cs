using System.Collections.Generic;
using ToptalTimezones.Domain;

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
}