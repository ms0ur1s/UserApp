using System;
using Microsoft.AspNetCore.Http;

namespace UserApp.API.Dtos
{
    public class PictureForCreationDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; }

        public PictureForCreationDto()
        {
            DateAdded = DateTime.Now;
        }  
    }
}