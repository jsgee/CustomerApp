using CustomerApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CustomerApp
{
    public class CustomersContext : DbContext
    {
        public CustomersContext(DbContextOptions<CustomersContext> options)
            : base(options)
        {
        }

        public DbSet<Customer>? Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) => base.OnModelCreating(builder);
    }
}
