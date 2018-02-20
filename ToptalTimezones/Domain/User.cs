using System.Collections.Generic;

namespace ToptalTimezones.Domain
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public Role Role { get; set; }
        
        public ICollection<Clock> Clocks { get; set; }

        public User()
        {
            Role = Role.Registered;
            Clocks = new List<Clock>();
        }
    }
}