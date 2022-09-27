using System.ComponentModel.DataAnnotations;

namespace CustomerApp.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        [Required]

        [Display(Name = "First Name")]
        public string? FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required.")]
        [Display(Name = "Last Name")]
        public string? LastName { get; set; }

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string? Email { get; set; }

        public DateTime Created { get; set; } 
        public DateTime Updated { get; set; } = DateTime.Now;
    }
}
