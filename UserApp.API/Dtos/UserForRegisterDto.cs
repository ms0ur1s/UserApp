using System.ComponentModel.DataAnnotations;

namespace UserApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(22, MinimumLength = 8, ErrorMessage = "Your Password must be between 8 and 22 characters long")]
        public string Password { get; set; }
    }
}