using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using UserApp.API.Data;
using UserApp.API.Dtos;
using UserApp.API.Helpers;
using UserApp.API.Models;

namespace UserApp.API.Controllers {
    [Authorize]
    [Route ("api/users/{userId}/pictures")]
    [ApiController]
    public class PicturesController : ControllerBase {
        private readonly IUserRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PicturesController (IUserRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig) {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _repo = repo;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);

        }

        
        [HttpGet("{id}", Name = "GetPicture")]
        public async Task<IActionResult> GetPicture(int id)
        {
            var pictureFromRepo = await _repo.GetPicture(id);

            var picture = _mapper.Map<PictureForReturnDto>(pictureFromRepo);

            return Ok(picture);
        }
        
        [HttpPost]
        public async Task<IActionResult> AddPictureForUser(int userId,
            [FromForm]PictureForCreationDto pictureForCreationDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            
            var userFromRepo = await _repo.GetUser(userId);  

            var file = pictureForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream)
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            pictureForCreationDto.Url = uploadResult.Uri.ToString();
            pictureForCreationDto.PublicId = uploadResult.PublicId;

            var picture = _mapper.Map<Picture>(pictureForCreationDto);

            if (!userFromRepo.Pictures.Any(u => u.IsMain))
                picture.IsMain = true;

            userFromRepo.Pictures.Add(picture);

            if (await _repo.SaveAll())
            {
                var pictureToReturn = _mapper.Map<PictureForReturnDto>(picture);
                return CreatedAtRoute("GetPicture", new { userId = userId, id = picture.Id },
                pictureToReturn);
            }

            return BadRequest("Could not add file");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPicture(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var user = await _repo.GetUser(userId);

            if (!user.Pictures.Any(p => p.Id == id))
            return Unauthorized();

            var pictureFromRepo = await _repo.GetPicture(id);

            if (pictureFromRepo.IsMain)
            return BadRequest("This is already your main image");

            var currentMainPicture = await _repo.GetMainPictureForUser(userId);
            currentMainPicture.IsMain = false;

            pictureFromRepo.IsMain = true;

            if (await _repo.SaveAll())
            return NoContent();

            return BadRequest("Could not set image to main");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePicture(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _repo.GetUser(userId);

            if (!user.Pictures.Any(p => p.Id == id))
                return Unauthorized();

            var pictureFromRepo = await _repo.GetPicture(id);

            if (pictureFromRepo.IsMain)
                return BadRequest("You cannot delete your main photo");

            if (pictureFromRepo.PublicId != null)
            {
                var deleteParams = new DeletionParams(pictureFromRepo.PublicId);

                var result = _cloudinary.Destroy(deleteParams);

                if (result.Result == "ok")
                {
                    _repo.Delete(pictureFromRepo);
                }
            }

            if (pictureFromRepo.PublicId == null)
            {
                _repo.Delete(pictureFromRepo);
            }

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Failed to delete photo");
        }
    }
}