using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public sealed class AppRecord
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Url { get; set; }

        public string? IconUrl { get; set; }

        public string? Category { get; set; }
    }
}
