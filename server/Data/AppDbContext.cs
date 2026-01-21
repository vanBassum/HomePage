using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data;

public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Example entity set (remove/replace with yours)
    public DbSet<AppRecord> AppRecords => Set<AppRecord>();
}

