using System.Collections.Generic;
using System.Threading.Tasks;
using UserApp.API.Models;

namespace UserApp.API.Data
{
    public interface IUserRepository
    {
        void Add<T>(T entity) where T: class;
        void Delete<T>(T entity) where T: class;
        Task<bool> SaveAll();
        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int id);
        Task<Picture> GetPicture(int id);
        Task<Picture> GetMainPictureForUser(int userId);
    }
}