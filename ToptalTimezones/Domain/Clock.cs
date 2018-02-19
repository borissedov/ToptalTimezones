using System.Collections.Generic;

namespace ToptalTimezones.Domain
{
    public class Clock
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CityName { get; set; }
        public string Timezone { get; set; }
        
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}