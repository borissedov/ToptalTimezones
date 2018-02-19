using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ToptalTimezones.Domain;

namespace ToptalTimezones.Helpers
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Clock> Clocks { get; set; }
    }
}