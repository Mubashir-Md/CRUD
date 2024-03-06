
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(50)]
        public string Name { get; set; }
        public string Email { get; set; }
        [MaxLength(10)]
        public string PhoneNumber { get; set; }
    }
}