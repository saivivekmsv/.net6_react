using Microsoft.AspNetCore.Mvc;

namespace test1.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
