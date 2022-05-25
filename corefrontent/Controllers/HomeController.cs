using Microsoft.AspNetCore.Mvc;

namespace corefrontent.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
