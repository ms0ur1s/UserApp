using Microsoft.EntityFrameworkCore;
using UserApp.API.Models;

namespace UserApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Picture> Pictures { get; set; }
    }
}