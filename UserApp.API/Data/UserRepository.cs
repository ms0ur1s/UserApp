using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UserApp.API.Models;

namespace UserApp.API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Picture> GetMainPictureForUser(int userId)
        {
            return await _context.Pictures.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Picture> GetPicture(int id)
        {
            var picture = await _context.Pictures.FirstOrDefaultAsync(u => u.Id == id);

            return picture;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Pictures).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _context.Users.Include(p => p.Pictures).ToListAsync();

            return users;
        }

        public async Task<bool> SaveAll()
        {
           return await _context.SaveChangesAsync() > 0;
        }
    }
}